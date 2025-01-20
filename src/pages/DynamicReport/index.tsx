import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Space,
  Button,
  Table,
  Form,
  Input,
  message,
  TreeSelect,
  DatePicker,
  InputNumber,
  Switch,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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
    const processFields = (fieldList: ModelField[], parentPath = ''): ModelField[] => {
      const processed: ModelField[] = [];
      
      fieldList.forEach(field => {
        console.log('parentPath:', parentPath);
        const currentPath = parentPath ? `${parentPath}__${field.name}` : field.name;
        const currentVerbose = parentPath ? `${parentPath} - ${field.verbose_name}` : field.verbose_name;
        
        // Add the current field
        processed.push({
          ...field,
          name: currentPath,
          verbose_name: currentVerbose
        });
        
        // Process related fields recursively
        if (field.is_relation && field.related_fields) {
          const nestedFields = processFields(field.related_fields, currentPath);
          // Adjust the path by removing the first parent segment if it's nested
          nestedFields.forEach(nestedField => {
            nestedField.name = nestedField.name.replace(/^[^__]+__/, '');
          });
          processed.push(...nestedFields);
        }
      });
      console.log('Processed fields:', processed);
      return processed;
    };

    const processedFields = processFields(fields);
    setFilterFields(processedFields);
  }, [fields]);

  const handleModelChange = async (value: string) => {
    console.log('Model changed to:', value);
    setSelectedModel(value);
    setSelectedFields([]);
    setFilters([]);
    setData([]);
    setRelatedRecords({});
  };

  const handleFieldsChange = (value: string[]) => {
    console.log('Selected fields before processing:', value);
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
    // Remove any duplicate segments in the path
    const parts = fieldPath.split('__');
    // Remove duplicates while preserving order
    const seen = new Set<string>();
    const uniqueParts = parts.filter(part => {
      if (seen.has(part)) {
        return false;
      }
      seen.add(part);
      return true;
    });
    const cleanedFieldPath = uniqueParts.join('__');
    
    const field = filterFields.find(f => f.name === cleanedFieldPath);
    console.log('Found field:', field);

    if (!field) {
      console.error('Field not found in filterFields');
      message.error('Invalid field selected');
      return;
    }

    updateFilter(index, 'field', cleanedFieldPath);
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
        
        if (!Array.isArray(records)) {
          throw new Error('Invalid records format');
        }

        setRelatedRecords(prev => ({
          ...prev,
          [cleanedFieldPath]: records.map(record => ({
            ...record,
            label: record.display || String(record.id),
            value: String(record.id)
          }))
        }));
      } catch (error) {
        console.error('Error fetching related records:', error);
        message.error('Failed to fetch related records');
        updateFilter(index, 'field', '');
      }
    }
  };

  const buildTreeData = (fields: ModelField[]): any[] => {
    const processNode = (field: ModelField, parentPath = ''): any => {
      const currentPath = parentPath ? `${parentPath}__${field.name}` : field.name;
      
      const node = {
        title: field.verbose_name,
        value: currentPath,
        key: currentPath,
        selectable: true // Allow all nodes to be selectable
      };

      if (field.is_relation && field.related_fields) {
        const children = field.related_fields.map(rf => processNode(rf, currentPath));
        return {
          ...node,
          children
        };
      }

      return node;
    };

    return fields.map(field => processNode(field));
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
          showSearch
          optionFilterProp="label"
        />
      ) : (
        <Select
          style={{ width: '100%' }}
          value={filter.value}
          onChange={(value) => updateFilter(index, 'value', value)}
          options={choices}
          placeholder="Select an option"
          showSearch
          optionFilterProp="label"
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
          options={records}
          placeholder={`Select ${field.related_model?.verbose_name || 'records'}`}
          showSearch
          optionFilterProp="label"
          loading={!records.length}
        />
      ) : (
        <Select
          style={{ width: '100%' }}
          value={filter.value}
          onChange={(value) => updateFilter(index, 'value', value)}
          options={records}
          placeholder={`Select ${field.related_model?.verbose_name || 'a record'}`}
          showSearch
          optionFilterProp="label"
          loading={!records.length}
        />
      );
    }

    switch (internal_type) {
      case 'DateTimeField':
        return (
          <DatePicker
            showTime={!filter.operator.includes('date')}
            style={{ width: '100%' }}
            onChange={(date) => 
              updateFilter(index, 'value', date ? 
                date.format(filter.operator.includes('date') ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss') 
                : ''
              )
            }
            value={filter.value ? dayjs(filter.value) : null}
            format={filter.operator.includes('date') ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'}
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
            format="YYYY-MM-DD"
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
            precision={internal_type === 'FloatField' || internal_type === 'DecimalField' ? 2 : 0}
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
            allowClear
          />
        );
    }
  };

  const getExportColumns = () => {
    return selectedFields.map(field => {
      const fieldObj = filterFields.find(f => f.name === field);
      return {
        title: fieldObj?.verbose_name || field,
        dataIndex: field,
        selected: true
      };
    });
  };

  const getExportFilters = () => {
    const validFilters = filters
      .filter(f => f.field && f.operator && (f.value !== undefined && f.value !== ''))
      .map(f => {
        let normalizedField = f.field;
        if (f.field.includes('.')) {
          const parts = f.field.split('.');
          // Remove the model name prefix and use the field name for the relation
          parts.shift(); // Remove the model name
          normalizedField = parts.join('__');
        }
        return {
          field: normalizedField,
          operator: f.operator,
          value: f.value
        };
      });

    const queryParams: Record<string, any> = {};
    validFilters.forEach(filter => {
      if (filter.operator === 'in') {
        // Handle array values for 'in' operator
        const values = Array.isArray(filter.value) ? filter.value : filter.value.split(',');
        queryParams[`${filter.field}__${filter.operator}`] = values.join(',');
      } else if (filter.value === 'true' || filter.value === 'false') {
        // Handle boolean values
        queryParams[`${filter.field}__${filter.operator}`] = filter.value === 'true';
      } else {
        queryParams[`${filter.field}__${filter.operator}`] = filter.value;
      }
    });

    return queryParams;
  };

  const handleQuery = async () => {
    if (!selectedModel || selectedFields.length === 0) {
      message.error('Please select a model and at least one field');
      return;
    }

    setLoading(true);
    try {
      // Clean and validate filters
      const validFilters = filters
        .filter(f => f.field && f.operator && f.value !== undefined && f.value !== '')
        .map(f => {
          const field = filterFields.find(ff => ff.name === f.field);
          if (!field) {
            throw new Error(`Invalid field: ${f.field}`);
          }
          
          return {
            field: f.field,
            operator: f.operator,
            value: processFilterValue(f)
          };
        });

      // Clean and validate selected fields
      const validFields = selectedFields
        .map(field => {
          const fieldObj = filterFields.find(f => f.name === field);
          if (!fieldObj) {
            console.warn(`Skipping invalid field: ${field}`);
            return null;
          }
          return field;
        })
        .filter((field): field is string => field !== null);

      if (validFields.length === 0) {
        throw new Error('No valid fields selected');
      }

      console.log('Sending query with:', {
        model: selectedModel,
        fields: validFields,
        filters: validFilters
      });

      const response = await axios.post('/api/reporting/api/query/', {
        model: selectedModel,
        fields: validFields,
        filters: validFilters,
      });
      
      if (Array.isArray(response.data)) {
        const formattedData = response.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setData(formattedData);
        
        if (formattedData.length === 0) {
          message.info('No results found for your query');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error querying data:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch data';
      message.error(errorMessage);
      if (error.response?.data?.detail) {
        message.error(error.response.data.detail);
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const processFilterValue = (filter: FilterCondition) => {
    const field = filterFields.find(f => f.name === filter.field);
    if (!field) {
      console.warn(`Field not found: ${filter.field}`);
      return filter.value;
    }

    try {
      if (filter.operator === 'in') {
        return filter.value.split(',').map(v => v.trim()).filter(v => v !== '');
      }

      switch (field.internal_type) {
        case 'BooleanField':
          return filter.value === 'true';
        case 'IntegerField':
        case 'BigIntegerField':
          const intValue = parseInt(filter.value, 10);
          if (isNaN(intValue)) {
            throw new Error(`Invalid integer value: ${filter.value}`);
          }
          return intValue;
        case 'FloatField':
        case 'DecimalField':
          const floatValue = parseFloat(filter.value);
          if (isNaN(floatValue)) {
            throw new Error(`Invalid decimal value: ${filter.value}`);
          }
          return floatValue;
        default:
          return filter.value;
      }
    } catch (error) {
      console.error('Error processing filter value:', error);
      message.error(`Invalid value for field ${field.verbose_name}`);
      return filter.value;
    }
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
                label: model.verbose_name,
                value: `${model.app_label}.${model.name}`,
                title: `${model.app_label}.${model.name}`
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
              maxTagCount="responsive"
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
              columns={selectedFields.map(field => {
                const fieldObj = filterFields.find(f => f.name === field);
                return {
                  title: fieldObj?.verbose_name || field,
                  dataIndex: field,
                  key: field,
                  render: (value: any) => {
                    if (value === true) return 'Yes';
                    if (value === false) return 'No';
                    if (value === null) return '-';
                    return value;
                  }
                };
              })}
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
