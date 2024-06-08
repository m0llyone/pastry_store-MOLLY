import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import jsonServerProvider from 'ra-data-simple-rest';
import { SERVER_URL } from '../../data/constants';

const apiUrl = `${SERVER_URL}/api`;
const httpClient = fetchUtils.fetchJson;

const dataProvider = jsonServerProvider(apiUrl, httpClient);

const customDataProvider = {
  ...dataProvider,
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
      ...params.filter,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    // Дополнительный запрос для получения общего количества элементов
    const countUrl = `${apiUrl}/${resource}/count?${stringify(params.filter)}`;

    return Promise.all([
      httpClient(url).then(({ headers, json }) => ({
        data: json,
        total: parseInt(headers.get('x-total-count'), 10),
      })),
      httpClient(countUrl).then(({ json }) => json.count),
    ]).then(([data, total]) => ({
      ...data,
      total,
    }));
  },
  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),
  getMany: (resource, params) => {
    const query = {
      id: params.ids,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({
      data: json,
    }));
  },
  // getManyReference: (resource, params) => {
  //   const { page, perPage } = params.pagination;
  //   const { field, order } = params.sort;
  //   const query = {
  //     _sort: field,
  //     _order: order,
  //     _start: (page - 1) * perPage,
  //     _end: page * perPage,
  //     [params.target]: params.id,
  //     ...params.filter,
  //   };
  //   const url = `${apiUrl}/${resource}?${stringify(query)}`;

  //   return httpClient(url).then(({ headers, json }) => {
  //     if (!headers.has('x-total-count')) {
  //       throw new Error(
  //         'The X-Total-Count header is missing in the HTTP Response. The server must include this header in the response.',
  //       );
  //     }
  //     return {
  //       data: json,
  //       total: parseInt(headers.get('x-total-count'), 10),
  //     };
  //   });
  // },
  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource, params) => {
    const query = {
      id: params.ids,
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'DELETE',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },
};

export default customDataProvider;
