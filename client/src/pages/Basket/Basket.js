import { useDispatch, useSelector } from 'react-redux';
import styles from './Basket.module.css';
import { Button } from '../../common/Button/Button';
import { ReactComponent as Cross } from '../../assets/images/crossIcon.svg';
import { useNavigate, Link } from 'react-router-dom';
import cart from '../../assets/images/emptyCart.svg';
import { easeOut, motion } from 'framer-motion';
import axios from 'axios';
import { SERVER_URL } from '../../data/constants';
import { removeAllProducts, removeProduct } from '../../reducers/userSlice';
import Preloader from '../../common/Preloader/Preloader';

const Basket = () => {
  const { basket, user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteProduct = async ({ currentTarget }) => {
    const { id } = currentTarget;
    try {
      await axios.delete(`${SERVER_URL}/api/cart?id=${basket.id}&product=${id}`);
      dispatch(removeProduct({ id }));
    } catch (error) {
      console.log(error);
    }
  };

  const clearBasket = async () => {
    try {
      await axios.delete(`${SERVER_URL}/api/cart/${user.id}`);
      dispatch(removeAllProducts());
    } catch (error) {
      console.log(error);
    }
  };

  if (status === 'loading') {
    return <Preloader />;
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: easeOut }}
    >
      {basket.items && basket.items.length > 0 ? (
        <div className={styles.removeContainer}>
          <span className={styles.title}>Ваш заказ:</span>
          <div onClick={clearBasket}>
            <Cross className={styles.cross} />
          </div>
        </div>
      ) : (
        <div className={styles.emptyBasket}>
          <img src={cart} alt="cart" />
          <div className={styles.emptyBasketText}>Корзина пустая</div>
        </div>
      )}
      <div className={styles.productsContainer}>
        {basket.items?.map((el) => (
          <div key={el._id}>
            <div
              id={el._id}
              onClick={(e) => deleteProduct(e)}
              className={[styles.removeContainer, styles.crossContainer].join(' ')}
            >
              <Cross className={styles.cross} />
            </div>
            <div className={styles.productContainer}>
              <div className={styles.aboutContainer}>
                <Link to={`/catalog/cakes/${el.product.id}`}>
                  <img
                    className={styles.productImage}
                    width={'286px'}
                    src={el.product.images[0]}
                    alt="img"
                  />
                </Link>
                <div>
                  <span className={styles.title}>{el.product.title}</span>
                  <div className={styles.propsContainer}>
                    <div className={styles.props}>
                      <span>Вид:</span>
                      <span>Декор:</span>
                      <span>Вес:</span>
                    </div>
                    <div className={styles.props}>
                      <span>{el.options.kind}</span>
                      <span>{el.options.decor}</span>
                      <span>{el.options.weight}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.priceContainer}>
                <span style={{ fontSize: '18px' }}>Ваш заказ:</span>
                <div>
                  <div className={styles.price}>
                    <span> Сумма заказа: </span>
                    <span>
                      {el.product.price}BYN(x{el.quantity})
                    </span>
                  </div>
                  <div className={styles.finalPrice}>
                    <span>
                      Общая сумма: {parseFloat(el.quantity * el.product.price).toFixed(2)} BYN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {basket.items && basket.items.length > 0 ? (
        <div className={styles.fullPriceContainer}>
          <div className={styles.fullPrice}>
            <div>
              <span>Итого: {parseFloat(basket.total).toFixed(2)} BYN</span>
            </div>
            <Button onClick={() => navigate('/form')} addStyles={styles.basketButton}>
              Оформить
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
    </motion.div>
  );
};

export default Basket;
