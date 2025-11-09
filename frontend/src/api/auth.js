import client from './client.js';

export const registerAdmin = (payload) => client.post('/auth/register', payload);
export const login = (payload) => client.post('/auth/login', payload);
export const currentUser = () => client.get('/auth/me');
