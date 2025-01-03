import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Card, Col, DatePicker, Divider, Flex, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDateTime, mapInitialValues } from "@/utils/functions";
import FormField from "@/components/form/FormField";
import { API_CONTENEURS_ENDPOINT, API_SCELLE_ENDPOINT } from "@/api/api";
import { useReferenceContext } from "@/context/ReferenceContext";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
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
  const { user: users } = useReferenceContext();
  const { user } = useAuth();
  useEffect(() => {
    users?.fetch();
  }, []);

  const account = localStorage.getItem("cat");
  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    formatDateTime("date_entree_port_sec", values);

    let scelle = null;
    if (
      initialvalues.date_entree_port_sec ==
      values?.date_entree_port_sec + "Z"
    )
      delete values["date_entree_port_sec"];

    if (initialvalues.current_scelle) {
      delete values["current_scelle"];
    } else if (values["current_scelle"]) {
      scelle = {
        numero: values?.current_scelle,
        type_scelle: values?.type_scelle,
        tc: initialvalues?.id,
      };
      values["current_scelle"] = scelle;
    }

    values["receved"] = true;
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
          width={500}
          isLoading={isLoading}
          initialvalues={initialvalues}
        >
          {initialvalues?.current_scelle && (
            <Card style={{ marginTop: "20px" }} size="small">
              <Flex justify="space-between">
                <Row align={"middle"}>
                  {initialvalues?.current_scelle?.numero} - {initialvalues?.current_scelle?.type_scelle}
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
            initialvalues={mapInitialValues({
              ...initialvalues,
              receved_by: user,
            })}
          >
            <Row gutter={24}>
              <FormField
                label="Chagé réception"
                name="receved_by"
                disabled
                option_label="full_name"
                option_value="id"
                required
                span_md={24}
                span={24}
                type="select"
                options={users?.results}
              />

              {!initialvalues.current_scelle && (
                <>
                  <Divider dashed style={{ marginTop: "0px" }} orientation="left">Scellé</Divider>
                  <FormField
                    label="Numero"
                    name="current_scelle"
                    span={24}
                    span_md={24}
                    type="text"
                  />
                  <FormField
                    span={24}
                    span_md={24}
                    type="select"
                    name="type_scelle"
                    label="Type"
                    option_label="label"
                    option_value="value"
                    options={[
                      {
                        label: "National",
                        value: "National",
                      },
                      {
                        label: "International",
                        value: "International",
                      },
                    ]}
                  />
                  <Divider dashed style={{ marginTop: "0px" }}></Divider>

                </>
              )}

              <FormField
                label="Matricule"
                name="matricule_camion"
                span={24}
                span_md={24}
                type="text"
              />

              <Col span={24}>
                <Form.Item label="Date" name="date_entree_port_sec" required>
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabled={disabled}
                    showTime
                    minDate={
                      initialvalues?.date_sortie_port
                        ? dayjs(initialvalues?.date_sortie_port)
                        : undefined
                    }
                    maxDate={dayjs().startOf("day")}
                  />
                </Form.Item>
              </Col>

              <FormField
                label="Observation"
                name="observation_reception"
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
