import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useData from "../hooks/useData";
import useLoading from "../hooks/useLoading";
import { CloudDownloadOutlined } from "@ant-design/icons";

interface ColumnType {
  title: string;
  dataIndex?: string;
  schema?: string[];
  selected?: boolean;
}

interface ExcelExportProps {
  columns: ColumnType[];
  filters?: any;
  search?: string;
  endpoint: string;
  expand?: string;
  button_text?:string;
}

interface DataRowType {
  [key: string]: any;
}

// Helper function to get nested property value by schema
const getNestedValue = (obj: any, path: string[]): string => {
  const nestedValue = path.reduce((acc, part) => acc && acc[part], obj);
  return nestedValue ? nestedValue.toString() : "-";
};

const Excel: React.FC<ExcelExportProps> = ({
  columns,
  filters,
  search,
  endpoint,
  expand,
  button_text="Exportez"
}) => {
  const [fileName, setFileName] = useState<string>(() => `data_export_${new Date().toISOString().split("T")[0]}`);

  const {
    refetch: refetchExportData,
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
  } = useData({
    endpoint,
    name: "Filter_export",
    params: {
      expand,
      all: true,
      search,
      ...filters,
    },
    enabled: false, // Disable auto-fetch
  });

  const { isLoading } = useLoading({
    loadingStates: [isRefetching, isLoadingData, isFetching],
  });

  const [shouldExport, setShouldExport] = useState(false);

  const exportToExcel = async () => {
    if (!data?.data?.length) {
      message.warning("No data available for export");
      return;
    }

    try {
      const workbook = XLSX.utils.book_new();
      const selectedColumns = columns.filter((column) => column.selected);
      const header = selectedColumns.map((column) => column.title);

      // Prepare worksheet data
      const worksheetData = [
        header,
        ...(data.data.map((row: DataRowType) =>
          selectedColumns.map((column) => {
            const cellData = column.schema
              ? getNestedValue(row, column.schema)
              : row[column.dataIndex as string];
            return cellData;
          })
        ) || []),
      ];

      // Convert array data to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Set autofilter for the header row
      worksheet["!autofilter"] = { ref: `A1:${String.fromCharCode(65 + header.length - 1)}1` };

      // Auto-adjust column widths
      // @ts-ignore
      const columnWidths = worksheetData[0].map((_, colIndex) => {
        const maxWidth = worksheetData.reduce((maxWidth, row) => {
          const cell = row[colIndex] ?? "";
          return Math.max(maxWidth, cell.toString().length);
        }, 10); // Set minimum width
        return { wch: maxWidth + 2 }; // Adding padding
      });
      worksheet["!cols"] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(dataBlob, `${fileName}.xlsx`);
      message.success("Export successful!");
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export data");
    }
  };

    // Export data only when it changes and shouldExport is true
  useEffect(() => {
    if (shouldExport && data?.data?.length) {
      exportToExcel();
      setShouldExport(false); // Reset the flag after export
    }
  }, [data, shouldExport, exportToExcel]);

  // Fetch data when the export button is clicked
  const handleClick = () => {
    setFileName(`data_export_${new Date().toISOString().split("T")[0]}`);
    setShouldExport(true); // Enable export
    refetchExportData(); // Fetch the latest data
  };
  
  return (
    <Button
      type="primary"
      onClick={handleClick}
      loading={isLoading}
      icon={<CloudDownloadOutlined />}
    >
      {button_text}
    </Button>
  );
};

export default Excel;
