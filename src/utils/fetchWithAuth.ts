// src/utils/fetchWithAuth.ts
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {

  const token = localStorage.getItem('access-token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('access-token');
    window.location.href = '/authorization'; // Перенаправление на страницу авторизации
    
  }

  return response;
};

export default fetchWithAuth;
