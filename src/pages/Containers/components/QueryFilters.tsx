import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { useEffect } from "react";

import { transformRangeDateFilter, transformSelectFilter } from "@/utils/functions";
import { selectConfig } from "@/utils/config";
import { useReferenceContext } from "@/context/ReferenceContext";
import { YES_NO_CHOICES } from "@/utils/constants";
import { Card } from "antd";

type QueryFiltersProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<number>>;
  resetFilters: () => void;
  collapsed?:boolean
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
  collapsed=true
}) => {
  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
   
  };

  const { containerType, mrn } = useReferenceContext();

  useEffect(() => {
    containerType.fetch();
    mrn?.fetch();
  }, []);

  return (
    <Card style={{ marginBottom: "20px" }}>
      <QueryFilter
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
       defaultCollapsed={collapsed}
      >
        <ProFormText name="tc__icontains" label="Numéro" />

        <ProFormSelect
          {...selectConfig}
          options={mrn?.results}
          label="Mrn"
          name="article__gros"
          fieldProps={{
            fieldNames: { label: "gros", value: "id" },
            maxTagCount: 'responsive',
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter("multiple", "article__gros", value)
          }
        />


      <ProFormDigit name="article__numero" label="Article" />


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
          options={containerType?.results}
          label="Type"
          name="type_tc"
          fieldProps={{
            fieldNames: { label: "designation", value: "id" },
            maxTagCount: 'responsive',
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter("multiple", "type_tc", value)
          }
        />

        <ProFormDatePicker name="article__gros__accostage" label="Accostage" />
        <ProFormDateRangePicker
          name="article__gros__accostage__range"
          label="Accostage"
          transform={(value) => transformRangeDateFilter("article__gros__accostage", value)}
        />

        <ProFormDatePicker name="date_sortie_port_sec__date" label="Sortie port" />
        <ProFormDateRangePicker
          name="date_sortie_port__date__range"
          label="Sortie port"
          transform={(value) => transformRangeDateFilter("date_sortie_port_sec__date", value)}
        />

        <ProFormDatePicker name="date_entree_port_sec__date" label="Entree PS" />
        <ProFormDateRangePicker
          name="date_entree_port_sec__date__range"
          label="Entree PS"
          transform={(value) => transformRangeDateFilter("date_entree_port_sec__date", value)}
        />

        <ProFormDatePicker name="date_sortie_src_port__date" label="Sortie PS" />
        <ProFormDateRangePicker
          name="date_sortie_port_sec__date__range"
          label="Sortie PS"
          transform={(value) => transformRangeDateFilter("date_sortie_port_sec__date", value)}
        />

<ProFormSelect
          {...selectConfig}
          // @ts-ignore
          options={YES_NO_CHOICES}
          label="Facturé"
          name="billed"
          mode="single"
        />

<ProFormSelect
          {...selectConfig}
          // @ts-ignore
          options={YES_NO_CHOICES}
          label="Groupage"
          name="article__groupage"
          mode="single"
        />



      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
