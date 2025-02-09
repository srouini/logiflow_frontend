import {
  ProFormSelect,
  QueryFilter,
} from "@ant-design/pro-components";
import { selectConfig } from "../../../../utils/config";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { transformSelectFilter } from "@/utils/functions";
import { Card } from "antd";
import useData from "@/hooks/useData";
import { API_ARTICLES_ENDPOINT } from "@/api/api";

type QueryFiltersProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: any;
  resetFilters: () => void;
  collapsed?: boolean
  mrn:string | undefined
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
  collapsed = true,
  mrn
}) => {
  const { client, transitaire } = useReferenceContext();

  const {
    data:articles,
    isLoading: isLoadingArticles,
    isRefetching:isRefetchingArticles,
    isFetching:isFetchingArticles,
    refetch:refetchArticles,
  } = useData({
    endpoint: API_ARTICLES_ENDPOINT,
    name: "GET_ARTICLES_BY_GROS",
    params: {
      all: true,
      expand: "",
      gros__in: mrn,
    },
  });

  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };

  return (
    <Card style={{ marginBottom: "20px", paddingLeft: "0px" }}>
      <QueryFilter
                defaultCollapsed={collapsed}

        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
      >
        <ProFormSelect
            {...selectConfig}
            options={articles?.data}
            label="Article"
            name="article"
            mode="multiple"
            fieldProps={{
              fieldNames: { label: "numero", value: "id" },
              maxTagCount: "responsive",
            }}
            transform={(value) =>
              transformSelectFilter("multiple", "article", value)
            }
          />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
