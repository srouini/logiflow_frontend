import { useEffect, useState } from "react";
import { Flex, Form, InputNumber, message } from "antd";
import usePost from "../../../../../hooks/usePost";
import { useReferenceContext } from "../../../../../context/ReferenceContext";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import { SousArticle } from "@/types/data";



interface AUFormProps {
  refetch: () => void;
  sous_article: SousArticle;
}

const AUForm = ({ refetch, sous_article }:AUFormProps) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType.fetch();
  }, []);

  const {} = useReferenceContext();

  const handleFormSubmission = async () => {
    let values = await form.validateFields();

    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CONTENEURS_ENDPOINT,
  });



const [value, setValue] = useState<number>(3);

const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    console.log(value);
  }
}


  return (
    <Flex align="baseline">
      <span style={{marginRight:"10px"}}>Volume: </span>
     <InputNumber min={0}  step={0.01}  onChange={(value) => setValue(value as number)}  onKeyPress={handleKeyPress}/>
     </Flex>
  );


};

export default AUForm;
