import { API_FACTURES_AVOIRE_GROUPAGE_ENDPOINT } from "@/api/api";
import Print from "@/components/Print";
import { renderDate, renderMoney, renderText } from "@/utils/functions";
import { ProColumns, TableDropdown } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import AUForm from "../FactureAvoireDetails/index";

interface Props {
  refetch: any;
  isLoadingFacture: boolean;
}

export const getColumns = ({
  refetch,
  isLoadingFacture,
}: Props): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "full_number",
    copyable: true,
    width: 180,
    key: "1",
    render: (_, record: any) => (
      <AUForm
        factureAvoire={record}
        key={record?.id}
        refetchFacture={refetch}
        isLoadingFacture={isLoadingFacture}
      />
    ),
  },
  {
    title: "Facture",
    dataIndex: "facture",
    width: 150,
    key: "2",
    render: (record: any) => renderText(record?.numero),
  },
  {
    title: "Date",
    dataIndex: "date_creation",
    key: "5",
    render: (record) => renderDate(record),
    width: 100,
  },
  {
    title: "HT",
    dataIndex: "HT",
    key: "8",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    key: "9",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    key: "11",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "Actions",
    valueType: "option",
    key: "12",
    align: "center",
    width: 100,
    fixed: "right",
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        style={{ justifyItems: "center" }}
        children={[
          <Row gutter={8}>
            <Col>
              <Print
                endpoint={API_FACTURES_AVOIRE_GROUPAGE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="Download"
              />
            </Col>
            <Col>
              <Print
                endpoint={API_FACTURES_AVOIRE_GROUPAGE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="View"
              />
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];
