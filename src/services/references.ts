export const fetchNavireData = async (params: any) => {
    const response = await api.get('/api/reference/navire/', { params });
    return response.data;
  };