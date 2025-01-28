import { API_FACTURE_ENDPOINT } from "@/api/api";
import usePost from "@/hooks/usePost";
import { usePermissions } from "@/utils/permissions";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm } from "antd";
import { PopconfirmProps } from "antd/lib";
import dayjs from "dayjs";

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

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_FACTURE_ENDPOINT,
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
   
  };
  const hasPermission = usePermissions();
  return (
    <Popconfirm
      title="Validation de la proforma"
      description="Êtes-vous sûr de vouloir valider cette proforma ?"
      onConfirm={confirm}
      onCancel={cancel}
      okText="Oui"
      cancelText="Non"
        disabled={proforma?.trashed || proforma?.valide || isLoading || !hasPermission('billing.can_validate_proforma')}
    >
      <Button
        type="default"
        icon={<CloudUploadOutlined />}
        loading={isLoading}
        disabled={proforma?.trashed || proforma?.valide || isLoading || !hasPermission('billing.can_validate_proforma')}
        
      >
        Valider
      </Button>
    </Popconfirm>
  );
};

export default ValidateProformaButton;
