import moment from "moment";
import { SelectModeType } from "../types/antdeing";
import dayjs from "dayjs";

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

import utc from 'dayjs/plugin/utc';
import { Rubrique } from "@/types/bareme";
dayjs.extend(utc); 

export const renderDateTime = (date: any) => {

  let formatted_date = dayjs(date).utc();

  if (formatted_date.isValid()) return formatted_date.format("YYYY-MM-DD HH:mm:ss");

  return "-";
};

export const renderDate = (date: any) => {
  let formatted_date = moment(date);

  if (formatted_date.isValid()) return formatted_date.format("YYYY-MM-DD");

  return "-";
};


export const renderMoney = (value: any) => {
  return (
    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
      {value ? value + " DA" : "-"}
    </span>
  );};




  export const mapInitialValues = (
    initialValues: InitialValues
  ): InitialValues => {
    const mappedValues: InitialValues = {};
    if (!initialValues) {
      return mappedValues; // Return an empty object if initialValues is null or undefined
    }
  
    for (const [key, value] of Object.entries(initialValues)) {
      // Handle date fields: if the value is a valid date string (YYYY-MM-DD)
      if (
        value &&
        typeof value === "string" &&
        dayjs(value, "YYYY-MM-DD", true).isValid()
      ) {
        mappedValues[key] = dayjs(value, "YYYY-MM-DD");
      }
      // Handle datetime fields: if the value is a valid datetime string (YYYY-MM-DDTHH:mm:ss)
      else if (
        value &&
        typeof value === "string" &&
        dayjs(value, "YYYY-MM-DDTHH:mm:ssZ", false).isValid()
      ) {
        mappedValues[key] = dayjs(value,"YYYY-MM-DDTHH:mm:ss"); // Use dayjs directly to parse the datetime
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


export function removeDuplicatedRubriques(prestations: Rubrique[]): Rubrique[] {
  let uniqueDesignations: { [key: string]: boolean } = {};
  return prestations?.filter(item => {
    if (!uniqueDesignations[item.designation]) {
      uniqueDesignations[item.designation] = true;
      return true;
    }
    return false;
  });
}


export const formatDate = (field:string, values: any) => {
  values[field] = values[field].format("YYYY-MM-DD");
  return values
}

export const formatDateTime = (field:string, values: any) => {
  values[field] = values[field].format("YYYY-MM-DDTHH:mm:ss");
  return values
}


export function formatStringDate(dateString:string) {
  return moment(dateString).format('YYYY-MM-DD HH:mm');
}

export function roundToDecimals(num:number, decimals:number) {
  let factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function ensureHashPrefix(str:string) {
  // Check if the string starts with '#'
  if (str.startsWith('#')) {
      return str; // Return the string as it is
  } else {
      return '#' + str; // Add '#' at the beginning and return
  }
}