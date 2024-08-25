import {
  EllipsisOutlined,
  PlusOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag } from "antd";
import { useRef } from "react";
import request from "umi-request";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

import enUS from 'antd/es/locale/en_US';

interface MarkType {
  id: number;
  label: string;
}

interface Direction {
  id?: number;
  label: string;
}

interface ClientType {
  id: number;
  full_name: string;
  personne_physique: boolean;
  direction: Direction;
}

interface InventoryItem {
  id: number;
  model: string;
  reference: string;
  inventory_number: string;
  class_name: string;
  purshase_date: string;
  bill: string;
  initial_price: string;
  form_factor: string;
  processor: string;
  ram: number;
  rom: number;
  hard_drive: string;
  integrated_gpu: string;
  dedicated_gpu: string;
  mark: MarkType | number;
  owner: ClientType | number;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: InventoryItem[];
}

const columns: ProColumns<InventoryItem>[] = [
  {
    title: "ID",
    dataIndex: "id",
    hideInSearch: true,
    hidden: true,
    ellipsis: true,
  },

  {
    title: "Model",
    dataIndex: "model",
    search: false,
    ellipsis: true,
  },
  ,
  {
    title: "Model",
    dataIndex: "model__icontains",
    hideInTable: true,
  },
  {
    title: "Mark",
    dataIndex: "mark",
    ellipsis: true,
    render: (_, record: InventoryItem) =>
      typeof record.mark === "object" && record.mark !== null ? (
        <span>{record.mark.label}</span>
      ) : null,
  },
  {
    title: "Owner",
    dataIndex: "owner",
    ellipsis: true,
    render: (_, record: InventoryItem) =>
      typeof record.owner === "object" && record.owner !== null ? (
        <span>{record.owner.full_name}</span>
      ) : null,
  },
  {
    title: "Direction",
    dataIndex: "owner",
    ellipsis: true,
    render: (_, record: InventoryItem) =>
      typeof record.owner === "object" && record.owner !== null ? (
        <span>{record.owner.direction.label}</span>
      ) : null,
  },
  {
    title: "Inventory Number",
    dataIndex: "inventory_number",
    ellipsis: true,
  },
  {
    title: "Class Name",
    dataIndex: "class_name",
    ellipsis: true,
  },
  {
    title: "Purchase Date",
    dataIndex: "purshase_date",
    valueType: "date",
    ellipsis: true,
  },
  {
    title: "Initial Price",
    dataIndex: "initial_price",
    valueType: "money",
    ellipsis: true,
  },
  {
    title: "Form Factor",
    dataIndex: "form_factor",
    sorter: true,
    ellipsis: true,
  },
  {
    title: "Processor",
    dataIndex: "processor",
    sorter: true,
    ellipsis: true,
  },
  {
    title: "RAM (GB)",
    dataIndex: "ram",
    sorter: true,
    ellipsis: true,
  },
  {
    title: "ROM (GB)",
    dataIndex: "rom",
    ellipsis: true,
  },
  {
    title: "Hard Drive",
    dataIndex: "hard_drive",
    ellipsis: true,
  },
  ,
];

export default () => {
  const actionRef = useRef<ActionType>();
  const cleanFilters = (filters: []) => {
    console.log(filters);
  };

  const cleanSorter = (sorter: any) => {
    try {
      if (sorter !== undefined && typeof sorter === "object") {
        const [key, value] = Object.entries(sorter)[0];
        if (value == "descend") return `${"-"}${key}`;
        return `${key}`;
      }
    } catch (error) {}
  };

  return (
    <ProTable<InventoryItem>
    locale={{
        filterTitle: "Expand",
        filterSearchPlaceholder:"Search"
    }} 
 
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
 
        // let ordering: string | undefined = "";
        // if (Object.keys(sort).length !== 0) ordering = cleanSorter(sort);

        const response = await request<ApiResponse>(
          "http://127.0.0.1:8000/inventory/computer/",
          {
            params: {
              page: params.current,
              page_size: params.pageSize,
              ...params, // Include other filters/sorts
            //   ...filter,
            //   ordering,
              expand: "owner.direction,mark",
              omit:"owner.direction.id,owner.id,owner.personne_physique,mark.id,class_name"
            },
          }
        );

        return {
          data: response.results,
          success: true,
          total: response.count,
        };
      }}
      editable={{
        type: "multiple",
      }}
      columnsState={{
        persistenceKey: "pro-table-singe-demos",
        persistenceType: "localStorage",
        defaultValue: {
          option: { fixed: "right", disable: true },
        },
        onChange(value) {
          console.log("value: ", value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: "auto",
        resetText: "Clear",
        searchText: "Query",
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
        fullScreen: true,
        reload: true,

      }}
  





      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === "get") {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        showQuickJumper: true,
        pageSize:300
        // onChange: (page) => console.log(page),
        // pageSizeOptions: [10, 20, 100, 200, 300],
      }}
      dateFormatter="string"
      headerTitle="Table Header"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          New
        </Button>,
      ]}
    />
  );
};
