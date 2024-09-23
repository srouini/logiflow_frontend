import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { ProList } from '@ant-design/pro-components';
import { Button, Modal } from "antd";
import React, { useState } from "react";

interface Props {
  mrn: string | number | undefined;
}



const NotLoadedContainers = ({ mrn }: Props) => {
  const [open, setOpen] = React.useState<boolean>(false);
  // @ts-ignore
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any) => setSelectedRowKeys(keys),
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
  };

  const { data } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: "GET_NOT_LOADED_MRN_CONTAINERS",
    params: {
      all: true,
      expand: "article,type_tc",
      article__gros__in: mrn,
      bulletins__id__isnull: true,
    },
  });

  const data_sou = data?.data?.map((item:any) => ({
    subTitle: <>{item?.tc} /  {item?.type_tc?.designation}</>,
  }));


  return (
    <>
      <Button type="primary" onClick={showLoading}>
        Open Modal
      </Button>
      <Modal open={open} onCancel={() => setOpen(false)} width={800}>
      <ProList<{
        title: string;
        subTitle: JSX.Element;
        actions: JSX.Element[];
        description: JSX.Element;
        type?: 'top' | 'inline' | 'new';
        avatar: string;
        children: JSX.Element;
      }>
        metas={{
          title: {},
          subTitle: {},
          avatar:{render:() => <AppstoreAddOutlined />}
        }}
        
        rowKey="id"
        headerTitle="Conteneurs non chargé"
        rowSelection={rowSelection}
        dataSource={data_sou
        }

      />
      </Modal>
    </>
  );
};

export default NotLoadedContainers;
