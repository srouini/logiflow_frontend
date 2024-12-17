import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_SEJOURS_GROUPAGE_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { YES_NO_CHOICES } from "@/utils/constants";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Bareme } from "@/types/bareme";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  bareme: Bareme | undefined;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  bareme,
  editText = "MODIFIER",
  addText = "Séjour TC Groupage",
  hasIcon = <PlusOutlined />,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType?.fetch();
  }, []);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    values.bareme = parseInt(bareme?.id);
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_SEJOURS_GROUPAGE_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Séjour TC Groupage"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={500}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <FormField
          name="type_tc"
          label="Type"
          type="select"
          options={containerType?.results}
          option_label="designation"
          span_md={24}
        />
        <FormField
          name="dangereux"
          label="Dangereux"
          type="select"
          options={YES_NO_CHOICES}
          span_md={24}
          option_value="value"
          option_label="label"
        />
        <FormField
          name="frigo"
          label="Frigo"
          type="select"
          options={YES_NO_CHOICES}
          span_md={24}
          option_value="value"
          option_label="label"
        />
        <FormField
          name="jour_min"
          label="Jour Min"
          type="number"
          span_md={24}
        />
        <FormField
          name="jour_max"
          label="Jour Max"
          type="number"
          span_md={24}
        />
        <FormField
          name="prix"
          label="Prix"
          type="number"
          span_md={24}
        />
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
