import { useState } from "react";
import { Badge, Button, Card, Divider, Drawer, Row, Tag } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import {
  API_PRFORMAS_ENDPOINT,
} from "@/api/api";
import {
  columns,
  columns_prestation_article,
  columns_prestation_conteneurs,
} from "./data";
import useLoading from "@/hooks/useLoading";
import { Proforma } from "@/types/billing";
import CustomTableData from "@/components/CustomTableData";

interface ProformaPageProps {
  proforma: Proforma;
}

export default ({ proforma }: ProformaPageProps) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    refetch();
  };

  const onClose = () => {
    setOpen(false);
  };


  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: `${API_PRFORMAS_ENDPOINT}${proforma?.id}/details/`,
    name: `GET_PROFORMA_DETAILS_${proforma?.id}`,
    params: {
      expand:"groups_lignes.tc"
    },
    enabled: false,
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  return (
    <>
      <Button onClick={showDrawer}><span style={{textDecorationLine:`${proforma.trashed ? "line-through" :""} `}}>{proforma?.numero}</span></Button>

      <Drawer
        width={1000}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <Badge count={proforma?.valide ? "Validé" : "Annulé"} color={proforma?.valide ? "green" : "red"} size="default" style={{marginBottom:"10px"}}></Badge>
        <ProDescriptions
          dataSource={proforma}
          columns={columns}
          style={{ marginBottom: "10px", maxHeight: "50" }}
        ></ProDescriptions>

        <Divider />

        <CustomTableData
          getColumns={columns_prestation_article}
          data={data?.data?.lignes_prestations_article}
          isLoading={isLoading}
          refetch={refetch}
          headerTitle="Préstation Artilce"
          key="PROFORMA_LIGNE_PRESTATION_ARTICLE_TABLE"
        />

        <Divider />

        {data?.data?.groups?.map((item: any) => {
          return (
            <>
              <Card style={{ marginBottom: "20px",marginTop: "20px" }}>
                <Row>
                  { item?.dangereux && <Tag color="red">DGX</Tag>}
                  { item?.frigo &&  <Tag color="blue">FRIGO</Tag>}
                  {item?.type_description && <Tag color="green">{item.type_description}</Tag>}
                  { data?.data?.groups_lignes?.map((container:any) => {
                   return container.groupe === item.id &&  <Tag color="default">{container?.matricule}</Tag>
                  })}
                </Row>
              </Card>

              <CustomTableData
                getColumns={columns_prestation_conteneurs}
                data={data?.data?.lignes_prestations.filter(
                  (elem: any) => elem.groupe == item.id
                )}
                isLoading={isLoading}
                refetch={refetch}
                headerTitle="Préstations"
                key={`PROFORMA_LIGNE_PRESTATION_ARTICLE_TABLE_${item?.id}`}
              />
            </>
          );
        })}
      </Drawer>
    </>
  );
};
