import React, { useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_BAREMES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { YES_NO_CHOICES } from "@/utils/constants";



interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  editText?:string; 
  addText?:string; 
  hasIcon?:boolean
  disabled?:boolean
}

const AUForm: React.FC<AUFormProps> = ({ refetch, initialvalues, editText="MODIFIER",addText="Bareme", hasIcon=false,disabled=false }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const {} = useReferenceContext();

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
    endpoint: API_BAREMES_ENDPOINT,
  });


  return (
    <DraggableModel
      OkButtontext="Submit"
      disabledModalOpenButton={disabled}
      modalOpenButtonText={initialvalues ? editText : addText}
      addButtonIcon={hasIcon && initialvalues ? <EditOutlined />:<PlusOutlined /> }
      modalTitle="Bareme"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={500}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
          <FormField label="Designation" name="designation"  span={24} required  span_md={24} type="text"/>
          <FormField label="À partir de la date d'accostage" name="accostage"  span={24} required  span_md={24} type="select" options={YES_NO_CHOICES} option_label="label" option_value="value"/>

      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
