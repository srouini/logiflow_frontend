import { API_VISITES_ENDPOINT } from "@/api/api";
import Print from "@/components/Print";
import { renderDate, renderText } from "@/utils/functions";
import { ProColumns, TableDropdown } from "@ant-design/pro-components";
import { Col, Row } from "antd";

export const getColumns = (): ProColumns<any>[] => [
  {
    title: "Numero",
    dataIndex: "numero",
    key: "1",
    width: 200,
    render: (record: any) => renderText(record),
  },
  {
    title: "Date Visite",
    key: "2",
    dataIndex: "date_visite",
    width: 150,
    render: (record: any) => renderDate(record),
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
    width: 60,
    fixed: "right",
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Print
                endpoint={API_VISITES_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="View"
                disabled={!record?.validated}
              />
            </Col>
            <Col>
              <Print
                endpoint={API_VISITES_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="Download"
                disabled={!record?.validated}
              />
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];
