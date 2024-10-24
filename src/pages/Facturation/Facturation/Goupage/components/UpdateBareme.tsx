import { useEffect, useState } from "react";
import { Flex, Form, message } from "antd";
import usePost from "../../../../../hooks/usePost";
import { useReferenceContext } from "../../../../../context/ReferenceContext";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import { ProForm, ProFormSelect } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";



interface AUFormProps {
  refetch: () => void;
  sous_article: any;
}

const AUForm = ({ refetch, sous_article }:AUFormProps) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { bareme } = useReferenceContext();

  useEffect(() => {
    bareme.fetch();
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
    endpoint: API_CONTENEURS_ENDPOINT,
  });

  const handleChange = (value:any) => {
    message.success(value)
  }

  console.log(sous_article?.tc?.article?.client?.bareme)

  useEffect(() => {
    if (sous_article?.tc?.article?.client?.bareme) {
      form.setFieldsValue({ bareme: sous_article.tc.article.client.bareme });
    }
  }, [sous_article, form]);
  
  return (
    <Form form={form}>
  <Flex align="baseline">
      <ProFormSelect
            {...selectConfig}
            width="lg"
            // onChange={onChange}
            options={bareme?.results}
            onChange={handleChange}
           
            label="Bareme"
            name="bareme"
            fieldProps={{
              fieldNames: { label: "designation", value: "id" },
              maxTagCount: 'responsive',
            }}
            style={{minWidth:"250px"}}
          />
     </Flex>
     </Form >
  );


};

export default AUForm;
