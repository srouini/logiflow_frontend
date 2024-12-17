import {
  LightFilter,
  ProFormSelect,
  ProFormSwitch,
} from "@ant-design/pro-components";
import { useEffect } from "react";

import {
  transformSelectFilter,
} from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { Button, Form } from "antd";

type QueryFiltersProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<number>>;
  resetFilters: () => void;
};

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
