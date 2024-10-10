import { API_FACTURE_ENDPOINT } from "@/api/api";
import usePost from "@/hooks/usePost";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm } from "antd";
import { PopconfirmProps } from "antd/lib";
import dayjs from "dayjs";
import { useState } from "react";

interface ValidateProformaButtonProps {
  proforma: any;
  refetch:any;
}
const ValidateProformaButton = ({ proforma,refetch }: ValidateProformaButtonProps) => {
  const now = dayjs();

  // Format the date as a string (e.g., ISO 8601 format)
  const dateString = now.format("YYYY-MM-DD");

  const onSuccess = () => {
    message.success("Submission successful");
    refetch();
  };

  const [aTerme, setATerme] = useState(false);
  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_FACTURE_ENDPOINT,
  });

  // @ts-ignore
  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    setATerme(false);
    mutate({
      proforma: proforma?.id,
      a_terme: aTerme,
      date_creation: dateString,
    });
  };
  // @ts-ignore
  const cancel: PopconfirmProps["onCancel"] = (e) => {
    setATerme(true);
    mutate({
      proforma: proforma?.id,
      a_terme: aTerme,
      date_creation: dateString,
    });
  };

  return (
    <Popconfirm
      title="Modalité de paiement"
      description="Voulez-vous créer une facture à terme ? "
      onConfirm={confirm}
      onCancel={cancel}
      okText="Non"
      cancelText="Oui"
        disabled={proforma?.trashed || proforma?.valide || isLoading}
    >
      <Button
        type="default"
        icon={<CloudUploadOutlined />}
        loading={isLoading}
        disabled={proforma?.trashed || proforma?.valide || isLoading}
        
      >
        Valider
      </Button>
    </Popconfirm>
  );
};

export default ValidateProformaButton;
