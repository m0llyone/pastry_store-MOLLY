import Main from '../pages/Main/Main';
import Products from '../pages/Products/Products';
import Basket from '../pages/Basket/Basket';
import Product from '../pages/Product/Product';
import OrderForm from '../pages/Form/OrderForm';
import PrivacyPage from '../pages/PrivacyPage/PrivacyPage';
import Terms from '../pages/Terms/Terms';

export const routes = [
  { path: '/', element: Main },
  { path: '/catalog/:url', element: Products },
  { path: '/catalog/:url/:id', element: Product },
  { path: '/basket', element: Basket },
  { path: '/form', element: OrderForm },
  { path: '/privacy-policy', element: PrivacyPage },
  { path: '/terms-of-use', element: Terms },
];
