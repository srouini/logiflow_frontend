import { API_CONTENEURS_ENDPOINT, API_PRFORMAS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import useData from "@/hooks/useData";
import usePost from "@/hooks/usePost";
import { YES_NO_CHOICES } from "@/utils/constants";
import { PaperClipOutlined, PlusOutlined } from "@ant-design/icons";
import { CheckCard } from "@ant-design/pro-components";
import {  Divider,  Form, message, Row, Tag } from "antd";
import { useEffect, useState } from "react";
import FormObject from "@/components/Form";
import DraggableModel from "@/components/DraggableModel";

interface AUFormProps {
  article: any;
  refetch: () => void;
}

export default ({ article, refetch }: AUFormProps) => {
  // @ts-ignore
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();


  const onSuccess = async () => {
    message.success("Submission successful");
    setIsModalOpen(false);
    await refetch();
    refetchTcs();
  };

  useEffect(() => {}, [refetch]);

  useEffect(() => {
    refetchTcs();
  }, []);
  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PRFORMAS_ENDPOINT,
  });

  const { data: containers, refetch: refetchTcs } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: `GET_PROFORMA_TCS`,
    params: {
      article__id: article.id,
      all: true,
      billed: false,
      expand: "type_tc",
    },
  });

  const [selectedContainers, setSelectedContainers] = useState([]);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();

    const date = new Date(values["date_proforma"]);
    values["date_proforma"] = date.toISOString().split("T")[0];
    values["article"] = article?.id;
    values["gros"] = article?.gros?.id;
    values["tcs"] = selectedContainers;
    console.log(values);
    mutate(values);
  };

  console.log(containers);
  return (
    <>
      <DraggableModel
        OkButtontext="Submit"
        modalOpenButtonText="Proforma"
        addButtonIcon={<PlusOutlined />}
        modalTitle="+ Proforma"
        onSubmit={handleFormSubmission}
        setOpen={setIsModalOpen}
        open={isModalOpen}
        width={600}
        isLoading={isLoading}
      >
        <FormObject form={form} initialvalues={{ quantite: 1 }}>
          <Divider dashed style={{ marginTop: "0px" }} />

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
              initialValue={true}
              options={YES_NO_CHOICES}
              option_value="value"
              span_md={12}
            />
            <FormField
              name="entreposage"
              label="Entreposage"
              type="select"
              initialValue={true}
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
              initialValue={false}
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
              initialValue={false}
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

          <Divider dashed style={{ marginTop: "0px" }} />

          <CheckCard.Group
            multiple
            onChange={(value: any) => {
              setSelectedContainers(value);
            }}
            size="small"
            style={{ width: "100%" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "300px",
                overflow: "scroll",
              }}
            >
              {containers?.data?.map((item: any) => {
                return (
                  <CheckCard
                    size="large"
                    style={{ minHeight: "55px", width: "95%" }}
                    title={item?.tc}
                    extra={
                      <>
                        <Tag>{item?.type_tc?.designation}</Tag>
                        {item?.dangereux && <Tag color="red">DGX</Tag>}
                      </>
                    }
                    loading={item.type_tc == null}
                    value={item?.id}
                    avatar={<PaperClipOutlined />}
                  />
                );
              })}
            </div>
          </CheckCard.Group>
        </FormObject>
      </DraggableModel>
    </>
  );
};
