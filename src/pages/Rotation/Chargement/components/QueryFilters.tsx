import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { useEffect } from "react";

import { selectConfig } from "../../../../utils/config";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { YES_NO_CHOICES } from "@/utils/constants";
import { transformSelectFilter } from "@/utils/functions";
import FilterSelect from "@/components/filterFields/FilterSelect";
import { Card } from "antd";
import FilterDateRange from "@/components/filterFields/FilterDateRange";

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
  const { mrn } = useReferenceContext();

  useEffect(() => {
    mrn?.fetch();
  }, []);

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

        <ProFormSelect
          {...selectConfig}
          options={mrn?.results}
          label="Mrn"
          name="gros"
          mode="multiple"
          fieldProps={{
            fieldNames: { label: "gros", value: "id" },
            maxTagCount: 'responsive',
          }}
          transform={(value) =>
            transformSelectFilter("multiple", "gros", value)
          }
        />
        <ProFormDatePicker name="date_creation" label="Date" />
        <ProFormSelect
          {...selectConfig}
          options={YES_NO_CHOICES}
          label="Reçu"
          name="receved"
          mode="single"
        />
                <ProFormSelect
          {...selectConfig}
          options={YES_NO_CHOICES}
          label="Chargé"
          name="loaded"
          mode="single"
        />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
