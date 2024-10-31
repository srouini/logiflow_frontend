import {
  API_MRNS_ENDPOINT,
  API_USER_PROFILE_ENDPOINT,
  API_USERS_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import usePost from "@/hooks/usePost";
import { formatDate, mapInitialValues } from "@/utils/functions";
import { Button, Col, ColorPicker, Divider, Form, message, Row } from "antd";
import FormObject from "@/components/Form";
import useData from "@/hooks/useData";
import { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";

interface Props {
  id: number;
}
export default ({ id }: Props) => {
  const [form] = Form.useForm();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
  } = useData({
    endpoint: API_USERS_ENDPOINT + id + "/",
    name: "GET_ACTIVE_ACCOUNT",
    params: {
      expand: "profile",
    },
  });

  const [primaryColor, setPrimaryColor] = useState(data?.data?.profile?.colorPrimary) 

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    //   if (initialvalues) {
    //     values.id = initialvalues?.id;
    //   }
    // values = formatDate("accostage", values);
    values["id"] = data?.data?.profile?.id;
    values["colorPrimary"] = primaryColor;
    mutate(values);
  };

  useEffect(() => {
    setPrimaryColor(data?.data?.profile?.colorPrimary)
  },[data])

  const onSuccess = () => {
    message.success("Submission successful");
    window.location.reload();

  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_USER_PROFILE_ENDPOINT,
  });

  const handleChange = (value:any) => {
    setPrimaryColor(value.toHex())
  }
  const resetColor = () => {
    setPrimaryColor("FA541C");
  }

  useEffect(() => {
    console.log(primaryColor)
  },[primaryColor])

  return (
    <FormObject
      form={form}
      initialvalues={mapInitialValues(data?.data?.profile)}
    >
      <Row gutter={24} style={{ width: "50%" }}>
        <FormField
          label="Layout"
          name="layout"
          span={24}
          required
          span_md={24}
          option_label="label"
          option_value="value"
          options={[
            { label: "Top", value: "top" },
            { label: "Side", value: "side" },
            { label: "Mix", value: "mix" },
          ]}
          type="select"
        />
        <FormField
          label="Saider Manu Type"
          name="siderMenuType"
          span={24}
          required
          span_md={24}
          option_label="label"
          option_value="value"
          options={[
            { label: "Group", value: "group" },
            { label: "Sub", value: "sub" },
          ]}
          type="select"
        />
      </Row>
      <Divider dashed style={{ marginTop: "0px" }} />
      <Row align={"middle"} gutter={8}>
        <Col style={{marginRight:"20px"}}>Couleur</Col>
        <Col style={{display:"flex",alignItems:"center"}}>
          <ColorPicker  defaultFormat="hex" value={primaryColor} onChange={handleChange}/>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} style={{margin:"0px"}} onClick={resetColor}/>
        </Col>
      </Row>
      <Divider dashed style={{ marginTop: "20px" }} />
      <Row>
        <Button type="primary" onClick={handleFormSubmission}>
          Submit
        </Button>
      </Row>
    </FormObject>
  );
};
