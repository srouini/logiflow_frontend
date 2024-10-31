import type { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import { renderDateTime, renderText } from "@/utils/functions";

export const getColumns = (): ProColumns<any>[] => [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "1",
    width: 100,
    render: (record: any) => renderText(record?.tc),
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
    dataIndex: "tc",
    key: "gros",
    width: 100,
    render: (record: any) => renderText(record?.article?.gros?.gros),
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
    render: (record: any) => <Tag color="blue"> Groupage </Tag>,
  },

  {
    title: "Depoté",
    key: "depote",
    width: 100,
    dataIndex: "tc",
    // @ts-ignore
    render: (record: any) =>
      record.article?.depote && record.article?.groupage ? (
        <Tag color="green"> Depté </Tag>
      ) : record.article?.groupage ? (
        -(<Tag color="red"> Non depoté </Tag>)
      ) : (
        "-"
      ),
  },
  {
    title: "Date dépotage",
    dataIndex: "tc",
    key: "date_depotage",
    width: 150,
    render: (record: any) => renderDateTime(record?.article?.date_depotage),
  },
  {
    title: "Transitaire",
    key: "transitaire",
    width: 300,
    dataIndex: "transitaire",
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Volume",
    key: "volume",
    width: 300,
    dataIndex: "volume",
    render: (record: any) => renderText(record),
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
      title: "Facturation",
    },
    {
      title: "Groupage",
    },
  ],
};
