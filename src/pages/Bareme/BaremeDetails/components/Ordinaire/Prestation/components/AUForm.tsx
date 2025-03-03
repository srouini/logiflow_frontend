import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Col, Form, message } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_PRESTATIONS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { YES_NO_CHOICES } from "@/utils/constants";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Bareme } from "@/types/bareme";
import { ProFormSelect } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  bareme: Bareme | undefined;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  bareme,
  editText = "MODIFIER",
  addText = "Prestation",
  hasIcon = <PlusOutlined />,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { containerType, rubrique } = useReferenceContext();

  console.log(rubrique)
  useEffect(() => {
    containerType?.fetch();
    rubrique?.fetch();
  }, []);


  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    const selectedTypes = values.type_tc;
    const selectedDangereux = values.dangereux;
    const selectedGroupage = values.groupage;
    const selectedFrigo = values.frigo;
    const selectedRubrique = values.rubrique;
    
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    values.bareme = parseInt(bareme?.id);

    // Create combinations of all selected options
    const typesToProcess = Array.isArray(selectedTypes) ? selectedTypes : [selectedTypes];
    const dangereuxToProcess = Array.isArray(selectedDangereux) ? selectedDangereux : [selectedDangereux];
    const groupageToProcess = Array.isArray(selectedGroupage) ? selectedGroupage : [selectedGroupage];
    const frigoToProcess = Array.isArray(selectedFrigo) ? selectedFrigo : [selectedFrigo];
    const rubriqueToProcess = Array.isArray(selectedRubrique) ? selectedRubrique : [selectedRubrique];

    // Create a prestation for each combination
    for (const typeId of typesToProcess) {
      for (const dangereuxValue of dangereuxToProcess) {
        for (const groupageValue of groupageToProcess) {
            for (const frigoValue of frigoToProcess) {
              for (const rubriqueId of rubriqueToProcess) {
                const prestationValues = {
                  ...values,
                  type_tc: typeId,
                  dangereux: dangereuxValue,
                  groupage: groupageValue,
                  frigo: frigoValue,
                  rubrique: rubriqueId
                };
                await mutate(prestationValues);
              }
            }
          }
      }
    }
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_PRESTATIONS_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Soumettre"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Prestation"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={500}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={initialvalues? mapInitialValues(initialvalues) : {debeur: false,dangereux: true, groupage: false,frigo:false}}>

        <ProFormSelect
          name="rubrique"
          label="Rubrique"
          mode="multiple"
          fieldProps={selectConfig}
          options={rubrique?.results?.map((item: any) => ({
            label: item.designation,
            value: item.id,
          }))}
        />
  
      <Col span={24} md={24}>
          <ProFormSelect
          name="type_tc"
          label="Type"
          mode="multiple"
          fieldProps={selectConfig}
          options={containerType?.results?.map((item: any) => ({
            label: item.designation,
            value: item.id,
          }))}
        />
        </Col>

        <ProFormSelect
          name="groupage"
          label="Groupage"
          mode="multiple"
          fieldProps={selectConfig}
          options={YES_NO_CHOICES.map((item: any) => ({
            label: item.label,
            value: item.value,
          }))}
        />
        <ProFormSelect
          name="dangereux"
          label="DGX"
          mode="multiple"
          fieldProps={selectConfig}
          options={YES_NO_CHOICES.map((item: any) => ({
            label: item.label,
            value: item.value,
          }))}
        />
        <ProFormSelect
          name="frigo"
          label="FRIGO"
          mode="multiple"
          fieldProps={selectConfig}
          options={YES_NO_CHOICES.map((item: any) => ({
            label: item.label,
            value: item.value,
          }))}
        />
        <FormField span_md={24} name="prix" label="Prix" type="number" step={0.01} />

      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
