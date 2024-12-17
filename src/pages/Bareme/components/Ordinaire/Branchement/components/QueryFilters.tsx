import { Button, Form } from "antd";
import { useReferenceContext } from "@/context/ReferenceContext";
import { useEffect } from "react";
import { LightFilter, ProFormSelect } from "@ant-design/pro-components";

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
  const { containerType } = useReferenceContext();
  const [form] = Form.useForm();

  useEffect(() => {
    containerType?.fetch();
  }, []);


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
      onFinish={handleSubmission}
      onReset={resetFilters}
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
      <Button onClick={handleClear} type="default">
        Clear Filters
      </Button>
    </LightFilter>
  );
};

export default QueryFilters;
