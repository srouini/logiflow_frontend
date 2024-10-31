import { useEffect, useState } from "react";
import { Flex, Form, message } from "antd";
import usePost from "../../../../../hooks/usePost";
import { useReferenceContext } from "../../../../../context/ReferenceContext";
import { API_CONTENEURS_ENDPOINT, API_SOUSARTICLES_ENDPOINT } from "@/api/api";
import { ProForm, ProFormSelect } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";



interface AUFormProps {
  refetch: () => void;
  sous_article: any;
}

const AUForm = ({ refetch, sous_article }:AUFormProps) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { transitaire } = useReferenceContext();

  useEffect(() => {
    transitaire.fetch();
  }, []);

  const {} = useReferenceContext();

  const handleFormSubmission = async () => {
    let values = await form.validateFields();

    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_SOUSARTICLES_ENDPOINT,
  });

  const handleChange = (value: any) => {
    console.log(value)
    if (value) {
      let values = { 'id': sous_article.id, 'transitaire': value };
      mutate(values);
    }
  };

  useEffect(() => {
    if (sous_article?.transitaire) {
      form.setFieldsValue({ transitaire: sous_article.transitaire.id });
    }
  }, [sous_article, form]);

  

  return (
    <Form form={form}>
    <Flex align="baseline">
      <ProFormSelect
        disabled={sous_article?.billed}
            {...selectConfig}
            width="lg"
            // onChange={onChange}
            options={transitaire?.results}
            onChange={handleChange}
            label="Transitaire"
            name="transitaire"
            fieldProps={{
              fieldNames: { label: "raison_sociale", value: "id" },
              maxTagCount: 'responsive',
              loading: isLoading,
            }}
            style={{minWidth:"250px"}}
          />
     </Flex>
     </Form >
  );


};

export default AUForm;
