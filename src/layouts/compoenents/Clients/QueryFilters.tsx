import {
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
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
        <ProFormText name="raison_sociale__icontains" label="Nom" />
        <ProFormText name="adress__icontains" label="Adresse" />
        <ProFormText name="email__icontains" label="Email" />
        <ProFormText name="tel__icontains" label="Tél" />
        <ProFormText name="code__icontains" label="Code" />
        <ProFormText name="RC__icontains" label="RC" />
        <ProFormText name="NIF__icontains" label="NIF" />
        <ProFormText name="AI__icontains" label="AI" />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
