import { Button, Form } from "antd";
import { LightFilter, ProFormSwitch } from "@ant-design/pro-components";

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

  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };
  const handleClear = () => {
    // Reset all form fields
    form.resetFields();
    setFilters([])
  };
  return (
    <LightFilter
      form={form}
      onFinish={handleSubmission}
      onReset={resetFilters}
      style={{ padding: "0px", marginBottom: "15px" }}
    >
      <ProFormSwitch name="dangereux" label="DGX" allowClear />
      <Button onClick={handleClear} type="default">
        Clear Filters
      </Button>
    </LightFilter>

  );
};

export default QueryFilters;
