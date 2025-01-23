import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderDateTime, renderText } from "@/utils/functions";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import SubArticlePage from "./ContainerDetails";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import Print from "@/components/Print";

export const getColumns = (
  refetch: () => void,
): ProColumns<any>[] => [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "1",
    width: 200,
    render: (_, record) =>
      record?.article?.groupage ? (
        <SubArticlePage container={record} columns={columns} />
      ) : (
        record?.tc
      ),
  },
  {
    title: "Type",
    key: "2",
    dataIndex: "type_tc",
    width: 100,
    render: (record: any) => <Tag color="blue"> {record?.designation} </Tag>,
  },
  {
    title: "Mrn",
    key: "mrn",
    dataIndex: "article",
    width: 250,
    render: (record: any) => renderText(record?.gros?.gros),
  },
  {
    title: "Accostage",
    key: "mrn",
    dataIndex: "article",
    width: 150,
    render: (record: any) => renderText(record?.gros?.accostage),
  },
  {
    title: "Article",
    key: "article",
    dataIndex: "article",
    width: 100,
    render: (record: any) => renderText(record?.numero),
  },
  {
    title: "Groupage",
    key: "groupage",
    dataIndex: "article",
    width: 150,
    render: (record: any) =>
      record?.groupage ? <Tag color="blue"> Groupage </Tag> : <Tag> Ordinaire </Tag>,
  },

  {
    title: "Tar",
    key: "3",
    dataIndex: "tar",
    width: 150,
  },
  {
    title: "Poids",
    key: "4",
    dataIndex: "poids",
    width: 120,
  },
  {
    title: "Nature",
    key: "5",
    dataIndex: "dangereux",
    width: 150,
    render: (_, record: any) => (
      <>
        {" "}
        {record.dangereux ? <Tag color="red"> DGX </Tag> : ""}{" "}
        {record.frigo ? <Tag color="blue"> FRIGO </Tag> : ""}
      </>
    ),
  },

  {
    title: "Position",
    key: "position",
    dataIndex: "position",
    width: 130,
    render: (_, record) => {
      if (record?.date_sortie_port_sec) {
        return <Tag color="green">Livré</Tag>;
      } else if (record?.date_entree_port_sec) {
        return <Tag color="blue">Magasin</Tag>;
      } else if (!record?.date_sortie_port_sec && !record?.date_entree_port_sec && record?.date_sortie_port) {
        return <Tag color="orange">Sur camion</Tag>;
      }
      return null;
    },
  },
  {
    title: "Date sortie port",
    key: "date_sortie_port",
    dataIndex: "date_sortie_port",
    width: 220,
    render: (record: any) => renderDateTime(record),
  },
  {
    title: "Date entrée port sec",
    key: "date_entree_port_sec",
    dataIndex: "date_entree_port_sec",
    width: 220,
    render: (record: any) => renderDateTime(record),
  },
  {
    title: "Date sortie port sec",
    key: "date_sortie_port_sec",
    dataIndex: "date_sortie_port_sec",
    width: 220,
    render: (record: any) => renderDateTime(record),
  },
  {
    title: "Statut facturation",
    key: "billed",
    dataIndex: "billed",
    width: 200,
    render: (record: any) => (
      <Tag color={record ? "green" : "red"}>
        {record ? "Facturé" : "Non facturé"}
      </Tag>
    ),
  },

  {
    title: "Actions",
    valueType: "option",
    key: "Actions",
    fixed: "right",
    width: 220,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>

            <Col>
              <Delete
                url={API_CONTENEURS_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Conteneur"
                type="dashed"
                link={false}
                text=""
                has_icon
                permission="app.delete_tc"
              />
            </Col>
            <Col>
              <AUForm
                initialvalues={record}
                refetch={refetch}
                article={record?.article}
                editText=""
                hasIcon
              />
            </Col>
            <Col>
            <Print
                endpoint={API_CONTENEURS_ENDPOINT}
                endpoint_suffex="check_list/"
                id={record?.id}
                key={record?.id}
                type="View"
                button_text="Check list"
                permission='app.print_checklist_tc'
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
    title: "Matricule",
    dataIndex: "tc",
    key: "tc",
    width: 100,
  },
  {
    title: "Type",
    key: "type_tc",
    dataIndex: "type_tc",
    width: 150,
    render: (record: any) => <Tag color="blue"> {record?.designation} </Tag>,
  },
  {
    title: "Tar",
    key: "tar",
    dataIndex: "tar",
    width: 150,
  },
  {
    title: "Poids",
    key: "poids",
    dataIndex: "poids",
    width: 120,
    render: (record: any) => record + " kg",
  },
  {
    title: "Nature",
    key: "dangereux",
    dataIndex: "dangereux",
    width: 150,
    // @ts-ignore
    render: (_, record: any) => (
      <>
        {" "}
        {record.dangereux ? <Tag color="red"> DGX </Tag> : ""}{" "}
        {record.frigo ? <Tag color="blue"> FRIGO </Tag> : ""}
      </>
    ),
  },
];

export const exportColumns = [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "tc",
    selected: true
  },

  {
    title: "Type",
    key: "type_tc",
    dataIndex: "type_tc",
    schema: ["type_tc", "designation"],
    selected: true
  },
  {
    title: "Mrn",
    key: "mrn",
    dataIndex: "article",
    schema: ["article", "gros","gros"],
    selected: true
  },
  {
    title: "Accostage",
    key: "mrn",
    dataIndex: "article",
    schema: ["article", "gros","accostage"],
    selected: true
  },
  {
    title: "Article",
    key: "article",
    dataIndex: "article",
    schema: ["article", "numero"],
    selected: true
  },
  {
    title: "Groupage",
    key: "groupage",
    dataIndex: "article",
    schema: ["article", "groupage"],
    selected: true
  },
  {
    title: "Tar",
    key: "tar",
    dataIndex: "tar",
    selected: true

  },
  {
    title: "Poids",
    key: "poids",
    dataIndex: "poids",
    selected: true

  },
  {
    title: "Dangereux",
    key: "dangereux",
    dataIndex: "dangereux",
    selected: true

  },
  {
    title: "Frigo",
    key: "frigo",
    dataIndex: "frigo",
    selected: true

  },
  {
    title: "Facturé",
    key: "billed",
    dataIndex: "billed",
    selected: true
  },
];

export const DetailsColumns = [
  {
    title: "Mrn",
    dataIndex: "gros",
    key: "gros",
    width: 100,
    render: (record: any) => renderText(record?.gros),
  },
  {
    title: "BL",
    key: "bl",
    dataIndex: "bl",
    width: 150,
    render: (record: any) => renderText(record),
  },
  {
    title: "Client",
    key: "client",
    dataIndex: "client",
    width: 300,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Groupage",
    key: "groupage",
    dataIndex: "groupage",
    width: 120,
    render: (record: any) =>
      record ? <Tag color="blue"> Groupage </Tag> : <Tag> Ordinaire </Tag>,
  },

  {
    title: "Depoté",
    key: "depote",
    width: 100,
    dataIndex: "depote",
    // @ts-ignore
    render: (_, record: any) =>
      record.depote && record.groupage ? (
        <Tag color="green"> Depté </Tag>
      ) : record.groupage ? (
        <Tag color="red"> Non depoté </Tag>
      ) : (
        "-"
      ),
  },
  {
    title: "Date dépotage",
    dataIndex: "date_depotage",
    key: "date_depotage",
    width: 150,
    render: (record: any) => renderDateTime(record),
  },

  {
    title: "Transitaire",
    key: "transitaire",
    width: 300,
    dataIndex: "transitaire",
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Designation",
    key: "designation",
    dataIndex: "designation",
    ellipsis: true,
    width: 350,
    render: (record: any) => renderText(record),
  },
];

export const breadcrumb: any = {
  items: [
    {
      title: "Conteneurs",
    },
  ],
};
