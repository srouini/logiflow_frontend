import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { CONTAINER_NATURE_CHOICES, YES_NO_CHOICES } from "@/utils/constants";
import FormField from "@/components/form/FormField";
import { API_ARTICLES_ENDPOINT } from "@/api/api";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { usePermissions } from "@/utils/permissions";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  gros?: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  gros,
  editText = "MODIFIER",
  addText = "",
  hasIcon = false,
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

    if (initialvalues) values.id = initialvalues?.id;
    values.gros = parseInt(gros);

    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_ARTICLES_ENDPOINT,
  });

  const hasPermission = usePermissions();

  return (
    <DraggableModel
      disabledModalOpenButton={(!initialvalues && !hasPermission('app.add_article')) || (initialvalues && !hasPermission('app.change_article'))}
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Article"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={800}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={24}>
          <FormField
            label="Numéro"
            name="numero"
            span={24}
            required
            span_md={12}
            type="text"
          />
          <FormField
            label="BL"
            name="bl"
            span={24}
            required
            span_md={12}
            type="text"
          />
          <FormField
            label="Nature"
            name="groupage"
            option_label="label"
            option_value="value"
            required
            type="select"
            options={CONTAINER_NATURE_CHOICES}
          />
          <FormField
            label="Cleint"
            name="client"
            option_label="raison_sociale"
            required
            type="select"
            options={client?.results}
          />
          <FormField
            label="Designation"
            name="designation"
            span={24}
            span_md={24}
            type="text"
          />
          <FormField
            label="Transitaire"
            name="transitaire"
            option_label="raison_sociale"
            type="select"
            options={transitaire?.results}
          />
        </Row>
        <Divider style={{ marginTop: "0px" }} />
        <Row gutter={24}>
          <FormField
            label="Depoté"
            disabled={true}
            name="depote"
            option_label="label"
            option_value="value"
            type="select"
            options={YES_NO_CHOICES}
          />
          <FormField
            label="Date dépotage"
            name="date_depotage"
            type="date"
            disabled={true}
          />
          <FormField
            label="Observation de dépotage"
            name="observation_depotage"
            span={24}
            span_md={24}
            type="text"
            disabled
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
