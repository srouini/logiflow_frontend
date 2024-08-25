import {
    ProFormDatePicker,
    ProFormText,
    QueryFilter,
  } from '@ant-design/pro-components';
  


  export default ({setFilters,resetFilters}:any) => {

    const handleSubmission = (values:any) => {
      setFilters(values)
    }
    return (
      <QueryFilter defaultCollapsed split onFinish={handleSubmission} onReset={resetFilters}>
        <ProFormText name="numero__icontains" label="Numéro" />
        <ProFormDatePicker name="createDate" label="创建时间" />
        <ProFormText name="status" label="应用状态" />
        <ProFormDatePicker name="replyDate" label="响应日期" />
        <ProFormDatePicker name="startDate" label="创建时间" />
        <ProFormDatePicker name="endDate" label="结束时间" />
      </QueryFilter>
    );
  };