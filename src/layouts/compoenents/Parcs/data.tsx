import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import { API_PARCS_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import AUForm from "./AUForm";

export const getColumns = (refetch: () => void) => [
    {
      title: "Designation",
      dataIndex: "designation",
      copyable: true,
      ellipsis: true,
      key: "1",
      width: 350,
      selected: false,
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
                url={API_PARCS_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Parc"
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
      title: "Designation",
      dataIndex: "designation",
      copyable: true,
      ellipsis: true,
      key: "1",
      width: 350,
      selected: true,
    }
]