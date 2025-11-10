import client from './client.js';

export const fetchPublishedSurveys = () => client.get('/public/surveys');
export const fetchPublishedSurvey = (id) => client.get(`/public/surveys/${id}`);
export const fetchAdminSurveys = () => client.get('/surveys');
export const fetchSurvey = (id) => client.get(`/surveys/${id}`);
export const createSurvey = (payload) => client.post('/surveys', payload);
export const updateSurvey = (id, payload) => client.put(`/surveys/${id}`, payload);
export const togglePublication = (id, published) => client.patch(`/surveys/${id}/publication`, null, { params: { published } });
export const deleteSurvey = (id) => client.delete(`/surveys/${id}`);
export const submitResponse = (payload) => client.post('/responses', payload);
export const fetchResponses = (surveyId) => client.get(`/responses/survey/${surveyId}`);
