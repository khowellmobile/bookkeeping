// Holds application-wide constants sourced from environment variables. (helps with jest testing)
const {
  VITE_BASE_URL, 
  MODE,          
} = import.meta.env;

export const BASE_URL = VITE_BASE_URL;
export const ENVIRONMENT = MODE;