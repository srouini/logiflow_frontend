import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_PRESTATIONS_ARTICLE_ENDPOINT } from "@/api/api";
import { YES_NO_CHOICES } from "@/utils/constants";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Bareme } from "@/types/bareme";
import { ProFormSelect } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";
import FormField from "@/components/form/FormField";

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
  addText = "Prestation Article",
  hasIcon = <PlusOutlined />,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { rubrique } = useReferenceContext();

  useEffect(() => {
    rubrique?.fetch();
  }, []);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    const selectedRubrique = values.rubrique;
    const selectedGroupage = values.groupage;
    
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    values.bareme = parseInt(bareme?.id);

    // Create combinations of all selected options
    const rubriqueToProcess = Array.isArray(selectedRubrique) ? selectedRubrique : [selectedRubrique];
    const groupageToProcess = Array.isArray(selectedGroupage) ? selectedGroupage : [selectedGroupage];

    // Create a prestation for each combination
    for (const rubriqueId of rubriqueToProcess) {
      for (const groupageValue of groupageToProcess) {
        const prestationValues = {
          ...values,
          rubrique: rubriqueId,
          groupage: groupageValue,
        };
        await mutate(prestationValues);
      }
    }
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PRESTATIONS_ARTICLE_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Soumettre"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Prestation Article"
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
          name="rubrique"
          label="Rubrique"
          mode="multiple"
          fieldProps={selectConfig}
          options={rubrique?.results?.map((item: any) => ({
            label: item.designation,
            value: item.id,
          }))}
        />
        <FormField
          name="prix"
          label="Prix"
          type="number"
          span_md={24}
        />
        <ProFormSelect
          name="groupage"
          label="Groupage"
          mode="multiple"
          fieldProps={selectConfig}
          options={YES_NO_CHOICES.map((item: any) => ({
            label: item.label,
            value: item.value,
          }))}
        />
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
