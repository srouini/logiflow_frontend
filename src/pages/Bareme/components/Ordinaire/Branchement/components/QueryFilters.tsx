import { Form } from "antd";
import FormField from "@/components/form/FormField";
import { useReferenceContext } from "@/context/ReferenceContext";
import { useEffect } from "react";

interface QueryFiltersProps {
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
}

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
}) => {
  const [form] = Form.useForm();
  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType?.fetch();
  }, []);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setPage(1);
    setFilters(allValues);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onValuesChange={handleValuesChange}
      style={{ marginBottom: "1rem" }}
    >
      <div style={{ display: "flex", gap: "1rem" }}>
        <FormField
          name="type_tc"
          label="Type"
          type="select"
          options={containerType?.results}
          option_label="designation"
          allowClear
          style={{ minWidth: "200px" }}
        />
      </div>
    </Form>
  );
};

export default QueryFilters;
