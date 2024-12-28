import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

interface Props {
  mrnId: number;
}

const ExcelDownload: React.FC<Props> = () => {
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

  return (
    <Button 
      icon={<DownloadOutlined />} 
      onClick={handleDownloadTemplate}
    >
      Canvas
    </Button>
  );
};

export default ExcelDownload;
