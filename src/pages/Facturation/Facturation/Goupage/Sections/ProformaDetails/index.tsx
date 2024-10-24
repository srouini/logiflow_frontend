import { useState } from "react";
import { Badge, Button, Card, Col, Divider, Drawer, Row, Tag } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import { API_PRFORMAS_ENDPOINT } from "@/api/api";
import {
  columns,
  columns_prestation_article,
  columns_prestation_conteneurs,
} from "./data";
import useLoading from "@/hooks/useLoading";
import { Proforma } from "@/types/billing";
import CustomTableData from "@/components/CustomTableData";
import Print from "@/components/Print";
import ValidateProformaButton from "./components/ValidateProformaButton";
import Refetch from "@/components/Refetch";

interface ProformaPageProps {
  proforma: Proforma;
  refetchProformas: any;
}

export default ({ proforma, refetchProformas }: ProformaPageProps) => {
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
      expand: "groups_lignes.tc",
    },
    enabled: false,
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const refetchAll = () => {
    refetch();
    refetchProformas();
  };
  return (
    <>
      <Button onClick={showDrawer}>
        <span
          style={{
            textDecorationLine: `${proforma.trashed ? "line-through" : ""} `,
          }}
        >
          {proforma?.numero}
        </span>
      </Button>

      <Drawer
        width={1000}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <Row justify={"space-between"}>
          <Col>
            <Badge
              count={proforma?.valide ? "Validé" : "Annulé"}
              color={proforma?.valide ? "green" : "red"}
              size="default"
              style={{ marginBottom: "10px" }}
            ></Badge>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Refetch isLoading={isLoading} refetch={refetchAll} />
              </Col>
              <Col>
                <Print
                  endpoint={API_PRFORMAS_ENDPOINT}
                  id={proforma?.id}
                  endpoint_suffex="generate_pdf/"
                  key={proforma?.id}
                  type="Download"
                />
              </Col>
              <Col>
                <Print
                  endpoint={API_PRFORMAS_ENDPOINT}
                  id={proforma?.id}
                  endpoint_suffex="generate_pdf/"
                  key={proforma?.id}
                  type="View"
                />
              </Col>
              <Col>
                <ValidateProformaButton
                  proforma={proforma}
                  key={proforma?.id}
                  refetch={refetchProformas}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider style={{ marginTop: "10px" }} />

        <ProDescriptions
          loading={isLoading}
          dataSource={proforma}
          columns={columns}
          style={{ marginBottom: "10px", maxHeight: "50" }}
        ></ProDescriptions>

        <Divider />

        {data?.data?.lignes_prestations_article?.length > 0 && (
          <>
            <CustomTableData
              getColumns={columns_prestation_article}
              data={data?.data?.lignes_prestations_article}
              isLoading={isLoading}
              refetch={refetch}
              headerTitle="Préstation Artilce"
              key="PROFORMA_LIGNE_PRESTATION_ARTICLE_TABLE"
            />

            <Divider />
          </>
        )}

        {data?.data?.groups?.map((item: any) => {
          return (
            <>
              <Card style={{ marginBottom: "20px", marginTop: "20px" }}>
                <Row>
                  {item?.dangereux && <Tag color="red">DGX</Tag>}
                  {item?.frigo && <Tag color="blue">FRIGO</Tag>}
                  {item?.type_description && (
                    <Tag color="green">{item.type_description}</Tag>
                  )}
                  {data?.data?.groups_lignes?.map((container: any) => {
                    return (
                      container.groupe === item.id && (
                        <Tag color="default">{container?.matricule}</Tag>
                      )
                    );
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
