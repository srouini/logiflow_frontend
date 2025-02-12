import { useEffect } from "react";
import { Flex, Form, message } from "antd";
import usePost from "../../../../../hooks/usePost";
import { useReferenceContext } from "../../../../../context/ReferenceContext";
import {
  API_CLIENTS_ENDPOINT,
} from "@/api/api";
import { ProFormSelect } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";
import { usePermissions } from "@/utils/permissions";

interface AUFormProps {
  refetch: () => void;
  sous_article: any;
}

const AUForm = ({ refetch, sous_article }: AUFormProps) => {
  const [form] = Form.useForm();

  const { bareme } = useReferenceContext();

  useEffect(() => {
    bareme.fetch();
  }, []);

  const onSuccess = () => {
    message.success("Le barème a été mis à jour avec succès");
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CLIENTS_ENDPOINT,
  });

  const handleChange = (value: any) => {
    if (value) {
      let values = { id: sous_article.tc.article.client.id, bareme: value };
      mutate(values);
    }
  };

  useEffect(() => {
    if (sous_article?.tc?.article?.client?.bareme) {
      form.setFieldsValue({ bareme: sous_article.tc.article.client.bareme });
    }
  }, [sous_article, form]);

  const hasPermission = usePermissions();

  return (
    <Form form={form}>
      <Flex align="baseline">
        <ProFormSelect
        disabled={sous_article?.billed || !hasPermission('app.change_sousarticle')}
          {...selectConfig}
          width="lg"
          // onChange={onChange}
          options={bareme?.results}
          onChange={handleChange}
          label="Bareme"
          name="bareme"
          fieldProps={{
            fieldNames: { label: "designation", value: "id" },
            maxTagCount: "responsive",
            loading: isLoading,
          }}
          style={{ minWidth: "250px" }}
        />
      </Flex>
    </Form>
  );
};

export default AUForm;
