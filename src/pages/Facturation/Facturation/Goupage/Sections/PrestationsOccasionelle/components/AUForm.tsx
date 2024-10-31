import { API_PRESTATIONS_OCCASIONNELLE_GROUPAGE_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { useReferenceContext } from "@/context/ReferenceContext";
import usePost from "@/hooks/usePost";
import { formatDate, removeDuplicatedRubriques } from "@/utils/functions";
import { Form, message, Row } from "antd";
import { useEffect, useState } from "react";
import FormObject from "@/components/Form";
import DraggableModel from "@/components/DraggableModel";
import { PlusOutlined } from "@ant-design/icons";

interface AUFormProps {
  article: any;
  refetch: () => void;
}

export default ({ article, refetch }: AUFormProps) => {
  // @ts-ignore
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { rubrique } = useReferenceContext();

  useEffect(() => {
    rubrique.fetch();
  }, []);

  const onSuccess = async () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  useEffect(() => {}, [refetch]);

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PRESTATIONS_OCCASIONNELLE_GROUPAGE_ENDPOINT,
  });

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values["sous_article"] = article?.id;
    values = formatDate("date", values);
    mutate(values);
  };

  return (
    <>
      <DraggableModel
        OkButtontext="Submit"
        modalOpenButtonText="Prestation occasionnelle"
        addButtonIcon={<PlusOutlined />}
        modalTitle="Prestation occasionnelle"
        onSubmit={handleFormSubmission}
        setOpen={setOpen}
        open={open}
        width={500}
        isLoading={isLoading}
        disabledModalOpenButton={article?.billed}
      >
        <FormObject form={form}>
          <Row gutter={24}>
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
              required
              span_md={24}
              span={24}
              type="date"
              name="date"
              label="Date"
            ></FormField>
            <FormField
              label="Tarif"
              name="prix"
              required
              span={24}
              step={0.01}
              span_md={24}
              type="number"
            />
          </Row>
        </FormObject>
      </DraggableModel>
    </>
  );
};
