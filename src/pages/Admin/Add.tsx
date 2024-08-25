import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProFormDatePicker,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Col, Form, message, Row } from "antd";
import FormSelectInput from "../../components/form/FormSelectInput";
import usePost from "../../hooks/usePost";

export default () => {


  const onSuccess = () => message.success("Submission successful");

  const {mutate,isLoading} = usePost({ onSuccess:onSuccess, endpoint: "http://localhost:8000/api/data/gros/" });

  const [form] = Form.useForm<{
    numero: string;
    port_emission: number;
    port_reception: number;
    armateur: number;
    consignatire: number;
  }>();
  return (
    <ModalForm
      submitter={{
        submitButtonProps:{
          disabled:isLoading,
          loading:isLoading,
        }, 
      }}
      title="MRN"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          MRN
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log("run"),
      }}
      submitTimeout={2000}
      onFinish={async (values:any) => {
        mutate(values);
      }}
      autoFocus={true}
    >
      <Row gutter={36}>
        <Col span={12}>
          <ProFormText
            width="lg"
            name="numero"
            label="Numéro"
            tooltip="Up to 24 characters"
            placeholder="mrn"
            required={true}
            
          />
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            width="lg"
            name="accostage"
            label="Accostage"
            placeholder="accostage"
            fieldProps={{
              format: (value) => value.format("YYYY-MM-DD"),
            }}
            required={true}
          />
        </Col>
      </Row>

      <Row gutter={36}>
        <Col span={12}>
          <ProFormText
            width="lg"
            name="escale"
            label="Escale"
            tooltip="Up to 24 characters"
            placeholder="escale"
      
          />
        </Col>
        <Col span={12}>
        
        </Col>
      </Row>

      <Row gutter={36}>
        <Col span={12}>
          <FormSelectInput
            endpoint="api/reference/port/"
            name="port_emission"
            option_label="raison_sociale"
            option_value="id"
            label="Port emission"
            params={{ all: true, fields: "raison_sociale,id" }}
          />
        </Col>
        <Col span={12}>
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
        <Col span={12}>
          <FormSelectInput
            endpoint="api/reference/consignataire/"
            name="consignataire"
            option_label="raison_sociale"
            option_value="id"
            label="Consignataire"
            params={{ all: true, fields: "raison_sociale,id" }}
          />
        </Col>
        <Col span={12}>
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
        <Col span={12}>
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
        <Col span={12}>
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
    </ModalForm>
  );
};
