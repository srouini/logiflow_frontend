import { Form } from "antd";
import { useReferenceContext } from "@/context/ReferenceContext";
import { useEffect } from "react";
import { ProFormSelect, QueryFilter } from "@ant-design/pro-components";
import { transformSelectFilter } from "@/utils/functions";
import { selectConfig } from "@/utils/config";
import { YES_NO_CHOICES } from "@/utils/constants";

interface QueryFiltersProps {
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
}

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
}) => {
  const [form] = Form.useForm();
  const { rubrique, containerType } = useReferenceContext();

  useEffect(() => {
    rubrique?.fetch();
    containerType?.fetch();
  }, []);

  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };

  return (
    <QueryFilter
      onFinish={handleSubmission}
      onReset={resetFilters}
      style={{ padding: "0px", marginBottom: "15px",marginTop: "15px" }}
      form={form}
      defaultCollapsed={false}
    >
      <ProFormSelect
        name="rubrique"
        label="Rubrique"
        mode="multiple"
        showSearch
        options={rubrique?.results?.filter((rubrique: any) => rubrique?.categorie === "Automatique")}
        fieldProps={{
          fieldNames: { label: "designation", value: "id" },
        }}
        transform={(value) => transformSelectFilter("multiple", "rubrique", value)}
      />

<ProFormSelect
        {...selectConfig}
        // @ts-ignore
        options={YES_NO_CHOICES}
        label="Dangereux"
        name="dangereux"
        mode="single"
      />

    </QueryFilter>
  );
};

export default QueryFilters;
