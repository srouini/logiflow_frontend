import React, { useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import { Form, message, Switch } from "antd";
import usePost from "@/hooks/usePost";
import { API_AGENT_DOUANE_ENDPOINT } from "@/constants/reference";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
}

const AUForm: React.FC<AUFormProps> = ({ refetch, initialvalues }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Soumission réussie");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_AGENT_DOUANE_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Soumettre"
      modalOpenButtonText=""
      modalOpenButton={
        initialvalues ? (
          <EditOutlined style={{ color: "#1890ff" }} />
        ) : (
          <PlusOutlined style={{ fontSize: "24px" }} />
        )
      }
      title={initialvalues ? "Modifier Agent Douane" : "Ajouter Agent Douane"}
      open={open}
      setOpen={setOpen}
      onSubmit={handleFormSubmission}
      confirmLoading={isLoading}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={initialvalues}
      >
        <FormField
          name="nom"
          label="Nom"
          type="text"
          rules={[{ required: true, message: "Le nom est requis" }]}
        />
        <FormField
          name="prenom"
          label="Prénom"
           type="text"
          rules={[{ required: true, message: "Le prénom est requis" }]}
        />
        <FormField
          name="code"
          label="Code"
          type="text"
        />
        <Form.Item 
          name="active" 
          label="Actif" 
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </DraggableModel>
  );
};

export default AUForm;
