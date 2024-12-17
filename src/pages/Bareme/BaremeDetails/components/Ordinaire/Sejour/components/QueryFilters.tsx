import { Button, Form } from "antd";
import FormField from "@/components/form/FormField";
import { useReferenceContext } from "@/context/ReferenceContext";
import { useEffect } from "react";
import { YES_NO_CHOICES } from "@/utils/constants";
import { LightFilter, ProFormSelect, ProFormSwitch } from "@ant-design/pro-components";

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

  const handleSubmission = (allValues: any) => {
    setPage(1);
    setFilters(allValues);
  };

  const handleClear = () => {
    // Reset all form fields
    form.resetFields();
    resetFilters();
  };


  return (
    <LightFilter
      onFinish={handleSubmission}
      style={{ padding: "0px", marginBottom: "15px" }}
      form={form}
    >

      <ProFormSelect
        name="type_tc__id"
        label="Type"
        mode="single"
        options={containerType?.results}
        fieldProps={{
          fieldNames: { label: "designation", value: "id" },
        }}
      />
      <ProFormSwitch name="dangereux" label="DGX" />
      <ProFormSwitch name="frigo" label="FRIGO" />
      <Button onClick={handleClear} type="default">
        Clear Filters
      </Button>

    </LightFilter>
  );
};

export default QueryFilters;
