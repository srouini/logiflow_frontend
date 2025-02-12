import React, { useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDate } from "@/utils/functions";
import { API_PROFORMAS_GROUPAGE_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { PlusOutlined } from "@ant-design/icons";
import { YES_NO_CHOICES } from "@/utils/constants";
import { usePermissions } from "@/utils/permissions";



interface AUFormProps {
  article: any;
  refetch: () => void;
}

const AUForm: React.FC<AUFormProps> = ({ article, refetch }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  console.log(article)
  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values = formatDate("date_proforma", values);
    values["article"] = article?.tc?.article?.id;
    values["gros"] = article?.tc?.article?.gros?.id;
    values["sous_article"] = article?.id;
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PROFORMAS_GROUPAGE_ENDPOINT,
  });

  const hasPermission = usePermissions();

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText="Proforma"
      addButtonIcon={<PlusOutlined />}
      modalTitle="+ PROFMRA"
      disabledModalOpenButton={article?.volume == null || article?.billed || !hasPermission('billing.add_proformagroupage')}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
    >
      <FormObject form={form}>

      <Row gutter={24}>
                <FormField
                  label="Date"
                  name="date_proforma"
                  span={24}
                  required
                  span_md={24}
                  type="date"
                />
              </Row>
              <Row gutter={24}>
                <FormField
                  name="tva"
                  label="Tva"
                  type="select"
                  initialValue={true}
                  options={YES_NO_CHOICES}
                  option_value="value"
                  span_md={24}
                />

              </Row>
              <Divider dashed style={{ marginTop: "0px" }} />
              <Row gutter={24}>
                <FormField
                  name="remise"
                  label="Remise"
                  type="select"
                  options={YES_NO_CHOICES}
                  option_value="value"
                  span_md={8}
                  initialValue={false}
                />
                <FormField
                  label="Remise"
                  name="REMISE"
                  span={24}
                  span_md={16}
                  type="number"
                  step={0.01}
                />
              </Row>
              <Row gutter={24}>
                <FormField
                  name="debeur"
                  label="Debours"
                  type="select"
                  options={YES_NO_CHOICES}
                  option_value="value"
                  span_md={8}
                  initialValue={false}
                />
                <FormField
                  label="Debours"
                  name="DEBEUR"
                  span={24}
                  span_md={16}
                  type="number"
                  step={0.01}
                />
              </Row>

      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
