import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import CustomTable from "@/components/CustomTable";
import { useReferenceContext } from "@/context/ReferenceContext";
import useData from "@/hooks/useData";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import usePost from "@/hooks/usePost";
import { TableSelectionType } from "@/types/antdeing";
import {
  AppstoreAddOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Drawer, message, Segmented, Switch, Tag } from "antd";
import { useEffect, useState } from "react";

interface props {
  mrn: string | undefined;
}
export default ({ mrn }: props) => {
  const [open, setOpen] = useState(false);

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType?.fetch();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
    isFetching
  } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: "GET_CONTAINERS",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      article__gros__in: mrn,
      expand: "type_tc",
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching],
  });

  const columns = () => [
    {
      title: "Matricule",
      dataIndex: "tc",
      key: "tc",
      width: 100,
    },
    {
      title: "Type",
      key: "type_tc",
      dataIndex: "type_tc",
      width: 100,
      render: (record: any) => <Tag color="blue"> {record?.designation} </Tag>,
    },
    {
      title: "Tar",
      key: "tar",
      dataIndex: "tar",
      width: 150,
    },
    {
      title: "Poids",
      key: "poids",
      dataIndex: "poids",
      width: 120,
    },
    {
      title: "Nature",
      key: "dangereux",
      dataIndex: "dangereux",
      width: 150,
      // @ts-ignore
      render: (_, record: any) => (
        <>
          {" "}
          {record.dangereux ? <Tag color="red"> DGX </Tag> : ""}{" "}
          {record.frigo ? <Tag color="blue"> FRIGO </Tag> : ""}
        </>
      ),
    },
  ];

  // handle type container

  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const rowSelectionFunction: TableSelectionType = {
    onChange(selectedRowKeys) {
      setSelectedRows(selectedRowKeys);
    },
  };

  const onSuccess = () => {
    message.success("Submission successful");
    refetch();
  };

  const { mutate } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CONTENEURS_ENDPOINT + "bulk_update_type_tc/",
  });

  const { mutate: mutateDangereux } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CONTENEURS_ENDPOINT + "set_dangereux/",
  });

  const { mutate: mutateFrigo } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CONTENEURS_ENDPOINT + "set_frigo/",
  });

  const handleContainerType = (values: any) => {
    mutate({
      ids: selectedRows,
      type_tc_id: values,
    });
  };

  const handleDgxChange = (value: any) => {
    mutateDangereux({
      ids: selectedRows,
      dangereux: value,
    });
  };

  const handleFrigoChange = (value: any) => {
    mutateFrigo({
      ids: selectedRows,
      frigo: value,
    });
  };

  const RowSelectionRnder = (
    <>
      DGX:
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        onChange={handleDgxChange}
      />
      FRIGO:
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        onChange={handleFrigoChange}
      />
      Type:
      <Segmented
        options={containerType.results?.map((item: any) => {
          return { label: item.designation, value: item.id };
        })}
        onChange={handleContainerType}
        allowFullScreen
        defaultValue={false}
      />
    </>
  );

  return (
    <>
      <Button
        onClick={showDrawer}
        type="primary"
        icon={<AppstoreAddOutlined />}
      >
        Conteneurs
      </Button>

      <Drawer
        width={900}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <CustomTable
          getColumns={columns()}
          data={data}
          isFetching={isFetching}
          scrollX={800}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="CONTENEUR_AFFECTATION_TYPE"
          rowSelectionFunction={rowSelectionFunction}
          RowSelectionRnder={RowSelectionRnder}
        />
      </Drawer>
    </>
  );
};
