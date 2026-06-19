const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4037/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('scentpulse_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('scentpulse_token');
    localStorage.removeItem('scentpulse_user');
    window.location.href = '/login';
    throw new Error('Oturum süresi doldu');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  health: () => fetchAPI('/health'),

  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; atelierName: string; city?: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  me: () => fetchAPI('/auth/me'),

  dashboardStats: () => fetchAPI('/dashboard/stats'),

  getClients: () => fetchAPI('/clients'),
  getClient: (id: string) => fetchAPI(`/clients/${id}`),
  createClient: (data: Record<string, unknown>) => fetchAPI('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: string, data: Record<string, unknown>) => fetchAPI(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteClient: (id: string) => fetchAPI(`/clients/${id}`, { method: 'DELETE' }),

  getFormulas: () => fetchAPI('/formulas'),
  createFormula: (data: Record<string, unknown>) => fetchAPI('/formulas', { method: 'POST', body: JSON.stringify(data) }),
  updateFormula: (id: string, data: Record<string, unknown>) => fetchAPI(`/formulas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getIngredients: () => fetchAPI('/ingredients'),
  createIngredient: (data: Record<string, unknown>) => fetchAPI('/ingredients', { method: 'POST', body: JSON.stringify(data) }),
  updateIngredient: (id: string, data: Record<string, unknown>) => fetchAPI(`/ingredients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteIngredient: (id: string) => fetchAPI(`/ingredients/${id}`, { method: 'DELETE' }),

  getOrders: () => fetchAPI('/orders'),
  createOrder: (data: Record<string, unknown>) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id: string, data: Record<string, unknown>) => fetchAPI(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getAppointments: () => fetchAPI('/appointments'),
  createAppointment: (data: Record<string, unknown>) => fetchAPI('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointment: (id: string, data: Record<string, unknown>) => fetchAPI(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAppointment: (id: string) => fetchAPI(`/appointments/${id}`, { method: 'DELETE' }),
};
