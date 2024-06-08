import { Admin, CustomRoutes, Resource, ShowGuesser, fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-simple-rest';
import { SERVER_URL } from '../../data/constants';

import { EditProduct, GetProducts } from './Items/Products.js';
import GetOrders, { EditOrder } from './Items/Orders.js';
import customDataProvider from './dataProvider.js';
import { Route } from 'react-router-dom';
import { CreateUser, EditUser, GetUsers } from './Items/Users.js';

const AdminPage = () => {
  const httpClient = (url, options = {}) => {
    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
  };

  const dataProvider = jsonServerProvider(`${SERVER_URL}/api`, httpClient);
  return (
    <Admin dataProvider={dataProvider} darkTheme>
      <Resource
        name="users"
        list={GetUsers}
        edit={EditUser}
        create={CreateUser}
        show={ShowGuesser}
      />
      <Resource name="order" list={GetOrders} edit={EditOrder} />
      <Resource name="products" list={GetProducts} edit={EditProduct} />
      {/* <CustomRoutes></CustomRoutes> */}
    </Admin>
  );
};

export default AdminPage;
