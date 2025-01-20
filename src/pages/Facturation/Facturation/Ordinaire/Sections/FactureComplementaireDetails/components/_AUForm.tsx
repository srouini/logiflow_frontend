import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import {
  API_LIGNES_FACTURE_COMPLIMENTAIRE_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import { PlusOutlined } from "@ant-design/icons";
import { Facture } from "@/types/billing";
import { removeDuplicatedRubriques } from "@/utils/functions";

interface AUFormProps {
  refetch: () => void;
  facture: Facture;
}

const AUForm: React.FC<AUFormProps> = ({ refetch, facture }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { rubrique } = useReferenceContext();

  useEffect(() => {
    rubrique.fetch();
  }, []);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values.facture_complementaire = facture?.id 
    mutate(values);
    setOpen(false);
  };

  const onSuccess = async () => {
    message.success("Submission successful");
    setOpen(false);
    await refetch();
    form.resetFields();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_LIGNES_FACTURE_COMPLIMENTAIRE_ENDPOINT,
  });



  return (
    <DraggableModel
      disabledModalOpenButton={facture?.paid}
      OkButtontext="Submit"
      modalOpenButtonText="Ligne"
      modalTitle="Ligne"
      addButtonType="dashed"
      addButtonIcon={<PlusOutlined />}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
    >
      <FormObject form={form}>
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
        />
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
