import React, { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDate, mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_MRNS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { usePermissions } from '@/utils/permissions';

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  editText?:string; 
  addText?:string; 
  hasIcon?:boolean
  disabled?:boolean
}

const AUForm: React.FC<AUFormProps> = ({ refetch, initialvalues, editText="MODIFIER",addText="Mrn", hasIcon=false,disabled=false }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);


  const { navire, regime, armateur, consignataire, port, mrn } =
    useReferenceContext();
  const hasPermission = usePermissions();

  useEffect(() => {
    navire.fetch();
    regime.fetch();
    armateur.fetch();
    consignataire.fetch();
    port.fetch();
  }, []);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    values = formatDate("accostage", values);
    mutate(values);
  };

  const onFinish = async (values: any) => {
    handleFormSubmission();
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
    mrn?.refetch()
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_MRNS_ENDPOINT,
  });


  return (
    <DraggableModel
      OkButtontext="Submit"
      disabledModalOpenButton={disabled || (!initialvalues && !hasPermission('app.add_gros')) || (initialvalues && !hasPermission('app.change_gros'))}
      modalOpenButtonText={initialvalues ? editText : addText}
      addButtonIcon={hasIcon && initialvalues ? <EditOutlined />:<PlusOutlined /> }
      modalTitle="MRN"
      onSubmit={onFinish}
      setOpen={setOpen}
      open={open}
      width={800}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>

        <Row gutter={24}>
          <FormField label="Numéro" name="numero"  span={24} required  span_md={12} type="text"/>
          <FormField label="Accostage" name="accostage"  span={24} required  span_md={12} type="date"/>
          <FormField label="Escale" name="escale"  span={24}  span_md={12} type="text"/>
        </Row>

        <Divider dashed style={{ marginTop: "0px" }} />
        <Row gutter={24}>
          <FormField label="Port emission" name="port_emission" placeholder="-" options={port?.results} option_label="raison_sociale"  option_value="id" span={24}  span_md={12} type="select"/>
          <FormField label="Port réception" name="port_reception" placeholder="-" options={port?.results} option_label="raison_sociale"  option_value="id" span={24} required  span_md={12} type="select"/>
          <FormField label="Consignataire" name="consignataire" placeholder="-" options={consignataire?.results} option_label="raison_sociale"  option_value="id" span={24} required  span_md={12} type="select"/>
          <FormField label="Armateur" name="armateur" placeholder="-" options={armateur?.results} option_label="raison_sociale"  option_value="id" span={24} required  span_md={12} type="select"/>
          <FormField label="Régime" name="regime" placeholder="-" options={regime?.results} option_label="designation"  option_value="id" span={24} required  span_md={12} type="select"/>
          <FormField label="Navire" name="navire" placeholder="-" options={navire?.results} option_label="nom"  option_value="id" span={24} required  span_md={12} type="select"/>

        </Row>

      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
