import {
  API_CONTENEURS_ENDPOINT,
  API_PRESTATIONS_OCCASIONNELLE_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import { useReferenceContext } from "@/context/ReferenceContext";
import useData from "@/hooks/useData";
import usePost from "@/hooks/usePost";
import { removeDuplicatedRubriques } from "@/utils/functions";
import { PaperClipOutlined } from "@ant-design/icons";
import { CheckCard, ProCard, StepsForm } from "@ant-design/pro-components";
import { Button, Flex, message, Modal, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface AUFormProps {
  article: any;
  refetch: () => void;
}

export default ({ article, refetch }: AUFormProps) => {
  // @ts-ignore
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { rubrique } = useReferenceContext();

  useEffect(() => {
    rubrique.fetch();
  }, []);

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
    endpoint: API_PRESTATIONS_OCCASIONNELLE_ENDPOINT,
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
        + Prestation occasionnelle
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
              selectedContainers?.map((container: any) => {
                mutate({
                  rubrique: values["rubrique"],
                  tc: container,
                  date: dayjs(values["date"]).format("YYYY-MM-DD"),
                  prix: values["prix"],
                });
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
              title="Prestation occasionnelle"
              onFinish={async () => {
                setLoading(true);
                setLoading(false);
                return true;
              }}
            >
              <Row gutter={24}>
                <FormField
                  label="Rubrique"
                  name="rubrique"
                  span={24}
                  required
                  initialValue={null}
                  span_md={24}
                  type="select"
                  option_label="designation"
                  option_value="designation"
                  options={removeDuplicatedRubriques(rubrique?.results)}
                />
                <FormField
                  required
                  span_md={24}
                  span={24}
                  type="date"
                  name="date"
                  label="Date"
                ></FormField>
                <FormField
                  label="Tarif"
                  name="prix"
                  required
                  span={24}
                  step={0.01}
                  span_md={24}
                  type="number"
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
