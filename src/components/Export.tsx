import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Row, Col, Input, Divider } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FilterLayout from "./FilterLayout";
import useData from "@/hooks/useData";
import useLoading from "../utils/useLoading";
import SearchInput from "./SearchInput";
import Refetch from "./Refetch";
import ColumnsSelect from "./ColumnsSelect";

interface ColumnType {
  title: string;
  dataIndex?: string;
  schema?: string[];
  selected?: boolean;
}

interface ExcelExportProps {
  columns: ColumnType[];
  Filters?: React.ReactNode;
  handleSearchFocus?: () => void;
  endpoint: string;
  expand?: string;
}

interface DataRowType {
  [key: string]: any;
}

// Helper function to get nested property value by schema
const getNestedValue = (obj: any, path: string[]): string => {
  const nestedValue = path.reduce((acc, part) => acc && acc[part], obj);
  return nestedValue ? nestedValue.toString() : "-";
};

const ExcelExport: React.FC<ExcelExportProps> = ({
  columns,
  Filters,
  handleSearchFocus,
  endpoint,
  expand,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("data");
  const [filtredColumns, setFilteredColumns] = useState<ColumnType[]>(
    columns?.filter((column) => column.title !== "Action")
  );
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const {
    refetch: refetchExportData,
    data,
    isLoading: isLoadingData,
    isRefetching,
  } = useData({
    endpoint: endpoint,
    name: "Filter_compoter_form",
    params: {
      expand: expand,
      all: true,
      search: search,
      ...filters,
    },
    enabled: shouldFetch,
  });

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const to_use_columns = filtredColumns.filter((column) => column.selected);
    const header = to_use_columns?.map((column) => column.title);

    const worksheetData = [
      header,
      ...(data?.data?.map((row: DataRowType) =>
        to_use_columns?.map((column) => {
          const cellData = column.schema
            ? getNestedValue(row, column.schema)
            : row[column.dataIndex as string];
          return cellData;
        })
      ) || []),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${fileName}.xlsx`);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    exportToExcel();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setShouldFetch(false);
    setIsModalVisible(false);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      setShouldFetch(true);
      refetchExportData();
    }
  }, [filters, refetchExportData]);

  const { isLoading } = useLoading(isLoadingData, isRefetching);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Export
      </Button>
      <Modal
        centered
        title="Export Data to Excel"
        visible={isModalVisible}
        width={1200}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Exporter"
        okButtonProps={{ disabled: !data?.data?.length }}
      >
        <ColumnsSelect
          columns={filtredColumns}
          setSelectedColumns={setFilteredColumns}
        />
        <Divider />
        {Filters && (
          <FilterLayout
            Filters={Filters}
            setFilters={setFilters}
            handleSearchFocus={handleSearchFocus}
          />
        )}

        <Row justify="space-between" style={{ marginBottom: "10px" }} gutter={6}>
          <Row>
            <Input
              value={fileName}
              onChange={handleFileNameChange}
              addonBefore="File name"
              addonAfter=".xlsx"
              size="middle"
            />
          </Row>
          <Row>
            <Col>
              <SearchInput
                placeholder="Chercher..."
                loading={isLoading}
                setSearch={setSearch}
                refetch={refetchExportData}
                handleSearchFocus={handleSearchFocus}
              />
            </Col>
            <Col>
              <Refetch refetch={refetchExportData} />
            </Col>
          </Row>
        </Row>

        <Table
          className="virtual-table"
          rowKey={(record) => record.id}
          loading={isLoading}
          columns={columns.filter((column) => column.title !== "Action")}
          scroll={{ x: 1300, y: 300 }}
          pagination={false}
          dataSource={data?.data}
          size="small"
        />
      </Modal>
    </>
  );
};

export default ExcelExport;
