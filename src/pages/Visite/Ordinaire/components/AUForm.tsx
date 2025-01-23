import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDate, mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import FormField from "@/components/form/FormField";
import { API_ARTICLES_ENDPOINT, API_VISITES_ENDPOINT } from "@/api/api";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import FormRelatedSelectInput from "@/components/form/FormRelatedSelectInput";
import { usePermissions } from "@/utils/permissions";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  gros?: any;
  disabled?: boolean;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  disabled,
  editText = "MODIFIER",
  addText = "Visite",
  hasIcon = false,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { mrn, transitaire } = useReferenceContext();

  useEffect(() => {
    mrn?.fetch();
    transitaire?.fetch();
  }, []);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) values.id = initialvalues?.id;
    values = formatDate("date_visite", values);
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    form.resetFields();
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_VISITES_ENDPOINT,
  });

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const hasPermission = usePermissions();

  return (
    <DraggableModel
      OkButtontext="Submit"
      addButtonType="dashed"
      disabledModalOpenButton={disabled || (!initialvalues && !hasPermission('app.add_visite')) || (initialvalues && !hasPermission('app.change_visite'))}
      modalOpenButtonText={initialvalues ? editText : addText}
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      modalTitle="Visite ordinaire"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={550}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues? initialvalues : {type_visite:"Visite douane"})}>
        <Row gutter={24}>
          <FormRelatedSelectInput
            QUERY_NAME="GET_ARTICLES_BY_MRN"
            form={form}
            related_endpoint={API_ARTICLES_ENDPOINT}
            labelP="Mrn"
            labelC="Article"
            nameC="article"
            nameP="gros"
            related_attribute="gros__id"
            option_labelC="numero"
            option_labelP="gros"
            option_valueC="id"
            option_valueP="id"
            optionsP={mrn?.results}
            requiredC
            requiredP
            spanC={24}
            spanP={24}
            span_mdC={12}
            span_mdP={12}
          />
          <FormField
            label="Transitaire"
            name="transitaire"
            option_label="raison_sociale"
            option_value="id"
            required
            span_md={24}
            span={24}
            type="select"
            options={transitaire?.results}
          />
          <FormField
            label="Date"
            name="date_visite"
            span={24}
            required
            span_md={24}
            type="date"
            minDate={formattedDate}
          />
          <FormField
            label="Type"
            name="type_visite"
            option_label="label"
            option_value="value"
            required
            span_md={24}
            span={24}
            type="select"
            options={[
              { label: "Visite douane", value: "Visite douane" },
              { label: "Visite D41", value: "Visite D41" },
            ]}
          />
          <FormField
            label="Badge"
            name="badge"
            type="text"
            required
            span={24}
            span_md={24}
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
