import {
  SettingOutlined,
} from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import Clients from "./Clients/Index";
import Transitaires from "./Transitaires/Index";
import Parcs from "./Parcs/Index";
import Zones from "./Zones/Index";
import Boxs from "./Box/Index";

const References = () => {
  const [open, setOpen] = useState(false);
  return (
    <FloatButton.Group
      onClick={() => setOpen(!open)}
      open={open}
      shape="circle"
      trigger="click"
      style={{ insetInlineEnd: 80 }}
      icon={<SettingOutlined />}
      badge={{ dot: true }}
      type="primary"
    >
      <Clients hanleClose={() => setOpen(false)} />
      <Transitaires hanleClose={() => setOpen(false)} />
      <Parcs hanleClose={() => setOpen(false)} />
      <Zones hanleClose={() => setOpen(false)} />
      <Boxs hanleClose={() => setOpen(false)} />
    </FloatButton.Group>
  );
};

export default References;
