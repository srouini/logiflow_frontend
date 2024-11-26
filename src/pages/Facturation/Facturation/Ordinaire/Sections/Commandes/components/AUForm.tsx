import { API_BONS_COMMANDE_ENDPOINT, API_CONTENEURS_ENDPOINT } from "@/api/api";
import DraggableModel from "@/components/DraggableModel";
import FormField from "@/components/form/FormField";
import useData from "@/hooks/useData";
import usePost from "@/hooks/usePost";
import { PaperClipOutlined, PlusOutlined } from "@ant-design/icons";
import { CheckCard } from "@ant-design/pro-components";
import { Divider, Form, message, Row, Tag } from "antd";
import { useEffect, useState } from "react";
import FormObject from "@/components/Form";

interface AUFormProps {
  article: any;
  refetch: () => void;
}

export default ({ article, refetch }: AUFormProps) => {
  // @ts-ignore
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const TYPES = [
    {
      label: "Clarck Intégral",
      value: "Clarck Intégral",
    },
    {
      label: "Clarck Partiel",
      value: "Clarck Partiel",
    },
    {
      label: "Manutentions humaines Intégral",
      value: "Manutentions humaines Intégral",
    },
    {
      label: "Manutentions humaines Partiel",
      value: "Manutentions humaines Partiel",
    },
  ];

  const onSuccess = async () => {
    message.success("Submission successful");
    setIsModalOpen(false);
    await refetch();
    refetchTcs();
  };

  useEffect(() => {}, [refetch]);

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_BONS_COMMANDE_ENDPOINT,
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

    mutate({
      article: article?.id,
      commandes: selectedContainers?.map((tc: any) => {
        return {
          tc: tc,
          type: values["type"],
          quantite: values["quantite"],
          observation: values["observation"],
        };
      }),
    });
  };
  return (
    <>
      <DraggableModel
        OkButtontext="Submit"
        modalOpenButtonText="Commande"
        addButtonIcon={<PlusOutlined />}
        modalTitle="+ Commande"
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
              label="Type"
              name="type"
              span={16}
              required
              span_md={16}
              type="select"
              option_label="label"
              option_value="value"
              options={TYPES}
            />
            <FormField
              label="Quantité"
              name="quantite"
              span={8}
              span_md={8}
              minValue={1}
              type="number"
              required
            />
          </Row>
          <Row>
            <FormField
              label="observation"
              name="observation"
              type="text"
              span={24}
              span_md={24}
            />
          </Row>

          <Divider dashed style={{ marginTop: "0px" }} />
          <Row>
            <CheckCard.Group
              multiple
              onChange={(value: any) => {
                setSelectedContainers(value);
              }}
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "300px",
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
                          {item?.frigo && <Tag color="blue">FRIGO</Tag>}
                        </>
                      }
                      value={item?.id}
                      avatar={<PaperClipOutlined />}
                    />
                  );
                })}
              </div>
            </CheckCard.Group>
          </Row>
        </FormObject>
      </DraggableModel>
    </>
  );
};
