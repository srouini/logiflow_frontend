import { API_VISITES_ENDPOINT } from "@/api/api";
import CustomTableAll from "@/components/CustomTableAll";
import useData from "@/hooks/useData";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import { TableSelectionType } from "@/types/antdeing";
import { renderText } from "@/utils/functions";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { Button, Drawer, Tag } from "antd";
import { useEffect, useState } from "react";
import AUForm from "./AUForm";

interface props {
  visite: string | undefined;
  refetchVisiteItems: () => void;
  disabled?: boolean;
}
export default ({ visite, disabled,refetchVisiteItems }: props) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_VISITES_ENDPOINT + visite + "/non_visited_tcs/",
    name: "GET_NON_VISITED_TCS",
    params: {},
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const columns = () => [
    {
      title: "Matricule",
      dataIndex: "tc",
      key: "tc",
      width: 150,
    },
    {
      title: "Article",
      key: "article",
      dataIndex: "article",
      width: 150,
      render: (record: any) => renderText(record?.numero),
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
    {
      title: "Action",
      key: "99",
      dataIndex: "tc",
      fixed:"right",
      width: 120,
      render: (_,record:any) => <AUForm tc={record} refetch={refetchVisiteItems} initialvalues={null} addText="" visite_id={visite} refetchNonVisitedContainers={refetch}/> 
    },
  ];

  return (
    <>
      <Button
        onClick={showDrawer}
        type="primary"
        icon={<AppstoreAddOutlined />}
        disabled={disabled}
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
        <CustomTableAll
          getColumns={columns()}
          data={data}
          scrollX={800}
          isLoading={isLoading}
          refetch={refetch}
          key="CONTENEUR_AFFECTATION_VISITE"
        />
      </Drawer>
    </>
  );
};
