import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { useEffect } from "react";

import {
  transformRangeDateFilter,
  transformSelectFilter,
} from "@/utils/functions";
import { selectConfig } from "@/utils/config";
import { useReferenceContext } from "@/context/ReferenceContext";
import { Card } from "antd";

type QueryFiltersProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<number>>;
  resetFilters: () => void;
  collapsed?: boolean
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
  collapsed=true
}) => {
  const { client,mrn } = useReferenceContext();

  useEffect(() => {
    client?.fetch();
    mrn?.fetch();
  }, []);

  const handleSubmission = (values: any) => {
    if (values["state"]) {
      if (values["state"] === "paid") {
        values["paid"] = true;
      }
      if (values["state"] === "not_paid") {
        values["paid"] = false;
      }
      delete values["state"];
    }
    setPage(1);
    setFilters(values);
  };

  return (
    <Card style={{ marginBottom: "20px" }}>
      <QueryFilter
        defaultCollapsed={collapsed}
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
      >
        <ProFormText name="numero__icontains" label="Numéro" />
        <ProFormSelect
          {...selectConfig}
          options={[
            { label: "Payée", value: "paid" },
            { label: "Non Payée", value: "not_paid" },
          ]}
          label="Etat"
          name="state"
          fieldProps={{
            fieldNames: { label: "label", value: "value" },
            maxTagCount: 'responsive',
          }}
          mode="single"
        />
        <ProFormSelect
          
          {...selectConfig}
          options={mrn?.results}
          label="Mrn"
          name="proforma__gros__in"
          fieldProps={{
            fieldNames: { label: "gros", value: "id" },
            maxTagCount: 'responsive',
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter("multiple", "proforma__gros", value)
          }
        />

        
        <ProFormDatePicker name="proforma__date_proforma" label="Date" />
        <ProFormDateRangePicker
          name="proforma__date_proforma__range"
          label="Date"
          transform={(value) => transformRangeDateFilter("proforma__date_proforma", value)}
        />
         <ProFormSelect
          {...selectConfig}
          options={client?.results}
          label="Groupeur"
          name="proforma__article__client__in"
          fieldProps={{
            fieldNames: { label: "raison_sociale", value: "id" },
            maxTagCount: "responsive",
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter(
              "multiple",
              "proforma__article__client",
              value
            )
          }
        />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
