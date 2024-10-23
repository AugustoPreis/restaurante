import axios from 'axios';
import { getToken, logout } from '../providers/AuthProvider';

export default function request(url, context) {
  const normalizedContext = normalizeContext(url, context);
  let httpRequest;

  switch (context.method) {
    default:
    case 'GET':
      httpRequest = get(normalizedContext);
      break;
    case 'POST':
      httpRequest = post(normalizedContext);
      break;
    case 'PUT':
      httpRequest = put(normalizedContext);
      break;
    case 'DELETE':
      httpRequest = _delete(normalizedContext);
      break;
  }

  return new Promise((resolve, reject) => {
    httpRequest
      .then((response) => {
        resolve(response.data);
      }).catch((err) => {
        if (err.response.status === 401) {
          logout();
        }

        reject(err.response.data);
      });
  });
}

function get(context) {
  return axios.get(context.url, {
    headers: context.headers,
    params: context.params,
  });
}

function post(context) {
  return axios.post(context.url, context.body, {
    headers: context.headers,
    params: context.params,
  });
}

function put(context) {
  return axios.put(context.url, context.body, {
    headers: context.headers,
    params: context.params,
  });
}

function _delete(context) {
  return axios.delete(context.url, {
    headers: context.headers,
    params: context.params,
  });
}

function normalizeContext(url, dirt) {
  const context = { ...dirt };

  context.method = context.method?.toUpperCase();
  context.url = url;

  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(context.method)) {
    context.method = 'GET';
  }

  if (!context.headers) {
    context.headers = {};
  }

  if (context.api !== false) {
    const token = getToken();

    if (context.admin) {
      context.url = `/admin${context.url}`;
    }

    context.url = `/api${context.url}`;

    if (token) {
      context.headers['Authorization'] = token;
    }
  }

  if (context.multipart) {
    context.headers['Content-Type'] = 'multipart/form-data';
    context.body = multipartBody(context.body, context.files);
  }

  return context;
}

function multipartBody(body, files) {
  const formData = new FormData();

  formData.append('data', JSON.stringify(body || {}));
  formData.append('isMultipartRequest', 'true');

  if (!Array.isArray(files)) {
    return formData;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file?.originFileObj) {
      continue;
    }

    formData.append(`arquivo_${i + 1}`, file.originFileObj);
  }

  return formData;
}