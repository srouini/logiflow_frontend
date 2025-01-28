import React, { useEffect, useState, useRef } from 'react';
import { Card, Select, Space, Spin, Button, Empty } from 'antd';
import { Column } from '@ant-design/plots';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { toPng } from 'html-to-image';
import {useAxios} from '@/hooks/useAxios';
import { API_REPORTING_ENDPOINT } from '@/api/api';
import { useReferenceContext } from "@/context/ReferenceContext";
import { useAuth } from "@/context/AuthContext";

const ClientPaymentsChart: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(dayjs().year() - 1);
  const chartRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isDarkMode = user?.profile?.theme_mode === 'dark';

  const api = useAxios();
  const { client:clients } = useReferenceContext();

  const fetchData = async () => {
    setLoading(true);
    try {
      const startDate = dayjs().year(selectedYear).startOf('year');
      const endDate = dayjs().year(selectedYear).endOf('year');

      const response = await api.post(`${API_REPORTING_ENDPOINT}top_groupeures/`, {
        client_ids: selectedClients,
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD')
      });

      const transformedData = response.data.map((item: any) => ({
        month: dayjs().month(item.month - 1).format('MMM'),
        amount: item.amount,
        client: item.client_name
      }));

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clients.fetch();
  }, []);

  useEffect(() => {
    if (selectedClients.length > 0 || selectedYear) {
      fetchData();
    } else {
      setData([]);
    }
  }, [selectedClients, selectedYear]);

  const handleClientChange = (values: number[]) => {
    setSelectedClients(values);
  };

  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await toPng(chartRef.current, {
          backgroundColor: isDarkMode ? '#141414' : '#ffffff',
        });
        const link = document.createElement('a');
        link.download = `client-payments-${selectedYear}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error downloading chart:', error);
      }
    }
  };

  const config = {
    data,
    isStack: false,
    xField: 'month',
    yField: 'amount',
    seriesField: 'client',
    colorField: 'client',
    color: ['#1979C9', '#D62A0D', '#FAA219', '#0349A5', '#A0D911', '#13C2C2', '#EB2F96', '#722ED1'],
    label: {
      position: 'middle',
      style: {
        fill: isDarkMode ? '#ffffff' : '#000000',
        fontSize: 11,
        fontWeight: 'bold',
        textShadow: isDarkMode ? '0px 1px 2px rgba(0,0,0,0.5)' : 'none',
      },
    },
    xAxis: {
      label: {
        style: {
          fill: isDarkMode ? '#ffffff' : '#000000',
          fontSize: 12,
          fontWeight: 500,
        },
      },
      line: {
        style: {
          stroke: isDarkMode ? '#303030' : '#D9D9D9',
        },
      },
      grid: {
        line: {
          style: {
            stroke: isDarkMode ? '#303030' : '#D9D9D9',
          },
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${parseInt(v).toLocaleString()} DA`,
        style: {
          fill: isDarkMode ? '#ffffff' : '#000000',
          fontSize: 12,
          fontWeight: 500,
        }
      },
      grid: {
        line: {
          style: {
            stroke: isDarkMode ? '#303030' : '#D9D9D9',
          },
        },
      },
    },
    theme: {
      type: isDarkMode ? 'dark' : 'light',
      subColor: isDarkMode ? '#ffffff' : '#000000',
      backgroundColor: isDarkMode ? '#141414' : '#ffffff',
      defaultColor: isDarkMode ? '#ffffff' : '#000000',
      columnWidthRatio: 0.6,
      minColumnWidth: 10,
      maxColumnWidth: 50,
      styleSheet: {
        brandColor: isDarkMode ? '#ffffff' : '#000000',
        paletteQualitative10: ['#1979C9', '#D62A0D', '#FAA219', '#0349A5', '#A0D911', '#13C2C2', '#EB2F96', '#722ED1'],
        paletteQualitative20: ['#1979C9', '#D62A0D', '#FAA219', '#0349A5', '#A0D911', '#13C2C2', '#EB2F96', '#722ED1'],
      },
    },
    legend: {
      position: 'top',
      flipPage: false,
      itemName: {
        style: {
          fill: isDarkMode ? '#ffffff' : '#000000',
          fontSize: 12,
          fontWeight: 500,
        },
      },
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    appendPadding: [16, 16, 16, 16],
  };

  return (
    <Card
      title={`Groupeurs - ${selectedYear}`}
      style={{
        background: isDarkMode ? '#141414' : '#ffffff',marginTop:"20px", borderRadius:"16px"
      }}
      headStyle={{
        color: isDarkMode ? '#ffffff' : '#000000',
      }}
      bodyStyle={{
        background: isDarkMode ? '#141414' : '#ffffff',
      }}
      extra={
        <Space>
          <Select
            mode="multiple"
            style={{ width: '300px' }}
            placeholder="Select clients"
            filterOption={(input, option) =>
              //@ts-ignore
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            maxCount={10}
            maxTagCount="responsive"
            maxTagPlaceholder={(omittedTags) => `+${omittedTags.length} autres`}
            maxTagTextLength={15}
            allowClear
            onChange={handleClientChange}
            value={selectedClients}
            options={clients.results?.map((client: any) => ({
              label: client.raison_sociale,
              value: client.id,
            }))}
          />
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            options={Array.from({ length: 5 }, (_, i) => ({
              label: dayjs().subtract(i, 'year').year(),
              value: dayjs().subtract(i, 'year').year(),
            }))}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <div 
          ref={chartRef} 
          style={{ 
            width: '100%', 
            height: '400px',
            backgroundColor: isDarkMode ? '#141414' : '#ffffff',
            padding: '20px',
          }}
        >
          {loading ? (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spin size="large" />
            </div>
          ) : data.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Empty 
                description="No data available" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <Column {...config} />
          )}
        </div>
      </Spin>
    </Card>
  );
};

export default ClientPaymentsChart;
