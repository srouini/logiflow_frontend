import { PageContainer } from "@ant-design/pro-components";
import StatisticsDay from "./StatisticsDay";
import StatisticsMonth from "./StatisticsMonth";
import StatisticsYear from "./StatisticsYear";
import TopGroupeursChart from '@/pages/Reports/TopGroupeursChart';
import TopClientsChart from '@/pages/Reports/TopClientsChart';
import PerformanceChart from './PerformanceChart';
import { Flex, Typography } from 'antd';
import {useAuth} from "@/context/AuthContext";
import dayjs from "dayjs";
import { LuCalendarDays } from "react-icons/lu";

const { Title,Text } = Typography;

export default () => {
  const { user } = useAuth();
  const today = dayjs(); 
  const formattedDate = today.format('MMMM D, YYYY');

  return (
    <div>
      <PageContainer
        contentWidth="Fluid"
        title={false}
      >
        <Flex justify="space-between" align="center">
          <Title style={{marginTop:"10px", marginBottom:"0px"}} level={2}>Hello, {user?.first_name}</Title>
          <Flex align="center">
            <Text>{formattedDate}</Text>
          </Flex>
        </Flex>
        <div style={{marginBottom:"25px"}}>
          <Text type="secondary" style={{marginBottom:"30px", fontSize:"20px"}}>Ici, vous pouvez suivre les principales statistiques en temps réel.</Text>
        </div>
       
        <Flex justify="" gap={16}>
          <Flex style={{width:"70%"}}>
        <PerformanceChart />
        </Flex>
        <Flex vertical style={{overflow:"scroll",width:"30%",height:"500px"}}>
            <StatisticsDay />
            <StatisticsMonth />
            <StatisticsYear />
        </Flex>
        </Flex>
        <TopGroupeursChart />
        <TopClientsChart />
      </PageContainer>
    </div>
  );
};
