const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
export const BASE = BASE_URL;
export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;




// For production, set VITE_BACKEND_URL in frontend/.env to your backend URL
