import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderMoney, renderText } from "@/utils/functions";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import { API_BAREMES_ENDPOINT, API_PRESTATIONS_ENDPOINT, API_SOUSARTICLES_ENDPOINT } from "@/api/api";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Rubrique",
    dataIndex: "rubrique",
    key: "rubrique",
    width: 300,
    render: (record:any) => renderText(record?.designation)
  },
  {
    title: "Type Tc",
    key: "type_tc",
    dataIndex: "type_tc",
    render: (record:any) => <Tag color="green"> {renderText(record?.designation)}</Tag>
  },
  {
    title: "Nature",
    key: "dangereux",
    render: (_,record: any) =>{ return (
      <>
        {record.dangereux ? <Tag color="red"> DGX </Tag> : ""}
        {record.frigo ? <Tag color="blue"> FRIGO </Tag> : ""}
      </>
    )}
  },
  {
    title: "Prix",
    key: "prix",
    dataIndex: "prix",
    render: (record:any) => renderMoney(record)
  },
  {
    title: "groupage",
    key: "groupage",
    dataIndex: "groupage",
    render: (record:any) => record? <Tag color="blue"> Groupage </Tag> : <Tag> Ordinaire </Tag>
  },
  {
    title: "Actions",
    valueType: "option",
    key: "Actions",
    fixed:"right",
    width: 100,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
      
        children={
          [
            <Row gutter={8}>
              <Col>
                <Delete
                  url={API_PRESTATIONS_ENDPOINT}
                  id={record?.id}
                  refetch={refetch}
                  class_name="Bareme"
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
                  bareme={record?.bareme}
                  editText=""
                  hasIcon
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
    title: "Numéro",
    dataIndex: "numero",
    key: "1",
    selected:true
  },
  {
    title: "Position",
    key: "1.5",
    dataIndex: "box",
    selected:true,
    schema:["box","designation"]
  },
  {
    title: "BL",
    key: "2",
    dataIndex: "bl",
    selected:false
  },
  {
    title: "Client",
    key: "3",
    dataIndex: "client",
    selected:true,
    schema:["client","raison_sociale"]
  },
  {
    title: "Volume",
    key: "4",
    dataIndex: "volume",
    selected:true
  },
  {
    title: "Poids",
    key: "5",
    dataIndex: "poids",
    selected:true
  },
  {
    title: "Dangereux",
    key: "6",
    dataIndex: "dangereux",
    selected:false
  },
  {
    title: "NBR colis",
    key: "7",
    dataIndex: "ponombre_colisids",
    selected:false
  },
  {
    title: "Surface",
    key: "8",
    dataIndex: "surface",
    selected:false
  },
  {
    title: "Quantité",
    key: "9",
    dataIndex: "quantite",
    selected:false
  },

   {
    title: "Marchandise",
    key: "10",
    dataIndex: "designation",
    selected:true
  },
  {
    title: "Transitaire",
    key: "11",
    dataIndex: "transitaire",
    selected:false,
    schema:["transitaire","raison_sociale"]
  }]