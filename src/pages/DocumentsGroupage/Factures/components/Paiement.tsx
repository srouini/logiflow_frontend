import { useEffect, useState } from "react";
import DraggableModel from "../../../../components/DraggableModel";
import FormObject from "../../../../components/Form";
import { Form, message, Row } from "antd";
import usePost from "../../../../hooks/usePost";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { API_PAIEMENETS_GROUPAGE_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { usePermissions } from "@/utils/permissions";

const formatDate = (field: string, values: any) => {
  if (values[field]) values[field] = values[field].format("YYYY-MM-DD");
  return values;
};

interface PaiementProps {
  refetch: () => void;
  factures: any;
  setSelectedFactures: any
}

const Paiement: React.FC<PaiementProps> = ({
  refetch,
  factures,
  setSelectedFactures
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { containerType, banque } = useReferenceContext();

  useEffect(() => {
    containerType.fetch();
    banque.fetch();
  }, []);

  const { } = useReferenceContext();

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values = formatDate("date", values);
    factures.map((facture: any) => {
      let paiement = {
        banque: values.banque,
        cheque: values.cheque,
        date: values.date,
        montant: facture.TTC,
        facture: facture.id,
        mode:"Chèque"
    }
    mutate(paiement);
    }
  )
  setSelectedFactures([]),
  refetch();
  };

  const getFacture = (id:number) => {
    return factures.find((facture: any) => facture.id === id);
  }
  const onSuccess = (values:any) => {
    console.log(values)
    message.success(`Le paiement de la facture ${getFacture(values.facture)?.numero} a été ajouté avec succès.`);
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PAIEMENETS_GROUPAGE_ENDPOINT,
  });

  const hasPermission = usePermissions();
  useEffect(() => {
    console.log(factures)
  }, [factures])

  const sum = () => {
    return Array.isArray(factures) ? factures.reduce((acc, facture) => acc + Number(facture.TTC || 0), 0).toFixed(2)
      : 0
  }
  return (
    <DraggableModel
      disabledModalOpenButton={(!hasPermission('app.change_tc')) || (sum() < 1)}
      OkButtontext="Submit"
      modalOpenButtonText={`Payez ( ${factures?.length} ) ${sum()} DA`}
      modalTitle="Conteneur"
      addButtonType="dashed"
      addButtonIcon={null}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
    >
      <FormObject form={form} initialvalues={{montant:sum()}}>
        <Row gutter={24}>
          <FormField
            name="banque"
            label="Banque"
            type="select"
            options={banque?.results}
            option_label="raison_sociale"
            option_value="id"
            span_md={24}
            required
          />
         <FormField
            label="Chèque"
            name="cheque"
            type="number"
            required
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
            disabled
            required
            span_md={24}
          ></FormField>
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default Paiement;
