import React, { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_RUBRIQUES_ENDPOINT, API_TRANSITAIRE_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { YES_NO_CHOICES } from "@/utils/constants";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
}

const AUForm: React.FC<AUFormProps> = ({ refetch, initialvalues }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { rubrique,direction } = useReferenceContext();

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    mutate(values);
  };

  useEffect(() => {
    direction?.fetch();
  },[])
  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
    rubrique?.refetch();
    direction?.refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_RUBRIQUES_ENDPOINT,
  });

  const TYPES_CALCULE = [
    { value: 'Calcule par unité TC' },
    { value: 'Calcule par unité JOUR' },
    { value: 'Calcule par unité TC X JOUR' },
    { value: 'Calcule par unité ARTICLE' },
    { value: 'A la demande' },
  ]
  const CATEGORIES = [
    { value: 'Automatique' },
    { value: 'Préstation occasionnelle' },
    { value: 'Clarck Intégral' },   
    { value: 'Clarck Partiel' },   
    { value: 'Manutentions humaines Intégral' },   
    { value: 'Manutentions humaines Partiel' },   
  ]


  return (
    <DraggableModel
      OkButtontext="Soumettre"
      modalOpenButtonText=""
      addButtonIcon={initialvalues ? <EditOutlined /> : <PlusOutlined />}
      modalTitle="Rubrique"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={650}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues? initialvalues : {soumis_tva:true})}>
        <Row gutter={24}>
        <FormField
            label="Désignation"
            name="designation"
            span={24}
            span_md={24}
            type="text"
          />
                   <FormField
            label="Type de calcul"
            name="type_calcule"
            span={24}
            required
            span_md={24}
            type="select"
            options={TYPES_CALCULE}
            option_label="value"
            option_value="value"
          />
                         <FormField
            label="Categorie"
            name="categorie"
            span={24}
            required
            span_md={24}
            type="select"
            options={CATEGORIES}
            option_label="value"
            option_value="value"
          />  
                        <FormField
            label="Direction"
            name="direction"
            span={24}
            required
            span_md={24}
            type="select"
            options={direction?.results}
            option_label="nom"
            option_value="id"
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
