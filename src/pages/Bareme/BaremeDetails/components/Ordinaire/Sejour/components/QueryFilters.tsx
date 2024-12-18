import { Button, Form } from "antd";
import FormField from "@/components/form/FormField";
import { useReferenceContext } from "@/context/ReferenceContext";
import { useEffect } from "react";
import { YES_NO_CHOICES } from "@/utils/constants";
import { LightFilter, ProFormSelect, ProFormSwitch, QueryFilter } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";

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

  useEffect(() => {
    containerType?.fetch();
  }, []);

  const handleSubmission = (allValues: any) => {
    setPage(1);
    setFilters(allValues);
  };


  return (
    <QueryFilter
      onFinish={handleSubmission}
      style={{ padding: "0px", marginBottom: "15px", marginTop: "15px" }}
      defaultCollapsed={false}
      onReset={resetFilters}
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
           <ProFormSelect
        {...selectConfig}
        // @ts-ignore
        options={YES_NO_CHOICES}
        label="Dangereux"
        name="dangereux"
        mode="single"
      />

      <ProFormSelect
        {...selectConfig}
        // @ts-ignore
        options={YES_NO_CHOICES}
        label="Frigo"
        name="frigo"
        mode="single"
      />

    </QueryFilter>
  );
};

export default QueryFilters;
