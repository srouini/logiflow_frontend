import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import DetailsButton from "@/components/DetailsButton";
import { API_BULLETINS_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete"
import AUForm from "./components/AUForm";


export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numero",
    dataIndex: "bulletins",
    key: "1",
    width: 250,
    render: (_, record) => (
      <DetailsButton
        text={record.bulletins}
        navigate_to={`/rotations/chargement/${record?.id}`}
      />
    ),
  },
  {
    title: "Date",
    key: "2",
    dataIndex: "date_creation",
    render: (record: any) => renderDate(record),
  },
  {
    title: "Mrn",
    key: "3",
    dataIndex: "gros",
    width: 250,
    render: (record: any) => renderText(record?.gros),
  },
  {
    title: "Etat",
    key: "4",
    dataIndex: "loaded",
    render: (record: any) =>
      record ? (
        <Tag color="green">Chargé</Tag>
      ) : (
        <Tag color="red">Non chargé</Tag>
      ),
  },
  {
    title: "Reçu",
    key: "5",
    dataIndex: "receved",
    render: (record: any) =>
      record ? <Tag color="green">Reçu</Tag> : <Tag color="red">Non Reçu</Tag>,
  },
  {
    title: "Chargé par",
    key: "6",
    dataIndex: "charge_chargement",
    render: (record: any) => renderText(record?.full_name),
  },
  {
    title: "Reçu par",
    key: "7",
    dataIndex: "charge_reception",
    render: (record: any) => renderText(record?.full_name),
  },

  {
    title: "Actions",
    valueType: "option",
    key: "Actions",
    width: 100,
    fixed:"right",
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"

        children={
          [
            <Row gutter={8}>
              <Col>
                <Delete
                  url={API_BULLETINS_ENDPOINT}
                  id={record?.id}
                  refetch={refetch}
                  class_name="Bulletin"
                  type="dashed"
                  link={false}
                  text=""
                  has_icon
                  disabled={record?.loaded}
                />
              </Col>
              <Col>
                <AUForm
                  initialvalues={record}
                  refetch={refetch}
                  editText=""
                  hasIcon
                  gros={record?.gros}
                  disabled={record?.loaded}
                />
              </Col>
            </Row>,
          ]
        }
      />,
    ],
  },
];



export const columns = [
  {
    title: "Numero",
    dataIndex: "bulletins",
    key: "1",
    selected:true
  },
  {
    title: "Date de création",
    key: "2",
    dataIndex: "date_creation",
    selected:true
  },
  {
    title: "Mrn",
    key: "3",
    dataIndex: "gros",
    selected:true, 
    schema:["gros","gros"]
  },
  {
    title: "Etat",
    key: "4",
    dataIndex: "loaded",
    selected:true,

  },
  {
    title: "Reçu",
    key: "5",
    dataIndex: "receved",
    selected:true
  },
  {
    title: "Chargé par",
    key: "6",
    dataIndex: "charge_chargement",
    selected:true,
    schema:["charge_chargement","full_name"]
  },
  {
    title: "Reçu par",
    key: "7",
    dataIndex: "charge_reception",
    selected:true,
    schema:["charge_reception","full_name"]
  },

];
