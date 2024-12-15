import { useState } from "react";
import { Button, Divider, Drawer} from "antd";
import { Bareme } from "@/types/bareme";
import { ArrowRightOutlined } from "@ant-design/icons";
import Prestation from "./Ordinaire/Prestation/index";
import PrestationArticle from "./Ordinaire/PrestationArticle/index";
import Sejour from "./Ordinaire/Sejour/index";
import SejourTcGroupage from "./Ordinaire/SejourTcGroupage/index";
import SejourSousArticleGroupage from "./Ordinaire/SejourSousArticleGroupage/index";
import Branchement from "./Ordinaire/Branchement/index";
import PrestationGroupage from "./Ordinaire/PrestationGroupage/index";
import PrestationVisiteGroupage from "./Ordinaire/PrestationVisiteGroupage/index";

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
        <PrestationArticle bareme={bareme} />
        <Sejour bareme={bareme} />
        <SejourTcGroupage bareme={bareme} />
        <SejourSousArticleGroupage bareme={bareme} />
        <Branchement bareme={bareme} />
        <PrestationGroupage bareme={bareme} />
        <PrestationVisiteGroupage bareme={bareme} />
      </Drawer>
    </>
  );
};
