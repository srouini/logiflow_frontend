import DraggableModel from "@/components/DraggableModel";
import usePost from "@/hooks/usePost";
import { Card, Col, Divider, Form, message, Row, Button, Flex, notification } from "antd";
import { useState } from "react";
import FormObject from "@/components/Form";
import { SnippetsOutlined } from "@ant-design/icons";
import { ProFormUploadDragger } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import { API_EDI_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import { formatStringDate } from "@/utils/functions";
import { useAxios } from "@/hooks/useAxios";
import { usePermissions } from "@/utils/permissions";

interface ChargementProps {
  refetch: () => void;
  mrn: number;
}

const Chargement = ({ refetch, mrn }: ChargementProps) => {

  const api = useAxios();

  const Generer = async (id: string) => {
    try {
      // @ts-ignore
      const response = await api.post(`${API_EDI_ENDPOINT}${id}/process_files/`);
      // Handle the response if necessary
      notification.success({
        message: `Files processed`,
        description: `Files processed successfully`,
        duration: 2,
      });

      setOpen(false);
      refetch();
      
    } catch (error) {
      // Handle errors here
      message.error('Error processing files');

  

      // Optionally, you can throw the error to handle it outside this function
      throw error;
    }
  };

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleFormSubmission = async () => {
    try {
      let values = await form.validateFields();

      const contaFiles = values.conta[0]?.originFileObj;
      const ligneFiles = values.ligne[0]?.originFileObj;

      const formData = new FormData();
      formData.append("conta", contaFiles);
      formData.append("ligne", ligneFiles);
      formData.append("mrn", String(mrn));

      mutate(formData);
    } catch (error) {
      message.error("Form validation failed");
    }
  };

  const onSuccess = () => {
    message.success("Submission successful");
    refetchEdis();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_EDI_ENDPOINT,
  });

  const {
    data,
    refetch: refetchEdis,
  } = useData({
    endpoint: API_EDI_ENDPOINT,
    name: "GET_ARTICLES",

    params: {
      mrn__in: mrn,
    },
  });

  const hasPermission = usePermissions();


  return (
    <DraggableModel
      OkButtontext="Submit"
      disabledModalOpenButton={!hasPermission('app.can_populate_gros')}
      modalOpenButtonText="EDI"
      modalTitle="EDI"
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={700}
      isLoading={isLoading}
      addButtonType="primary"
      addButtonIcon={<SnippetsOutlined />}
    >
      {data?.data?.map((item: any) => {
        return (
          <Card style={{ marginBottom: "20px" }} size="small">
            <Flex justify="space-between">
              <Row align={"middle"}>{formatStringDate(item?.created_at)}</Row>
              <Row gutter={12}>
                <Col>
                  <Button type="primary" onClick={() => Generer(item?.id)}> Générer</Button>
                </Col>
                <Col>
                  {" "}
                  <Delete
                    class_name="Edi"
                    refetch={refetchEdis}
                    url={API_EDI_ENDPOINT}
                    id={item.id}
                    link={false}
                    type="dashed"
                  />
                </Col>
              </Row>
            </Flex>
          </Card>
        );
      })}
      <Divider style={{ marginBottom: "0px" }} />
      <FormObject form={form}>
        <Row style={{ marginBottom: "30px" }}>
          Utilisez les fichiers EDI &nbsp;<b>CONTA</b>&nbsp; et &nbsp;
          <b>LIGNE</b>&nbsp; pour créer automatiquement les articles et les
          conteneurs.
        </Row>
        <Row gutter={12}>
          <Col span={24} md={12}>
            <ProFormUploadDragger
              max={1}
              name="conta"
              description=""
              title="Cliquez ou faites glisser le fichier CONTA"
            />
          </Col>
          <Col span={24} md={12}>
            <ProFormUploadDragger
              max={1}
              name="ligne"
              description=""
              title="Cliquez ou faites glisser le fichier LIGNE"
            />
          </Col>
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default Chargement;
