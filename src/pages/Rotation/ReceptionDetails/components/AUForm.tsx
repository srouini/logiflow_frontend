import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Col, DatePicker, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDateTime, mapInitialValues } from "@/utils/functions";
import FormField from "@/components/form/FormField";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import { useReferenceContext } from "@/context/ReferenceContext";
import dayjs from "dayjs";

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
  const { user } = useReferenceContext();
  useEffect(() => {
    user?.fetch();
  }, []);

  const account = localStorage.getItem("cat");
  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    formatDateTime("date_entree_port_sec", values);

    if (
      initialvalues.date_entree_port_sec ==
      values?.date_entree_port_sec + "Z"
    )
      delete values["date_entree_port_sec"];
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
          <FormObject
            form={form}
            initialvalues={mapInitialValues({
              ...initialvalues,
              receved_by: account,
            })}
          >
            <Row gutter={24}>
              <FormField
                label="Chagé chargement"
                name="receved_by"
                disabled
                option_label="full_name"
                option_value="id"
                required
                span_md={24}
                span={24}
                type="select"
                options={user?.results}
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
