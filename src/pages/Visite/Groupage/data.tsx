import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import { API_VISITESGROUPAGE_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import Print from "@/components/Print";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numero",
    dataIndex: "visite",
    key: "1",
    width: 250,
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
    title: "Sous Article",
    key: "4",
    dataIndex: "sous_article",
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
    width: 140,
    fixed: "right",
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Print
                endpoint={API_VISITESGROUPAGE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="View"
                permission="groupage.can_print_visitegroupage"
              />
            </Col>
            <Col>
              <Delete
                url={API_VISITESGROUPAGE_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Bulletin"
                type="dashed"
                link={false}
                text=""
                has_icon
                permission="groupage.delete_visitegroupage"
              />
            </Col>
            <Col>
              <AUForm
                initialvalues={record}
                refetch={refetch}
                editText=""
                hasIcon
                gros={record?.gros}
                type="edit"
              />
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];

export const exportColumns = [
  {
    title: "Numero",
    dataIndex: "visite",
    key: "numero",
    selected: true
  },
  {
    title: "Date Visite",
    dataIndex: "date_visite",
    key: "date_visite",
    selected: true
  },
  {
    title: "Mrn",
    dataIndex: "gros",
    key: "mrn",
    schema: ["gros", "gros"],
    selected: true
  },
  {
    title: "Article",
    dataIndex: "article",
    key: "article",
    schema: ["article", "numero"],
    selected: true
  },
  {
    title: "Sous Article",
    dataIndex: "sous_article",
    key: "sous_article",
    schema: ["sous_article", "numero"],
    selected: true
  },
  {
    title: "Type",
    dataIndex: "type_visite",
    key: "type",
    selected: true
  },
  {
    title: "Transitaire",
    dataIndex: "transitaire",
    key: "transitaire",
    schema: ["transitaire", "raison_sociale"],
    selected: true
  },
  {
    title: "Badge",
    dataIndex: "badge",
    key: "badge",
    selected: true
  }
];
