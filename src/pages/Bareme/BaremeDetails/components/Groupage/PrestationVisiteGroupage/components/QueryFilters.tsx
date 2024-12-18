import { Button, Form } from "antd";
import { LightFilter, ProFormSelect, ProFormSwitch, QueryFilter } from "@ant-design/pro-components";
import { selectConfig } from "@/utils/config";
import { YES_NO_CHOICES } from "@/utils/constants";

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

  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };


  return (
    <QueryFilter
      onFinish={handleSubmission}
      onReset={resetFilters}
      style={{ padding: "0px", marginBottom: "15px", marginTop: "15px" }}
      defaultCollapsed={false}
    >
        <ProFormSelect
        {...selectConfig}
        // @ts-ignore
        options={YES_NO_CHOICES}
        label="Dangereux"
        name="dangereux"
        mode="single"
      />

    </QueryFilter>
  );
};

export default QueryFilters;
