import { useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import {Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import {
  API_BONS_SORTIE_GROUPAGE_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import { PlusOutlined } from "@ant-design/icons";
import { FactureGroupage } from "@/types/billing";
import dayjs from "dayjs";
import { mapInitialValues } from "@/utils/functions";

interface AUFormProps {
  refetch: () => void;
  facture: FactureGroupage;
  sous_article: any;
}

const AUForm: React.FC<AUFormProps> = ({ refetch, facture }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    const final_value = {
      d10: values?.d10,
      facture: facture?.id,
      // @ts-ignore
      sous_article: facture?.proforma?.sous_article,
      badge: values?.badge,
      matricule : values?.matricule
    };
    mutate(final_value);
    setOpen(false);
  };

  console.log(facture);
  const onSuccess = async () => {
    message.success("Submission successful");
    setOpen(false);
    await refetch();
    form.resetFields();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_BONS_SORTIE_GROUPAGE_ENDPOINT,
  });

  // const today = new Date();
  // const formattedDate = today.toISOString().split('T')[0];

  // @ts-ignore
  const formattedDate = (new Date(facture?.proforma?.date_proforma)).toISOString().split('T')[0];

  const current = dayjs();

  return (
    <DraggableModel
      disabledModalOpenButton={!facture?.a_terme && !facture?.paid}
      OkButtontext="Submit"
      modalOpenButtonText="Bon Livraison"
      modalTitle="Bon Livraison"
      addButtonType="dashed"
      addButtonIcon={<PlusOutlined />}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={mapInitialValues({"date_sortie":'02-11-2024'})}
    >
      <FormObject form={form}>
        <Row gutter={24}>
          <FormField
            type="date"
            name="date_sortie"
            label="Date sortie"
            required
            span={24}
            span_md={24}
            minDate={formattedDate}
          ></FormField>
          <FormField
            type="text"
            name="d10"
            label="D10"
            required
            span={24}
            span_md={24}
          ></FormField>
          <FormField
            type="text"
            name="badge"
            label="Badge"
            span={24}
            span_md={24}
            required
          ></FormField>

          <FormField
            span_md={24}
            required
            span={24}
            label="Mattricule"
            name="matricule"
            type="text"
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
