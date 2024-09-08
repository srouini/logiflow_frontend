import { useEffect, useState } from "react";
import DraggableModel from "../../components/DraggableModel";
import FormObject from "../../components/Form";
import { Col, Divider, Form, message, Row } from "antd";
import FormDateInput from "../../components/form/FormDateInput";
import FormTextInput from "../../components/form/FormTextInput";
import usePost from "../../hooks/usePost";
import { mapInitialValues } from "../../utils/functions";
import { useReferenceContext } from "../../context/ReferenceContext";
import { ProFormSelect } from "@ant-design/pro-components";
import { selectConfig } from "../../utils/config";
import { API_ENDPOINT } from "@/utils/constants";
import { API_MRNS_ENDPOINT } from "@/api/api";

const formatDate = (field: string, values: any) => {
  if (values[field]) values[field] = values[field].format("YYYY-MM-DD");
  return values;
};

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
}

const AUForm: React.FC<AUFormProps> = ({ refetch, initialvalues }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { navire, regime, armateur, consignataire, port } =
    useReferenceContext();

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

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_MRNS_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? "MODIFIER" : "AJOUTER"}
      modalTitle="AJOUTER"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={700}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={12}>
          <Col span={24} md={12}>
            <FormTextInput
              name={"numero"}
              label={"Numéro"}
              required
            ></FormTextInput>
          </Col>

          <Col span={24} md={12}>
            <FormDateInput label="Accostage" name="accostage" required />
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={24} md={12}>
            <FormTextInput name={"escale"} label={"Escale"}></FormTextInput>
          </Col>
          <Col span={24} md={12}></Col>
        </Row>

        <Divider  dashed style={{marginTop:"0px"}}/>
        <Row gutter={36}>
          <Col span={24} md={12}>
             <ProFormSelect
              {...selectConfig}
              options={port.results}
              label="Port emission"
              name="port_emission"
              fieldProps={{
                fieldNames: { label: "raison_sociale", value: "id" },
              }}
              placeholder="-"
            />
          </Col>
          <Col span={24} md={12}>
            <ProFormSelect
              {...selectConfig}
              options={port.results}
              label="Port réception"
              name="port_reception"
              fieldProps={{
                fieldNames: { label: "raison_sociale", value: "id" },
              }}
              placeholder="-"
              required={true}
            />
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={24} md={12}>
            <ProFormSelect
              {...selectConfig}
              options={consignataire.results}
              label="Consignataire"
              name="consignataire"
              fieldProps={{
                fieldNames: { label: "raison_sociale", value: "id" },
              }}
              placeholder="-"
            />
          </Col>
          <Col span={24} md={12}>
             <ProFormSelect
              {...selectConfig}
              options={armateur.results}
              label="Armateur"
              name="armateur"
              fieldProps={{
                fieldNames: { label: "raison_sociale", value: "id" },
              }}
              placeholder="-"
            />
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={24} md={12}>
            <ProFormSelect
              {...selectConfig}
              options={regime.results}
              label="Régime"
              name="regime"
              fieldProps={{
                fieldNames: { label: "designation", value: "id" },
              }}
              placeholder="-"
              required={true}
            />
          </Col>
          <Col span={24} md={12}>
            <ProFormSelect
              {...selectConfig}
              options={navire.results}
              label="Navire"
              name="navire"
              fieldProps={{
                fieldNames: { label: "nom", value: "id" },
              }}
              placeholder="-"
            />
          </Col>
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
