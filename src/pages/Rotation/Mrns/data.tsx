import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderText } from "@/utils/functions";
import { API_MRNS_ENDPOINT } from "@/api/api";
import DetailsButton from "@/components/DetailsButton";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "gros",
    copyable: true,
    ellipsis: false,
    tooltip: "Gros",
    key:"1",
    render: (_, record) => (
      <DetailsButton
        text={record.gros}
        navigate_to={`/rotations/mrns/${record?.id}`}
        key={record?.id}
      />
    ),
    width: 250,
  },
  {
    title: "Regime",
    dataIndex: "regime",
    key:"2",
    render: (record: any) => (
      <Tag color={record.color ? record?.color : "blue"}>
        {" "}
        {record?.designation}{" "}
      </Tag>
    ),
  },
  {
    title: "Accostage",
    ellipsis: true,
    key:"3",
    dataIndex: "accostage",
  },
  {
    title: "Escale",
    ellipsis: true,
    key:"4",
    dataIndex: "escale",
  },
  {
    title: "Navire",
    dataIndex: "navire",
    ellipsis: false,
    key:"5",
    render: (record: any) => renderText(record?.nom),
  },
  {
    title: "Armasteur",
    dataIndex: "armateur",
    ellipsis: false,
    key:"6",
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Consignataire",
    dataIndex: "consignataire",
    ellipsis: false,
    key:"7",
    render: (record: any) => renderText(record?.raison_sociale),
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
              <AUForm
                initialvalues={record}
                refetch={refetch}
                editText=""
                hasIcon
              />
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];
