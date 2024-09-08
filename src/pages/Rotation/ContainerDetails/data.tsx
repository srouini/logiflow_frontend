import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import { renderText } from "@/utils/functions";
import Ajouter from "./components/AUForm";
import { SettingOutlined } from "@ant-design/icons";
import Delete from "@/components/Delete";
import { API_SOUSARTICLES_ENDPOINT } from "@/api/api";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "numero",
    key: "numero",
    width: 100,
  },
  {
    title: "BL",
    key: "bl",
    dataIndex: "bl",
    width: 150,
  },
  {
    title: "Client",
    key: "client",
    dataIndex: "client",
    width: 250,
    render: (record:any) => renderText(record?.raison_sociale)
  },
  {
    title: "Volume",
    key: "volume",
    dataIndex: "volume",
    width: 150,
  },
  {
    title: "Poids",
    key: "poids",
    dataIndex: "poids",
    width: 120,
  },
  {
    title: "Dangereux",
    key: "dangereux",
    dataIndex: "dangereux",
    width: 150,
    render: (_,record:any) => <> {record.dangereux ? <Tag color="red" > DGX </Tag> :" - "}</>
  },
  {
    title: "NBR colis",
    key: "nombre_colis",
    dataIndex: "ponombre_colisids",
    width: 120,
  },
  {
    title: "Surface",
    key: "surface",
    dataIndex: "surface",
    width: 120,
  },
  {
    title: "Quantité",
    key: "quantite",
    dataIndex: "quantite",
    width: 120,
  },

   {
    title: "Marchandise",
    key: "designation",
    dataIndex: "designation",
    ellipsis:true,
    width: 350,
  },
  {
    title: "Transitaire",
    key: "transitaire",
    dataIndex: "transitaire",
    width: 250,
    render: (record:any) => renderText(record?.raison_sociale)
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
                url={API_SOUSARTICLES_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Sous Article"
              />
            ),
          },
          {
            key: "Ajouter",
            name: <Ajouter initialvalues={record} refetch={refetch} tc={record?.tc}></Ajouter>,
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

