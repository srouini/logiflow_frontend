import {
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

  return (
    <Card style={{ marginBottom: "20px" }}>

      <QueryFilter
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        
        style={{ padding: "0px" }}
        defaultCollapsed={collapsed}
      >
        <ProFormText name="raison_sociale__icontains" label="Nom" />
        <ProFormText name="adress__icontains" label="Adresse" />
        <ProFormText name="email__icontains" label="Email" />
        <ProFormText name="tel__icontains" label="Tél" />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
