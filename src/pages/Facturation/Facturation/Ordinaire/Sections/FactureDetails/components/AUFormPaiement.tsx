import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import {
  API_PAIEMENETS_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import { CreditCardOutlined } from "@ant-design/icons";
import { Facture, Paiement } from "@/types/billing";
import { PAIEMENTS_METHODE } from "@/utils/constants";
import { formatDate, roundToDecimals } from "@/utils/functions";
import dayjs from "dayjs";
import { usePermissions } from "@/utils/permissions";

interface AUFormProps {
  refetch: () => void;
  facture: Facture;
}

const AUFormPaiement: React.FC<AUFormProps> = ({ refetch, facture }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("Chèque");

  const calculateRest = () => {
    let total: number = 0;
    facture?.paiements?.forEach((paiement: Paiement) => {
      total = total + (parseFloat(paiement?.montant) || 0);
    });
    let rest = facture.TTC ? facture.TTC - total : 0;
    if (mode === "Espèce") {
      const timbreTax = (rest * 0.01);
      rest = rest + timbreTax;
    }
    return roundToDecimals(rest,2);
  };

  const { banque } = useReferenceContext();

  useEffect(() => {
    banque?.fetch();
  }, []);

  useEffect(() => {
    form.resetFields();
    console.log(`New TTC: ${calculateRest()}`);
    form.setFieldsValue({
      montant: calculateRest(),
      mode: mode,
      date: dayjs(),
    });
  }, [facture, mode]);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values.facture = facture?.id;
    values = formatDate("date", values);
    mutate(values);
  };

  const onSuccess = async () => {
    message.success("Submission successful");
    setOpen(false);
    await refetch();
    form.resetFields();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PAIEMENETS_ENDPOINT,
  });

  const handleModeChange = (value: string) => {
    console.log(`Chnaged: ${value}`);
    setMode(value);
  };

  const hasPermission = usePermissions();

      
  return (
    <DraggableModel

      disabledModalOpenButton={(calculateRest() <= 0) ||  !hasPermission('billing.add_paiement')}

      OkButtontext="Submit"
      modalOpenButtonText="Paiement"
      modalTitle="Paiement"
      addButtonType="dashed"
      addButtonIcon={<CreditCardOutlined />}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={500}
      isLoading={isLoading}
    >
      <FormObject form={form}>
        <Row gutter={24}>
          <FormField
            name="mode"
            label="Mode"
            type="select"
            options={PAIEMENTS_METHODE}
            option_label="label"
            option_value="value"
            required
            span_md={24}
            onChange={handleModeChange}
          />
          <FormField
            name="banque"
            label="Banque"
            type="select"
            options={banque?.results}
            option_label="raison_sociale"
            option_value="id"
            disabled={mode == "Espèce"}
            required={mode == "Chèque"}
            span_md={24}
          />
          <FormField
            label="Chèque"
            name="cheque"
            type="number"
            required={mode == "Chèque"}
            disabled={mode == "Espèce"}
            span={24}
            span_md={24}
          ></FormField>
          <FormField
            label="Date"
            name="date"
            type="date"
            required
            span_md={24}
          ></FormField>
          <FormField
            label="Montant"
            step={0.01}
            name="montant"
            type="number"
            initialValue={0}
            required
            disabled={mode == "Espèce"}
            span_md={24}
          ></FormField>
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUFormPaiement;
