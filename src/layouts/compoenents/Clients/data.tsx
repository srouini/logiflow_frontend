import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderText } from "@/utils/functions";
import { API_MRNS_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
// import AUForm from "./components/AUForm";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Raison Sociale",
    dataIndex: "raison_sociale",
    copyable: true,
    ellipsis: true,
    key:"1",
    width:350
  },
  {
    title: "Adresse",
    dataIndex: "adress",
    ellipsis: true,
    key:"2",
    render: (record: any) => renderText(record),
    width:350
  },
  {
    title: "Email",
    ellipsis: true,
    key:"3",
    dataIndex: "email",
    render: (record: any) => renderText(record),
    width:200
  },
  {
    title: "Tél",
    ellipsis: true,
    key:"4",
    dataIndex: "tel",
    render: (record: any) => renderText(record),
    width:200
  },
  {
    title: "Code",
    dataIndex: "code",
    key:"5",
    render: (record: any) => renderText(record),
    width:200
  },
  {
    title: "RC",
    dataIndex: "RC",
    ellipsis: false,
    key:"6",
    render: (record: any) => renderText(record),
    width:200
  },
  {
    title: "NIF",
    dataIndex: "NIF",
    ellipsis: false,
    key:"7",
    render: (record: any) => renderText(record),
    width:200
  },
  {
    title: "AI",
    dataIndex: "AI",
    ellipsis: false,
    key:"7",
    render: (record: any) => renderText(record),
    width:200
  },
  {
    title: "NIS",
    dataIndex: "NIS",
    ellipsis: false,
    key:"7",
    render: (record: any) => renderText(record),
    width:200
  },
  {
    title: "Soumis tva",
    dataIndex: "soumis_tva",
    ellipsis: false,
    key:"7",
    width:200,
    render: (record: any) => record ? <Tag color="green"> Soumis au TVA </Tag> :<Tag color="red"> None soumis au TVA </Tag>  ,
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
        children={[
          <Row gutter={8}>
            <Col>
              <Delete
                url={API_MRNS_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="MRN"
                type="dashed"
                link={false}
                text=""
                has_icon
              />
            </Col>
            <Col>
              {/* <AUForm
                initialvalues={record}
                refetch={refetch}
                editText=""
                hasIcon
              /> */}
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];
