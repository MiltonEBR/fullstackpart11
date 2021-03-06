import axios from 'axios'

const baseUrl = '/api/persons'

const get = () => {
  const request = axios.get(baseUrl)
  return request.then((res) => res.data)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((res) => res.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

const del = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request
}

export default {
  get, create, update, del,
}
