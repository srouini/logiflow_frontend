import { useReferenceContext } from "@/context/ReferenceContext";
import {
  ProFormDigit,
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
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
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
        defaultCollapsed
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
      >
        <ProFormSelect
          options={parc?.results}
          fieldProps={{
            fieldNames: { label: "designation", value: "id" },
          }}
          name="parc__id"
          label="Parc"
        />
        <ProFormText name="zone__icontains" label="Zone" />
        <ProFormDigit name="lignes" label="Lignes" />
        <ProFormDigit name="ranges" label="Ranges" />
        <ProFormDigit name="gerbage" label="Gerbage" />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
