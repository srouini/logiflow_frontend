import { ProTable } from "@ant-design/pro-components";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Space } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { AxiosResponse } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import "@/index.css"
type CustomTableProps = {
  getColumns: any;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  data: AxiosResponse<any, any> | undefined;
  setSearch: ((value: React.SetStateAction<string>) => void) | null;
  getPageSize?: () => number;
  setPageSize?: (pageSize: number) => void;
  setPage?: (value: React.SetStateAction<number>) => void;
  isLoading: boolean;
  headerTitle?: string | React.ReactNode;
  rowSelectionFunction?:
    | false
    | (TableRowSelection<Record<string, any>> & { alwaysShowAlert?: boolean });
  RowSelectionRnder?: React.ReactNode;
  scrollX?: number;
  scrollY?: number;
  toolBar?:any,
  toolbar?:any,
  isFetching?:boolean
};

const CustomTable: React.FC<CustomTableProps> = ({
  getColumns,
  refetch,
  data,
  setSearch,
  getPageSize = () => 10,
  setPageSize,
  setPage,
  isLoading,
  headerTitle,
  rowSelectionFunction,
  RowSelectionRnder,
  scrollX = 1200,
  scrollY,
  toolBar,
  toolbar,
  isFetching
}) => {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    if (!isFetching) {
      setTableData(data);
    }
  }, [data, isFetching]);
  // Memoize table options to avoid unnecessary recalculations
  const tableOptions: any = useMemo(
    () => ({
      reload: refetch,
      setting: {
        listsHeight: 400,
      },
      search: setSearch !== null ? {
        onSearch(keyword: any) {
          setSearch(keyword);
        },
        allowClear: true,
      } : null,
      fullScreen: true,
    }),
    [refetch, setSearch]
  );

  return (
    <ProTable
      columns={getColumns}
      cardBordered
      onReset={refetch}
      toolBarRender={toolBar}
      dataSource={tableData?.data?.results}
      columnsState={{
        persistenceKey: "pro-table-singe-demos",
        persistenceType: "localStorage",
        defaultValue: {
          option: { fixed: "left" },
        },
      }}
      rowKey={(item) => item?.id}
      search={false}
      options={tableOptions}
      scroll={{ x: 'max-content', y: scrollY }}
      loading={isLoading}
      pagination={{
        pageSize: getPageSize(),
        total: tableData?.data?.count,
        pageSizeOptions: [10, 20, 30, 100],
        showSizeChanger: true,
        onChange: (page: number, pageSize: number) => {
          // @ts-ignore
          setPageSize(pageSize);
          // @ts-ignore
          setPage(page);
          refetch();
        },
      }}
      revalidateOnFocus={true}
      dateFormatter="string"
      headerTitle={headerTitle}
      size="small"
      rowSelection={rowSelectionFunction}
      tableAlertOptionRender={() =>
        RowSelectionRnder && <Space size={16}>{RowSelectionRnder}</Space>
      }
      toolbar={toolbar}
    />
  );
};

export default CustomTable;
