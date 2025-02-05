import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import CustomTable from "@/components/CustomTable";
import { getPaiementColumns } from "../data";
import { Button, Drawer, Popconfirm } from "antd";
import { AuditOutlined, ClearOutlined } from "@ant-design/icons";
import QueryFilters from "./QueryFilters";
import { API_FACTURES_GROUPAGE_ENDPOINT } from "@/api/api";
import { FactureGroupage } from "@/types/billing";
import SelectedFactures from "./SelectedFactures";
import Paiement from "./Paiement";
interface Props {
  expand?: string;
  query_params?: any;
}

export default ({ expand = "proforma.gros,proforma.sous_article.client,proforma.article.client,proforma.article", query_params }: Props) => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();
  const [open, setOpen] = useState(false);


  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_FACTURES_GROUPAGE_ENDPOINT,
    name: "GET_DOCUMENTS_GROUPAGE_FACTURES_EXPORT",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: expand,
      ...query_params,
      paid:false
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const [selcetedFactures, setSelectedFactures] = useState<FactureGroupage[]>([]);

  useEffect(() => {
    console.log(selcetedFactures)
  }, [selcetedFactures])

  const handleFactureAdd = (facture: any) => {
    console.log(facture)

    const exist = selcetedFactures.some(item => item.id === facture.id);
    if (!exist) {
      setSelectedFactures(prev => [...prev, facture]);
    }

  }

  return (
    <>
      <Button icon={<AuditOutlined />} type="dashed" onClick={() => setOpen(true)}>
        Paiement
      </Button>

      <Drawer
        placement="left"
        title="Exportation de données"
        destroyOnClose
        width={"80%"}
        footer={false}
        open={open}
        closeIcon
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

        <SelectedFactures
          factures={selcetedFactures}
          setSelectedFactures={setSelectedFactures}
        />

        <CustomTable
          getColumns={getPaiementColumns(handleFactureAdd)}
          data={data}
          hasoptions={false}
          isFetching={isFetching}
          getPageSize={getPageSize}

          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="DOCUMENTS_GROUPAGE_FACTURES_TABLE_EXPORT"

          toolbar={{
            actions: [
              <Paiement factures={selcetedFactures} refetch={refetch} setSelectedFactures={setSelectedFactures} />,
              <Popconfirm
                title="retirer cette facture"
                description="Êtes-vous sûr de vouloir retirer toute les facture ?"
                onConfirm={() => setSelectedFactures([])}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<ClearOutlined />} />
              </Popconfirm>
            ],
          }}
        />
      </Drawer>
    </>
  );
};
