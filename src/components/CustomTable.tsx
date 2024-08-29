import { ProTable } from '@ant-design/pro-components';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react'
import Ajouter from '../pages/Admin/AUForm';

type CustomTableProps = {
  getColumns: any;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
    data: AxiosResponse<any, any> | undefined;
    setSearch: (value: React.SetStateAction<string>) => void;
    getPageSize: () => number;
    setPageSize: (pageSize: number) => void;
    setPage: (value: React.SetStateAction<number>) => void;
    isLoading: boolean, 
    buttons:React.ReactNode[]
}

const CustomTable : React.FC<CustomTableProps>= ({getColumns,refetch,data,setSearch,getPageSize,setPageSize,setPage,isLoading,buttons}) => {

    const tableOptions = {
        reload: refetch,
        setting: {
          listsHeight: 400,
        },
        search: {
          onSearch(keyword:any) {
            setSearch(keyword);
          },
          allowClear: true,
        },
        fullScreen: true,
      }
    
      const paginationConfig = {
        pageSize: getPageSize(),
        total: data?.data?.count,
        pageSizeOptions: [10, 20, 30, 100],
        showSizeChanger: true,
        hideOnSinglePage: true,
        onChange: (page:number, pageSize:number) => {
          setPageSize(pageSize);
          setPage(page);
          refetch();
        },
      }

      
  return (
    <ProTable
    columns={getColumns}
    cardBordered
    onReset={refetch}
    dataSource={data?.data?.results}
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
    scroll={{x:1200}}
    loading={isLoading}
    pagination={paginationConfig}
    revalidateOnFocus={true}
    dateFormatter="string"
    headerTitle="Mrns"
    toolBarRender={() => buttons}
  />
  )
}

export default CustomTable;
