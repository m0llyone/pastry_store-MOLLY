import styles from './Products.module.css';
import { useParams, NavLink, useLocation } from 'react-router-dom';
import { Title } from '../../common/Title/Title';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Item } from '../../common/Item/Item';
import { easeOut, motion } from 'framer-motion';
import Pagination from '../../components/Pagination/Pagination';
import { fetchPaginatedProducts } from '../../reducers/productSlice';
import Preloader from '../../common/Preloader/Preloader';
import { addToCart, setCounter } from '../../reducers/userSlice';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { SERVER_URL } from '../../data/constants';
import { Search } from '../../common/Search/Search';

const Products = () => {
  const { url } = useParams();
  const { pathname } = useLocation();

  const { user, isAuth } = useSelector((state) => state.user);
  const { products, pagination, status } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const categories = [
    { title: 'Все', link: 'all' },
    { title: 'Торты', link: 'cakes' },
    { title: 'Пирожные', link: 'brownie' },
    { title: 'Пиццы', link: 'pizza' },
    { title: 'Выпечка', link: 'pastry' },
  ];

  const addProduct = async ({ currentTarget }) => {
    const userId = user?.id;
    const id = currentTarget.id;

    const res = await axios.get(`${SERVER_URL}/api/products/${id}`);
    const { kind, decor, weight } = res.data.category.options;

    if (!isAuth || !userId) {
      return toast.error('Войдите в аккаунт для добавления товара в корзину');
    }

    try {
      await dispatch(
        addToCart({
          userId,
          product: id,
          quantity: 1,
          options: { kind: kind[0], decor: decor[0], weight: weight[0] },
        }),
      ).unwrap();
      dispatch(setCounter(1));
      toast.success('Товар успешно добавлен в корзину');
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(
          fetchPaginatedProducts({
            page,
            category: url !== 'all' ? url : '',
          }),
        );
      } catch (error) {
        toast.error('Ошибка:', error);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [page, url, dispatch]);

  useEffect(() => {
    setPage(1);
  }, [url]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  if (status === 'loading') {
    return <Preloader />;
  }

  return (
    <>
      <Title addStyles={styles.titleCatalog} title="Каталог" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: easeOut }}
        className={styles.container}
        key={url}
      >
        <div className={styles.searchContainer}>
          <nav className={styles.linkContainer}>
            {categories.map(({ title, link }, i) => (
              <NavLink
                key={i}
                className={
                  pathname.slice(1) === `catalog/${link}`
                    ? [styles.navLink_active, styles.navLink].join(' ')
                    : styles.navLink
                }
                to={`/catalog/${link}`}
              >
                {title}
              </NavLink>
            ))}
          </nav>
          <Search />
        </div>
        <div className={styles.productsContainer}>
          {products.map((item) => (
            <div key={item.id}>
              <Item
                id={item.id}
                src={item.images[0]}
                title={item.title}
                price={item.price}
                weight={item.category.baseWeight}
                onClick={addProduct}
                link={item.category.category}
              />
            </div>
          ))}
        </div>
        <Pagination pageCount={pagination.pageCount} page={page} onChange={handlePageClick} />
        <Toaster richColors />
      </motion.div>
    </>
  );
};

export default Products;
