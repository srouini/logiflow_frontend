import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_PRESTATIONS_GROUPAGE_ENDPOINT } from "@/api/api";
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
  addText = "Prestation Groupage",
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
    const selectedDangereux = values.dangereux;
    
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    values.bareme = parseInt(bareme?.id);

    // Create combinations of all selected options
    const rubriqueToProcess = Array.isArray(selectedRubrique) ? selectedRubrique : [selectedRubrique];
    const dangereuxToProcess = Array.isArray(selectedDangereux) ? selectedDangereux : [selectedDangereux];

    // Create a prestation for each combination
    for (const rubriqueId of rubriqueToProcess) {
      for (const dangereuxValue of dangereuxToProcess) {
        const prestationValues = {
          ...values,
          rubrique: rubriqueId,
          dangereux: dangereuxValue,
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
    endpoint: API_PRESTATIONS_GROUPAGE_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Soumettre"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Prestation Groupage"
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
