import { useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Col, Divider, Form,  message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { API_BONS_SORTIE_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined } from "@ant-design/icons";
import { BonSortie } from "@/types/billing";

interface AUFormProps {
  refetch: () => void;
  bon_sortie: BonSortie;
}

const AUFormUpdate: React.FC<AUFormProps> = ({ refetch, bon_sortie }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    const final_value =  {
      id:bon_sortie?.id,
      d10:values?.d10,
      badge:values?.badge,
      bon_sortie_items : 
        bon_sortie?.bon_sortie_items?.map((item:any) => {
          return {
            id:item?.id,
            tc: item?.tc, 
            matricule: values[item?.tc]
          }
        })
      
    }
    mutate(final_value);
    setOpen(false)
  };

  const onSuccess = async () => {
    message.success("Submission successful");
    setOpen(false);
    await refetch();
    form.resetFields();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_BONS_SORTIE_ENDPOINT,
  });


  return (
    <DraggableModel
      // disabledModalOpenButton={!facture?.a_terme && !facture?.paid}
      OkButtontext="Submit"
      modalOpenButtonText=""
      modalTitle="Bon Livraison"
      addButtonType="dashed"
      addButtonIcon={<EditOutlined />}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
    >
      <FormObject form={form}>
        <Row gutter={24}>
          <FormField type="text" name="d10" label="D10" required initialValue={bon_sortie?.d10}></FormField>
          <FormField
          initialValue={bon_sortie?.badge}
            type="text"
            name="badge"
            label="Badge"
            required
          ></FormField>

          <Divider style={{ marginTop: "0px" }} />
          {bon_sortie?.bon_sortie_items?.map((item: any) => {
            return <Row style={{width:"100%"}} gutter={8}>
              <Col span={12} md={12}>
                <FormField span_md={24} initialValue={item?.matricule_tc} disabled span={24} label="Matricule" name="matricule" type="select" option_label="matricule" option_value="tc"  />
              </Col>
              <Col span={12} md={12}>
                <FormField span_md={24} initialValue={item?.matricule} required span={24} label="Camion" name={item.tc} type="text" />
              </Col>
            </Row>;
          })}
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUFormUpdate;
