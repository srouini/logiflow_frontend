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
  const { containerType, rubrique } = useReferenceContext();
  useEffect(() => {
    containerType.fetch();
    rubrique.fetch();
  }, []);

  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };
  

  return (
    <QueryFilter
      onFinish={handleSubmission}
      onReset={resetFilters}
      style={{ padding: "0px", marginBottom: "15px", marginTop: "15px" }} 
      defaultCollapsed={false}
    >
      <ProFormSelect
        name="type_tc__id"
        label="Type"
        mode="single"
        options={containerType?.results}
        fieldProps={{
          fieldNames: { label: "designation", value: "id" },
        }}
      />

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
        // @ts-ignore
        options={YES_NO_CHOICES}
        label="GROUPAGE"
        name="groupage"
        mode="single"
      />


      <ProFormSelect
        name="rubrique"
        label="Rubrique"
        mode="multiple"
        options={rubrique?.results?.filter((rubrique: any) => rubrique?.categorie === "Automatique")}
        fieldProps={{
          fieldNames: { label: "designation", value: "id" },
        }}
        transform={(value) => transformSelectFilter("multiple", "rubrique", value)}
      />

    </QueryFilter>
  );
};

export default QueryFilters;
