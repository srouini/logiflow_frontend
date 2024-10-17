import { API_BONS_COMMANDE_ENDPOINT, API_CONTENEURS_ENDPOINT, API_RUBRIQUES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import useData from "@/hooks/useData";
import usePost from "@/hooks/usePost";
import { PaperClipOutlined } from "@ant-design/icons";
import { CheckCard, ProCard, StepsForm } from "@ant-design/pro-components";
import { Button, Flex, message, Modal, Row } from "antd";
import { useEffect, useState } from "react";

interface AUFormProps {
  article: any;
  refetch: () => void;
}

export default ({ article, refetch }: AUFormProps) => {
  // @ts-ignore
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
    },
  });

  const { data: rubriques } = useData({
    endpoint: API_RUBRIQUES_ENDPOINT,
    name: `GET_RUBRIQUES`,
    params: {
      categorie__icontains:"occasionnelle",
      all: true,
    },
  });

  const [selectedContainers, setSelectedContainers] = useState([]);
  return (
    <>
      <Button
        type="default"
        onClick={showModal}
        disabled={containers?.data?.length === 0}
      >
        + Bon Commande
      </Button>
      <Modal
        title="+ Préstation occasionnelle"
        destroyOnClose
        width={600}
        footer={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProCard>
          <StepsForm
            onFinish={async (values: any) => {
              mutate({
                article: article?.id, 
                commandes : 
                  selectedContainers?.map((tc:any) => {
                    return {
                      tc: tc, 
                      type: values["type"], 
                      quantite: values["quantite"],
                      observation: values["observation"]
                    }
                  })
                
              });
            }}
            submitter={{
              render: ({ form, onSubmit, step, onPre }) => {
                return [
                  <Button
                    key="rest"
                    onClick={() => {
                      form?.resetFields();
                    }}
                  >
                    Reset
                  </Button>,
                  step > 0 && (
                    <Button
                      key="pre"
                      onClick={() => {
                        onPre?.();
                      }}
                    >
                      Précédent
                    </Button>
                  ),
                  <Button
                    key="next"
                    loading={isLoading}
                    type="primary"
                    onClick={() => {
                      onSubmit?.();
                      refetchTcs();
                    }}
                    disabled={isLoading}
                  >
                    Suivant
                  </Button>,
                ];
              },
            }}
            formProps={{
              validateMessages: {
                required: "Required",
              },
            }}
          >
            <StepsForm.StepForm
              name="base"
              title="Bon Commande"
              onFinish={async () => {
                setLoading(true);
                setLoading(false);
                return true;
              }}
            >
              <Row gutter={24}>
                <FormField
                  label="Type"
                  name="type"
                  span={18}
                  required
                  span_md={18}
                  type="select"
                  option_label="label"
                  option_value="id"
                  options={rubriques?.data}
                />
                <FormField
                  label="Quantité"
                  name="quantite"
                  span={6}
                  span_md={6}
                  type="number"
                />
              </Row>
              <Row> 
                <FormField label="observation" name="observation" type="text" span={24} span_md={24}/> 
              </Row>
            </StepsForm.StepForm>
            <StepsForm.StepForm name="checkbox" title="Conteneurs">
              <Flex style={{ padding: "0px", paddingTop: "0px" }}>
                <CheckCard.Group
                  multiple
                  onChange={(value: any) => {
                    setSelectedContainers(value);
                  }}
                  size="small"
                >
                  <Flex wrap justify="center">
                    {containers?.data?.map((item: any) => {
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
            </StepsForm.StepForm>
          </StepsForm>
        </ProCard>
      </Modal>
    </>
  );
};
