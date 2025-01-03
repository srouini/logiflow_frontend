import { useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Card, Col, DatePicker, Divider, Flex, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDateTime, mapInitialValues } from "@/utils/functions";
import FormField from "@/components/form/FormField";
import { API_CONTENEURS_ENDPOINT, API_SCELLE_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import dayjs from "dayjs";
import { ProCard } from "@ant-design/pro-components";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  disabled?: boolean;
  mrn: any;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  disabled,
  mrn,
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
        type_scelle: values?.type_scelle,
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
         
          <FormObject
            form={form}
            initialvalues={mapInitialValues(initialvalues)}
          >
            <Row gutter={24}>
       

              <Col span={24}>
                <Form.Item label="Date" name="date_sortie_port" required>
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabled={disabled}
                    showTime
                    minDate={mrn?.accostage ? dayjs(mrn.accostage) : undefined}
                    maxDate={dayjs().startOf("day")}
                  />
                </Form.Item>
              </Col>
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
