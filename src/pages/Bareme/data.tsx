import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Space, Tag } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import { API_MRNS_ENDPOINT } from "@/api/api";
import DetailsButton from "@/components/DetailsButton";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import BaremeDetails from "./components/BaremeDetails";
import CloneButton from "@/components/CloneButton";
import { API_BAREMES_ENDPOINT } from "@/api/api";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Designation",
    dataIndex: "designation",
    key:"designation",
    width: 400,
    render:(_,record:any) => <BaremeDetails bareme={record} columns={columns} />
  },
  {
    title: "Actions",
    valueType: "option",
    key: "actions",
    width: 100,
    fixed:"right",
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Space size="middle">
                <AUForm
                  initialvalues={record}
                  refetch={refetch}
                  editText=""
                  hasIcon
                />
                <CloneButton
                  endpoint={API_BAREMES_ENDPOINT}
                  id={record.id}
                  refetch={refetch}
                />
                <Delete
                  url={API_BAREMES_ENDPOINT}
                  id={record?.id}
                  refetch={refetch}
                  class_name="BAREME"
                  type="dashed"
                  link={false}
                  text=""
                  has_icon
                />
              </Space>
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];

export const  columns =  [ {
  title: "Numéro",
  dataIndex: "gros",
  selected:true,
  key:"1"
},
{
  title: "Regime",
  dataIndex: "regime",
  selected:true,
  schema:["regime","designation"],
  key:"2"
},
{
  title: "Accostage",
  dataIndex: "accostage",
  selected:true,
  key:"3"
},
{
  title: "Escale",
  index: "escale",
  key:"4"
},
{
  title: "Navire",
  dataIndex: "navire",
  selected:true,
  schema:["navire","nom"],
  key:"5"
},
{
  title: "Armasteur",
  dataIndex: "armateur",
  selected:true,
  schema:["armateur","raison_sociale"],
  key:"6"
},
{
  title: "Consignataire",
  dataIndex: "consignataire",
  selected:true,
  schema:["consignataire","raison_sociale"],
  key:"7"
}]