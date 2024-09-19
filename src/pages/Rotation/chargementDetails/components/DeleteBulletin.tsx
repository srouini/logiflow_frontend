import React from "react";
import { Button, Popconfirm, message } from "antd";
import usePost from "@/hooks/usePost";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";

interface DeleteProps {
  refetch: () => void;
  id: string | number;
  disabled?: boolean;
  type?: "link" | "text" | "default" | "primary" | "dashed" | undefined;
  link?:boolean
}

const DeleteBulletin: React.FC<DeleteProps> = ({ refetch, id, disabled,type="text", link=true }) => {

  const onSuccess = () =>{
    message.success("Submission successful");
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CONTENEURS_ENDPOINT,
  });

 
  const handleContainerLoadUndo = () => {
    mutate({
      id: id, 
      bulletins: null
    });
  }

  const confirm = () => handleContainerLoadUndo();

  return (
    <Popconfirm
      title="Vous allez supprimer cet enregistrement, êtes-vous sûr ?"
      onConfirm={confirm}
      key={id}
      disabled={disabled}
    >

     { link ?  disabled? <span style={{color:"#d9d9d9"}}>SUPPRIMER</span> :<a>SUPPRIMER</a>  :  <Button type={type} loading={isLoading} disabled={isLoading}>SUPPRIMER</Button>}
    </Popconfirm>
  );
};

export default DeleteBulletin;
