import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Drawer, theme } from 'antd';
import {
  FileSearchOutlined,
  ContainerOutlined,
  CarOutlined,
  BankOutlined,
  TeamOutlined,
  DollarOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import ClientsPage from "./compoenents/Clients/Index";
import TransitairesPage from "./compoenents/Transitaires/Index";
import ParcsPage from "./compoenents/Parcs/Index";
import ZonesPage from "./compoenents/Zones/Index";
import BoxsPage from "./compoenents/Box/Index";

interface ReferenceCard {
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  description: string;
  color: string;
}

const References: React.FC = () => {
  return (
    <PageContainer>
      <Row gutter={[16, 16]} style={{ padding: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ClientsPage />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <TransitairesPage />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ParcsPage />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <BoxsPage />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ZonesPage />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default References;
