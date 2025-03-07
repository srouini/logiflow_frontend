import {
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { useEffect } from "react";

import { transformSelectFilter } from "@/utils/functions";
import { selectConfig } from "@/utils/config";
import { useReferenceContext } from "@/context/ReferenceContext";
import { YES_NO_CHOICES } from "@/utils/constants";
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
  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType.fetch();
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
        <ProFormText name="tc__icontains" label="Numéro" />
  
        <ProFormSelect
          {...selectConfig}
          // @ts-ignore
          options={YES_NO_CHOICES}
          label="Dangereux"
          name="dangereux"
          mode="single"
        />

        <ProFormSelect
          {...selectConfig}
           // @ts-ignore
          options={YES_NO_CHOICES}
          label="Frigo"
          name="frigo"
          mode="single"
        />
        <ProFormSelect
          {...selectConfig}
          options={containerType?.results}
          label="Type"
          name="type_tc"
          fieldProps={{
            fieldNames: { label: "designation", value: "id" },
            maxTagCount: 'responsive',
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter("multiple", "type_tc", value)
          }
        />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
