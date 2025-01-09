import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '../useAxios';
import { AgentDouane } from '@/types/reference';
import { message } from 'antd';

const API_URL = '/api/reference/agent-douane/';

const useAgentDouane = () => {
  const api = useAxios();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: agents, isLoading, refetch } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await api.get(API_URL);
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newAgent: Partial<AgentDouane>) => {
      const response = await api.post(API_URL, newAgent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      message.success('Agent douane créé avec succès');
    },
    onError: () => {
      message.error('Erreur lors de la création');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (agent: AgentDouane) => {
      const response = await api.put(`${API_URL}${agent.id}/`, agent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      message.success('Agent douane mis à jour avec succès');
    },
    onError: () => {
      message.error('Erreur lors de la mise à jour');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${API_URL}${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      message.success('Agent douane supprimé avec succès');
    },
    onError: () => {
      message.error('Erreur lors de la suppression');
    }
  });

  return {
    agents,
    isLoading,
    error,
    createAgent: createMutation.mutate,
    updateAgent: updateMutation.mutate,
    deleteAgent: deleteMutation.mutate,
    refetch
  };
};

export default useAgentDouane;
