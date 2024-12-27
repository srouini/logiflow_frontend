import React, { useEffect, useState } from 'react';
import { Button, Upload, Modal, message, Space, Spin } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { API_ARTICLES_ENDPOINT, API_CONTENEURS_ENDPOINT } from '@/api/api';
import usePost from '@/hooks/usePost';
import { useReferenceContext } from '@/context/ReferenceContext';
import useData from '@/hooks/useData';

interface Article {
  numero: string;
  groupage: string;
  bl: string;
  designation: string;
  client: string;
}

interface Container {
  tc: string;
  tar: string | number;
  poids: string | number;
  article: string;
  type_tc: string;
  dangereux: boolean;
  frigo: boolean;
}

interface SubArticle {
  numero: string;
  tc: string;
  bl: string;
  volume: string | number;
  dangereux: boolean;
  nombre_colis: string | number;
  description: string;
  surface: string | number;
  quantite: string | number;
  poids: string | number;
  client: string;
}

interface Props {
  mrnId: number;
  refetch: () => void;
  onDataProcessed?: (data: { 
    articles: Article[], 
    containers: Container[], 
    subArticles: SubArticle[] 
  }) => void;
}

const ExcelImportExport: React.FC<Props> = ({ mrnId, refetch, onDataProcessed }) => {
  const [previewData, setPreviewData] = useState<any>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [stage, setStage] = useState<'articles' | 'containers'>('articles');

  const { client, containerType } = useReferenceContext();

  // Get existing articles for this MRN
  const { data: existingArticles, refetch: refetchArticles } = useData({
    endpoint: API_ARTICLES_ENDPOINT,
    name: "GET_MRN_ARTICLES",
    params: { gros__id: mrnId, all: true },
  });

  // Get existing containers for this MRN
  const { data: existingContainers, refetch: refetchContainers } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: "GET_MRN_CONTAINERS",
    params: { article__gros__id: mrnId, all: true },
  });

  useEffect(() => {
    client?.fetch();
    containerType?.fetch();
    refetchArticles();
    refetchContainers();
  }, []);

  // Function to add borders and styles to worksheet
  const addBordersAndStyles = (ws: XLSX.WorkSheet) => {
    if (!ws['!ref']) return;
    
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell_address]) {
          ws[cell_address] = { v: '', t: 's' };
        }
        
        ws[cell_address].s = {
          border: {
            top: { style: 'thin', color: { rgb: "000000" } },
            bottom: { style: 'thin', color: { rgb: "000000" } },
            left: { style: 'thin', color: { rgb: "000000" } },
            right: { style: 'thin', color: { rgb: "000000" } }
          },
          fill: R === 0 ? {
            patternType: 'solid',
            fgColor: { rgb: "CCCCCC" }
          } : undefined
        };
      }
    }
  };

  // Function to download template
  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Articles sheet
    const articlesHeaders = ['numero', 'groupage', 'bl', 'designation', 'client'];
    const articlesWs = XLSX.utils.aoa_to_sheet([articlesHeaders]);
    addBordersAndStyles(articlesWs);
    XLSX.utils.book_append_sheet(wb, articlesWs, 'Articles');

    // Conteneurs sheet
    const conteneursHeaders = ['tc', 'tar', 'poids', 'article', 'type_tc', 'dangereux', 'frigo'];
    const conteneursWs = XLSX.utils.aoa_to_sheet([conteneursHeaders]);
    addBordersAndStyles(conteneursWs);
    XLSX.utils.book_append_sheet(wb, conteneursWs, 'Conteneurs');

    // SousArticles sheet
    const sousArticlesHeaders = ['numero', 'tc', 'bl', 'volume', 'dangereux', 'nombre_colis', 'description', 'surface', 'quantite', 'poids', 'client'];
    const sousArticlesWs = XLSX.utils.aoa_to_sheet([sousArticlesHeaders]);
    addBordersAndStyles(sousArticlesWs);
    XLSX.utils.book_append_sheet(wb, sousArticlesWs, 'SousArticles');

    // Set column widths for all sheets
    const wscols = [
      {wch: 15}, // A
      {wch: 15}, // B
      {wch: 15}, // C
      {wch: 20}, // D
      {wch: 15}, // E
      {wch: 12}, // F
      {wch: 12}, // G
      {wch: 15}, // H
      {wch: 15}, // I
      {wch: 15}, // J
      {wch: 20}  // K
    ];

    [articlesWs, conteneursWs, sousArticlesWs].forEach(ws => {
      ws['!cols'] = wscols;
    });

    // Save to file
    XLSX.writeFile(wb, 'import_template.xlsx');
  };

  // Function to process boolean values
  const processBooleanValue = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowercased = value.toLowerCase();
      return lowercased === 'true' || lowercased === 'oui' || lowercased === 'yes' || lowercased === '1' || lowercased === 'vrai';
    }
    if (typeof value === 'number') return value === 1;
    return false;
  };

  // Function to process numeric values
  const processNumericValue = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Function to normalize client name by removing common company suffixes
  const normalizeClientName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s*(eurl|sarl|epe|spa|algeria|algerie)\s*/gi, ' ')
      .trim();
  };

  // Function to calculate similarity between two strings
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const costs = new Array();
    for (let i = 0; i <= longer.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= shorter.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) {
        costs[shorter.length] = lastValue;
      }
    }
    const levenshteinDistance = costs[shorter.length];
    return (1 - levenshteinDistance / longer.length) * 100;
  };

  // Function to process article with client matching
  const processArticle = (article: Article, clients: any[]): any => {
    const normalizedArticleClient = normalizeClientName(article.client);
    
    // Find matching client
    let matchingClient = null;
    let highestSimilarity = 0;
    
    clients?.forEach(client => {
      const normalizedClientName = normalizeClientName(client.raison_sociale);
      const similarity = calculateSimilarity(normalizedArticleClient, normalizedClientName);
      
      if (similarity > 85 && similarity > highestSimilarity) {
        highestSimilarity = similarity;
        matchingClient = client;
      }
    });

    // Convert groupage to boolean
    const groupage = String(article.groupage || '').toLowerCase();
    const groupageBoolean = groupage === 'true' || groupage === 'vrai' || groupage === 'oui' || groupage === 'yes' || groupage === '1';
    
    return {
      ...article,
      gros: mrnId,
      groupage: groupageBoolean,
      client: matchingClient ? matchingClient.id : { raison_sociale: article.client }
    };
  };

  // Function to post article to backend
  const postArticle = async (article: any) => {
    try {
      await mutateArticle(article);
      return true;
    } catch (error) {
      console.error('Error posting article:', error);
      message.error(`Failed to post article ${article.numero}`);
      return false;
    }
  };

  // Function to get articles by gros
  const getArticlesByGros = async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_ARTICLES_ENDPOINT}?gros=${mrnId}`);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      message.error('Failed to fetch articles');
      return [];
    }
  };

  // Function to clean string for matching
  const cleanStringForMatch = (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      // Remove special characters and extra spaces
      .replace(/[^a-z0-9]/g, '')
      // Remove extra spaces
      .replace(/\s+/g, '');
  };

  // Function to find best matching container type
  const findBestMatchingContainerType = (typeStr: string) => {
    if (!containerType?.results?.length || !typeStr) return null;

    const cleanInput = cleanStringForMatch(typeStr);
    if (!cleanInput) return null;

    // First try exact match
    const exactMatch = containerType.results.find(
      type => cleanStringForMatch(type.designation) === cleanInput
    );
    if (exactMatch) return exactMatch.id;

    // Then try includes match
    const includesMatch = containerType.results.find(
      type => {
        const cleanType = cleanStringForMatch(type.designation);
        return cleanType.includes(cleanInput) || cleanInput.includes(cleanType);
      }
    );
    if (includesMatch) return includesMatch.id;

    return null;
  };

  // Function to process container and match with article
  const processContainer = async (container: Container, articles: any[]): Promise<any | null> => {
    // Find matching article by number - convert both to integers for comparison
    const matchingArticle = articles.find(
      article => parseInt(String(article.numero)) === parseInt(String(container.article))
    );

    if (!matchingArticle) {
      console.warn(`No matching article found for container with article number: ${container.article}`);
      return null;
    }

    // Process numeric values
    const processedContainer = {
      tc: container.tc,
      tar: processNumericValue(container.tar),
      poids: processNumericValue(container.poids),
      article: matchingArticle.id,
      type_tc: findBestMatchingContainerType(container.type_tc),
      dangereux: processBooleanValue(container.dangereux),
      frigo: processBooleanValue(container.frigo)
    };

    return processedContainer;
  };

  // Function to post container to backend
  const postContainer = async (container: any) => {
    try {
      await mutateContainer(container);
      return true;
    } catch (error) {
      console.error('Error posting container:', error);
      message.error(`Failed to post container ${container.tc}`);
      return false;
    }
  };

  // Function to process articles
  const processArticles = async (articles: Article[]) => {
    const existingArticleNumbers = existingArticles?.data?.map(a => String(a.numero)) || [];
    return articles.map(article => ({
      original: {
        numero: article.numero,
        groupage: article.groupage,
        bl: article.bl,
        designation: article.designation,
        client: article.client
      },
      processed: processArticle(article, client?.results),
      exists: existingArticleNumbers.includes(String(article.numero))
    }));
  };

  // Function to process containers
  const processContainers = async (containers: Container[]) => {
    const allArticles = [...(existingArticles?.data || [])];
    const existingContainerTCs = existingContainers?.data?.map(c => String(c.tc)) || [];

    return containers.map(container => {
      const matchedTypeId = findBestMatchingContainerType(container.type_tc);
      const exists = existingContainerTCs.includes(String(container.tc));
      
      return {
        original: container,
        processed: {
          tc: container.tc,
          tar: processNumericValue(container.tar),
          poids: processNumericValue(container.poids),
          type_tc: matchedTypeId,
          dangereux: processBooleanValue(container.dangereux),
          frigo: processBooleanValue(container.frigo),
          article: allArticles.find(a => parseInt(String(a.numero)) === parseInt(String(container.article)))?.id
        },
        exists,
        warnings: [
          ...(exists ? ['Container already exists'] : []),
          ...(!matchedTypeId ? [`No matching container type found for: ${container.type_tc}`] : [])
        ]
      };
    });
  };

  // Function to handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Process Articles sheet
        const articles: Article[] = (XLSX.utils.sheet_to_json(workbook.Sheets['Articles']) as any[])
          .map(row => ({
            numero: String(row.numero || ''),
            groupage: String(row.groupage || ''),
            bl: String(row.bl || ''),
            designation: String(row.designation || ''),
            client: String(row.client || '')
          }));

        // Process Containers sheet
        const containers: Container[] = (XLSX.utils.sheet_to_json(workbook.Sheets['Conteneurs']) as any[])
          .map(row => ({
            tc: String(row.tc || ''),
            tar: processNumericValue(row.tar),
            poids: processNumericValue(row.poids),
            article: String(row.article || ''),
            type_tc: String(row.type_tc || ''),
            dangereux: row.dangereux,
            frigo: row.frigo
          }));

        setFileData({ articles, containers });
        
        // Process and preview articles first
        const processedArticles = await processArticles(articles);
        setProcessedData({ articles: processedArticles });
        setPreviewData({
          articles: processedArticles,
          summary: {
            totalArticles: processedArticles.length,
            newArticles: processedArticles.filter(a => !a.exists).length,
            existingArticles: processedArticles.filter(a => a.exists).length
          }
        });
        setStage('articles');
        setPreviewVisible(true);
      } catch (error) {
        console.error('Error processing file:', error);
        message.error('Error reading file. Please make sure it follows the template format.');
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  // Function to handle import
  const handleImport = async () => {
    if (!processedData) return;

    setIsImporting(true);
    try {
      if (stage === 'articles') {
        // Post only new articles
        const newArticles = processedData.articles.filter(article => !article.exists);
        if (newArticles.length) {
          for (const article of newArticles) {
            const success = await postArticle(article.processed);
            if (!success) {
              setIsImporting(false);
              return;
            }
          }
        }

        // Refresh articles and move to containers stage
        await refetchArticles();
        
        // Process containers after articles are updated
        if (fileData?.containers?.length) {
          const processedContainers = await processContainers(fileData.containers);
          setProcessedData({ containers: processedContainers });
          setPreviewData({
            containers: processedContainers,
            summary: {
              totalContainers: processedContainers.length,
              newContainers: processedContainers.filter(c => !c.exists).length,
              existingContainers: processedContainers.filter(c => c.exists).length,
              validContainers: processedContainers.filter(c => !c.exists && c.processed.article && c.processed.type_tc).length,
              invalidContainers: processedContainers.filter(c => !c.exists && (!c.processed.article || !c.processed.type_tc)).length,
              containersWithWarnings: processedContainers.filter(c => c.warnings?.length > 0).length
            }
          });
          setStage('containers');
          setIsImporting(false);
          return;
        }
      } else if (stage === 'containers') {
        // Post only new and valid containers
        let processedCount = 0;
        let skippedCount = 0;

        const newContainers = processedData.containers.filter(
          container => !container.exists && container.processed.article && container.processed.type_tc
        );

        for (const container of newContainers) {
          try {
            await mutateContainer(container.processed);
            processedCount++;
          } catch (error) {
            console.error('Error posting container:', error);
            message.error(`Failed to post container ${container.original.tc}`);
            skippedCount++;
          }
        }

        const existingCount = processedData.containers.filter(c => c.exists).length;
        if (existingCount > 0) {
          message.warning(`Skipped ${existingCount} existing containers`);
        }

        if (processedCount > 0) {
          message.success(`Successfully processed ${processedCount} new containers`);
        }
        if (skippedCount > 0) {
          message.warning(`Failed to process ${skippedCount} containers due to errors`);
        }
      }

      setPreviewVisible(false);
      setFileData(null);
      setPreviewData(null);
      setProcessedData(null);
      setStage('articles');
      refetch();
      refetchContainers();
    } catch (error) {
      console.error('Error importing data:', error);
      message.error('Failed to import data');
    }
    setIsImporting(false);
  };

  const { mutate: mutateArticle } = usePost({
    endpoint: API_ARTICLES_ENDPOINT,
    onSuccess: () => {
      // Success is handled in handleImport
    },
  });

  const { mutate: mutateContainer } = usePost({
    endpoint: API_CONTENEURS_ENDPOINT,
    onSuccess: () => {
      // Success is handled in handleImport
    },
  });

  return (
    <>
      <Space>
        <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
          Download Template
        </Button>
        <Upload
          beforeUpload={handleFileUpload}
          showUploadList={false}
          accept=".xlsx,.xls"
        >
          <Button icon={<UploadOutlined />}>Upload Excel</Button>
        </Upload>
      </Space>
      <Modal
        title={`Preview ${stage === 'articles' ? 'Articles' : 'Containers'}`}
        open={previewVisible}
        onOk={handleImport}
        onCancel={() => {
          if (stage === 'containers') {
            // If canceling container preview, reset to articles
            setStage('articles');
            setPreviewData(null);
            setProcessedData(null);
            setPreviewVisible(false);
          } else {
            setPreviewVisible(false);
          }
        }}
        width={800}
      >
        {isImporting ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
            <p>Importing {stage}...</p>
          </div>
        ) : (
          <div>
            {previewData?.summary && (
              <div style={{ marginBottom: '20px' }}>
                <h3>Summary:</h3>
                {stage === 'articles' ? (
                  <>
                    <p>Total Articles: {previewData.summary.totalArticles}</p>
                    <p>New Articles to Import: {previewData.summary.newArticles}</p>
                    <p>Existing Articles (Will Skip): {previewData.summary.existingArticles}</p>
                  </>
                ) : (
                  <>
                    <p>Total Containers: {previewData.summary.totalContainers}</p>
                    <p>New Containers to Import: {previewData.summary.newContainers}</p>
                    <p>Existing Containers (Will Skip): {previewData.summary.existingContainers}</p>
                    <p>Valid New Containers: {previewData.summary.validContainers}</p>
                    <p>Invalid New Containers: {previewData.summary.invalidContainers}</p>
                    {previewData.summary.containersWithWarnings > 0 && (
                      <p style={{ color: '#faad14' }}>
                        Containers with Warnings: {previewData.summary.containersWithWarnings}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
            {stage === 'containers' && previewData?.containers?.some(c => c.warnings?.length > 0) && (
              <div style={{ marginBottom: '20px', color: '#faad14' }}>
                <h4>Warnings:</h4>
                {previewData.containers
                  .filter(c => c.warnings?.length > 0)
                  .map((c, i) => (
                    <div key={i}>
                      <strong>Container {c.original.tc}:</strong>
                      <ul>
                        {c.warnings.map((warning, j) => (
                          <li key={j}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
            <pre>{JSON.stringify(previewData, null, 2)}</pre>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ExcelImportExport;
