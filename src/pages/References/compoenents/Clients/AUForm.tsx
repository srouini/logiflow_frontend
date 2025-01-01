import React, { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_CLIENTS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { YES_NO_CHOICES } from "@/utils/constants";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
}

const AUForm: React.FC<AUFormProps> = ({ refetch, initialvalues }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { client } = useReferenceContext();

  useEffect(() => {
    client.fetch();
  }, []);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
    client?.refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CLIENTS_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText=""
      addButtonIcon={initialvalues ? <EditOutlined /> : <PlusOutlined />}
      modalTitle="Client"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={800}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={24}>
          <FormField
            label="Raison Sociale"
            name="raison_sociale"
            span={24}
            required
            span_md={24}
            type="text"
          />
          <FormField
            label="Adresse"
            name="adress"
            span={24}
            span_md={24}
            type="text"
          />
          <Divider dashed style={{ marginTop: "0px" }} />
          <FormField
            label="Email"
            name="email"
            span={24}
            span_md={12}
            type="text"
          />
          <FormField
            label="Tél"
            name="tel"
            span={24}
            span_md={12}
            type="text"
          />
          <FormField
            label="Code"
            name="code"
            span={24}
            span_md={12}
            type="text"
          />
          <FormField label="RC" name="RC" span={24} span_md={12} type="text" />
          <FormField
            label="NIF"
            name="NIF"
            span={24}
            span_md={12}
            type="text"
          />
          <FormField label="AI" name="AI" span={24} span_md={12} type="text" />
          <FormField
            label="NIS"
            name="NIS"
            span={24}
            span_md={12}
            type="text"
          />
          <FormField
            label="Soumis tva"
            name="soumis_tva"
            span={24}
            required
            span_md={12}
            type="select"
            options={YES_NO_CHOICES}
            option_label="label"
            option_value="value"
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
