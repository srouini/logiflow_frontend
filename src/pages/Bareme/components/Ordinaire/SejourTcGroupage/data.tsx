import { Col, Row } from 'antd';
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_SEJOURS_GROUPAGE_ENDPOINT } from "@/api/api";
import { TableDropdown } from '@ant-design/pro-components';

export const getColumns = (refetch: () => void) => [
  {
    title: "Type",
    dataIndex: "type_tc",
    key: "type_tc",
    render: (type_tc: any) => type_tc?.designation,
  },
  {
    title: "Dangereux",
    dataIndex: "dangereux",
    key: "dangereux",
    render: (dangereux: boolean) => (dangereux ? "Oui" : "Non"),
  },
  {
    title: "Frigo",
    dataIndex: "frigo",
    key: "frigo",
    render: (frigo: boolean) => (frigo ? "Oui" : "Non"),
  },
  {
    title: "Jour Min",
    dataIndex: "jour_min",
    key: "jour_min",
  },
  {
    title: "Jour Max",
    dataIndex: "jour_max",
    key: "jour_max",
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
  },
  {
    title: "Actions",
    key: "action",
    render: (_: any, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <AUForm
                refetch={refetch}
                initialvalues={record}
                bareme={record.bareme}
                hasIcon={true}
                editText=""
              />,
            </Col>
            <Col>
              <Delete
                url={API_SEJOURS_GROUPAGE_ENDPOINT}
                class_name='Sejour Conteneur Groupage'
                id={record.id}
                refetch={refetch}
                type="dashed"
                link={false}
                text=""
                has_icon
              />
            </Col>
          </Row>
        ]}
      />,
    ]
  },
];
