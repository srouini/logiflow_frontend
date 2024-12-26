import React, { useState } from 'react';
import { Button, Upload, Modal, message, Space, Spin } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { API_ARTICLES_ENDPOINT } from '@/api/api';
import usePost from '@/hooks/usePost';

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
      return lowercased === 'true' || lowercased === 'oui' || lowercased === 'yes' || lowercased === '1';
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

  // Function to handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Process Articles sheet
        const articles: Article[] = (XLSX.utils.sheet_to_json(workbook.Sheets['Articles']) as any[]).map(row => ({
          numero: String(row.numero || ''),
          groupage: String(row.groupage || ''),
          bl: String(row.bl || ''),
          designation: String(row.designation || ''),
          client: String(row.client || '')
        }));
        console.log(articles);
        // Process Conteneurs sheet
        const containers: Container[] = (XLSX.utils.sheet_to_json(workbook.Sheets['Conteneurs']) as any[]).map(row => ({
          tc: String(row.tc || ''),
          tar: processNumericValue(row.tar),
          poids: processNumericValue(row.poids),
          article: String(row.article || ''),
          type_tc: String(row.type_tc || ''),
          dangereux: processBooleanValue(row.dangereux),
          frigo: processBooleanValue(row.frigo)
        }));
        console.log(containers);
        // Process SousArticles sheet
        const subArticles: SubArticle[] = (XLSX.utils.sheet_to_json(workbook.Sheets['SousArticles']) as any[]).map(row => ({
          numero: String(row.numero || ''),
          tc: String(row.tc || ''),
          bl: String(row.bl || ''),
          volume: processNumericValue(row.volume),
          dangereux: processBooleanValue(row.dangereux),
          nombre_colis: processNumericValue(row.nombre_colis),
          description: String(row.description || ''),
          surface: processNumericValue(row.surface),
          quantite: processNumericValue(row.quantite),
          poids: processNumericValue(row.poids),
          client: String(row.client || '')
        }));

        const processedData = { articles, containers, subArticles };

        // Call the callback with the processed data if provided
        if (onDataProcessed) {
          onDataProcessed(processedData);
        }

        setFileData(processedData);
        setPreviewData(processedData);
        setPreviewVisible(true);
      } catch (error) {
        console.error('Error processing file:', error);
        message.error('Error reading file. Please make sure it follows the template format.');
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent automatic upload
  };

  // Function to handle import
  const handleImport = () => {
    if (fileData) {
      importData({ mrn_id: mrnId, data: fileData });
    }
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

  return (
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
      <Modal
        title="Preview Data"
        open={previewVisible}
        onOk={handleImport}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {isImporting ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
            <p>Importing data...</p>
          </div>
        ) : (
          <pre>{JSON.stringify(previewData, null, 2)}</pre>
        )}
      </Modal>
    </Space>
  );
};

export default ExcelImportExport;
