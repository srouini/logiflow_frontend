import { useEffect } from "react";
import { Flex, Form, message } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import {
  API_BULLETINS_ENDPOINT,
} from "@/api/api";
import { ProFormSelect } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";


interface AUFormProps {
  refetch: () => void;
  bulletin: any;
}

const UpdateDouanier = ({ refetch, bulletin }: AUFormProps) => {
  const [form] = Form.useForm();

  const { AgentDouane } = useReferenceContext();

  useEffect(() => {
    AgentDouane.fetch();
  }, []);

  const onSuccess = () => {
    message.success("Le barème a été mis à jour avec succès");
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_BULLETINS_ENDPOINT,
  });

  const handleChange = (value: any) => {
    if (value) {
      let values = { id: bulletin?.id, douanier: value };
      mutate(values);
    }
  };

  useEffect(() => {
    if (bulletin?.douanier) {
      form.setFieldsValue({ douanier: bulletin.douanier });
    }
  }, [bulletin, form]);

  return (
    <Form form={form}>
      <Flex align="baseline">
        <ProFormSelect
        disabled={bulletin?.receved}
          {...selectConfig}
          width="lg"
          // onChange={onChange}
          options={AgentDouane?.results}
          onChange={handleChange}
          label="Douanier de la réception"
          name="douanier"
          fieldProps={{
            fieldNames: { label: "full_name", value: "id" },
            maxTagCount: "responsive",
            loading: isLoading,
          }}
          style={{ minWidth: "250px" }}
        />
      </Flex>
    </Form>
  );
};

export default UpdateDouanier;
