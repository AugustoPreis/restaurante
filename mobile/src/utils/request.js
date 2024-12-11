import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
});

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
        reject(err.response.data);
      });
  });
}

function get(context) {
  return api.get(context.url, {
    headers: context.headers,
    params: context.params,
  });
}

function post(context) {
  return api.post(context.url, context.body, {
    headers: context.headers,
    params: context.params,
  });
}

function put(context) {
  return api.put(context.url, context.body, {
    headers: context.headers,
    params: context.params,
  });

}

function _delete(context) {
  return api.delete(context.url, {
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
    context.url = `/api${context.url}`;

    context.headers['Authorization'] = context.user?.token;
  }

  return context;
}