import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Flex,
  Row,
  Tag,
} from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import {
  API_BONS_SORTIE_ENDPOINT,
  API_FACTURE_ENDPOINT,
  API_PRFORMAS_ENDPOINT,
} from "@/api/api";
import {
  columns,
  columns_paiementrs,
  columns_prestation_article,
  columns_prestation_conteneurs,
} from "./data";
import useLoading from "@/hooks/useLoading";
import CustomTableData from "@/components/CustomTableData";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import AUFormPaiement from "./components/AUFormPaiement";
import { FileDoneOutlined } from "@ant-design/icons";
import { BonSortie } from "@/types/billing";
import Print from "@/components/Print";
import AUForm from "./components/AUForm";
import AUFormUpdate from "./components/AUFormUpdate";
import Refetch from "@/components/Refetch";

interface ProformaPageProps {
  facture: any;
  refetchFacture: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  isLoadingFacture: boolean;
}

export default ({
  facture,
  refetchFacture,
  isLoadingFacture,
}: ProformaPageProps) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    refetch();
    RefetchbonSorties();
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
    endpoint: `${API_PRFORMAS_ENDPOINT}${facture?.proforma?.id}/details/`,
    name: `GET_PROFORMA_DETAILS_${facture?.proforma?.id}`,
    params: {
      expand: "groups_lignes.tc",
    },
    enabled: false,
  });

  const {
    data: bonSorties,
    // isLoading: isLoadingDataBonSortie,
    // isRefetching: isRefetchingBonSorties,
    // isFetching: isFetchingBonSortie,
    refetch: RefetchbonSorties,
  } = useData({
    endpoint: API_BONS_SORTIE_ENDPOINT,
    name: `GET_BONSORTIES_${facture?.id}`,
    params: {
      all: true,
      facture__id: facture?.id,
      expand: "bon_sortie_items",
    },
    enabled: false,
  });


  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const refetchAll = () => {
    refetchFacture();
    RefetchbonSorties(); 
    refetch();
  }
  return (
    <>
      <Button onClick={showDrawer} color="red">
        {facture?.numero}
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
              count={
                facture?.paid
                  ? "Payé"
                  : facture?.a_terme
                  ? "A terme"
                  : "Non payé"
              }
              color={
                facture?.paid ? "green" : facture?.a_terme ? "gold" : "red"
              }
              size="default"
              style={{ marginBottom: "10px" }}
            ></Badge>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Refetch
                  isLoading={isLoadingFacture}
                  refetch={refetchAll}
                />
              </Col>
              <Col>
                <Print
                  endpoint={API_FACTURE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={facture?.id}
                  key={facture?.id}
                  type="Download"
                />
              </Col>
              <Col>
                <Print
                  endpoint={API_FACTURE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={facture?.id}
                  key={facture?.id}
                  type="View"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider style={{ marginTop: "10px" }} />

        <ProDescriptions
          loading={isLoadingFacture}
          dataSource={facture}
          columns={columns}
          style={{ marginBottom: "10px", maxHeight: "50" }}
        ></ProDescriptions>

        <Divider />

        {bonSorties?.data?.length == 0 && (
          <Card>
            <Flex align="center" justify="space-between">
              <span>BON LIVRAISON </span>
              <AUForm facture={facture} refetch={RefetchbonSorties} />
            </Flex>
          </Card>
        )}

        {bonSorties?.data?.length > 0 && (
          <Card>
            {bonSorties?.data?.map((item: BonSortie) => {
              return (
                <Flex justify="space-between" align="center">
                  <Flex gap={8}>
                    <FileDoneOutlined />
                    <span>{item?.numero}</span>
                  </Flex>
                  <Flex gap={8}>
                    <AUFormUpdate
                      bon_sortie={item}
                      refetch={RefetchbonSorties}
                      key={item?.id}
                    />
                    <Print
                      endpoint={API_BONS_SORTIE_ENDPOINT}
                      id={item?.id?.toString()}
                      type="View"
                      endpoint_suffex="generate_pdf/"
                    />
                    <Print
                      endpoint={API_BONS_SORTIE_ENDPOINT}
                      id={item?.id?.toString()}
                      type="Download"
                      endpoint_suffex="generate_pdf/"
                    />
                  </Flex>
                </Flex>
              );
            })}
          </Card>
        )}

        <Divider />
        <CustomTableData
          toolbar={{
            actions: [
              <AUFormPaiement
                facture={facture}
                refetch={refetchFacture}
                key={facture?.id}
              />,
            ],
          }}
          getColumns={columns_paiementrs}
          data={facture?.paiements}
          isLoading={isLoadingFacture}
          refetch={refetchFacture}
          headerTitle="Paiements"
          key="PAIEMENTS_TABLE"
        />
        <Divider />

        {data?.data?.lignes_prestations_article.length > 0 && (
          <>
            <CustomTableData
              getColumns={columns_prestation_article}
              data={data?.data?.lignes_prestations_article}
              isLoading={isLoading}
              refetch={refetch}
              headerTitle="Préstation Artilce"
              key="PRESTATIONS_ARTICLE_TABLE"
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
                key={`PRESTATIIONS_TABLE_${item?.id}`}
              />
            </>
          );
        })}
      </Drawer>
    </>
  );
};
