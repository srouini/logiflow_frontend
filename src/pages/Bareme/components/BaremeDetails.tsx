import { useState } from "react";
import { Button, Divider, Drawer} from "antd";
import { Bareme } from "@/types/bareme";
import { ArrowRightOutlined } from "@ant-design/icons";
import Prestation from "./Ordinaire/Prestation/index";

interface SubArticlePageProps {
  bareme?: Bareme;
}

export default ({ bareme }: SubArticlePageProps) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };








  return (
    <>
      <Button onClick={showDrawer}>{bareme?.designation}</Button>

      <Drawer
        width={1000}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <p
          className="site-description-item-profile-p"
          style={{ marginBottom: 24, fontWeight: "bold" }}
        >
          BAREME <ArrowRightOutlined /> {bareme?.designation}
        </p>

        <Prestation bareme={bareme} />

       
      </Drawer>
    </>
  );
};
