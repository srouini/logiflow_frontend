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
  const { containerType, rubrique } = useReferenceContext();
  const [form] = Form.useForm();
  useEffect(() => {
    containerType.fetch();
    rubrique.fetch();
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
      form={form}
      onFinish={handleSubmission}
      onReset={resetFilters}
      style={{ padding: "0px", marginBottom: "15px" }}
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

      <ProFormSwitch name="dangereux" label="DGX" allowClear />
      <ProFormSwitch name="frigo" label="FRIGO" />
      <ProFormSwitch name="groupage" label="GROUPAGE" />
      <ProFormSelect
        name="rubrique"
        label="Rubrique"
        mode="multiple"
        options={rubrique?.results?.filter((rubrique: any) => rubrique?.categorie === "Automatique")}
        fieldProps={{
          fieldNames: { label: "designation", value: "id" },
        }}
        transform={(value) => transformSelectFilter("multiple", "rubrique", value)}
      />
      <Button onClick={handleClear} type="default">
        Clear Filters
      </Button>
    </LightFilter>
  );
};

export default QueryFilters;
