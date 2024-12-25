import React, { useState } from 'react';
import { Button, Upload, Modal, message, Space, Spin } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { API_ARTICLES_ENDPOINT } from '@/api/api';
import usePost from '@/hooks/usePost';

interface Props {
  mrnId: number;
  refetch: () => void;
}

const ExcelImportExport: React.FC<Props> = ({ mrnId, refetch }) => {
  const [previewData, setPreviewData] = useState<any>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Function to download template
  const handleDownloadTemplate = () => {
    // Create template data for Tc
    const tcTemplate = [
      {
        tc: '',
        type_tc: '',
        dangereux: false,
        frigo: false,
        tar: 0,
        poids: '',
        matricule_camion: '',
      }
    ];

    // Create template data for SousArticle
    const sousArticleTemplate = [
      {
        numero: 0,
        bl: '',
        volume: 0,
        dangereux: false,
        nombre_colis: 0,
        description: '',
        surface: 0,
        quantite: 0,
        poids: 0,
        unite_de_visite: '',
        unite_de_chargement: '',
        unite_de_magasinage: '',
        designation: '',
      }
    ];

    // Create workbook and add worksheets
    const wb = XLSX.utils.book_new();
    const tcWs = XLSX.utils.json_to_sheet(tcTemplate);
    const sousArticleWs = XLSX.utils.json_to_sheet(sousArticleTemplate);

    XLSX.utils.book_append_sheet(wb, tcWs, 'Tcs');
    XLSX.utils.book_append_sheet(wb, sousArticleWs, 'SousArticles');

    // Save to file
    XLSX.writeFile(wb, 'tc_sous_article_template.xlsx');
  };

  const { mutate: importData, isLoading: isImporting } = usePost({
    endpoint: `${API_ARTICLES_ENDPOINT}import_tc_sous_articles/`,
    onSuccess: () => {
      message.success('Data imported successfully');
      setPreviewVisible(false);
      setFileData(null);
      setPreviewData(null);
      refetch();
    },
  });

  // Function to handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read both sheets
        const tcData = XLSX.utils.sheet_to_json(workbook.Sheets['Tcs']);
        const sousArticleData = XLSX.utils.sheet_to_json(workbook.Sheets['SousArticles']);

        const preview = {
          tcs: tcData,
          sousArticles: sousArticleData,
        };

        setFileData(preview);
        setPreviewData(preview);
        setPreviewVisible(true);
      } catch (error) {
        message.error('Error reading file. Please make sure it follows the template format.');
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent automatic upload
  };

  const handleImport = () => {
    if (!fileData) return;

    importData({
      mrn_id: mrnId,
      data: fileData,
    });
  };

  return (
    <Space>
      <Button
        icon={<DownloadOutlined />}
        onClick={handleDownloadTemplate}
      >
        Download Template
      </Button>

      <Upload
        accept=".xlsx,.xls"
        beforeUpload={handleFileUpload}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>
          Upload Excel
        </Button>
      </Upload>

      <Modal
        title="Preview Data"
        open={previewVisible}
        onOk={handleImport}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        confirmLoading={isImporting}
      >
        {isImporting ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
            <p>Importing data...</p>
          </div>
        ) : (
          <div>
            <h3>Tcs ({previewData?.tcs?.length || 0})</h3>
            <pre>{JSON.stringify(previewData?.tcs, null, 2)}</pre>
            
            <h3>Sous Articles ({previewData?.sousArticles?.length || 0})</h3>
            <pre>{JSON.stringify(previewData?.sousArticles, null, 2)}</pre>
          </div>
        )}
      </Modal>
    </Space>
  );
};

export default ExcelImportExport;
