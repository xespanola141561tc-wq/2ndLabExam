// DummyJSON API configured in the Postman collection.
export const API_BASE_URL = 'https://dummyjson.com';

// Keep API paths in one place so screens use the same endpoint configuration.
export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  profile: `${API_BASE_URL}/auth/me`,
  students: `${API_BASE_URL}/users`,
  studentById: (id: string) => `${API_BASE_URL}/users/${encodeURIComponent(id)}`,
} as const;
