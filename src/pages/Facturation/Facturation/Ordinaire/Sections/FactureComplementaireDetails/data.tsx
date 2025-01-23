import { type ProColumns } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderDate, renderMoney, renderText } from "@/utils/functions";
import AUForm from "./components/AUForm";
import { API_LIGNES_FACTURE_COMPLIMENTAIRE_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";

// @ts-ignore
export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "full_number",
    key: "1",
    width: 100,
  },
  {
    title: "Position",
    key: "1.5",
    dataIndex: "box",
    width: 150,
    render: (record: any) => (
      <Tag color="green"> {renderText(record?.designation)}</Tag>
    ),
  },
  {
    title: "BL",
    key: "2",
    dataIndex: "bl",
    width: 150,
  },
  {
    title: "Client",
    key: "3",
    dataIndex: "client",
    width: 250,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Volume",
    key: "4",
    dataIndex: "volume",
    width: 150,
  },
  {
    title: "Poids",
    key: "5",
    dataIndex: "poids",
    width: 120,
  },
  {
    title: "Dangereux",
    key: "6",
    dataIndex: "dangereux",
    width: 150,
    render: (_, record: any) => (
      <> {record.dangereux ? <Tag color="red"> DGX </Tag> : " - "}</>
    ),
  },
  {
    title: "NBR colis",
    key: "7",
    dataIndex: "ponombre_colisids",
    width: 120,
  },
  {
    title: "Surface",
    key: "8",
    dataIndex: "surface",
    width: 120,
  },
  {
    title: "Quantité",
    key: "9",
    dataIndex: "quantite",
    width: 120,
  },
  {
    title: "Marchandise",
    key: "10",
    dataIndex: "designation",
    ellipsis: true,
    width: 350,
  },
  {
    title: "Transitaire",
    key: "11",
    dataIndex: "transitaire",
    width: 250,
    render: (record: any) => renderText(record?.raison_sociale),
  },
];

export const columns = [
  {
    title: "Numéro",
    dataIndex: "full_number",
    copyable: true,
    width: 150,
    key: "1",
  },
  {
    title: "Etat",
    dataIndex: "numero",
    width: 150,
    key: "2",
    // @ts-ignore
    render: (_, record: any) =>
      record?.paid ? (
        <Tag color="green"> Payée </Tag>
      ) : record?.a_terme ? (
        <Tag>A Terme</Tag>
      ) : (
        <Tag color="red">Non Payée</Tag>
      ),
  },
  {
    title: "Date",
    dataIndex: "date_creation",
    key: "5",
    render: (record: any) => renderDate(record),
    width: 100,
  },
  {
    title: "Facture",
    dataIndex: "facture",
    key: "7",
    render: (record: any) => renderText(record?.numero),
    width: 150,
  },
  {
    title: "HT",
    dataIndex: "HT",
    key: "8",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    key: "9",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "Timber",
    dataIndex: "timber",
    key: "10",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    key: "11",
    render: (record: any) => renderMoney(record),
    width: 150,
  },
  {
    title: "Tva",
    dataIndex: "tva",
    width: 150,
    key: "2",
    // @ts-ignore
    render: (_, record: any) =>
      record?.paid ? (
        <Tag color="green"> OUI </Tag>
      ) : record?.a_terme ? (
        <Tag>A Terme</Tag>
      ) : (
        <Tag color="red">NO</Tag>
      ),
  },
];

export const columns_prestation_article = [
  {
    title: "Rubrique",
    dataIndex: "rubrique",
    copyable: true,
    width: 100,
    key: "1",
  },
  {
    title: "Tarif",
    dataIndex: "tarif",
    width: 100,
    key: "2",
    render: (record: any) => renderMoney(record),
  },
  {
    title: "HT",
    dataIndex: "HT",
    width: 100,
    key: "3",
    render: (record: any) => renderMoney(record),
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    width: 100,
    key: "4",
    render: (record: any) => renderMoney(record),
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    width: 100,
    key: "5",
    render: (record: any) => renderMoney(record),
  },
];

export const columns_prestation_conteneurs = (refetch: () => void) => [
  {
    title: "Action",
    dataIndex: "action",
    copyable: true,
    ellipsis: true,
    width: 60,
    key: "1",
    //@ts-ignore
    render: (_,record: any) => <Row gutter={8}><Col><AUForm key={record?.id} initialvalues={record} refetch={refetch} /></Col><Col><Delete permission="billing.delete_lignefacturecomplementaire" has_icon type="dashed" text="" link={false} class_name="Ligne" url={API_LIGNES_FACTURE_COMPLIMENTAIRE_ENDPOINT} id={record?.id} refetch={refetch} /> </Col></Row>,
  },
  {
    title: "Rubrique",
    dataIndex: "rubrique",
    copyable: true,
    ellipsis: true,
    width: 150,
    key: "1",
  },
  {
    title: "Quantite",
    dataIndex: "quantite",
    width: 80,
    key: "13",
    render: (record: any) => renderText(record),
  },
  {
    title: "Tarif",
    dataIndex: "tarif",
    width: 100,
    key: "2",
    render: (record: any) => renderMoney(record),
  },
  {
    title: "HT",
    dataIndex: "HT",
    width: 100,
    key: "3",
    render: (record: any) => renderMoney(record),
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    width: 100,
    key: "4",
    render: (record: any) => renderMoney(record),
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    width: 100,
    key: "5",
    render: (record: any) => renderMoney(record),
  },
];

export const columns_paiementrs = [
  {
    title: "Banque",
    dataIndex: "banque",
    width: 60,
    key: "1",
    render: (record:any) => renderText(record?.raison_sociale)
  },
  {
    title: "Mode",
    dataIndex: "mode",
    width: 60,
    key: "12",
    render: (record: any) => renderText(record),
  },
  {
    title: "Chèque",
    dataIndex: "cheque",
    width: 60,
    key: "12",
    render: (record: any) => renderText(record),
  },
  {
    title: "Date",
    dataIndex: "date",
    width: 80,
    key: "13",
    render: (record: any) => renderDate(record),
  },
  {
    title: "Montant",
    dataIndex: "montant",
    width: 100,
    key: "2",
    render: (record: any) => renderMoney(record),
  },
];
