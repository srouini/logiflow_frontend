import { useAuth } from "@/context/AuthContext";
import { FactureGroupage } from "@/types/billing";
import { ensureHashPrefix } from "@/utils/functions";
import { CloseOutlined } from "@ant-design/icons";
import { Popconfirm, Tag } from "antd";
import React from "react";


interface ColumnsSelectProps {
  factures: FactureGroupage[];
  setSelectedFactures: any;
}



const SelectedFactures: React.FC<ColumnsSelectProps> = ({
  factures,
  setSelectedFactures
}) => {

  const {user} = useAuth();
  
  // const handleTagClick = (key: string) => {
  //   const updatedColumns = columns.map((column:any) => {
  //     if (column.key === key) {
  //       return { ...column, selected: !column.selected };
  //     }
  //     return column;
  //   });
  //   setSelectedColumns(updatedColumns);
  // };
const handleFactureRemove = (id:any) => {
  setSelectedFactures(factures.filter((facture:any) => facture.id !== id));
}
  return (
    <div style={{paddingBottom:"20px", paddingTop:"10px"}}>
      {factures?.map((facture:any) => (
        <Tag
          key={facture.id}
          // onClick={() => handleTagClick(column.key)}
          color={ensureHashPrefix(user?.profile?.theme_color || "#1890ff")}
          style={{
            marginBottom: "10px",
            paddingTop: "2px",
            paddingBottom: "2px",
            borderRadius: "8px",
            paddingRight: "10px",
            paddingLeft: "10px",
            cursor: "pointer",
          }}
        >
          {facture?.numero}
          <Popconfirm
              title="retirer cette facture"
              description="Êtes-vous sûr de vouloir retirer cette facture ?"
              onConfirm={() => handleFactureRemove(facture?.id)}
            
              okText="Yes"
              cancelText="No"
            >
          <CloseOutlined style={{marginLeft:"5px"}} />
          </Popconfirm>
        </Tag>
      ))}
    </div>
  );
};

export default SelectedFactures;
