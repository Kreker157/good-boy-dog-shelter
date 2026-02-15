import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ContributeRequest, DonationPayload } from './api';

export const queryKeys = {
  shelters: ['shelters'] as const,
  sheltersResult: ['sheltersResult'] as const,
};

export function useSheltersQuery() {
  return useQuery({
    queryKey: queryKeys.shelters,
    queryFn: api.getShelters,
    staleTime: 5 * 60 * 1000,
    select: (data) => data.shelters,
  });
}

export function useSheltersResultQuery() {
  return useQuery({
    queryKey: queryKeys.sheltersResult,
    queryFn: api.getShelterResults,
    refetchInterval: 60 * 1000,
  });
}

export function useSubmitDonationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContributeRequest) =>
      api.postShelterContribute(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sheltersResult });
    },
  });
}
