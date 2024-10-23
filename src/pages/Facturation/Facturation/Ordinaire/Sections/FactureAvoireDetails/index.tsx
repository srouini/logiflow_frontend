import { useState } from "react";
import { Button, Col, Divider, Drawer, Row } from "antd";
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
    name: `GET_LIGNES_FACTURE_COMPLIMENTAIRE_${factureAvoire?.id}`,
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

  const refetchAll = () => {
    refetchFacture(); 
    refetchLignesFacture();
  }

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
           
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Refetch isLoading={isLoadingFacture} refetch={refetchAll} />
              </Col>
              <Col>
                <Print
                  endpoint={API_FACTURES_AVOIRE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={factureAvoire?.id}
                  key={factureAvoire?.id}
                  type="Download"
                />
              </Col>
              <Col>
                <Print
                  endpoint={API_FACTURES_AVOIRE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={factureAvoire?.id}
                  key={factureAvoire?.id}
                  type="View"
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
                refetch={refetchAll}
                key={factureAvoire?.id}
              />,
            ],
          }}
          getColumns={columns_prestation_conteneurs}
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
