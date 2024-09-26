import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Card, Col, Flex, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDate, mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import FormField from "@/components/form/FormField";
import { API_VISITES_ENDPOINT, API_VISITES_ITEMS_ENDPOINT } from "@/api/api";
import { ArrowRightOutlined, EditOutlined, SwapRightOutlined } from "@ant-design/icons";

interface AUFormProps {
  refetch: () => void;
  refetchNonVisitedContainers: () => void;
  initialvalues: any;
  tc?: any;
  disabled?: boolean;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
  visite_id: string | undefined
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  refetchNonVisitedContainers,
  disabled,
  tc,
  visite_id
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
    values["tc"] = tc?.id
    if(visite_id !==undefined) values["visite"] = parseInt(visite_id);
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    form.resetFields();
    setOpen(false);
    refetch();
    refetchNonVisitedContainers();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_VISITES_ITEMS_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      addButtonType="dashed"
      disabledModalOpenButton={disabled}
      modalOpenButtonText=""
      addButtonIcon={
       <ArrowRightOutlined />
      }
      modalTitle={`Visite |  ${tc?.tc}`}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={550}
      isLoading={isLoading}
    >
        <Card style={{ marginTop: "20px", marginRight:"10px", marginLeft:"10px" }} size="small">
          <Flex justify="space-between">
            <Row align={"middle"}>Conteneur</Row>
            <Row gutter={12}>
              <Col>
                {tc?.tc}
              </Col>
            </Row>
          </Flex>
        </Card>

      <FormObject form={form} >
        <Row gutter={24}>
   
          <FormField
            label="Scelle"
            name="scelle"
            type="text"
            required
            span={24}
            span_md={24}
          />

          <FormField
            label="Observation"
            name="observation"
            type="text"
            required
            span={24}
            span_md={24}
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
