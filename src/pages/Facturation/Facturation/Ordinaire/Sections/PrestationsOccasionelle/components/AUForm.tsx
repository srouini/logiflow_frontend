import {
  API_CONTENEURS_ENDPOINT,
  API_PRESTATIONS_OCCASIONNELLE_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import { useReferenceContext } from "@/context/ReferenceContext";
import useData from "@/hooks/useData";
import usePost from "@/hooks/usePost";
import { removeDuplicatedRubriques } from "@/utils/functions";
import { PaperClipOutlined, PlusOutlined } from "@ant-design/icons";
import { CheckCard} from "@ant-design/pro-components";
import {  Divider, Form, message, Row, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { usePermissions } from "@/utils/permissions";
import { YES_NO_CHOICES } from "@/utils/constants";

interface AUFormProps {
  article: any;
  refetch: () => void;
}

export default ({ article, refetch }: AUFormProps) => {
  // @ts-ignore
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { rubrique } = useReferenceContext();

  useEffect(() => {
    rubrique.fetch();
  }, []);

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
      expand:"type_tc"
    },
  });

  const [selectedContainers, setSelectedContainers] = useState([]);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();

    selectedContainers?.map((container: any) => {
      mutate({
        rubrique: values["rubrique"],
        tc: container,
        date: dayjs(values["date"]).format("YYYY-MM-DD"),
        prix: values["prix"],
        debeur: values["debeur"]
      });
    });
  };

  const hasPermission = usePermissions();


  return (
    <>
      <DraggableModel
        OkButtontext="Soumettre"
        modalOpenButtonText="Prestation occasionnelles"
        disabledModalOpenButton={!hasPermission('bareme.add_prestationoccasionnelle')}
        addButtonIcon={<PlusOutlined />}
        modalTitle="+ Préstation occasionnelles"
        onSubmit={handleFormSubmission}
        setOpen={setIsModalOpen}
        open={isModalOpen}
        width={600}
        isLoading={isLoading}
      >
        <FormObject form={form} initialvalues={{ quantite: 1, debeur: false }}>
          <Divider dashed style={{ marginTop: "0px" }} />

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
              name="debeur"
              label="Debours"
              type="select"
              options={YES_NO_CHOICES}
              option_value="value"
              option_label="label"
              span_md={24}
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
