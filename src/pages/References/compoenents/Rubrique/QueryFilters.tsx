import {
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
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

  const TYPES_CALCULE = [
    { value: 'Calcule par unité TC' },
    { value: 'Calcule par unité JOUR' },
    { value: 'Calcule par unité TC X JOUR' },
    { value: 'Calcule par unité ARTICLE' },
    { value: 'A la demande' },
  ]
  const CATEGORIES = [
    { value: 'Automatique' },
    { value: 'Préstation occasionnelle' },
    { value: 'Visite' },   
  ]
  return (
    <Card style={{ marginBottom: "20px" }}>

      <QueryFilter
        split
        onFinish={handleSubmission}
        onReset={resetFilters}

        style={{ padding: "0px" }}
        defaultCollapsed={collapsed}
      >
        <ProFormText name="designation__icontains" label="Désignation" />
        <ProFormSelect
          options={TYPES_CALCULE}
          fieldProps={{
            fieldNames: { label: "value", value: "value" },
          }}
          name="type_calcule__exact"
          label="Type"
        />
        <ProFormSelect
          options={CATEGORIES}
          fieldProps={{
            fieldNames: { label: "value", value: "value" },
          }}
          name="categorie__exact"
          label="Catégorie"
        />

      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
