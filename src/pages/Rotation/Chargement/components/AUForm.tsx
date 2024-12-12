import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { formatDate, mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import FormField from "@/components/form/FormField";
import { API_BULLETINS_ENDPOINT } from "@/api/api";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  gros?: any;
  disabled?: boolean;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  disabled,
  editText = "MODIFIER",
  addText = "Mrn",
  hasIcon = false,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { mrn, user:users } = useReferenceContext();

  const { user } = useAuth();


  useEffect(() => {
    mrn?.fetch();
    users?.fetch();
  }, []);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) values.id = initialvalues?.id;
    values = formatDate("date_creation", values);
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_BULLETINS_ENDPOINT,
  });


  return (
    <DraggableModel
      OkButtontext="Submit"
      addButtonType="dashed"
      disabledModalOpenButton={disabled}
      modalOpenButtonText={initialvalues ? editText : addText}
      addButtonIcon={hasIcon && initialvalues ? <EditOutlined />:<PlusOutlined /> }
      modalTitle="Bulletin"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={500}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues({...initialvalues,charge_chargement:user})}>
        <Row gutter={24}>
          <FormField
            label="Mrn"
            name="gros"
            option_label="gros"
            option_value="id"
            required
            span_md={24}
            span={24}
            type="select"
            options={mrn?.results}
          />
          <FormField
            label="Chagé chargement"
            name="charge_chargement"
            option_label="full_name"
            option_value="id"
            required
            disabled
            span_md={24}
            span={24}
            type="select"
            options={users?.results}
          />
          <FormField
            label="Date"
            name="date_creation"
            span={24}
            required
            span_md={24}
            type="date"
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
