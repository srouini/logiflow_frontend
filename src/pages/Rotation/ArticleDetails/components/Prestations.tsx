import DraggableModel from "@/components/DraggableModel";
import useFraisPortuaire from "@/hooks/useFraisPortuaire";
import useImmobilisation from "@/hooks/useImmobilisation";
import FormObject from "@/components/Form";
import { DiffOutlined } from "@ant-design/icons";
import { Card, Divider, Flex, Form, message, Row } from "antd";
import { useState } from "react";
import FormField from "@/components/form/FormField";
import { API_PRESTATIONS_OCCASIONNELLE_ENDPOINT } from "@/api/api";
import usePost from "@/hooks/usePost";

interface Props {
  article: string | undefined;
}

function calculateTotalPrix(data: any) {
  return data?.reduce(
    (total: any, item: any) => total + parseFloat(item?.prix),
    0
  );
}

const Prestations = ({ article }: Props) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const { data: immobilisations, refetch: RefetchImmobilisation } =
    useImmobilisation({ article });

  const { data: fraisPortuaires, refetch: RefetchFraisPortuaires } =
    useFraisPortuaire({ article });

  const onSuccess = () => {
    message.success("Submission successful");
    RefetchImmobilisation();
    RefetchFraisPortuaires();
  };

  const { mutate, isLoading: isPostingPrestation } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PRESTATIONS_OCCASIONNELLE_ENDPOINT + "create-prestations/",
  });

  const today = new Date().toISOString().split("T")[0];
  const handlePrestationFormSubmission = async () => {
    let values = await form.validateFields();

    let prestation = {
      article: article,
      date: today,
      sum: values?.prix,
      rubrique: values?.rubrique,
    };
    mutate(prestation);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  return (
    <DraggableModel
      onSubmit={handlePrestationFormSubmission}
      OkButtontext="soumettre"
      addButtonType="dashed"
      addButtonIcon={<DiffOutlined />}
      modalOpenButtonText={"Préstations"}
      modalTitle="Préstations Occasionnelle"
      setOpen={setOpen}
      open={open}
      width={400}
      isLoading={isPostingPrestation}
    >
      <Card
        style={{ marginBottom: "10px", marginTop: "30px" }}
        size="small"
        onClick={showDrawer}
      >
        <Flex justify="space-between">
          <Row align={"middle"}>IMMOBILISATION</Row>
          <Row gutter={12} style={{ paddingRight: "20px" }}>
            {calculateTotalPrix(immobilisations?.data?.results)} DA
          </Row>
        </Flex>
      </Card>
      <Card style={{ marginBottom: "20px" }} size="small">
        <Flex justify="space-between">
          <Row align={"middle"}>FRAIS PORTUAIRES</Row>
          <Row gutter={12} style={{ paddingRight: "20px" }}>
            {calculateTotalPrix(fraisPortuaires?.data?.results)} DA
          </Row>
        </Flex>
      </Card>
      <Divider style={{ marginBottom: "0px" }} />
      <FormObject form={form}>
        <Row gutter={24}>
          <FormField
            label="Rubrique"
            name="rubrique"
            span_md={24}
            type="select"
            required
            option_label="label"
            option_value="value"
            options={[
              { value: "IMMOBILISATION", label: "IMMOBILISATION" },
              { value: "FRAIS PORTUAIRES", label: "FRAIS PORTUAIRES" },
            ]}
          />
          <FormField
            label="Total"
            name="prix"
            span={24}
            span_md={24}
            step={0.01}
            type="number"
            required
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default Prestations;
