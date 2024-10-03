import React, { useEffect, useState } from "react";
import DraggableModelWithoutFooter from "@/components/DraggableModelWithoutFooter";
import FormObject from "@/components/Form";
import { Button, Divider, Flex, Form, message, Row, Steps, theme } from "antd";
import usePost from "@/hooks/usePost";
import { formatDate, mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_PRFORMAS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import {
  EditOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { YES_NO_CHOICES } from "@/utils/constants";
import { CheckCard } from "@ant-design/pro-components";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
  article: any;
  containers: any;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  editText = "MODIFIER",
  addText = "Mrn",
  hasIcon = false,
  article,
  containers,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const {} = useReferenceContext();

  const handleFormSubmission = async () => {
    try {
      // Validate the form fields
      let values = await form.validateFields();

      // If the form is valid, continue with your logic
      // if (initialvalues) {
      //   values.id = initialvalues?.id;
      // }

      // values["article"] = article?.id;
      // values["gros"] = article?.gros?.id;
      // values["tcs"] = containers;

      // Assuming formatDate is a function that formats a date field
      values = formatDate("date_proforma", values);

      // Submit the form data via mutate
      mutate(values);
    } catch (error) {
      // Handle the validation errors
      console.log("Validation failed:", error);
    }
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PRFORMAS_ENDPOINT,
  });

  // ----------------------------------------------------

  const handleOnFinish = (values:any) => {
    console.log(values);
  };
  const [selectedContainers, setSelectedContainers] = useState([]);
  const steps = [
    {
      title: "Proforma",
      content: (
        <div style={{ padding: "20px", paddingTop: "40px" }}>
          <Row gutter={24}>
            <FormField
              label="Date"
              name="date_proforma"
              span={24}
              required
              span_md={24}
              type="date"
            />
          </Row>
          <Row gutter={24}>
            <FormField
              name="tva"
              label="Tva"
              type="select"
              options={YES_NO_CHOICES}
              option_value="value"
              span_md={12}
            />
            <FormField
              name="entreposage"
              label="Entreposage"
              type="select"
              options={YES_NO_CHOICES}
              option_value="value"
              span_md={12}
            />
          </Row>
          <Divider dashed style={{ marginTop: "0px" }} />
          <Row gutter={24}>
            <FormField
              name="remise"
              label="Remise"
              type="select"
              options={YES_NO_CHOICES}
              option_value="value"
              span_md={8}
            />
            <FormField
              label="Remise"
              name="REMISE"
              span={24}
              span_md={16}
              type="number"
              step={0.01}
            />
          </Row>
          <Row gutter={24}>
            <FormField
              name="debeur"
              label="Debours"
              type="select"
              options={YES_NO_CHOICES}
              option_value="value"
              span_md={8}
            />
            <FormField
              label="Debours"
              name="DEBEUR"
              span={24}
              span_md={16}
              type="number"
              step={0.01}
            />
          </Row>
        </div>
      ),
    },
    {
      title: "Conteneurs",
      content: (
        <Flex style={{ padding: "20px", paddingTop: "40px" }}>
          <CheckCard.Group
            multiple
            onChange={(value: any) => {
              setSelectedContainers(value);
            }}
            size="small"
          >
            <Flex wrap justify="center">
              {containers?.map((item: any) => {
                return (
                  <CheckCard
                    title={item?.tc}
                    value={item?.id}
                    avatar={<PaperClipOutlined />}
                  />
                );
              })}
            </Flex>
          </CheckCard.Group>
        </Flex>
      ),
    },
  ];

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item: any) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <DraggableModelWithoutFooter
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText}
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={800}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <Form
        layout="horizontal"
        style={{ padding: "10px", paddingTop: "20px" }}
        form={form}
        onFinish={handleOnFinish}
      >
        <>
          <Steps current={current} items={items} size="small" />
          <div style={contentStyle}>{steps[current].content}</div>
          <div style={{ marginTop: 24 }}>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                disabled={selectedContainers.length === 0}
                htmlType="submit"
              >
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Previous
              </Button>
            )}
          </div>
        </>
      </Form>
    </DraggableModelWithoutFooter>
  );
};

export default AUForm;
