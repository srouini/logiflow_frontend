import { useState } from "react";
import { Button, Divider, Drawer } from "antd";
import { Container } from "@/types/data";
import { ProDescriptions } from "@ant-design/pro-components";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import { API_SOUSARTICLES_ENDPOINT } from "@/api/api";
import usePage from "@/hooks/usePage";
import { getColumns } from "./data";
import useLoading from "@/hooks/useLoading";
import AUForm from "./components/AUForm";

interface SubArticlePageProps {
  container: Container;
  columns: any;
}

export default ({ container, columns }: SubArticlePageProps) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
  } = useData({
    endpoint: API_SOUSARTICLES_ENDPOINT,
    name: "GET_CONTAINERS",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "client,transitaire",
      tc__id: container?.id,
    },
  });

  const { isLoading } = useLoading({ isLoadingData, isRefetching });

  return (
    <>
      <Button onClick={showDrawer}>{container?.tc}</Button>

      <Drawer
        width={900}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <p
          className="site-description-item-profile-p"
          style={{ marginBottom: 24, fontWeight: "bold" }}
        >
          {container?.tc}
        </p>
        <ProDescriptions
          dataSource={container}
          columns={columns}
          style={{ marginBottom: "10px", maxHeight: "50" }}
        ></ProDescriptions>

        <Divider />

        <CustomTable
          getColumns={getColumns(refetch)}
          data={data}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="SUB_ARTICLES_TABLE"
          headerTitle={
            <AUForm refetch={refetch} tc={container?.id} initialvalues={null} />
          }
        />
      </Drawer>
    </>
  );
};
