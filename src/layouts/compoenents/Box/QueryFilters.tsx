import { useReferenceContext } from "@/context/ReferenceContext";
import {
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { Card } from "antd";
import { useEffect } from "react";

type QueryFiltersProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<number>>;
  resetFilters: () => void;
  collapsed?: boolean;
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
  collapsed = true,
}) => {
  const { parc } = useReferenceContext();

  useEffect(() => {
    parc?.fetch();
  }, []);

  const handleSubmission = (values: any) => {
    console.log(values)
    setPage(1);
    setFilters(values);
  };

  return (
    <Card style={{ marginBottom: "20px" }}>
      <QueryFilter
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
        defaultCollapsed={collapsed}
      >
        <ProFormSelect
          options={parc?.results}
          fieldProps={{
            fieldNames: { label: "designation", value: "id" },
          }}
          name="parc__id"
          label="Parc"
        />
        <ProFormText name="designation__icontains" label="Designation" />

      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
