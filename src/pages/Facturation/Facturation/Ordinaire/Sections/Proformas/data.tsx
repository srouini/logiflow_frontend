import { API_PRFORMAS_ENDPOINT } from "@/api/api";
import Print from "@/components/Print";
import { renderDate, renderDateTime, renderMoney, renderText } from "@/utils/functions";
import { ProColumns, TableDropdown } from "@ant-design/pro-components";
import { Row, Col, Tag } from "antd";
import ProfomaDetails from "../ProformaDetails/index"
import ValidateProformaButton from "../ProformaDetails/components/ValidateProformaButton";

export const getColumns = (refetch:any): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "numero",
    copyable: true,
    width: 150,
    key: "1",
    render:(_,record) => <ProfomaDetails proforma={record} refetchProformas={refetch}/>
  },
  {
    title: "Etat",
    dataIndex: "valide",
    width: 150,
    key: "2",
    render: (_, record: any) =>
      record?.trashed ? (
        <Tag> Annulé </Tag>
      ) : record?.valide ? (
        <Tag color="green"> Valide </Tag>
      ) : (
        <Tag color="red">Non Valide</Tag>
      ),
  },
  {
    title: "Date",
    dataIndex: "date_proforma",
    key: "5",
    render: (record) => renderDate(record),
    width: 100,
  },

  {
    title: "HT",
    dataIndex: "HT",
    key: "7",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    key: "8",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    key: "9",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "Actions",
    valueType: "option",
    key: "10",
    align: "center",
    width: 180,
    fixed: "right",
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        style={{ justifyItems: "center" }}
        children={[
          <Row gutter={8}>
            <Col>
              <Print
                endpoint={API_PRFORMAS_ENDPOINT}
                id={record?.id}
                endpoint_suffex="generate_pdf/"
                key={record?.id}
                type="Download"
                disabled={record?.trashed}
                permission="billing.can_print_proforma"
              />
            </Col>
            <Col>
              <Print
                endpoint={API_PRFORMAS_ENDPOINT}
                id={record?.id}
                endpoint_suffex="generate_pdf/"
                key={record?.id}
                type="View"
                disabled={record?.trashed}
                permission="billing.can_print_proforma"

              />
            </Col>
            <Col>
            <ValidateProformaButton proforma={record} key={record?.id} refetch={refetch}/>
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];

export const DetailsColumns = [
  {
    title: "Mrn",
    dataIndex: "gros",
    key: "gros",
    width: 100,
    render: (record: any) => renderText(record?.gros),
  },
  {
    title: "BL",
    key: "bl",
    dataIndex: "bl",
    width: 150,
    render: (record: any) => renderText(record),
  },
  {
    title: "Client",
    key: "client",
    dataIndex: "client",
    width: 300,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Groupage",
    key: "groupage",
    dataIndex: "groupage",
    width: 120,
    render: (record: any) =>
      record ? <Tag color="blue"> Groupage </Tag> : <Tag> Ordinaire </Tag>,
  },

  {
    title: "Depoté",
    key: "depote",
    width: 100,
    dataIndex: "depote",
    // @ts-ignore
    render: (_, record: any) =>
      record.depote && record.groupage ? (
        <Tag color="green"> Depté </Tag>
      ) : record.groupage ? (
        <Tag color="red"> Non depoté </Tag>
      ) : (
        "-"
      ),
  },
  {
    title: "Date dépotage",
    dataIndex: "date_depotage",
    key: "date_depotage",
    width: 150,
    render: (record: any) => renderDateTime(record),
  },

  {
    title: "Transitaire",
    key: "transitaire",
    width: 300,
    dataIndex: "transitaire",
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Designation",
    key: "designation",
    dataIndex: "designation",
    ellipsis: true,
    width: 350,
    render: (record: any) => renderText(record),
  },
];
