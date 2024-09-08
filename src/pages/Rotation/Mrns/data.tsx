import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import { renderText } from "@/utils/functions";
import { SettingOutlined } from "@ant-design/icons";
import React from "react";
import { API_MRNS_ENDPOINT } from "@/api/api";
import DetailsButton from "@/components/DetailsButton";

const Delete = React.lazy(() => import("@/components/Delete"));
const Ajouter = React.lazy(() => import("./components/AUForm"));

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "gros",
    copyable: true,
    ellipsis: false,
    tooltip: "Gros",
    render: (_, record) => <DetailsButton text={record.gros} navigate_to={`/rotations/mrns/${record?.id}`} />,
    width: 250,
  },
  {
    title: "Regime",
    dataIndex: "regime",
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
    dataIndex: "accostage",
  },
  {
    title: "Escale",
    ellipsis: true,
    dataIndex: "escale",
  },
  {
    title: "Navire",
    dataIndex: "navire",
    ellipsis: false,
    render: (record: any) => renderText(record?.nom),
  },
  {
    title: "Armasteur",
    dataIndex: "armateur",
    ellipsis: false,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Consignataire",
    dataIndex: "consignataire",
    ellipsis: false,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Actions",
    valueType: "option",
    key: "option",
    width: 80,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        menus={[
          {
            key: "delete",
            name: (
              <Delete
                url={API_MRNS_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="MRN"
              />
            ),
          },
          {
            key: "Ajouter",
            name: <Ajouter initialvalues={record} refetch={refetch}></Ajouter>,
          },
        ]}
        children={
          <Button
            style={{ width: "50px" }}
            icon={<SettingOutlined />}
            size="small"
          ></Button>
        }
      />,
    ],
  },
];
