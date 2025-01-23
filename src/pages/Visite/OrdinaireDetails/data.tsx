import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import {  API_VISITES_ITEMS_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete"
import { UnlockOutlined } from "@ant-design/icons";
import Update from "./components/Update";


export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "1",
    width: 200,
    render: (record:any) => renderText(record?.tc)
  },
  {
    title: "Type",
    key: "2",
    dataIndex: "tc",
    width: 150,
    render: (record: any) => <Tag color="blue">{record?.type_tc?.designation}</Tag>,
  },
  {
    title: "Article",
    key: "3",
    dataIndex: "tc",
    width: 200,
    render: (record: any) => renderText(record?.article?.numero),
  },
  {
    title: "Scelle",
    key: "4",
    dataIndex: "scelle",
    width: 100,
    render: (record: any) => <Row gutter={12}><Col><UnlockOutlined /></Col> <Col>{renderText(record)}</Col></Row>,
  },
  {
    title: "Observation",
    key: "5",
    dataIndex: "observation",
    width: 250,
  },
  {
    title: "Actions",
    valueType: "option",
    key: "8",
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
                  url={API_VISITES_ITEMS_ENDPOINT}
                  id={record?.id}
                  refetch={refetch}
                  class_name="Visite item"
                  type="dashed"
                  link={false}
                  text=""
                  has_icon
                  disabled={record?.visite?.validated}
                  permission="app.delete_visiteitem"
                />
              </Col>
              <Col>
                <Update
                  initialvalues={record}
                  refetch={refetch}
                  editText=""
                  hasIcon
                  disabled={record?.visite?.validated}
                />
              </Col>
            </Row>,
          ]
        }
      />,
    ],
  },
];

export const DetailsColumns = [
  {
    title: "Numero",
    dataIndex: "numero",
    key: "1",
    copyable: true,
  },
  {
    title: "Date Visite",
    key: "2",
    dataIndex: "date_visite",
    width: 150,
    render: (record: any) => renderDate(record),
  },
  {
    title: "Mrn",
    key: "3",
    dataIndex: "gros",
    width: 200,
    render: (record: any) => renderText(record?.gros),
  },
  {
    title: "Article",
    key: "4",
    dataIndex: "article",
    width: 100,
    render: (record: any) => renderText(record?.numero),
  },
  {
    title: "Type",
    key: "5",
    dataIndex: "type_visite",
    width: 150,
  },
  {
    title: "Transitaire",
    key: "6",
    dataIndex: "transitaire",
    width: 250,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Badge",
    key: "7",
    dataIndex: "badge",
    width: 200,
  },
]