import React from "react";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  TreeSelect,
} from "antd";
import type { FormInstance } from "antd/es/form";

interface Props {
  form: FormInstance<any>;
  children?: React.ReactNode;
}

const App: React.FC<Props> = ({ form, children }) => {
  const handleOnFinish = async () => {
    const values = await form.validateFields();
    console.log(values);
  };

  return (
    <Form
      layout="horizontal"
      style={{ padding: "10px", paddingTop: "20px" }}
      form={form}
      onFinish={handleOnFinish}

    >
      {children}
    </Form>
  );
};

export default App;
