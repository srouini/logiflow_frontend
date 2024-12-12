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
} from "../../../../utils/functions";
import { selectConfig } from "../../../../utils/config";
import { useReferenceContext } from "../../../../context/ReferenceContext";
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
  const { navire } = useReferenceContext();

  useEffect(() => {
    navire.fetch();
  }, []);

  const handleSubmission = (values: any) => {
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
        defaultdefaultCollapsed={collapsed}
      >
        <ProFormText name="numero__icontains" label="Numéro" />
        <ProFormText name="status" label="Status" />
        <ProFormText name="status" label="Status" />
        <ProFormText name="status" label="Status" />
        <ProFormDatePicker name="accostage" label="Accostage" />
        <ProFormDateRangePicker
          name="accostage__range"
          label="Accostage"
          transform={(value) => transformRangeDateFilter("accostage", value)}
        />
        <ProFormSelect
          {...selectConfig}
          options={navire.results}
          label="Navire"
          name="navire"
          fieldProps={{
            fieldNames: { label: "nom", value: "id" },
            maxTagCount: 'responsive',
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter("multiple", "navire", value)
          }
        />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
