import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import { SettingOutlined } from "@ant-design/icons";
import React from "react";
import DetailsButton from "@/components/DetailsButton";
import { API_BULLETINS_ENDPOINT } from "@/api/api";

const Delete = React.lazy(() => import("@/components/Delete"));
const AUForm = React.lazy(() => import("./components/AUForm"));

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numero",
    dataIndex: "bulletins",
    key: "bulletins",
    width: 250,
    render: (_, record) => (
      <DetailsButton
        text={record.bulletins}
        navigate_to={`/rotations/reception/${record?.id}`}
      />
    ),
  },
  {
    title: "Date",
    key: "date_creation",
    dataIndex: "date_creation",
    render: (record: any) => renderDate(record),
  },
  {
    title: "Mrn",
    key: "gros",
    dataIndex: "gros",
    width: 250,
    render: (record: any) => renderText(record?.gros),
  },
  {
    title: "Etat",
    key: "loaded",
    dataIndex: "loaded",
    render: (record: any) =>
      record ? (
        <Tag color="green">Chargé</Tag>
      ) : (
        <Tag color="red">Non chargé</Tag>
      ),
  },
  {
    title: "Reçu",
    key: "receved",
    dataIndex: "receved",
    render: (record: any) =>
      record ? <Tag color="green">Reçu</Tag> : <Tag color="red">Non Reçu</Tag>,
  },
  {
    title: "Chargé par",
    key: "charge_chargement",
    dataIndex: "charge_chargement",
    render: (record: any) => renderText(record?.full_name),
  },
  {
    title: "Reçu par",
    key: "charge_reception",
    dataIndex: "charge_reception",
    render: (record: any) => renderText(record?.full_name),
  },

];
