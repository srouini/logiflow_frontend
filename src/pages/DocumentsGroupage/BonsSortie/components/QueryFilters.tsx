import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";

import {
  transformRangeDateFilter,
  transformSelectFilter,
} from "@/utils/functions";
import { Card } from "antd";
import { selectConfig } from "@/utils/config";
import { useReferenceContext } from "@/context/ReferenceContext";
import { useEffect } from "react";

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
          options={client?.results}
          label="Groupeur"
          name="sous_article__tc__article__client__in"
          fieldProps={{
            fieldNames: { label: "raison_sociale", value: "id" },
            maxTagCount: "responsive",
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter(
              "multiple",
              "sous_article__tc__article__client",
              value
            )
          }
        />
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
