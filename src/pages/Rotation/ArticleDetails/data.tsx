import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderDate, renderDateTime, renderText } from "@/utils/functions";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import SubArticlePage from "../ContainerDetails";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";

export const getColumns = (
  refetch: () => void,
  article: any
): ProColumns<any>[] => [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "1",
    width: 100,
    render: (_, record) =>
      article?.groupage ? (
        <SubArticlePage container={record} columns={columns} />
      ) : (
        record?.tc
      ),
  },
  {
    title: "Type",
    key: "2",
    dataIndex: "type_tc",
    width: 150,
    render: (record: any) => <Tag color="blue"> {record?.designation} </Tag>,
  },
  {
    title: "Tar",
    key: "3",
    dataIndex: "tar",
    width: 150,
  },
  {
    title: "Poids",
    key: "4",
    dataIndex: "poids",
    width: 120,
  },
  {
    title: "Nature",
    key: "5",
    dataIndex: "dangereux",
    width: 150,
    render: (_, record: any) => (
      <>
        {" "}
        {record.dangereux ? <Tag color="red"> DGX </Tag> : ""}{" "}
        {record.frigo ? <Tag color="blue"> FRIGO </Tag> : ""}
      </>
    ),
  },

  {
    title: "Actions",
    valueType: "option",
    key: "6",
    fixed:"right",
    width: 100,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Delete
                url={API_CONTENEURS_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Conteneur"
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
                article={record?.article}
                editText=""
                hasIcon
              />
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];

export const columns = [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "tc",
    width: 100,
  },
  {
    title: "Type",
    key: "type_tc",
    dataIndex: "type_tc",
    width: 150,
    render: (record: any) => <Tag color="blue"> {record?.designation} </Tag>,
  },
  {
    title: "Tar",
    key: "tar",
    dataIndex: "tar",
    width: 150,
  },
  {
    title: "Poids",
    key: "poids",
    dataIndex: "poids",
    width: 120,
    render: (record: any) => record + " kg",
  },
  {
    title: "Nature",
    key: "dangereux",
    dataIndex: "dangereux",
    width: 150,
    // @ts-ignore
    render: (_, record: any) => (
      <>
        {" "}
        {record.dangereux ? <Tag color="red"> DGX </Tag> : ""}{" "}
        {record.frigo ? <Tag color="blue"> FRIGO </Tag> : ""}
      </>
    ),
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

export const breadcrumb: any = {
  items: [
    {
      title: "Rotation",
    },
    {
      title: "Mrns",
    },
    {
      title: "Articles",
    },
    {
      title: "Containers",
    },
  ],
};
