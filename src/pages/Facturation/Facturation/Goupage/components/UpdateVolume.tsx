import { useEffect, useState } from "react";
import { Flex, InputNumber, message } from "antd";
import usePost from "../../../../../hooks/usePost";
import { useReferenceContext } from "../../../../../context/ReferenceContext";
import { API_SOUSARTICLES_ENDPOINT } from "@/api/api";
import { SousArticle } from "@/types/data";

interface AUFormProps {
  refetch: () => void;
  sous_article: SousArticle;
}

const AUForm = ({ refetch, sous_article }: AUFormProps) => {

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType.fetch();
  }, []);

  const {} = useReferenceContext();

  const onSuccess = () => {
    message.success("Submission successful");
    refetch();
  };

  // @ts-ignore
  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_SOUSARTICLES_ENDPOINT,
  });

  const [value, setValue] = useState<number>(3);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (value) {
        console.log(value);
        let values = {
          id: sous_article.id,
          volume: value,
        };
        mutate(values);
      }
    }
  };

  return (
    <Flex align="baseline">
      <span style={{ marginRight: "10px" }}>Volume: </span>
      <InputNumber
        min={0}
        step={0.01}
        onChange={(value) => setValue(value as number)}
        onKeyPress={handleKeyPress}
        disabled={sous_article?.billed}
      />
    </Flex>
  );
};

export default AUForm;
