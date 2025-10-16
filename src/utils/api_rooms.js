import axios from "axios";

import { API_URL } from "./constants";

export async function getRooms(type, page = 1) {
  const response = await axios.get(
    API_URL + "rooms?page=" + page + (type === "all" ? "" : "&type=" + type)
  );

  return response.data;
}

export async function getRoom(id) {
  const response = await axios.get(API_URL + "rooms/" + id);

  return response.data;
}

export async function addRoom(
  name,
  type,
  description,
  price,
  capacity,
  image,
  token
) {
  const response = await axios.post(
    API_URL + "rooms",
    {
      name: name,
      type: type,
      description: description,
      price: price,
      capacity: capacity,
      image: image,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
        // Bearer jdke0fje00ifi0o...
      },
    }
  );
  return response.data;
}

export async function updateRoom(
  id,
  name,
  type,
  description,
  price,
  capacity,
  image,
  token
) {
  const response = await axios.put(
    API_URL + "rooms/" + id,
    {
      name,
      type,
      description,
      price,
      capacity,
      image,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function deleteRoom(id) {
  const response = await axios.delete(API_URL + "rooms/" + id);
  return response.data;
}
