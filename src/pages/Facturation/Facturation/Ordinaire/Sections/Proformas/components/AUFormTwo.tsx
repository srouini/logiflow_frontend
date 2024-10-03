import { API_PRFORMAS_ENDPOINT } from '@/api/api';
import FormField from '@/components/form/FormField';
import usePost from '@/hooks/usePost';
import { YES_NO_CHOICES } from '@/utils/constants';
import { formatDate } from '@/utils/functions';
import { PaperClipOutlined } from '@ant-design/icons';
import {
  CheckCard,
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Button, Divider, Flex, message, Modal, Row } from 'antd';
import { useRef, useState } from 'react';

interface AUFormProps {
  article:any,
  containers: any;
  refetch: () => void;
}

export default ({containers,article,refetch}:AUFormProps) => {
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

  const onSuccess = () => {
    message.success("Submission successful");
    setIsModalOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PRFORMAS_ENDPOINT,
  });
 
  const [selectedContainers, setSelectedContainers] = useState([]);
  return (
    <>
    <Button type="default" onClick={showModal}>
    + Proforma
  </Button>
  <Modal title="+ Proforma" destroyOnClose width={600} footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
    <ProCard>
      <StepsForm
        onFinish={async (values:any) => {
          const date = new Date(values["date_proforma"]);
          values["date_proforma"] = date.toISOString().split('T')[0];;
          values["article"] = article?.id;
          values["gros"] = article?.gros?.id;
          values["tcs"] = selectedContainers;
          console.log(values)
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
                rest
              </Button>,
              step > 0 && (
                <Button
                  key="pre"
                  onClick={() => {
                    onPre?.();
                  }}
                >
                  pre
                </Button>
              ),
              <Button
                key="next"
                loading={loading}
                type="primary"
                onClick={() => {
                  onSubmit?.();
                }}
              >
                next
              </Button>,
            ];
          },
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
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
        </StepsForm.StepForm>

      </StepsForm>
    </ProCard>
    </Modal>
    </>
  );
};