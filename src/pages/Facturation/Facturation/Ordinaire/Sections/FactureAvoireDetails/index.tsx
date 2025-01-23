import { useState } from "react";
import { Badge, Button, Col, Divider, Drawer, Row } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import {
  API_FACTURES_AVOIRE_ENDPOINT,
  API_LIGNES_FACTURE_AVOIRE_ENDPOINT,
} from "@/api/api";
import {
  columns,
  columns_prestation_conteneurs,
} from "./data";
import useLoading from "@/hooks/useLoading";
import CustomTableData from "@/components/CustomTableData";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import AUForm from "./components/AUForm";
import Print from "@/components/Print";
import Refetch from "@/components/Refetch";

interface factureAvoireDetailsPageProps {
  factureAvoire: any;
  refetchFacture: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  isLoadingFacture: boolean;
}

export default ({
  factureAvoire,
  refetchFacture,
  isLoadingFacture,
}: factureAvoireDetailsPageProps) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    refetchLignesFacture();
  };

  const onClose = () => {
    setOpen(false);
  };

  const {
    data: lignesFacture,
    isLoading: isLoadingLignesFacture,
    isRefetching: isRefetchingLignesFacture,
    isFetching: isFetchingLignesFacture,
    refetch: refetchLignesFacture,
  } = useData({
    endpoint: API_LIGNES_FACTURE_AVOIRE_ENDPOINT,
    name: `GET_LIGNES_FACTURE_AVOIRE_${factureAvoire?.id}`,
    params: {
      all: true,
      facture_avoire__id: factureAvoire?.id,
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

  const refetchFactureLignes = () => {
    refetchFacture();
    refetchLignesFacture();
  };

  return (
    <>
      <Button onClick={showDrawer} color="red">
        {factureAvoire?.full_number}
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
            <Badge status="processing" style={{ marginBottom: "-10px" }}>{factureAvoire?.full_number}</Badge>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Refetch isLoading={isLoadingFacture} refetch={refetchFactureLignes} />
              </Col>
              <Col>
                <Print
                  endpoint={API_FACTURES_AVOIRE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={factureAvoire?.id}
                  key={factureAvoire?.id}
                  type="Download"
                  permission="billing.can_print_factureavoire"

                />
              </Col>
              <Col>
                <Print
                  endpoint={API_FACTURES_AVOIRE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={factureAvoire?.id}
                  key={factureAvoire?.id}
                  type="View"
                  permission="billing.can_print_factureavoire"

                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider style={{ marginTop: "10px" }} />
        <ProDescriptions
          loading={isLoadingFacture}
          dataSource={factureAvoire}
          columns={columns}
          style={{ marginBottom: "10px", maxHeight: "50" }}
        ></ProDescriptions>

        <Divider />

        <CustomTableData
          toolbar={{
            actions: [
              <AUForm
                facture={factureAvoire}
                refetch={refetchFactureLignes}
                key="add_ligne"
              />,
            ],
          }}
          getColumns={columns_prestation_conteneurs(refetchFactureLignes)}
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
