import { Form } from "antd";
import FormField from "@/components/form/FormField";
import { useEffect } from "react";
import { YES_NO_CHOICES } from "@/utils/constants";

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
          name="dangereux"
          label="Dangereux"
          type="select"
          options={YES_NO_CHOICES}
          allowClear
          style={{ minWidth: "200px" }}
        />
      </div>
    </Form>
  );
};

export default QueryFilters;
