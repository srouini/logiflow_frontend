import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDate, mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import FormField from "@/components/form/FormField";
import { API_ARTICLES_ENDPOINT, API_SOUSARTICLES_ENDPOINT, API_VISITESGROUPAGE_ENDPOINT } from "@/api/api";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import FormRelatedSelectInput from "@/components/form/FormRelatedSelectInput";
import FormThreeRelatedSelectInput from "@/components/form/FormThreeRelatedSelectInput";

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
    endpoint: API_VISITESGROUPAGE_ENDPOINT,
  });


  return (
    <DraggableModel
      OkButtontext="Submit"
      addButtonType="dashed"
      disabledModalOpenButton={disabled}
      modalOpenButtonText={initialvalues ? editText : addText}
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      modalTitle="Visite groupage"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={550}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={24}>
          <FormThreeRelatedSelectInput
            QUERY_NAME_C="GET_ARTICLES_BY_MRN"
            QUERY_NAME_D="GET_SUB_ARTICLES_BY_Article"
            form={form}
            related_endpointC={API_ARTICLES_ENDPOINT}
            related_endpointD={API_SOUSARTICLES_ENDPOINT}
            labelP="Mrn"
            labelC="Article"
            nameC="article"
            nameP="gros"
            related_attributeC="gros__id"
            related_attributeD="tc__article__id"
            option_labelC="numero"
            option_labelP="gros"
            option_valueC="id"
            option_valueP="id"
            optionsP={mrn?.results}
            requiredC
            requiredP
            requiredD
            spanC={24}
            spanP={24}
            spanD={24}
            span_mdC={12}
            span_mdP={12}
            span_mdD={12}
            labelD="Sous Article"
            nameD="sous_article"
            option_labelD="numero"
            option_valueD="id"

          />
             <FormField
            label="Badge"
            name="badge"
            type="text"
            required
            span={24}
            span_md={12}
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
       
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
