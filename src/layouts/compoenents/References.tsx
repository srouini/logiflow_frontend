import {
  BorderTopOutlined,
  PicCenterOutlined,
  RadiusSettingOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import Clients from "./Clients/Index";

const References = () => {
  const [open, setOpen] = useState(false);
  return (
    <FloatButton.Group
      onClick={() => setOpen(!open)}
      open={open}
      shape="square"
      trigger="click"
      style={{ insetInlineEnd: 25 }}
      icon={<SettingOutlined />}
      badge={{ dot: true }}
    >
      <Clients hanleClose={() => setOpen(false)} />
      <FloatButton tooltip="Transitaire" icon={<UserAddOutlined />} />
      <FloatButton tooltip="Parc" icon={<RadiusSettingOutlined />} />
      <FloatButton tooltip="Zone" icon={<BorderTopOutlined />} />
      <FloatButton tooltip="Box" icon={<PicCenterOutlined />} />
    </FloatButton.Group>
  );
};

export default References;
