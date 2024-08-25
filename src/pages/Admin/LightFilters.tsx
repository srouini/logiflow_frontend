import {
    LightFilter,
    ProFormCascader,
    ProFormCheckbox,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormDateTimePicker,
    ProFormDateTimeRangePicker,
    ProFormDigit,
    ProFormFieldSet,
    ProFormSelect,
    ProFormSlider,
    ProFormSwitch,
    ProFormText,
    ProFormTimePicker,
    ProFormTreeSelect,
  } from '@ant-design/pro-components';
  import { Radio, TreeSelect } from 'antd';
  import type { SizeType } from 'antd/lib/config-provider/SizeContext';
  import dayjs from 'dayjs';
  import React from 'react';
  
  const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-0',
          key: '0-0-0',
        },
      ],
    },
    {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
      children: [
        {
          title: 'Child Node3',
          value: '0-1-0',
          key: '0-1-0',
        },
        {
          title: 'Child Node4',
          value: '0-1-1',
          key: '0-1-1',
        },
        {
          title: 'Child Node5',
          value: '0-1-2',
          key: '0-1-2',
        },
      ],
    },
  ];
  
  export default () => {
    return (
      <div>
        <br />
        <br />
        <LightFilter<{
          gender: string;
        }>
          initialValues={{
            name1: 'yutingzhao1991',
            name3: '2020-08-19',
            range: [20, 80],
            slider: 20,
            gender: [
              {
                value: 'open1',
                label: 'Open',
              },
              {
                value: 'closed2',
                label: 'Closed',
              },
            ],
            datetimeRanger: [
              dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
              dayjs('2019-11-16 12:50:26').valueOf(),
            ],
            timeRanger: [
              dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
              dayjs('2019-11-16 12:50:26').valueOf(),
            ],
          }}
          onFinish={async (values) => console.log(values.gender)}
        >
          <ProFormSelect
            name="gender"
            label="Gender"
            showSearch
            allowClear={false}
            fieldProps={{
              labelInValue: true,
            }}
            valueEnum={{
              male: 'Male',
              female: 'Female',
            }}
          />
          <ProFormSelect
            name="area"
            label="Area"
            mode="multiple"
            valueEnum={{
              beijing: 'Beijing',
              shanghai: 'Shanghai',
              hangzhou: 'Hangzhou',
              long: 'This is a long item for testing overflow',
            }}
          />
          <ProFormCheckbox.Group
            name="checkbox-group"
            label="Checkbox.Group"
            options={['A', 'B', 'C', 'D', 'E', 'F']}
          />
          <ProFormTreeSelect
            initialValue={['0-0', '0-1']}
            label="Tree Dropdown Selector"
            fieldProps={{
              fieldNames: {
                label: 'title',
              },
              treeData,
              treeCheckable: true,
              showCheckedStrategy: TreeSelect.SHOW_PARENT,
              placeholder: 'Please select',
            }}
            name="treeSelect"
          />
          <ProFormCascader
            width="md"
            request={async () => [
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [
                      {
                        value: 'xihu',
                        label: 'West Lake',
                      },
                    ],
                  },
                ],
              },
              {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                  {
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [
                      {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                      },
                    ],
                  },
                ],
              },
            ]}
            name="area"
            label="Region"
            initialValue={['zhejiang', 'hangzhou', 'xihu']}
          />
          <ProFormSwitch name="open" label="Switch" />
          <ProFormDigit name="count" label="Count" />
          <ProFormSlider name="range" label="Range" range />
          <ProFormSlider name="slider" label="Slider" />
          <ProFormText name="name1" label="Name" />
          <ProFormSwitch name="open" label="Switch" secondary />
          <ProFormText name="name2" label="Address" secondary />
          <ProFormDatePicker
            name="name3"
            label="Non-clearable Date"
            allowClear={false}
          />
          <ProFormDateRangePicker name="date" label="Date Range" />
          <ProFormDateTimePicker name="datetime" label="Date Time" />
          <ProFormDateTimeRangePicker
            name="datetimeRanger"
            label="Date Time Range"
          />
          <ProFormTimePicker name="time" label="Time" />
          <ProFormTimePicker.RangePicker name="timeRanger" label="Time Range" />
          <ProFormFieldSet name="name" label="Full Name">
            <ProFormText />
            <ProFormText />
          </ProFormFieldSet>
        </LightFilter>
      </div>
    );
  };
  