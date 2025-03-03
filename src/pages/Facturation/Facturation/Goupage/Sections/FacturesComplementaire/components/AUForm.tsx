import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import FormField from "@/components/form/FormField";
import { API_FACTURES_COMPLIMENTAIRE_GROUPAGE_ENDPOINT, API_FACTURES_GROUPAGE_ENDPOINT } from "@/api/api";
import { PlusOutlined } from "@ant-design/icons";
import useData from "@/hooks/useData";
import { YES_NO_CHOICES } from "@/utils/constants";

interface AUFormProps {
  article: any;
  refetch: () => void;
}

const AUForm: React.FC<AUFormProps> = ({
  article, refetch
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { client, transitaire } = useReferenceContext();

  useEffect(() => {
    client?.fetch();
    transitaire?.fetch();
  }, []);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_FACTURES_COMPLIMENTAIRE_GROUPAGE_ENDPOINT,
  });

  // @ts-ignore
  const { data, refetch:refetchFactures } = useData({
    endpoint: API_FACTURES_GROUPAGE_ENDPOINT,
    name: `GET_FACTURES_GROUPAGE`,
    params: {
      proforma__sous_article__id: article.id,
      all: true,
      canceled: false
    },
    enabled:true
  });

  return (
    <DraggableModel
      OkButtontext="Soumettre"
      modalOpenButtonText="Facture complimentaire"
      modalTitle="Facture complimentaire"
      addButtonType="dashed"
      addButtonIcon={
        <PlusOutlined />
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={400}
      isLoading={isLoading}
    >
      <FormObject form={form}>
        <Row gutter={24}>
          <FormField
            label="Facture"
            name="facture"
            option_label="numero"
            required
            span_md={24}
            type="select"
            options={data?.data}
          />
             <FormField
                  name="tva"
                  label="Tva"
                  type="select"
                  options={YES_NO_CHOICES}
                  option_value="value"
                  span_md={24}
                  initialValue={true}
                />

        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
