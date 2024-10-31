import { API_FACTURE_ENDPOINT, API_FACTURES_GROUPAGE_ENDPOINT } from "@/api/api";
import usePost from "@/hooks/usePost";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm } from "antd";
import { PopconfirmProps } from "antd/lib";
import dayjs from "dayjs";

interface ValidateProformaButtonProps {
  proforma: any;
  refetch:any;
  refetch_sub_article:() => void;
}
const ValidateProformaButton = ({ proforma,refetch,refetch_sub_article }: ValidateProformaButtonProps) => {
  const now = dayjs();

  // Format the date as a string (e.g., ISO 8601 format)
  const dateString = now.format("YYYY-MM-DD");

  const onSuccess = () => {
    message.success("Submission successful");
    refetch();
    refetch_sub_article();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_FACTURES_GROUPAGE_ENDPOINT,
  });

  // @ts-ignore
  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    mutate({
      proforma: proforma?.id,
      a_terme: false,
      date_creation: dateString,
    });
  };
  // @ts-ignore
  const cancel: PopconfirmProps["onCancel"] = (e) => {
    mutate({
      proforma: proforma?.id,
      a_terme: true,
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
