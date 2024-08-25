import { PageContainer } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import useData from "../../hooks/useData";
import { columns } from "./Data";
import Ajouter from "./Ajouter";
import SearchInput from "../../components/SearchInput";
import useLoading from "../../hooks/useLoading";
import usePage from "../../hooks/usePage";
import QueryFilters from "./QueryFilters";
import useFilters from "../../hooks/useFilters";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

export default () => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters()

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
  } = useData({
    endpoint: "/api/data/gros/",
    name: "GET_MRNS",
    params: { search: search, page: page, page_size: getPageSize(),...filters },
  });

  const { isLoading } = useLoading({ isLoadingData, isRefetching });

  const actionRef = useRef<ActionType>();

  return (
    <div>
      <PageContainer
      
        contentWidth="Fluid"
        header={{
          title: "Dashboard",
          ghost: true,
          breadcrumb: {
            items: [
              {
                path: "",
                title: "Admin",
              },
              {
                path: "",
                title: "Dashboard",
              },
            ],
          },
          extra: [
            <SearchInput
              isLoading={isLoading}
              refetch={refetch}
              setSearch={setSearch}
              key="gros_search"
            />,
          ],
        }}
      >
        <div  style={{ marginBottom: "30px",backgroundColor: "var(--ant-primary-color)", borderRadius:"5px" }}>
          <QueryFilters setFilters={setFilters}  resetFilters={resetFilters} />
        </div >

        <ProTable
          columns={columns}
          actionRef={actionRef}
          cardBordered
          
          editable={{
            type: "multiple",
          }}
          dataSource={data?.data?.results}
          columnsState={{
            persistenceKey: "pro-table-singe-demos",
            persistenceType: "localStorage",
            defaultValue: {
              option: { fixed: "right", disable: true },
            },
            onChange(value) {
              console.log("value: ", value);
            },
          }}
          rowKey="id"
          search={false}
          options={{
            setting: {
              listsHeight: 400,
            },
            search: {
              onSearch(keyword) {
                setSearch(keyword);
              },
              allowClear: true,
            },
            fullScreen: true,
          }}
          loading={isLoading}
          pagination={{
            pageSize: getPageSize(),
            total: data?.data?.count,
            pageSizeOptions: [10, 20, 30, 100],
            showSizeChanger: true,
            hideOnSinglePage: true,
            onChange: (page, pageSize) => {
              setPageSize(pageSize);
              setPage(page);
              refetch();
            },
          }}
          revalidateOnFocus={true}
          dateFormatter="string"
          headerTitle="Mrns"
          toolBarRender={() => [<Ajouter refetch={refetch} />]}
        />
      </PageContainer>
    </div>
  );
};
