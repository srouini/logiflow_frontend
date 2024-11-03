import { Tag } from "antd";
import React from "react";

interface Column {
  key: string;
  title: string;
  selected?: boolean;
}

interface ColumnsSelectProps {
  columns: Column[];
  setSelectedColumns: (columns: Column[]) => void;
}

const ColumnsSelect: React.FC<ColumnsSelectProps> = ({
  columns,
  setSelectedColumns,
}) => {
  const handleTagClick = (key: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.key === key) {
        return { ...column, selected: !column.selected };
      }
      return column;
    });
    setSelectedColumns(updatedColumns);
  };

  return (
    <div>
      {columns?.map((column) => (
        <Tag
          key={column.key}
          onClick={() => handleTagClick(column.key)}
          color={column.selected ? "#219C90" : "#CDE8E5"}
          style={{
            marginBottom: "10px",
            paddingTop: "2px",
            paddingBottom: "2px",
            borderRadius: "20px",
            paddingRight: "10px",
            paddingLeft: "10px",
            cursor: "pointer",
          }}
        >
          {column.title}
        </Tag>
      ))}
    </div>
  );
};

export default ColumnsSelect;
