import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { useEffect } from "react";
import { selectConfig } from "@/utils/config";
import { useReferenceContext } from "@/context/ReferenceContext";
import { YES_NO_CHOICES } from "@/utils/constants";
import {
  transformRangeDateFilter,
  transformSelectFilter,
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
  const { mrn, transitaire } = useReferenceContext();

  useEffect(() => {
    mrn?.fetch();
    transitaire?.fetch();
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
            maxTagCount: "responsive",
          }}
          transform={(value) =>
            transformSelectFilter("multiple", "gros", value)
          }
        />
        <ProFormSelect
          {...selectConfig}
          options={transitaire?.results}
          label="Transitaire"
          name="transitaire"
          mode="multiple"
          fieldProps={{
            fieldNames: { label: "raison_sociale", value: "id" },
            maxTagCount: "responsive",
          }}
          transform={(value) =>
            transformSelectFilter("multiple", "transitaire", value)
          }
        />
        <ProFormDatePicker name="date_visite" label="Date" />
        <ProFormDateRangePicker
          name="date_visite__range"
          label="Date"
          transform={(value) => transformRangeDateFilter("date_visite", value)}
        />
        <ProFormText name="badge__exact" label="Badge" />

      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
