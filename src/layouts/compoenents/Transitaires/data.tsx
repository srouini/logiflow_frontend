import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderText } from "@/utils/functions";
import { API_TRANSITAIRE_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import AUForm from "./AUForm";

export const getColumns = (refetch: () => void) => [
    {
      title: "Raison Sociale",
      dataIndex: "raison_sociale",
      copyable: true,
      ellipsis: true,
      key: "1",
      width: 350,
      selected: false,
    },
    {
      title: "Adresse",
      dataIndex: "adress",
      ellipsis: true,
      key: "2",
      render: (record: any) => renderText(record),
      width: 350,
      selected: true,
    },
    {
      title: "Email",
      ellipsis: true,
      key: "3",
      dataIndex: "email",
      render: (record: any) => renderText(record),
      width: 200,
      selected: true,
    },
    {
      title: "Tél",
      ellipsis: true,
      key: "4",
      dataIndex: "tel",
      render: (record: any) => renderText(record),
      width: 200,
      selected: true,
    },
    {
      title: "Soumis tva",
      dataIndex: "soumis_tva",
      ellipsis: false,
      key: "10",
      width: 200,
      render: (record: any) => record ? <Tag color="green"> Soumis au TVA </Tag> : <Tag color="red"> None soumis au TVA </Tag>,
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
                url={API_TRANSITAIRE_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Transitaire"
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
      title: "Raison Sociale",
      dataIndex: "raison_sociale",
      copyable: true,
      ellipsis: true,
      key: "1",
      width: 350,
      selected: true,
    },
    {
      title: "Adresse",
      dataIndex: "adress",
      ellipsis: true,
      key: "2",
      render: (record: any) => renderText(record),
      width: 350,
      selected: false,
    },
    {
      title: "Email",
      ellipsis: true,
      key: "3",
      dataIndex: "email",
      render: (record: any) => renderText(record),
      width: 200,
      selected: false,
    },
    {
      title: "Tél",
      ellipsis: true,
      key: "4",
      dataIndex: "tel",
      render: (record: any) => renderText(record),
      width: 200,
      selected: false,
    },
    {
      title: "Soumis tva",
      dataIndex: "soumis_tva",
      ellipsis: false,
      key: "10",
      width: 200,
      render: (record: any) => record ? <Tag color="green"> Soumis au TVA </Tag> : <Tag color="red"> None soumis au TVA </Tag>,
      selected: false,
    }
]