import {
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
  collapsed?: boolean;
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
  collapsed = true,
}) => {
  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };

  const { client,mrn } = useReferenceContext();

  useEffect(() => {
    client.fetch();
    mrn.fetch();
  }, []);

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
        <ProFormDateRangePicker
          name="date_creation__range"
          label="Date"
          transform={(value) =>
            transformRangeDateFilter("date_creation", value)
          }
        />
          <ProFormSelect
          {...selectConfig}
          options={mrn?.results}
          label="Mrn"
          name="article__gros__in"
          mode="multiple"
          fieldProps={{
            fieldNames: { label: "gros", value: "id" },
            maxTagCount: "responsive",
          }}
          transform={(value) =>
            transformSelectFilter("multiple", "article__gros", value)
          }
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
            transformSelectFilter("multiple", "article__client", value)
          }
        />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
