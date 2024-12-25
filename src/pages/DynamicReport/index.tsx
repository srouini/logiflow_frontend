import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Space,
  Button,
  Table,
  Form,
  Input,
  Tag,
  message,
  TreeSelect,
  Divider,
  Alert,
  DatePicker,
  TimePicker,
  InputNumber,
  Switch,
} from 'antd';
import { DeleteOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import axios from 'axios';
import dayjs from 'dayjs';
import Excel from '../../components/Export';

interface ModelField {
  name: string;
  type: string;
  internal_type: string;
  verbose_name: string;
  is_relation: boolean;
  choices?: Array<{ value: string; label: string }>;
  related_model?: {
    app_label: string;
    model_name: string;
    verbose_name: string;
  };
  related_fields?: ModelField[];
}

interface Model {
  name: string;
  app_label: string;
  verbose_name: string;
}

interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

const STRING_OPERATORS = [
  { label: 'Equals', value: 'exact' },
  { label: 'Contains', value: 'icontains' },
  { label: 'Starts with', value: 'istartswith' },
  { label: 'Ends with', value: 'iendswith' },
  { label: 'In list', value: 'in' },
];

const NUMBER_OPERATORS = [
  { label: 'Equals', value: 'exact' },
  { label: 'Greater than', value: 'gt' },
  { label: 'Less than', value: 'lt' },
  { label: 'Greater than or equal', value: 'gte' },
  { label: 'Less than or equal', value: 'lte' },
  { label: 'In list', value: 'in' },
];

const DATE_OPERATORS = [
  { label: 'Equals', value: 'exact' },
  { label: 'Greater than', value: 'gt' },
  { label: 'Less than', value: 'lt' },
  { label: 'Greater than or equal', value: 'gte' },
  { label: 'Less than or equal', value: 'lte' },
];

const FOREIGN_KEY_OPERATORS = [
  { label: 'Equals', value: 'exact' },
  { label: 'In list', value: 'in' },
];

const DynamicReport: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [fields, setFields] = useState<ModelField[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [filterFields, setFilterFields] = useState<ModelField[]>([]);
  const [relatedRecords, setRelatedRecords] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('/api/reporting/api/models/');
        console.log('Models Response:', response.data);
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
        message.error('Failed to fetch models');
      }
    };
    fetchModels();
  }, []);

  // Fetch fields when model is selected
  useEffect(() => {
    const fetchFields = async () => {
      if (!selectedModel) return;
      
      try {
        const [appLabel, modelName] = selectedModel.split('.');
        const response = await axios.get(
          `/api/reporting/api/models/${appLabel}/${modelName}/fields/`
        );
        console.log('Fields Response:', response.data);
        setFields(response.data);
      } catch (error) {
        console.error('Error fetching fields:', error);
        message.error('Failed to fetch fields');
      }
    };
    
    fetchFields();
  }, [selectedModel]);

  // Process fields when they change
  useEffect(() => {
    console.log('Processing fields:', fields);
    const processFields = (fieldList: ModelField[]): ModelField[] => {
      return fieldList.reduce((acc: ModelField[], field) => {
        // Add the current field
        acc.push(field);
        
        // If it has related fields, process them too
        if (field.is_relation && field.related_fields) {
          // Add related fields with updated names
          const relatedFields = field.related_fields.map(relatedField => ({
            ...relatedField,
            name: `${field.name}__${relatedField.name}`,
            verbose_name: `${field.verbose_name} - ${relatedField.verbose_name}`
          }));
          acc.push(...processFields(relatedFields));
        }
        
        return acc;
      }, []);
    };

    const processedFields = processFields(fields);
    console.log('Processed fields:', processedFields);
    setFilterFields(processedFields);
  }, [fields]);

  const handleModelChange = (value: string) => {
    console.log('Model changed to:', value);
    setSelectedModel(value);
    setSelectedFields([]);
    setFilters([]);
    setData([]);
  };

  const handleFieldsChange = (value: string[]) => {
    console.log('Selected fields changed to:', value);
    setSelectedFields(value);
  };

  const addFilter = () => {
    console.log('Adding new filter');
    setFilters(prev => [...prev, { field: '', operator: '', value: '' }]);
  };

  const removeFilter = (index: number) => {
    console.log('Removing filter at index:', index);
    setFilters(filters => filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, key: string, value: string) => {
    console.log('Updating filter:', { index, key, value });
    setFilters(filters => {
      const newFilters = [...filters];
      newFilters[index] = { ...newFilters[index], [key]: value };
      console.log('New filters:', newFilters);
      return newFilters;
    });
  };

  const fetchRelatedRecords = async (appLabel: string, modelName: string) => {
    try {
      const response = await axios.get(
        `/api/reporting/api/models/${appLabel}/${modelName}/records/`
      );
      console.log('Related records response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching related records:', error);
      message.error('Failed to fetch related records');
      return [];
    }
  };

  const handleFieldSelect = async (index: number, fieldPath: string) => {
    console.log('Field selected:', { index, fieldPath });
    const field = filterFields.find(f => f.name === fieldPath);
    console.log('Found field:', field);

    if (!field) {
      console.error('Field not found in filterFields');
      return;
    }

    // Fix the field path for related fields
    let normalizedFieldPath = fieldPath;
    if (field.is_relation && field.related_model) {
      // If it's a related field path (contains dots), fix the path structure
      if (fieldPath.includes('.')) {
        const parts = fieldPath.split('.');
        // Remove the model name prefix and use the field name for the relation
        parts.shift(); // Remove the model name
        normalizedFieldPath = parts.join('__');
      }
    } else {
      // For non-relation fields, just use the field name
      const parts = fieldPath.split('.');
      normalizedFieldPath = parts[parts.length - 1];
    }

    console.log('Normalized field path:', normalizedFieldPath);
    updateFilter(index, 'field', normalizedFieldPath);
    updateFilter(index, 'operator', '');
    updateFilter(index, 'value', '');

    if (field.is_relation && field.related_model) {
      try {
        console.log('Fetching related records for:', field.related_model);
        const records = await fetchRelatedRecords(
          field.related_model.app_label,
          field.related_model.model_name
        );
        console.log('Fetched related records:', records);
        setRelatedRecords(prev => ({
          ...prev,
          [fieldPath]: records
        }));
      } catch (error) {
        console.error('Error fetching related records:', error);
        message.error('Failed to fetch related records');
      }
    }
  };

  const buildTreeData = (fields: ModelField[]): any[] => {
    return fields.map((field) => ({
      title: field.verbose_name,
      value: field.name,
      key: field.name,
      selectable: true,
      children: field.is_relation && field.related_fields 
        ? buildTreeData(field.related_fields.map(rf => ({
            ...rf,
            name: `${field.name}__${rf.name}`,
            verbose_name: `${field.verbose_name} - ${rf.verbose_name}`
          })))
        : undefined
    }));
  };

  const getOperatorsForField = (field: ModelField): any[] => {
    console.log('Getting operators for field:', field);
    
    if (field.choices) {
      return [
        { label: 'Equals', value: 'exact' },
        { label: 'In list', value: 'in' }
      ];
    }
    
    if (field.is_relation) {
      return FOREIGN_KEY_OPERATORS;
    }
    
    switch (field.internal_type) {
      case 'DateTimeField':
        return DATE_OPERATORS;
      case 'DateField':
        return DATE_OPERATORS.filter(op => !op.value.includes('time'));
      case 'IntegerField':
      case 'BigIntegerField':
      case 'FloatField':
      case 'DecimalField':
        return NUMBER_OPERATORS;
      case 'BooleanField':
        return [{ label: 'Equals', value: 'exact' }];
      default:
        return STRING_OPERATORS;
    }
  };

  const renderFilterInput = (filter: FilterCondition, index: number) => {
    const field = filterFields.find(f => f.name === filter.field);
    if (!field) return null;

    const { internal_type, is_relation, choices } = field;

    // Handle fields with choices
    if (choices) {
      return filter.operator === 'in' ? (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          value={filter.value ? filter.value.split(',') : []}
          onChange={(values) => updateFilter(index, 'value', values.join(','))}
          options={choices}
          placeholder="Select options"
        />
      ) : (
        <Select
          style={{ width: '100%' }}
          value={filter.value}
          onChange={(value) => updateFilter(index, 'value', value)}
          options={choices}
          placeholder="Select an option"
        />
      );
    }

    // Handle relation fields
    if (is_relation) {
      const records = relatedRecords[filter.field] || [];
      return filter.operator === 'in' ? (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          value={filter.value ? filter.value.split(',') : []}
          onChange={(values) => updateFilter(index, 'value', values.join(','))}
          options={records.map((record) => ({
            label: record.display,
            value: record.id.toString(),
          }))}
          placeholder={`Select ${field.related_model?.verbose_name || 'records'}`}
        />
      ) : (
        <Select
          style={{ width: '100%' }}
          value={filter.value}
          onChange={(value) => updateFilter(index, 'value', value)}
          options={records.map((record) => ({
            label: record.display,
            value: record.id.toString(),
          }))}
          placeholder={`Select ${field.related_model?.verbose_name || 'a record'}`}
        />
      );
    }

    switch (internal_type) {
      case 'DateTimeField':
        return filter.operator.includes('date') ? (
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date) => 
              updateFilter(index, 'value', date ? date.format('YYYY-MM-DD') : '')
            }
            value={filter.value ? dayjs(filter.value) : null}
          />
        ) : (
          <DatePicker
            showTime
            style={{ width: '100%' }}
            onChange={(date) => 
              updateFilter(index, 'value', date ? date.format('YYYY-MM-DD HH:mm:ss') : '')
            }
            value={filter.value ? dayjs(filter.value) : null}
          />
        );
        
      case 'DateField':
        return (
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date) => 
              updateFilter(index, 'value', date ? date.format('YYYY-MM-DD') : '')
            }
            value={filter.value ? dayjs(filter.value) : null}
          />
        );
        
      case 'IntegerField':
      case 'BigIntegerField':
      case 'FloatField':
      case 'DecimalField':
        return filter.operator === 'in' ? (
          <Input
            style={{ width: '100%' }}
            value={filter.value}
            onChange={(e) => updateFilter(index, 'value', e.target.value)}
            placeholder="Enter comma-separated numbers"
          />
        ) : (
          <InputNumber
            style={{ width: '100%' }}
            value={filter.value ? Number(filter.value) : null}
            onChange={(value) => updateFilter(index, 'value', value?.toString() || '')}
          />
        );
        
      case 'BooleanField':
        return (
          <Switch
            checked={filter.value === 'true'}
            onChange={(checked) => updateFilter(index, 'value', checked.toString())}
          />
        );
        
      default:
        return filter.operator === 'in' ? (
          <Input
            style={{ width: '100%' }}
            value={filter.value}
            onChange={(e) => updateFilter(index, 'value', e.target.value)}
            placeholder="Enter comma-separated values"
          />
        ) : (
          <Input
            style={{ width: '100%' }}
            value={filter.value}
            onChange={(e) => updateFilter(index, 'value', e.target.value)}
            placeholder="Enter value"
          />
        );
    }
  };

  const handleQuery = async () => {
    if (!selectedModel || selectedFields.length === 0) {
      message.error('Please select a model and at least one field');
      return;
    }

    setLoading(true);
    try {
      // Prepare filters by normalizing field paths
      const validFilters = filters
        .filter(f => f.field && f.operator && (f.value !== undefined && f.value !== ''))
        .map(f => {
          let normalizedField = f.field;
          // If it's a related field path (contains dots)
          if (f.field.includes('.')) {
            const parts = f.field.split('.');
            // Remove the model name prefix
            parts.shift();
            normalizedField = parts.join('__');
          }
          return {
            ...f,
            field: normalizedField
          };
        });

      // Normalize selected fields
      const normalizedFields = selectedFields.map(field => {
        if (field.includes('.')) {
          const parts = field.split('.');
          // Remove the model name prefix
          parts.shift();
          return parts.join('__');
        }
        return field;
      });

      console.log('Sending query with:', {
        model: selectedModel,
        fields: normalizedFields,
        filters: validFilters
      });

      const response = await axios.post('/api/reporting/api/query/', {
        model: selectedModel,
        fields: normalizedFields,
        filters: validFilters,
      });
      
      console.log('Query response:', response.data);
      
      if (Array.isArray(response.data)) {
        setData(response.data);
        if (response.data.length === 0) {
          message.info('No results found for your query');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error querying data:', error);
      message.error(
        error.response?.data?.error || 
        'Failed to fetch data. Please check your filters and try again.'
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getExportColumns = () => {
    return selectedFields.map(field => ({
      title: field,
      dataIndex: field,
      selected: true
    }));
  };

  const getExportFilters = () => {
    const validFilters = filters
      .filter(f => f.field && f.operator && (f.value !== undefined && f.value !== ''))
      .map(f => {
        let normalizedField = f.field;
        if (f.field.includes('.')) {
          const parts = f.field.split('.');
          parts.shift();
          normalizedField = parts.join('__');
        }
        return {
          field: normalizedField,
          operator: f.operator,
          value: f.value
        };
      });

    // Convert filters array to query params format
    const queryParams: Record<string, any> = {};
    validFilters.forEach(filter => {
      if (filter.operator === 'in') {
        queryParams[`${filter.field}__${filter.operator}`] = filter.value.join(',');
      } else {
        queryParams[`${filter.field}__${filter.operator}`] = filter.value;
      }
    });

    return queryParams;
  };

  return (
    <PageContainer>
      <Card>
        <Form layout="vertical">
          <Form.Item label="Model">
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a model"
              value={selectedModel}
              onChange={handleModelChange}
              options={models.map((model) => ({
                label: `${model.app_label}.${model.name}`,
                value: `${model.app_label}.${model.name}`
              }))}
            />
          </Form.Item>

          <Form.Item label="Fields">
            <TreeSelect
              treeData={buildTreeData(fields)}
              value={selectedFields}
              onChange={handleFieldsChange}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              placeholder="Select fields to display"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Filters">
            <Space direction="vertical" style={{ width: '100%' }}>
              {filters.map((filter, index) => {
                const field = filterFields.find(f => f.name === filter.field);
                console.log(`Rendering filter ${index}:`, { filter, field });
                
                return (
                  <Card 
                    key={index}
                    size="small"
                    bordered
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFilter(index)}
                      />
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <TreeSelect
                        style={{ width: '100%' }}
                        value={filter.field}
                        onChange={(value) => handleFieldSelect(index, value)}
                        treeData={buildTreeData(fields)}
                        placeholder="Select field"
                        showSearch
                        treeNodeFilterProp="title"
                      />
                      
                      {filter.field && field && (
                        <Select
                          style={{ width: '100%' }}
                          value={filter.operator}
                          onChange={(value) => updateFilter(index, 'operator', value)}
                          options={getOperatorsForField(field)}
                          placeholder="Select operator"
                        />
                      )}
                      
                      {filter.field && field && filter.operator && (
                        <div style={{ width: '100%' }}>
                          {renderFilterInput(filter, index)}
                        </div>
                      )}
                    </Space>
                  </Card>
                );
              })}
              
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={addFilter}
              >
                Add Filter
              </Button>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                onClick={handleQuery}
                loading={loading}
                disabled={!selectedModel || selectedFields.length === 0}
              >
                Query
              </Button>

              {selectedModel && selectedFields.length > 0 && (
                <Excel
                  columns={getExportColumns()}
                  filters={getExportFilters()}
                  endpoint={`/api/reporting/api/query/`}
                  button_text="Export"
                  query_params={{
                    model: selectedModel,
                    fields: selectedFields,
                    all: true
                  }}
                />
              )}
            </Space>
          </Form.Item>

          {data.length > 0 && (
            <Table
              columns={selectedFields.map(field => ({
                title: field,
                dataIndex: field,
                key: field,
              }))}
              dataSource={data}
              rowKey="id"
              scroll={{ x: 'max-content' }}
            />
          )}
        </Form>
      </Card>
    </PageContainer>
  );
};

export default DynamicReport;
