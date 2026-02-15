const API_BASE = 'https://frontend-assignment-api.goodrequest.dev/api/v1';

export type Shelters = {
  shelters: SheltersItem;
};

export type SheltersItem = { id: string; name: string };

export type ShelterResults = {
  contributors: number;
  contribution: number;
};

export type DonationPayload = {
  donationType: 'foundation' | 'shelter';
  shelterId?: string | null;
  amount: number;
  firstName?: string;
  lastName: string;
  email: string;
  phone: string;
  gdprConsent: boolean;
};

export type ContributeRequest = {
  contributors: Array<{
    firstName?: string;
    lastName: string;
    email: string;
    phone: string;
  }>;
  value: number;
  shelterID?: number;
};

export type ContributeResponse = {
  messages: Array<{
    message: string;
    type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  }>;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export const api = {
  getShelters: () => request<{ shelters: SheltersItem[] }>('/shelters'),
  getShelterResults: () => request<ShelterResults>('/shelters/results'),
  postShelterContribute: (payload: ContributeRequest) =>
    request<ContributeResponse>('/shelters/contribute', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
