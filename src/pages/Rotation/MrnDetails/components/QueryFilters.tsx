import {
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
  const { client, transitaire } = useReferenceContext();

  useEffect(() => {
    client?.fetch();
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
        <ProFormText name="numero" label="Numéro" />
        <FilterSelect
          label="Client"
          name="client"
          mode="multiple"
          data={client?.results}
          option_value="id"
          option_label="raison_sociale"
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
        <ProFormSelect
          {...selectConfig}
          // @ts-ignore
          options={YES_NO_CHOICES}
          label="Groupage"
          name="groupage"
          mode="single"
        />
        <ProFormSelect
          {...selectConfig}
          // @ts-ignore
          options={YES_NO_CHOICES}
          label="Depoté"
          name="depote"
          mode="single"
        />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
