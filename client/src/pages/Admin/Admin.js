import { Admin, Resource, ShowGuesser, fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-simple-rest';
import { SERVER_URL } from '../../data/constants';
import UsersIcon from '@mui/icons-material/Group';
import OrdersIcon from '@mui/icons-material/ShoppingCart';
import ProductsIcon from '@mui/icons-material/Store';
import { CreateProduct, EditProduct, GetProducts } from './Items/Products.js';
import GetOrders, { EditOrder } from './Items/Orders.js';
import { CreateUser, EditUser, GetUsers } from './Items/Users.js';
import { Dashboard } from './dashBoard.js';

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
    <Admin dataProvider={dataProvider} dashboard={Dashboard}>
      <Resource
        name="users"
        list={GetUsers}
        edit={EditUser}
        create={CreateUser}
        show={ShowGuesser}
        icon={UsersIcon}
      />
      <Resource
        name="order"
        list={GetOrders}
        edit={EditOrder}
        show={ShowGuesser}
        icon={OrdersIcon}
      />
      <Resource
        name="products"
        list={GetProducts}
        edit={EditProduct}
        show={ShowGuesser}
        create={CreateProduct}
        icon={ProductsIcon}
      />
    </Admin>
  );
};

export default AdminPage;
