// yours
// export const API_URL = "http://localhost:5123/";
// mine
export const API_URL = import.meta.env.DEV
  ? "http://localhost:5555/"
  : "http://b15-rentai.mak3r.dev/api/";
