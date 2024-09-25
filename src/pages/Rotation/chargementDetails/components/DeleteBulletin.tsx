import React from "react";
import { Button, Popconfirm, message } from "antd";
import usePost from "@/hooks/usePost";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import { DeleteOutlined } from "@ant-design/icons";

interface DeleteProps {
  refetch: () => void;
  id: string | number;
  disabled?: boolean;
}

const DeleteBulletin: React.FC<DeleteProps> = ({ refetch, id, disabled }) => {

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

     <Button type="dashed" loading={isLoading} disabled={isLoading} icon={<DeleteOutlined /> } />
     </Popconfirm>
  );
};

export default DeleteBulletin;
