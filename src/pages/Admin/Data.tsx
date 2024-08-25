import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";

export const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "Mrn",
    dataIndex: "gros",
    copyable: true,
    ellipsis: true,
    search: false,
    tooltip: "Gros",
    formItemProps: {
      rules: [
        {
          required: true,
          message: "This field is required",
        },
      ],
    },
  },
  {
    title: "Title",
    dataIndex: "title",
    copyable: true,
    ellipsis: true,
    search: false,
    tooltip: "Long titles will be automatically shortened",
    formItemProps: {
      rules: [
        {
          required: true,
          message: "This field is required",
        },
      ],
    },
  },
  {
    disable: true,
    title: "Status",
    dataIndex: "state",
    filters: true,
    search: false,
    onFilter: true,
    ellipsis: true,
    valueType: "select",
  },
  {
    disable: true,
    title: "Tags",
    dataIndex: "labels",
    search: false,
  },
  {
    title: "Creation Time",
    key: "showTime",
    dataIndex: "created_at",
    valueType: "date",
    sorter: true,
    search: false,
    filters: true,
    onFilter: true,
  },
  {
    title: "Creation Time",
    dataIndex: "created_at",
    valueType: "dateRange",
    hideInTable: true,
    search: false,
  },
  {
    title: "Actions",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        Edit
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        View
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "Copy" },
          { key: "delete", name: "Delete" },
        ]}
      />,
    ],
  },
];
