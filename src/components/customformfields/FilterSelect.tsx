import React from "react";
import type { SelectProps } from "antd/es/select";
import type { FormItemProps } from "antd/es/form";
import { ProFormSelect } from "@ant-design/pro-components";

interface FormSelectInputProps extends Omit<FormItemProps, "children"> {
  name: string;
  label: string;
  required?: boolean;
  message?: string;
  placeholder?: string;
  option_label: string;
  option_value: string;
  mode?: "multiple" | "tags" | "single" | undefined;
  att?: Record<string, any>;
  disabled?: boolean;
  isLoading?: boolean;
  data: any;
}

const FilterSelect: React.FC<FormSelectInputProps> = ({
  name,
  label,
  placeholder = "-",
  data,
  isLoading,
  option_label,
  option_value,
  initialValue,
  mode,
  att = {},
  disabled = false,
}) => {


  return (
    <ProFormSelect
      disabled={disabled}
      options={data}
      width={"md"}
      label={label}
      name={name}
      fieldProps={{
        optionLabelProp: "nom",
        fieldNames: { label: option_label, value: option_value },
     
      }}
      allowClear
      mode={mode}
      showSearch
      transform={(value) => {
        if (mode === "multiple" || mode === "tags") {
          return { [`${name}__in`]: value.join(",") };
        }
        return { [`${name}`]: value };
      }}
    />
  );
};

export default FilterSelect;
