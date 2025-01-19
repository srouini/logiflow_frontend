import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message, Switch, Space } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import {
  API_LIGNES_FACTURE_AVOIRE_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Facture } from "@/types/billing";
import { mapInitialValues, removeDuplicatedRubriques } from "@/utils/functions";

interface AUFormProps {
  refetch: () => void;
  facture?: Facture;
  initialvalues?: any
}

const AUForm: React.FC<AUFormProps> = ({ refetch, facture, initialvalues }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialvalues);
  const [isCustomRubrique, setIsCustomRubrique] = useState(false);

  const { rubrique } = useReferenceContext();

  useEffect(() => {
    rubrique.fetch();
  }, []);

  useEffect(() => {
    if (initialvalues) {
      setFormData(initialvalues);
      form.setFieldsValue(mapInitialValues(initialvalues));
      // When updating, always set to predefined by default
      setIsCustomRubrique(false);
    }
  }, [initialvalues, form]);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if(formData) {
      values.id = formData?.id;
    } else {
      values.facture_avoire = facture?.id;
    }
    // If using custom rubrique, use the custom value
    if (isCustomRubrique) {
      values.rubrique = values.custom_rubrique;
    }
    mutate(values);
  };

  const onRubriqueTypeChange = (checked: boolean) => {
    setIsCustomRubrique(checked);
    form.setFieldValue('rubrique', null);
    form.setFieldValue('custom_rubrique', null);
  };

  const onSuccess = async (result: any) => {
    message.success("Submission successful");
    setOpen(false);
    if(initialvalues)
    setFormData(result);
  else form.resetFields();
    await refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess,
    endpoint: API_LIGNES_FACTURE_AVOIRE_ENDPOINT,
  });

  return (
    <DraggableModel
      disabledModalOpenButton={facture?.paid}
      OkButtontext="Submit"
      modalOpenButtonText={formData ? "" : "Ligne"}
      modalTitle="Ligne"
      addButtonType="dashed"
      addButtonIcon={formData ? <EditOutlined /> : <PlusOutlined />}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
    >
      <FormObject form={form} initialvalues={mapInitialValues(formData)}>
        <Space direction="horizontal" style={{ marginBottom: 16 }}>
          <span>Type de Rubrique:</span>
          <Switch
            checkedChildren="Personnalisée"
            unCheckedChildren="Prédéfinie"
            checked={isCustomRubrique}
            onChange={onRubriqueTypeChange}
            disabled={formData}
          />
        </Space>
        
        {!isCustomRubrique ? (
          <FormField
            label="Rubrique"
            name="rubrique"
            span={24}
            required
            initialValue={null}
            span_md={24}
            type="select"
            option_label="designation"
            option_value="designation"
            options={removeDuplicatedRubriques(rubrique?.results)}
            disabled={formData}
          />
        ) : (
          <FormField
            label="Rubrique Personnalisée"
            name="custom_rubrique"
            span={24}
            required
            initialValue={null}
            span_md={24}
            type="text"
            disabled={formData}
          />
        )}
        <FormField
          type="number"
          label="Tarif"
          name="tarif"
          span_md={24}
          step={0.01}
          required
        />
        <FormField
          type="number"
          label="Quantité"
          name="quantite"
          span_md={24}
          required
        />
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
