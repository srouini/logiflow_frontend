import { useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Card, Col, Flex, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDateTime, mapInitialValues } from "@/utils/functions";
import FormField from "@/components/form/FormField";
import { API_CONTENEURS_ENDPOINT, API_SCELLE_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  disabled?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  disabled,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    formatDateTime("date_sortie_port", values);
    let scelle = null;
    if (initialvalues.date_sortie_port == values?.date_sortie_port + "Z")
      delete values["date_sortie_port"];

    if (initialvalues.current_scelle) {
      delete values["current_scelle"];
    } else if (values["current_scelle"]) {
      scelle = {
        numero: values?.current_scelle,
        type_scelle: "scelle_port",
        tc: initialvalues?.id,
      };
      values["current_scelle"] = scelle;
    }

    values["id"] = initialvalues?.id;

    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CONTENEURS_ENDPOINT,
  });

  return (
    <>
      {disabled ? (
        initialvalues?.tc
      ) : (
        <DraggableModel
          OkButtontext="Submit"
          modalOpenButtonText={initialvalues?.tc}
          buttonType="Button"
          addButtonIcon={null}
          modalTitle={initialvalues?.tc}
          onSubmit={handleFormSubmission}
          setOpen={setOpen}
          open={open}
          width={400}
          isLoading={isLoading}
          initialvalues={initialvalues}
        >
          {initialvalues?.current_scelle && (
            <Card style={{ marginTop: "20px" }} size="small">
              <Flex justify="space-between">
                <Row align={"middle"}>
                  {initialvalues?.current_scelle?.numero}
                </Row>
                <Row gutter={12}>
                  <Col>
                    {" "}
                    <Delete
                      class_name="Scelle"
                      refetch={refetch}
                      url={API_SCELLE_ENDPOINT}
                      id={initialvalues?.current_scelle?.id}
                      link={false}
                      type="dashed"
                    />
                  </Col>
                </Row>
              </Flex>
            </Card>
          )}
          <FormObject
            form={form}
            initialvalues={mapInitialValues(initialvalues)}
          >
            <Row gutter={24}>
              <FormField
                label="Matricule"
                name="matricule_camion"
                span={24}
                span_md={24}
                type="text"
              />

              {!initialvalues.current_scelle && (
                <FormField
                  label="Scelle"
                  name="current_scelle"
                  span={24}
                  span_md={24}
                  type="text"
                />
              )}

              <FormField
                label="Date"
                name="date_sortie_port"
                span={24}
                required
                span_md={24}
                type="dateTime"
              />
              <FormField
                label="Observation"
                name="observation_chargement"
                span={24}
                span_md={24}
                type="text"
              />
            </Row>
          </FormObject>
        </DraggableModel>
      )}
    </>
  );
};

export default AUForm;
