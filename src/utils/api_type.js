import axios from "axios";

import { API_URL } from "./constants";

export const getTypes = async () => {
  const response = await axios.get(API_URL + "types");
  return response.data;
};

export async function getType(id) {
  const response = await axios.get(API_URL + "types/" + id);

  return response.data;
}

export const addNewType = async (label) => {
  const response = await axios.post(API_URL + "types", {
    label,
  });

  return response.data;
};

export const updateType = async (id, label) => {
  const response = await axios.put(API_URL + "types/" + id, {
    label,
  });
  return response.data;
};

export const deleteType = async (id) => {
  const response = await axios.delete(API_URL + "types/" + id);
  return response.data;
};
