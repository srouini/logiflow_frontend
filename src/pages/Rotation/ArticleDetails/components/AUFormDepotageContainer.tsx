import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { UnlockOutlined } from "@ant-design/icons";
import { usePermissions } from "@/utils/permissions";


interface AUFormProps {
  refetch: () => void;
  container: any;
  disable?:boolean
}

const AUFormDepotageContainer: React.FC<AUFormProps> = ({
  refetch,
  container,
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
    values["id"] = parseInt(container);
    values["depote"] = true;
    let updated_container = {
      id:container?.id,
      depote: true,
      date_depotage: values["date_depotage"]?.format("YYYY-MM-DDTHH:mm:ss")
    }
    mutate(updated_container);
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


  const today = new Date();
  today.setDate(today.getDate() - 1);
  // const formattedDateTime = `${today.toISOString().split('T')[0]} ${today.toTimeString().split(' ')[0]}`;


  const hasPermission = usePermissions();

  return (
    <DraggableModel
    disabledModalOpenButton={disable || !hasPermission('app.depot_tc')}
      OkButtontext="Submit"
      modalOpenButtonText="Dépoter" 
      modalTitle="Dépotage"
      addButtonType="primary"
      addButtonIcon={
       <UnlockOutlined />
      }
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

export default AUFormDepotageContainer;
