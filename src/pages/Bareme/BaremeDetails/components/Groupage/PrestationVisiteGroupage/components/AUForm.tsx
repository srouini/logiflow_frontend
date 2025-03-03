import { useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { API_PRESTATIONS_VISITE_GROUPAGE_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { YES_NO_CHOICES } from "@/utils/constants";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Bareme } from "@/types/bareme";
import { ProFormSelect } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";

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
  addText = "Prestation Visite Groupage",
  hasIcon = <PlusOutlined />,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    const selectedDangereux = values.dangereux;
    
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    values.bareme = parseInt(bareme?.id);

    // Create a prestation for each selected dangereux value
    const dangereuxToProcess = Array.isArray(selectedDangereux) ? selectedDangereux : [selectedDangereux];

    for (const dangereuxValue of dangereuxToProcess) {
      const prestationValues = {
        ...values,
        dangereux: dangereuxValue,
      };
      await mutate(prestationValues);
    }
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PRESTATIONS_VISITE_GROUPAGE_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Soumettre"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Prestation Visite Groupage"
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
        <ProFormSelect
          name="dangereux"
          label="Dangereux"
          mode="multiple"
          fieldProps={selectConfig}
          options={YES_NO_CHOICES.map((item: any) => ({
            label: item.label,
            value: item.value,
          }))}
        />
        <FormField
          name="volume_min"
          label="Volume Min"
          type="number"
          span_md={24}
        />
        <FormField
          name="volume_max"
          label="Volume Max"
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
