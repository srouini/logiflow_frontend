import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";

import {
  transformRangeDateFilter,
} from "@/utils/functions";
import { Card } from "antd";

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

  const handleSubmission = (values: any) => {
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
        <ProFormText name="numero__icontains" label="Numéro" />
        <ProFormText name="facture__numero__icontains" label="Facture" />
        <ProFormText name="d10__icontains" label="D10" />
        <ProFormText name="badge__icontains" label="Badge" />
        <ProFormDatePicker name="date_sortie" label="Date sortie" />
        <ProFormDateRangePicker
          name="date_sortie__range"
          label="Date sortie"
          transform={(value) => transformRangeDateFilter("date_sortie", value)}
        />
        
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
