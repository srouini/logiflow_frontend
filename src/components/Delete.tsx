import React from "react";
import { useAxios } from "../hooks/useAxios";
import { Button, Popconfirm, notification } from "antd";
import { useNavigate } from "react-router-dom";

interface DeleteProps {
  url: string;
  class_name: string;
  refetch: () => void;
  go_to_after?: string;
  id: string | number;
  disabled?: boolean;
  type?: "link" | "text" | "default" | "primary" | "dashed" | undefined;
  link?:boolean
}

const Delete: React.FC<DeleteProps> = ({ url, class_name, refetch, go_to_after, id, disabled,type="text", link=true }) => {
  let navigate = useNavigate();
  let api = useAxios();

  const handleDelete = async () => {
    try {
      let response = await api.delete(`${url}${id}/`);
      if (Math.trunc(response.status / 100) === 2) {
        refetch();
        notification.success({
          message: `${class_name} Supprimé`,
          description: `${class_name} Supprimé avec succès.`,
          duration: 2,
        });
        if (go_to_after) navigate(go_to_after, { replace: true });
      }
    } catch (error) {
      notification.error({
        message: `${class_name} Échec de la suppression`,
        description: `Échec de la suppression de ${class_name}. Veuillez réessayer plus tard.`,
        duration: 2,
      });
    }
  };

  const confirm = () => handleDelete();

  return (
    <Popconfirm
      title="Vous allez supprimer cet enregistrement, êtes-vous sûr ?"
      onConfirm={confirm}
      key={id}
      disabled={disabled}
    >

     { link ? disabled? <span style={{color:"#d9d9d9"}}>SUPPRIMER</span> : <a >SUPPRIMER</a>  :  <Button type={type}>SUPPRIMER</Button>}
    </Popconfirm>
  );
};

export default Delete;
