import { API_CONTENEURS_ENDPOINT, API_PRFORMAS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import useData from "@/hooks/useData";
import usePost from "@/hooks/usePost";
import { YES_NO_CHOICES } from "@/utils/constants";
import { PaperClipOutlined } from "@ant-design/icons";
import { CheckCard, ProCard, StepsForm } from "@ant-design/pro-components";
import { Button, Col, Divider, Flex, message, Modal, Row } from "antd";
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
    endpoint: API_PRFORMAS_ENDPOINT,
  });

  const { data: containers, refetch: refetchTcs } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: `GET_PROFORMA_TCS`,
    params: {
      article__id: article.id,
      all: true,
      billed: false,
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
        + Proforma
      </Button>
      <Modal
        title="+ Proforma"
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
              const date = new Date(values["date_proforma"]);
              values["date_proforma"] = date.toISOString().split("T")[0];
              values["article"] = article?.id;
              values["gros"] = article?.gros?.id;
              values["tcs"] = selectedContainers;
              console.log(values);
              mutate(values);
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
              title="Proforma"
              onFinish={async () => {
                setLoading(true);
                setLoading(false);
                return true;
              }}
            >
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
            </StepsForm.StepForm>
            <StepsForm.StepForm name="checkbox" title="Conteneurs">
              <CheckCard.Group
                multiple
                onChange={(value: any) => {
                  setSelectedContainers(value);
                }}
                size="small"
              >
                <Flex
                  wrap
                  justify="start"
                  style={{ height: "300px", overflow: "scroll" }}
                  align="flex-start"
                  vertical
                  gap={8}
                >
                  {containers?.data?.map((item: any) => {
                    return (
                      <CheckCard
                        size="large"
                        title={item?.tc}
                        value={item?.id}
                        avatar={<PaperClipOutlined />}
                        style={{height:"fit-content"}}
                      />
                    );
                  })}
                </Flex>
              </CheckCard.Group>
            </StepsForm.StepForm>
          </StepsForm>
        </ProCard>
      </Modal>
    </>
  );
};
