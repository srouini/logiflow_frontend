import { ProDescriptions, ProSkeleton } from "@ant-design/pro-components";
import { DetailsColumns } from "../data";

const MrnDetails = ({ dataSource, isLoading }: any) => {
  return (
    <>
    {isLoading && <div style={{marginBottom:"20px"}}><ProSkeleton type="list" list={false} toolbar={false}  statistic={1}   /></div>}
    {!isLoading &&
    
    <ProDescriptions
      title={dataSource?.gros}
      dataSource={dataSource}
      columns={DetailsColumns}
      style={{ marginBottom: "10px", maxHeight:"50" }}
    >
      {/* <ProDescriptions.Item label="百分比" valueType="percent">
          100
        </ProDescriptions.Item> */}
    </ProDescriptions>

    }
    
    </>
  );
};

export default MrnDetails;
