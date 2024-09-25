import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import DetailsButton from "@/components/DetailsButton";
import { API_BULLETINS_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete"
import AUForm from "./components/AUForm";


export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numero",
    dataIndex: "numero",
    key: "1",
    width: 200,
    render: (_, record) => (
      <DetailsButton
        text={record?.visite}
        navigate_to={`/rotations/visites/ordinaire/${record?.id}`}
      />
    ),
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
