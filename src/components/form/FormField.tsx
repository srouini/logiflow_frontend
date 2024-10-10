import React from "react";
import { Col } from "antd";
import FormTextInput from "./FormTextInput"; // Adjust the import path as needed
import FormDateInput from "./FormDateInput"; // Adjust the import path as needed
import ProFormSelect from "@ant-design/pro-form/lib/components/Select"; // Adjust the import path as needed
import { selectConfig } from "@/utils/config";
import ForNumberInput from "./FormNumberInput";
import FormDateTimeInput from "./FormDateTimeInput";

interface FormFieldProps {
  name: string;
  label: string;
  type: "text" | "date" | "dateTime" | "select" | "number";
  span?: number;
  span_md?: number;
  options?: Array<any>;
  option_value?: string;
  option_label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  step?:number
  initialValue?:any
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  span = 24,
  span_md = 12,
  options,
  option_value = "id",
  option_label,
  required = false,
  placeholder = "-",
  disabled = false,
  step=1,
  initialValue
}) => {
  switch (type) {
    case "text":
      return (
        <Col span={span} md={span_md}>
          <FormTextInput
            name={name}
            label={label}
            required={required}
            placeholder={placeholder}
            disabled={disabled}
          />
        </Col>
      );
    case "number":
      return (
        <Col span={span} md={span_md}>
          <ForNumberInput
            name={name}
            label={label}
            required={required}
            disabled={disabled}
            step={step}
          />
        </Col>
      );
    case "date":
      return (
        <Col span={span} md={span_md}>
          <FormDateInput
            name={name}
            label={label}
            required={required}
            disabled={disabled}
          />
        </Col>
      );

      case "dateTime":
        return (
          <Col span={span} md={span_md}>
            <FormDateTimeInput
              name={name}
              label={label}
              required={required}
              disabled={disabled}
            />
          </Col>
        );

        
    case "select":
      return (
        <Col span={span} md={span_md}>
          <ProFormSelect
            {...selectConfig}
            width="lg"
            options={options}
            initialValue={initialValue}
            label={label}
            required={required}
            name={name}
            disabled={disabled}
            fieldProps={{
              fieldNames: { label: option_label, value: option_value },
              maxTagCount: 'responsive',
            }}
            placeholder={placeholder}
          />
        </Col>
      );

    default:
      return null;
  }
};

export default FormField;
