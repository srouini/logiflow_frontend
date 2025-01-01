import React, { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_BOXS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
}

const AUForm: React.FC<AUFormProps> = ({ refetch, initialvalues }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
const {parc} = useReferenceContext()

useEffect(() => {
  parc?.fetch();
},[])
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
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_BOXS_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText=""
      addButtonIcon={initialvalues ? <EditOutlined /> : <PlusOutlined />}
      modalTitle="Box"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues? initialvalues : {soumis_tva:true})}>
        <Row gutter={24}>

          <FormField
            label="Parc"
            name="parc"
            span={24}
            required
            span_md={24}
            type="select"
            options={parc?.results}
            option_label="designation"
            option_value="id"
          />
         
          <FormField
            label="Designation"
            name="designation"
            span={24}
            span_md={24}
            type="text"
          />

        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
