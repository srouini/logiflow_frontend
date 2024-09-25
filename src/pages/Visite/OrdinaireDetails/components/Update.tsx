import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Card, Col, Flex, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import FormField from "@/components/form/FormField";
import { API_VISITES_ITEMS_ENDPOINT } from "@/api/api";
import { ArrowRightOutlined, EditOutlined } from "@ant-design/icons";
import { mapInitialValues } from "@/utils/functions";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  disabled?: boolean;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const Update: React.FC<AUFormProps> = ({
  refetch,
  disabled,
  initialvalues
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);


  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values["id"] = initialvalues?.id 
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    form.resetFields();
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_VISITES_ITEMS_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      addButtonType="dashed"
      disabledModalOpenButton={disabled}
      modalOpenButtonText=""
      addButtonIcon={
       <EditOutlined />
      }
      modalTitle="Bulletin"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={550}
      isLoading={isLoading}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={24}>
   
          <FormField
            label="Scelle"
            name="scelle"
            type="text"
            required
            span={24}
            span_md={24}
          />

          <FormField
            label="Observation"
            name="observation"
            type="text"
            required
            span={24}
            span_md={24}
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default Update;
