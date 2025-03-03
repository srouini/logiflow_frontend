import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import {
  Col,
  Divider,
  Form,
  message,
  Row,
} from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import {
  API_BONS_SORTIE_ENDPOINT,
  API_GROUPES_LIGNE_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import { PlusOutlined } from "@ant-design/icons";
import { Facture } from "@/types/billing";
import useData from "@/hooks/useData";
import useLoading from "@/hooks/useLoading";
import { usePermissions } from "@/utils/permissions";

interface AUFormProps {
  refetch: () => void;
  facture: Facture;
}

const AUForm: React.FC<AUFormProps> = ({ refetch, facture }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { banque } = useReferenceContext();

  useEffect(() => {
    banque?.fetch();
  }, []);

  useEffect(() => {
    if (open == true) {
      refetchContainers();
    }
  }, [open]);
  const {
    data,
    isLoading: isLoadingData,
    isRefetching: isRefetching,
    isFetching: isFetching,
    refetch: refetchContainers,
  } = useData({
    endpoint: API_GROUPES_LIGNE_ENDPOINT,
    name: `GET_BL_CONTAINERS_${facture?.id}`,
    params: {
      all: true,
      // @ts-ignore
      groupe__proforma__id: facture?.proforma?.id,
      omit: "groupe",
    },
    enabled: false,
  });

  const { isLoading: isLoadingContainers } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    const final_value = {
      d10: values?.d10,
      facture: facture?.id,
      badge: values?.badge,
      bon_sortie_items: data?.data?.map((item: any) => {
        return {
          tc: item?.tc,
          matricule: values[item?.tc],
        };
      }),
    };
    mutate(final_value);
    setOpen(false);
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

  const hasPermission = usePermissions();

  return (
    <DraggableModel
      disabledModalOpenButton={(!facture?.a_terme && !facture?.paid) ||  !hasPermission('billing.add_bonsortie')}
      OkButtontext="Soumettre"
      modalOpenButtonText="Bon Livraison"
      modalTitle="Bon Livraison"
      addButtonType="dashed"
      addButtonIcon={<PlusOutlined />}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
    >
      <FormObject form={form}>
        <Row gutter={24}>
          <FormField type="text" name="d10" label="D10" required></FormField>
          <FormField
            type="text"
            name="badge"
            label="Badge"
            required
          ></FormField>

          
          <Divider style={{ marginTop: "0px" }} />
          {isLoadingContainers && "is loading..."}
          {data?.data?.map((item: any) => {
            return (
              <Row style={{ width: "100%" }} gutter={8}>
                <Col span={12} md={12}>
                  <FormField
                    span_md={24}
                    initialValue={item?.matricule}
                    disabled
                    span={24}
                    label="Matricule"
                    name="matricule"
                    type="select"
                    option_label="matricule"
                    option_value="tc"
                  />
                </Col>
                <Col span={12} md={12}>
                  <FormField
                    span_md={24}
                    required
                    span={24}
                    label="Camion"
                    name={item.tc}
                    type="text"
                  />
                </Col>
              </Row>
            );
          })}
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
