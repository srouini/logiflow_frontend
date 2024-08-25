import { useState } from "react";
import DraggableModel from "./DraggableModel";
import FormObject from "./Form";
import {
  Col,
  Form,
  message,
  Row,
} from "antd";
import FormDateInput from "../../components/form/FormDateInput";
import FormSelectInput from "../../components/form/FormSelectInput";
import FormTextInput from "../../components/form/FormTextInput";
import usePost from "../../hooks/usePost";

const formatDate = (field:string, values:any) => {
  if (values[field])
    values[field] = values[field].format("YYYY-MM-DD");
  return values;
}
const Ajouter = ({refetch}:any) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values = formatDate('accostage',values)
    mutate(values);
  };

  const onSuccess = () => {message.success("Submission successful");setOpen(false);refetch();}

  const {mutate,isLoading} = usePost({ onSuccess:onSuccess, endpoint: "http://localhost:8000/api/data/gros/" });


  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText="AJOUTER"
      modalTitle="AJOUTER"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={700}
      isLoading={isLoading}
      
    >
      <FormObject form={form}>
        <Row gutter={12}>
        <Col span={24} md={12}>
            <FormTextInput
              name={"numero"}
              label={"Numéro"}
              required
            ></FormTextInput>
          </Col>

          <Col span={24} md={12}>
            <FormDateInput label="Accostage" name="accostage" required/>
          </Col>
         
        </Row>
        <Row gutter={12}>
          <Col span={24} md={12}>
            <FormTextInput
              name={"escale"}
              label={"Escale"}
            ></FormTextInput>
          </Col>
          <Col span={24} md={12}></Col>
        </Row>
        <Row gutter={36}>
          <Col span={24} md={12}>
            <FormSelectInput
              endpoint="api/reference/port/"
              name="port_emission"
              option_label="raison_sociale"
              option_value="id"
              label="Port emission"
              params={{ all: true, fields: "raison_sociale,id" }}
            />
          </Col>
          <Col span={24} md={12}>
            <FormSelectInput
              endpoint="api/reference/port/"
              name="port_reception"
              option_label="raison_sociale"
              option_value="id"
              label="Port réception"
              required={true}
              params={{ all: true, fields: "raison_sociale,id" }}
            />
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={24} md={12}>
            <FormSelectInput
              endpoint="api/reference/consignataire/"
              name="consignataire"
              option_label="raison_sociale"
              option_value="id"
              label="Consignataire"
              params={{ all: true, fields: "raison_sociale,id" }}
            />
          </Col>
          <Col span={24} md={12}>
            <FormSelectInput
              endpoint="api/reference/armateur/"
              name="armateur"
              option_label="raison_sociale"
              option_value="id"
              label="Armateur"
              params={{ all: true, fields: "raison_sociale,id" }}
            />
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={24} md={12}>
            <FormSelectInput
              endpoint="api/bareme/regime/"
              name="regime"
              option_label="designation"
              option_value="id"
              label="Régime"
              required={true}
              params={{ all: true, fields: "designation,id" }}
            />
          </Col>
          <Col span={24} md={12}>
            <FormSelectInput
              endpoint="api/reference/navire/"
              name="navire"
              option_label="nom"
              option_value="id"
              label="Navire"
              params={{ all: true, fields: "nom,id" }}
            />
          </Col>
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default Ajouter;
