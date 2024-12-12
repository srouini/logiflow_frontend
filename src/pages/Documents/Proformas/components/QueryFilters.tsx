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
  collapsed?: boolean;
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
  collapsed = true,
}) => {
  const { client } = useReferenceContext();

  useEffect(() => {
    client.fetch();
  }, []);

  const handleSubmission = (values: any) => {
    if (values["state"]) {
      if (values["state"] === "valide") {
        values["valide"] = true;
      }
      if (values["state"] === "none_valide") {
        values["valide"] = false;
      }
      if (values["state"] === "trashed") {
        values["trashed"] = true;
      }
      delete values["state"];
    }
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
        <ProFormText name="numero__icontains" label="Numéro" />
        <ProFormSelect
          {...selectConfig}
          options={[
            { label: "Valide", value: "valide" },
            { label: "Non Valide", value: "none_valide" },
            { label: "Annulé", value: "trashed" },
          ]}
          label="Etat"
          name="state"
          fieldProps={{
            fieldNames: { label: "label", value: "value" },
            maxTagCount: "responsive",
          }}
          mode="single"
        />
        <ProFormSelect
          {...selectConfig}
          options={client?.results}
          label="Client"
          name="article__client__in"
          fieldProps={{
            fieldNames: { label: "raison_sociale", value: "id" },
            maxTagCount: "responsive",
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter(
              "multiple",
              "article__client",
              value
            )
          }
        />
        <ProFormDatePicker name="date_proforma" label="Date" />
        <ProFormDateRangePicker
          name="date_proforma__range"
          label="Date"
          transform={(value) =>
            transformRangeDateFilter("date_proforma", value)
          }
        />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
