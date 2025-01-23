import React, { useState, useEffect } from 'react';
import { Button, Upload, Modal, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { API_ARTICLES_ENDPOINT, API_CONTENEURS_ENDPOINT, API_SOUSARTICLES_ENDPOINT } from '@/api/api';
import usePost from '@/hooks/usePost';
import PreviewArticles from './PreviewArticles';
import PreviewContainers from './PreviewContainers';
import PreviewSubArticles from './PreviewSubArticles';
import useData from '@/hooks/useData';
import { useReferenceContext } from '@/context/ReferenceContext';
import { findMatchingClient, findMatchingContainerType, processBooleanValue } from '@/utils/functions';
import { usePermissions } from '@/utils/permissions';

interface Props {
  mrnId: number;
  refetch: () => void;
}

const ExcelUpload: React.FC<Props> = ({ mrnId, refetch }) => {
  const [fileData, setFileData] = useState<{
    articles: any[];
    containers: any[];
    subArticles: any[];
  }>({
    articles: [],
    containers: [],
    subArticles: []
  });

  const [currentStep, setCurrentStep] = useState<'articles' | 'containers' | 'subArticles' | null>(null);
  const [processing, setProcessing] = useState(false);
  //@ts-ignore
  const [progress, setProgress] = useState(0);

  const { client, containerType } = useReferenceContext();

  useEffect(() => {
    client?.fetch();
    containerType?.fetch();
  }, []);

  // Get existing data for validation
  const { data: existingArticles, refetch: refetchArticles } = useData({
    endpoint: API_ARTICLES_ENDPOINT,
    name: "GET_MRN_ARTICLES",
    params: { gros__id: mrnId, all: true },
  });

  const { data: existingContainers, refetch: refetchContainers } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: "GET_MRN_CONTAINERS",
    params: { article__gros__id: mrnId, all: true },
  });

  const { data: existingSubArticles, refetch: refetchSubArticles } = useData({
    endpoint: API_SOUSARTICLES_ENDPOINT,
    name: "GET_MRN_SUBARTICLES",
    params: { tc__article__gros__id: mrnId, all: true },
  });

  const { mutate: mutateArticle } = usePost({
    endpoint: API_ARTICLES_ENDPOINT,
    onSuccess: () => {
      refetch();
      refetchArticles();
    }
  });

  const { mutate: mutateContainer } = usePost({
    endpoint: API_CONTENEURS_ENDPOINT,
    onSuccess: () => {
      refetchContainers();
    }
  });

  const { mutate: mutateSubArticle } = usePost({
    endpoint: API_SOUSARTICLES_ENDPOINT,
    onSuccess: () => {
      console.log("Subarticle Created")
    }
  });

  const findMatchingArticle = (articleNumber: string) => {
    if (!existingArticles?.data?.length || !articleNumber) return null;
    return existingArticles.data.find((article: any) =>
      String(article.numero) === String(articleNumber)
    );
  };

  const beforeUpload = (file: File) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error('You can only upload Excel files!');
      return false;
    }
    return true;
  };

  const handleFileRead = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const newFileData = {
          articles: [],
          containers: [],
          subArticles: []
        };

        workbook.SheetNames.forEach(sheetName => {
          const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          switch (sheetName.toLowerCase()) {
            case 'articles':
              //@ts-ignore
              newFileData.articles = sheet;
              break;
            case 'conteneurs':
              //@ts-ignore
              newFileData.containers = sheet;
              break;
            case 'sousarticles':
              //@ts-ignore
              newFileData.subArticles = sheet;
              break;
          }
        });

        setFileData(newFileData);
        if (newFileData.articles.length > 0) {
          setCurrentStep('articles');
        }
      } catch (error) {
        message.error('Error reading file');
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const processArticles = async () => {
    try {
      setProcessing(true);
      setProgress(0);

      const existingNums = new Set(existingArticles?.data?.map((a:any) => String(a.numero)));
      const newArticles = fileData.articles.filter(article => !existingNums.has(String(article.numero)));
      let processed = 0;

      for (const article of newArticles) {
        const matchingClient = findMatchingClient(client, article.client);
        
        await new Promise((resolve, reject) => {
          mutateArticle({
            ...article,
            groupage: processBooleanValue(article.groupage),
            gros: mrnId,
            //@ts-ignore
            client: matchingClient ? matchingClient.id : { raison_sociale: article.client }
          }, {
            onSuccess: () => {
              processed++;
              setProgress(Math.floor((processed / newArticles.length) * 100));
              resolve(true);
            },
            onError: (error) => reject(error)
          });
        });
      }

      const skippedArticles = fileData.articles.length - newArticles.length;

      if (processed > 0) {
        message.success(`Successfully created ${processed} article${processed > 1 ? 's' : ''}`);
      }
      if (skippedArticles > 0) {
        message.warning(`Skipped ${skippedArticles} existing article${skippedArticles > 1 ? 's' : ''}`);
      }

      // Refetch data and prepare for next step
      await Promise.all([refetch(), refetchArticles(), client?.refetch()]);
      setProcessing(false);
      setProgress(0);
      setCurrentStep(fileData.containers.length > 0 ? 'containers' : 
                    fileData.subArticles.length > 0 ? 'subArticles' : null);
    } catch (error) {
      setProcessing(false);
      setProgress(0);
      message.error('Error during articles import');
      console.error(error);
    }
  };

  const processContainers = async () => {
    try {
      setProcessing(true);
      setProgress(0);

      await refetchArticles();
      const existingTCs = new Set(existingContainers?.data?.map((c:any) => String(c.tc)));
      const newContainers = fileData.containers.filter(container => !existingTCs.has(String(container.tc)));
      
      let processed = 0;
      let invalid = 0;

      for (const container of newContainers) {
        const matchingArticle = findMatchingArticle(container.article);
        const matchingType = container.type_tc ? findMatchingContainerType(containerType, container.type_tc) : null;

        if (!matchingArticle) {
          invalid++;
          continue;
        }

        await new Promise((resolve, reject) => {
          mutateContainer({
            ...container,
            article: matchingArticle.id,
            //@ts-ignore
            type_tc: matchingType ? matchingType.id : undefined,
            dangereux: processBooleanValue(container.dangereux),
            frigo: processBooleanValue(container.frigo)
          }, {
            onSuccess: () => {
              processed++;
              setProgress(Math.floor((processed / newContainers.length) * 100));
              resolve(true);
            },
            onError: (error) => reject(error)
          });
        });
      }

      const skipped = fileData.containers.length - newContainers.length;

      if (processed > 0) {
        message.success(`Successfully created ${processed} container${processed > 1 ? 's' : ''}`);
      }
      if (skipped > 0) {
        message.warning(`Skipped ${skipped} existing container${skipped > 1 ? 's' : ''}`);
      }
      if (invalid > 0) {
        message.error(`${invalid} container${invalid > 1 ? 's' : ''} could not be created due to missing article reference`);
      }

      await refetchContainers();
      setProcessing(false);
      setProgress(0);
      setCurrentStep(fileData.subArticles.length > 0 ? 'subArticles' : null);
    } catch (error) {
      setProcessing(false);
      setProgress(0);
      message.error('Error during containers import');
      console.error(error);
    }
  };

  const processSubArticles = async () => {
    try {
      setProcessing(true);
      setProgress(0);

      await refetchContainers();
      await refetchSubArticles();

      const existingSubArticleSet = new Set(existingSubArticles?.data?.map((sa: any) => 
        `${sa.tc}-${sa.numero}`  // Composite key using tc and numero
      ));
      
      const newSubArticles = fileData.subArticles.filter(subArticle => {
        const matchingContainer = existingContainers?.data?.find(
          (c: any) => String(c.tc) === String(subArticle.tc)
        );
        return matchingContainer && !existingSubArticleSet.has(`${matchingContainer.id}-${subArticle.numero}`);
      });

      let processed = 0;
      let invalid = 0;

      for (const subArticle of newSubArticles) {
        const matchingContainer = existingContainers?.data?.find(
          (c: any) => String(c.tc) === String(subArticle.tc)
        );
        const matchingClient = findMatchingClient(client, subArticle.client);

        if (!matchingContainer) {
          invalid++;
          continue;
        }

        await new Promise((resolve, reject) => {
          mutateSubArticle({
            ...subArticle,
            tc: matchingContainer.id,
            //@ts-ignore
            client: matchingClient ? matchingClient.id : { raison_sociale: subArticle.client },
            dangereux: processBooleanValue(subArticle.dangereux)
          }, {
            onSuccess: () => {
              processed++;
              setProgress(Math.floor((processed / newSubArticles.length) * 100));
              resolve(true);
            },
            onError: (error) => reject(error)
          });
        });
      }

      const skipped = fileData.subArticles.length - newSubArticles.length;

      if (processed > 0) {
        message.success(`Successfully created ${processed} sub-article${processed > 1 ? 's' : ''}`);
      }
      if (skipped > 0) {
        message.warning(`Skipped ${skipped} existing sub-article${skipped > 1 ? 's' : ''}`);
      }
      if (invalid > 0) {
        message.error(`${invalid} sub-article${invalid > 1 ? 's' : ''} could not be created due to missing container reference`);
      }

      setProcessing(false);
      setProgress(0);
      setCurrentStep(null);
      refetch();
    } catch (error) {
      setProcessing(false);
      setProgress(0);
      message.error('Error during sub-articles import');
      console.error(error);
    }
  };

  const handleProcess = async () => {
    switch (currentStep) {
      case 'articles':
        await processArticles();
        break;
      case 'containers':
        await processContainers();
        break;
      case 'subArticles':
        await processSubArticles();
        break;
    }
  };

  const getArticleSummary = () => {
    //@ts-ignore
    const existingNums = new Set(existingArticles?.data?.map(a => String(a.numero)));
    const newArticles = fileData.articles.filter(article => !existingNums.has(String(article.numero)));

    return {
      total: fileData.articles.length,
      new: newArticles.length,
      skipped: fileData.articles.length - newArticles.length
    };
  };

  const getContainerSummary = () => {
    
    const existingTCs = new Set(existingContainers?.data?.map((c:any) => String(c.tc)));
    const validArticles = new Set(existingArticles?.data?.map((a:any) => String(a.numero)));
    
    const containersWithValidArticles = fileData.containers.filter(container => 
      validArticles.has(String(container.article))
    );

    const newContainers = containersWithValidArticles.filter(container => 
      !existingTCs.has(String(container.tc))
    );

    const invalidContainers = fileData.containers.filter(container => 
      !validArticles.has(String(container.article))
    );

    return {
      total: fileData.containers.length,
      new: newContainers.length,
      skipped: containersWithValidArticles.length - newContainers.length,
      invalid: invalidContainers.length
    };
  };

  const renderPreview = () => {
    if (!fileData) return null;

    switch (currentStep) {
      case 'articles':
        return (
          <PreviewArticles
            data={fileData.articles}
            loading={processing}
            summary={getArticleSummary()}
          />
        );
      case 'containers':
        return (
          <PreviewContainers
            data={fileData.containers}
            loading={processing}
            summary={getContainerSummary()}
          />
        );
      case 'subArticles':
        return (
          <PreviewSubArticles
            data={fileData.subArticles}
            loading={processing}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'articles':
        return 'Import Articles';
      case 'containers':
        return 'Import Containers';
      case 'subArticles':
        return 'Import Sub-Articles';
      default:
        return '';
    }
  };

  const hasPermission = usePermissions();


  return (
    <>
      <Upload
        accept=".xlsx,.xls"
        beforeUpload={beforeUpload}
        customRequest={({ file }) => handleFileRead(file as File)}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />} disabled={!hasPermission('app.can_populate_gros')}>Upload</Button>
      </Upload>

      <Modal
        title={getStepTitle()}
        open={currentStep !== null}
        onOk={handleProcess}
        onCancel={() => setCurrentStep(null)}
        width={1200}
        confirmLoading={processing}
        maskClosable={false}
        closable={!processing}
        cancelButtonProps={{ disabled: processing }}
      >
        {currentStep && (
          <>
            {renderPreview()}
          </>
        )}
      </Modal>
    </>
  );
};

export default ExcelUpload;