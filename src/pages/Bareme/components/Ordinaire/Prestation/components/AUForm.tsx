import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_PRESTATIONS_ENDPOINT, API_SOUSARTICLES_ENDPOINT } from "@/api/api";
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
  addText = "Prestation",
  hasIcon = <PlusOutlined />,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { containerType, rubrique } = useReferenceContext();

  console.log(rubrique)
  useEffect(() => {
    containerType?.fetch();
    rubrique?.fetch();
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
    endpoint: API_PRESTATIONS_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Prestation"
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
          name="rubrique"
          label="Rubrique"
          type="select"
          options={rubrique?.results}
          option_label="designation"
          span_md={24}
        />
        <FormField
          name="type_tc"
          label="Type"
          type="select"
          options={containerType?.results}
          option_label="designation"
          span_md={24}
        />
        <FormField
          name="groupage"
          label="Groupage"
          type="select"
          options={YES_NO_CHOICES}
          option_value="value"
          option_label="label"
          span_md={24}
        />
        <FormField
          name="dangereux"
          label="DGX"
          type="select"
          options={YES_NO_CHOICES}
          option_value="value"
          option_label="label"
          span_md={24}
        />
        <FormField
          name="frigo"
          label="FRIGO"
          type="select"
          options={YES_NO_CHOICES}
          option_value="value"
          option_label="label"          
          span_md={24}
      />
        <FormField span_md={24} name="prix" label="Prix" type="number" step={0.01} />

      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
