import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_AGENT_DOUANE_ENDPOINT } from "@/constants/reference";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns } from "./data";
import { Card, Drawer } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import QueryFilters from "./QueryFilters";
import AUForm from "./AUForm";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export";
import { useAuth } from "@/context/AuthContext";

interface Props {}

const AgentDouanePage: React.FC<Props> = () => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_AGENT_DOUANE_ENDPOINT,
    name: "GET_AGENT_DOUANE",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const [open, setOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<any>(columns);

  const showModal = () => {
    setOpen(true);
  };

  const countStr = () => {
    let count_str = "";
    if (data?.data?.count > 0) {
      count_str = ` (${data?.data?.count.toString()})`;
    }
    return count_str;
  };

  const { user } = useAuth();

  const card = {
    title: "Agents Douane",
    icon: <TeamOutlined style={{ fontSize: "24px" }} />,
    description: "Gérer les agents de douane",
    color: user?.profile?.theme_color || "#3D9970",
  };

  return (
    <div>
      <Card
        hoverable
        style={{
          height: "100%",
          borderTop: `2px solid ${card.color}`,
          cursor: "pointer",
        }}
        onClick={showModal}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{ color: card.color }}>{card.icon}</div>
        </div>
        <Card.Meta
          title={<div style={{ textAlign: "center" }}>{card.title}</div>}
          description={
            <div style={{ textAlign: "center" }}>{card.description}</div>
          }
        />
      </Card>

      <Drawer
        title="Agents Douane"
        destroyOnClose
        width={1200}
        footer={false}
        open={open}
        closeIcon
        placement="left"
        onClose={() => {
          setOpen(false);
        }}
      >
        <QueryFilters
          setFilters={setFilters}
          resetFilters={resetFilters}
          setPage={setPage}
          collapsed={false}
        />

        <ColumnsSelect
          columns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
        />

        <CustomTable
          getColumns={getColumns(refetch)}
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="AGENT_DOUANE_TABLE"
          toolbar={{
            actions: [
              <Export
                button_text={`Exportez ${countStr()}`}
                columns={selectedColumns}
                endpoint={API_AGENT_DOUANE_ENDPOINT}
                search={search}
                filters={filters}
              />,
              <AUForm initialvalues={null} refetch={refetch} />,
            ],
          }}
        />
      </Drawer>
    </div>
  );
};

export default AgentDouanePage;
