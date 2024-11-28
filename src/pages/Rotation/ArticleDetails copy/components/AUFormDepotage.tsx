import { useEffect, useState } from "react";
import DraggableModel from "../../../../components/DraggableModel";
import FormObject from "../../../../components/Form";
import { Form, message, Row } from "antd";
import usePost from "../../../../hooks/usePost";
import { formatDateTime } from "../../../../utils/functions";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { API_ARTICLES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { UnlockOutlined } from "@ant-design/icons";


interface AUFormProps {
  refetch: () => void;
  article: any;
  disable?:boolean
}

const AUFormDepotage: React.FC<AUFormProps> = ({
  refetch,
  article,
  disable=false
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType.fetch();
  }, []);

  const {} = useReferenceContext();

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values["id"] = parseInt(article);
    values["depote"] = true;
    formatDateTime("date_depotage", values);
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_ARTICLES_ENDPOINT,
  });


  const today = new Date();
  today.setDate(today.getDate() - 1);
  // const formattedDateTime = `${today.toISOString().split('T')[0]} ${today.toTimeString().split(' ')[0]}`;



  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText="Dépoter" 
      modalTitle="Dépotage"
      addButtonType="primary"
      addButtonIcon={
       <UnlockOutlined />
      }
      disabledModalOpenButton={disable}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
    >
      <FormObject form={form}>
        <Row gutter={24}>
          <FormField
            name="date_depotage"
            label="Date de  dépotage"
            type="dateTime"
            required
            span_md={24}
          />
          <FormField name="observation_depotage" label="Observation" type="text" span_md={24} />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUFormDepotage;
