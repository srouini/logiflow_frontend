import { useState } from "react";
import { Badge, Button,Col, Divider, Drawer, Row } from "antd";
import { ProDescriptions } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import {
  API_PROFORMAS_GROUPAGE_ENDPOINT,
} from "@/api/api";
import {
  columns,
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
  refetch_sub_article: () => void;
}

export default ({ proforma, refetchProformas,refetch_sub_article }: ProformaPageProps) => {
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
    endpoint: `${API_PROFORMAS_GROUPAGE_ENDPOINT}${proforma?.id}/details/`,
    name: `GET_PROFORMA_GROUPAGE_DETAILS_${proforma?.id}`,
    params: {},
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
                  endpoint={API_PROFORMAS_GROUPAGE_ENDPOINT}
                  id={proforma?.id}
                  endpoint_suffex="generate_pdf/"
                  key={proforma?.id}
                  type="Download"
                  permission="billing.can_print_proformagroupage"
                />
              </Col>
              <Col>
                <Print
                  endpoint={API_PROFORMAS_GROUPAGE_ENDPOINT}
                  id={proforma?.id}
                  endpoint_suffex="generate_pdf/"
                  key={proforma?.id}
                  type="View"
                  permission="billing.can_print_proformagroupage"
                />
              </Col>
              <Col>
                <ValidateProformaButton
                refetch_sub_article={refetch_sub_article}
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

        <CustomTableData
          getColumns={columns_prestation_conteneurs}
          data={data?.data?.lignes_prestations}
          isLoading={isLoading}
          refetch={refetch}
          headerTitle="Préstations"
          key={`PROFORMA_LIGNE_PRESTATION_GROUPAGE_TABLE_${proforma?.id}`}
        />
      </Drawer>
    </>
  );
};
