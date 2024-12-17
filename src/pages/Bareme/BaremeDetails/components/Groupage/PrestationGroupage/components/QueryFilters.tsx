import { Button, Form } from "antd";
import { useReferenceContext } from "@/context/ReferenceContext";
import { useEffect } from "react";
import { LightFilter, ProFormSelect, ProFormSwitch } from "@ant-design/pro-components";
import { transformSelectFilter } from "@/utils/functions";

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
  const { rubrique, containerType } = useReferenceContext();

  useEffect(() => {
    rubrique?.fetch();
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
        name="rubrique"
        label="Rubrique"
        mode="multiple"
        showSearch
        options={rubrique?.results?.filter((rubrique: any) => rubrique?.categorie === "Automatique")}
        fieldProps={{
          fieldNames: { label: "designation", value: "id" },
        }}
        transform={(value) => transformSelectFilter("multiple", "rubrique", value)}
      />
      <ProFormSwitch name="dangereux" label="DGX" allowClear />

      <Button onClick={handleClear} type="default">
        Clear Filters
      </Button>
    </LightFilter>
  );
};

export default QueryFilters;
