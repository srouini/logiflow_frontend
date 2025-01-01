import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import { renderText } from "@/utils/functions";
import { API_ZONES_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import AUForm from "./AUForm";

export const getColumns = (refetch: () => void) => [
    {
      title: "Parc",
      dataIndex: "parc",
      key: "1",
      width: 350,
      selected: true,
      schema:["designation"],
      render: (record:any) => renderText(record?.designation) 
        },
    {
      title: "Zone",
      dataIndex: "zone",
      ellipsis: true,
      key: "2",
      render: (record: any) => renderText(record),
      width: 350,
      selected: true,
    },
    {
      title: "Lignes",
      ellipsis: true,
      key: "3",
      dataIndex: "lignes",
      render: (record: any) => renderText(record),
      width: 200,
      selected: true,
    },
    {
      title: "Ranges",
      ellipsis: true,
      key: "4",
      dataIndex: "ranges",
      render: (record: any) => renderText(record),
      width: 200,
      selected: true,
    },
    {
      title: "Gerbage",
      dataIndex: "gerbage",
      key: "10",
      width: 200,
      selected: true,
    },
  {
    title: "Actions",
    valueType: "option",
    key: "11",
    width: 100,
    fixed:"right",
    // @ts-ignore
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Delete
                url={API_ZONES_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Zone"
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
    title: "Parc",
    dataIndex: "parc",
    copyable: true,
    ellipsis: true,
    key: "1",
    width: 350,
    selected: true,
    schema:["parc","designation"],
    render: (record:any) => renderText(record?.designation) 
  },
  {
    title: "Zone",
    dataIndex: "zone",
    ellipsis: true,
    key: "2",
    render: (record: any) => renderText(record),
    width: 350,
    selected: true,
  },
  {
    title: "Lignes",
    ellipsis: true,
    key: "3",
    dataIndex: "lignes",
    render: (record: any) => renderText(record),
    width: 200,
    selected: true,
  },
  {
    title: "Ranges",
    ellipsis: true,
    key: "4",
    dataIndex: "ranges",
    render: (record: any) => renderText(record),
    width: 200,
    selected: true,
  },
  {
    title: "Gerbage",
    dataIndex: "gerbage",
    key: "10",
    width: 200,
    selected: true,
  },
]