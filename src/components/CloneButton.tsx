import { Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import usePost from "@/hooks/usePost";

interface CloneButtonProps {
  endpoint: string;
  id: number | string;
  refetch: () => void;
}

const CloneButton = ({ endpoint, id, refetch }: CloneButtonProps) => {
  const { mutate, isLoading } = usePost({
    onSuccess: () => {
      message.success("Clone created successfully");
      refetch();
    },
    endpoint: `${endpoint}${id}/clone/`,
  });

  const handleClone = () => {
    mutate({});
  };

  return (
    <Button
      type="link"
      icon={<CopyOutlined />}
      onClick={handleClone}
      loading={isLoading}
    >
      CLONE
    </Button>
  );
};

export default CloneButton;
