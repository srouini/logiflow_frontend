import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import DetailsButton from "@/components/DetailsButton";
import { API_ARTICLES_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import Print from "@/components/Print";
import AUFormDepotage from "../ArticleDetails/components/AUFormDepotage";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numero",
    dataIndex: "numero",
    key: "1",
    width: 100,
    render: (_, record) => (
      <DetailsButton
        text={record.numero}
        navigate_to={`/rotations/mrns/articles/${record?.id}`}
      />
    ),
  },

  {
    title: "BL",
    key: "2",
    dataIndex: "bl",
    width: 150,
    render: (record: any) => renderText(record),
  },
  {
    title: "Groupage",
    key: "3",
    dataIndex: "groupage",
    width: 120,
    render: (record: any) =>
      record ? <Tag color="blue"> Groupage </Tag> : <Tag> Ordinaire </Tag>,
  },
  {
    title: "Depoté",
    key: "7",
    width: 100,
    dataIndex: "depote",
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
    title: "Client",
    key: "4",
    dataIndex: "client",
    width: 300,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Designation",
    key: "5",
    dataIndex: "designation",
    ellipsis: true,
    width: 350,
    render: (record: any) => renderText(record),
  },
  {
    title: "Transitaire",
    key: "6",
    width: 300,
    dataIndex: "transitaire",
    render: (record: any) => renderText(record?.raison_sociale),
  },

  {
    title: "Date dépotage",
    dataIndex: "date_depotage",
    key: "8",
    width: 150,
    render: (record) => renderDate(record),
  },
  
  {
    title: "Actions",
    valueType: "option",
    key: "9",
    fixed: "right",
    width: 350,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Delete
                url={API_ARTICLES_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Article"
                type="dashed"
                link={false}
                text=""
                has_icon
              />
            </Col>
            <Col>
              <AUForm
                initialvalues={record}
                refetch={refetch}
                gros={record?.gros}
                editText=""
                hasIcon
              />
            </Col>
            <Col>
              <Print
                type="View"
                endpoint={API_ARTICLES_ENDPOINT}
                disabled={!record?.groupage}
                id={record?.id}
                endpoint_suffex="generate_ticktage/"
                button_text="Ticktage"
              />
            </Col>
            <Col>
              <AUFormDepotage
                article={record?.id}
                disable={record?.depote || !record?.groupage}
                refetch={refetch}
              />
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];

export const DetailsColumns = [
  {
    title: "Numéro",
    dataIndex: "gros",
    copyable: true,
    ellipsis: false,
    tooltip: "Gros",
  },
  {
    title: "Regime",
    dataIndex: "regime",
    render: (record: any) => (
      <Tag color={record.color ? record?.color : "blue"}>
        {" "}
        {record?.designation}{" "}
      </Tag>
    ),
  },
  {
    title: "Accostage",
    ellipsis: true,
    dataIndex: "accostage",
  },
  {
    title: "Escale",
    ellipsis: true,
    dataIndex: "escale",
  },
  {
    title: "Navire",
    dataIndex: "navire",
    ellipsis: false,
    render: (record: any) => renderText(record?.nom),
  },
  {
    title: "Armasteur",
    dataIndex: "armateur",
    ellipsis: false,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Consignataire",
    dataIndex: "consignataire",
    ellipsis: false,
    render: (record: any) => renderText(record?.raison_sociale),
  },
];

export const columns = [
  {
    title: "Numero",
    dataIndex: "numero",
    key: "1",
    selected:true
  },

  {
    title: "BL",
    key: "2",
    dataIndex: "bl",
    selected:false

  },
  {
    title: "Groupage",
    key: "3",
    dataIndex: "groupage",
    selected:true

  },
  {
    title: "Depoté",
    key: "7",
    dataIndex: "depote",
    selected:false

  },
  {
    title: "Date dépotage",
    dataIndex: "date_depotage",
    key: "8",
    selected:false

  },
  {
    title: "Client",
    key: "4",
    dataIndex: "client",
    schema:["client","raison_sociale"],
    selected:true

  },
  {
    title: "Transitaire",
    key: "6",
    dataIndex: "transitaire",
    schema:["transitaire","raison_sociale"],
    selected:true
  },
  {
    title: "Designation",
    key: "5",
    dataIndex: "designation",
    selected:true

  },

];
