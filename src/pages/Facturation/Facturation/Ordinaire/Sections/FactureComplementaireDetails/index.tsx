import { useState } from "react";
import { Badge, Button, Col, Divider, Drawer, Row } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import {
  API_FACTURES_COMPLIMENTAIRE_ENDPOINT,
  API_LIGNES_FACTURE_COMPLIMENTAIRE_ENDPOINT,
  API_PAIEMENTS_FACTURE_COMPLIMENTAIRE_ENDPOINT,
} from "@/api/api";
import {
  columns,
  columns_paiementrs,
  columns_prestation_conteneurs,
} from "./data";
import useLoading from "@/hooks/useLoading";
import CustomTableData from "@/components/CustomTableData";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import AUFormPaiement from "./components/AUFormPaiement";
import AUForm from "./components/AUForm";
import Print from "@/components/Print";
import Refetch from "@/components/Refetch";

interface FactureComplementaireDetailsPageProps {
  factureComplementaire: any;
  refetchFacture: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  isLoadingFacture: boolean;
}

export default ({
  factureComplementaire,
  refetchFacture,
  isLoadingFacture,
}: FactureComplementaireDetailsPageProps) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    refetchPaiements();
    refetchLignesFacture();
  };

  const onClose = () => {
    setOpen(false);
  };

  const {
    data: paiementsFacture,
    isLoading: isLoadingPaiementsFacture,
    isRefetching: isRefetchingPaiementsFacture,
    isFetching: isFetchingPaiementsFacture,
    refetch: refetchPaiements,
  } = useData({
    endpoint: API_PAIEMENTS_FACTURE_COMPLIMENTAIRE_ENDPOINT,
    name: `GET_PAIEMENTS_FACTURE_COMPLIMENTAIRE_${factureComplementaire?.id}`,
    params: {
      all: true,
      facture_complementaire__id: factureComplementaire?.id,
      expand: "banque",
    },
    enabled: false,
  });

  const { isLoading: isLoadingPaiementsFactureCompelementaire } = useLoading({
    loadingStates: [
      isLoadingPaiementsFacture,
      isRefetchingPaiementsFacture,
      isFetchingPaiementsFacture,
    ],
  });

  const {
    data: lignesFacture,
    isLoading: isLoadingLignesFacture,
    isRefetching: isRefetchingLignesFacture,
    isFetching: isFetchingLignesFacture,
    refetch: refetchLignesFacture,
  } = useData({
    endpoint: API_LIGNES_FACTURE_COMPLIMENTAIRE_ENDPOINT,
    name: `GET_LIGNES_FACTURE_COMPLIMENTAIRE_${factureComplementaire?.id}`,
    params: {
      all: true,
      facture_complementaire__id: factureComplementaire?.id,
    },
    enabled: false,
  });

  const { isLoading: isLoadingLignesFactureCompelementaire } = useLoading({
    loadingStates: [
      isLoadingLignesFacture,
      isRefetchingLignesFacture,
      isFetchingLignesFacture,
    ],
  });
  const refetchFacturePaiements = () => {
    refetchFacture();
    refetchPaiements();
  };

  const refetchFactureLignes = () => {
    refetchFacture();
    refetchLignesFacture();
  };

  const refetchAll = () => {
    refetchFactureLignes();
    refetchFacturePaiements();
  };
  return (
    <>
      <Button onClick={showDrawer} color="red">
        {factureComplementaire?.full_number}
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
                factureComplementaire?.paid
                  ? "Payé"
                  : factureComplementaire?.a_terme
                  ? "A terme"
                  : "Non payé"
              }
              color={
                factureComplementaire?.paid
                  ? "green"
                  : factureComplementaire?.a_terme
                  ? "gold"
                  : "red"
              }
              size="default"
              style={{ marginBottom: "10px" }}
            ></Badge>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Refetch isLoading={isLoadingFacture} refetch={refetchAll} />
              </Col>
              <Col>
                <Print
                  endpoint={API_FACTURES_COMPLIMENTAIRE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={factureComplementaire?.id}
                  key={factureComplementaire?.id}
                  type="Download"
                />
              </Col>
              <Col>
                <Print
                  endpoint={API_FACTURES_COMPLIMENTAIRE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={factureComplementaire?.id}
                  key={factureComplementaire?.id}
                  type="View"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider style={{ marginTop: "10px" }} />
        <ProDescriptions
          loading={isLoadingFacture}
          dataSource={factureComplementaire}
          columns={columns}
          style={{ marginBottom: "10px", maxHeight: "50" }}
        ></ProDescriptions>

        <Divider />

        <CustomTableData
          toolbar={{
            actions: [
              <AUFormPaiement
                facture={factureComplementaire}
                refetch={refetchFacturePaiements}
                paiementsFacture={paiementsFacture?.data}
                key={factureComplementaire?.id}
              />,
            ],
          }}
          getColumns={columns_paiementrs}
          data={paiementsFacture?.data}
          isLoading={isLoadingPaiementsFactureCompelementaire}
          refetch={refetchPaiements}
          headerTitle="Paiements"
          key="PAIEMENTS_FACTURE_COMPLEMENTAIRE_TABLE"
        />
        <Divider />

        <CustomTableData
          toolbar={{
            actions: [
              <AUForm
                facture={factureComplementaire}
                refetch={refetchFactureLignes}
                key={factureComplementaire?.id}
              />,
            ],
          }}
          getColumns={columns_prestation_conteneurs(refetchAll)}
          data={lignesFacture?.data}
          isLoading={isLoadingLignesFactureCompelementaire}
          refetch={refetchLignesFacture}
          headerTitle="Lignes"
          key={"LignesFactureComplemenatire"}
        />
      </Drawer>
    </>
  );
};
