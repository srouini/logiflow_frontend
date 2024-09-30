import { API_PRFORMAS_ENDPOINT } from "@/api/api";
import Print from "@/components/Print";
import { renderDate, renderMoney, renderText } from "@/utils/functions";
import { ProColumns, TableDropdown } from "@ant-design/pro-components";
import { Row, Col, Tag } from "antd";

export const getColumns = (): ProColumns<any>[] => [
  {
    title: "Rubrique",
    dataIndex: "rubrique",
    copyable: true,
    width: 300,
    key: "1",
  },
  {
    title: "Conteneur",
    dataIndex: "tc",
    width: 200,
    key: "2",
    render: (record: any) => renderText(record?.tc)
      
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "5",
    render: (record) => renderDate(record),
    width: 200,
  },

  {
    title: "Montant",
    dataIndex: "prix",
    key: "7",
    render: (record: any) => renderMoney(record),
    width: 200,
  },
];
