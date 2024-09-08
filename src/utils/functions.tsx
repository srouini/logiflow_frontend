import moment from "moment";
import { SelectModeType } from "../types/antdeing";

export const renderText = (value: any) => {
  return (
    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
      {value ? value : "-"}
    </span>
  );};

interface NestedObject {
  id: number | string;
  [key: string]: any;
}

type InitialValues = {
  [key: string]: any;
};

export const renderDate = (date: any) => {
  let formatted_date = moment(date);

  if (formatted_date.isValid()) return formatted_date.format("YYYY-MM-DD");

  return "-";
};

export const mapInitialValues = (
  initialValues: InitialValues
): InitialValues => {
  const mappedValues: InitialValues = {};

  if (!initialValues) {
    return mappedValues; // Return an empty object if initialValues is null or undefined
  }

  for (const [key, value] of Object.entries(initialValues)) {
    // Handle date fields: if the value is a valid date string, convert it to a moment object
    if (
      value &&
      typeof value === "string" &&
      moment(value, "YYYY-MM-DD", true).isValid()
    ) {
      mappedValues[key] = moment(value, "YYYY-MM-DD");
    }
    // Handle nested objects with an 'id' field
    else if (value && typeof value === "object" && "id" in value) {
      mappedValues[key] = (value as NestedObject).id;
    }
    // Default case: retain the original value
    else {
      mappedValues[key] = value;
    }
  }

  return mappedValues;
};

export const transformRangeDateFilter = (name: string, value: any) => {
  if (Array.isArray(value) && value.length === 2) {
    return {
      [`${name}__gte`]: value[0],
      [`${name}__lte`]: value[1],
    };
  }
  return {};
};

export const transformSelectFilter = (
  mode: SelectModeType,
  name: string,
  value: any
) => {
  if (mode === "multiple" || mode === "tags") {
    return { [`${name}__in`]: value.join(",") };
  }
  return { [`${name}`]: value };
};


export const formatDate = (field:string, values: any) => {
  values[field] = values[field].format("YYYY-MM-DD");
  return values
}


export function formatStringDate(dateString:string) {
  return moment(dateString).format('YYYY-MM-DD HH:mm');
}