import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col } from 'antd';
import ClientsPage from "./compoenents/Clients/Index";
import TransitairesPage from "./compoenents/Transitaires/Index";
import ParcsPage from "./compoenents/Parcs/Index";
import ZonesPage from "./compoenents/Zones/Index";
import BoxsPage from "./compoenents/Box/Index";
import RubriquesPage from "./compoenents/Rubrique/Index";
import AgentDouanePage from './compoenents/AgentDouane/Index';


const References: React.FC = () => {
  return (
    <PageContainer>
      <Row gutter={[16, 16]} style={{ padding: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ClientsPage hanleClose={() => {}}/>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <TransitairesPage hanleClose={() => {}}/>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ParcsPage hanleClose={() => {}}/>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <BoxsPage hanleClose={() => {}}/>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ZonesPage hanleClose={() => {}} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <AgentDouanePage hanleClose={() => {}}/>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <RubriquesPage hanleClose={() => {}}/>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default References;
