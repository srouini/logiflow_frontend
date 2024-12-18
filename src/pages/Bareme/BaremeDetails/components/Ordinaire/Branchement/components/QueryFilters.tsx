import { Button, Form } from "antd";
import { useReferenceContext } from "@/context/ReferenceContext";
import { useEffect } from "react";
import { LightFilter, ProFormSelect, QueryFilter } from "@ant-design/pro-components";

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


  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };


  return (


    <QueryFilter
      onFinish={handleSubmission}
      onReset={resetFilters}
      style={{ padding: "0px", marginBottom: "15px", marginTop: "15px" }}
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

    </QueryFilter>
  );
};

export default QueryFilters;
