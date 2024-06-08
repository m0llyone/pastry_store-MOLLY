import styles from './Product.module.css';
import { useLocation, useParams } from 'react-router-dom';
import { Button } from '../../common/Button/Button';
import { Link } from 'react-router-dom';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Carousel from 'nuka-carousel';
import { AppContext } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../common/Modal/Modal';
import { Item } from '../../common/Item/Item';
import { motion, easeOut } from 'framer-motion';
import { SERVER_URL } from '../../data/constants';
import axios from 'axios';
import Preloader from '../../common/Preloader/Preloader';
import { Toaster, toast } from 'sonner';
import minus from '../../assets/images/minus.svg';
import plus from '../../assets/images/plus.svg';
import cake from '../../assets/images/cakes/oreo/oreo-1.jpg';
import { addToCart, setBasket, setCounter } from '../../reducers/userSlice';

const Product = () => {
  const { url, id } = useParams();
  const [active, setActive] = useState(0);
  const { isAuth, user, basket } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState({
    kind: 'Классическкий',
    decor: 'Без декора',
    weight: '1 кг',
  });
  const [suggestion, setSuggestion] = useState([]);
  const [modal, setModal] = useState(false);
  const [disabled, setDisabled] = useState(false); // не нужен
  const [cartCount, setCartCount] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productResponse, suggestionResponse] = await Promise.all([
          axios.get(`${SERVER_URL}/api/products/${id}`),
          axios.get(`${SERVER_URL}/api/product/${id}/similar`),
        ]);
        setProduct(productResponse.data);
        setSuggestion(suggestionResponse.data);
        setLoading(false);
      } catch (error) {
        toast.error('Ошибка при загрузке данных');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  console.log(suggestion, 'suggestion');

  const handleAddCount = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  const handleSubCount = useCallback(() => {
    cartCount > 1 && setCartCount((prev) => prev - 1);
  }, [cartCount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addToBasket = async (e) => {
    e.preventDefault();

    if (!isAuth) {
      return toast.error('Войдите в аккаунт для добавления товара в корзину');
    }

    const userId = user?.id;

    if (!userId) {
      return toast.error('Ошибка авторизации. Повторите вход.');
    }

    console.log([{ product: id, quantity: cartCount, options: value }], 'value');
    try {
      const resultAction = await dispatch(
        addToCart({ userId, product: id, quantity: cartCount, options: value }),
      ).unwrap();

      // Если есть специфическое состояние, проверяем результат
      console.log(resultAction, 'resultAction');
      setModal(false);
      toast.success('Товар успешно добавлен в корзину');
    } catch (error) {
      toast.error(error);
      console.error(error); // Логируем ошибку
    }
  };
  // const handleAddCount = ({ currentTarget }) => {
  //   const { id } = currentTarget;
  //   dispatch(increase_product({ id: id, link: link }));
  // };

  // const handleSubCount = ({ currentTarget }) => {
  //   if (cartCount >= 1) {
  //     const { id } = currentTarget;
  //     dispatch(decrease_price({ id: id, link: link }));
  //   }
  // };

  // const addToCart = ({ currentTarget }) => {
  //   const { id } = currentTarget;
  //   dispatch(increase_product({ id: id, link: link }));
  // };

  if (loading || product === null) {
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
      <div>
        <Link className={styles.path} to={'/'}>
          Главная /{' '}
        </Link>
        <Link className={styles.path} to={`/catalog/${product.category.category}`}>
          Каталог /{' '}
        </Link>
        <span className={styles.path}>{product.title}</span>
      </div>
      <div className={styles.productContainer}>
        <div className={styles.titleMobile}>{product.title}</div>
        <div className={styles.productCarousel}>
          <div style={{ overflow: 'hidden' }}>
            <img className={styles.imageProduct} src={cake} alt={product.title} />
          </div>

          <div className={styles.carouselContainer}>
            <Carousel
              className={styles.carousel}
              cellAlign="center"
              wrapAround={true}
              speed={2000}
              autoplay={true}
              slidesToShow={3}
              defaultControlsConfig={{
                nextButtonText: ' ',
                prevButtonText: ' ',
                nextButtonClassName: [styles.buttonCarousel, styles.nextButton].join(' '),
                prevButtonClassName: [styles.buttonCarousel, styles.prevButton].join(' '),
                pagingDotsClassName: styles.dots,
              }}
            >
              {/* {product.images.map((el, i) => (
                <img key={i} className={styles.carouselImage} src={el} alt="img" />
              ))} */}
              {[cake, cake, cake, cake].map((el, i) => (
                <img key={i} className={styles.carouselImage} src={el} alt="img" />
              ))}
            </Carousel>
          </div>
        </div>
        <div className={styles.productInfo}>
          <div>
            <div className={[styles.title, styles.productTitle].join(' ')}>{product.title}</div>
          </div>
          <div>
            <div>
              <ul className={styles.list}>
                {product.features.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            </div>
            <div className={styles.selectContainer}>
              <div className={styles.select}>
                <select onChange={handleChange} name="kind" value={value.kind} id={id}>
                  <option value="Ванильный">Вид</option>
                  {product.category.options.kind.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.select}>
                <select onChange={handleChange} name="decor" value={value.decor} id={id}>
                  <option value="Без декора">Декор</option>
                  {product.category.options.decor.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.select}>
                <select onChange={handleChange} name="weight" value={value.weight} id={id}>
                  <option value="1 кг">Вес готового изделия</option>
                  {product.category.options.weight.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.priceContainer}>
              <div className={styles.price}>{product.price} BYN</div>

              <Modal modal={modal} setModal={setModal} addStyles={styles.modal}>
                <div className={styles.modalContainer}>
                  <div style={{ textAlign: 'center', fontFamily: 'Montserrat' }}>
                    Выберите количество:
                  </div>
                  <div className={styles.counterContainer}>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubCount(e);
                      }}
                      id={id}
                      addStyles={styles.modalButton}
                    >
                      <img src={minus} alt="minus" />
                    </Button>
                    <span>{cartCount}</span>
                    <Button
                      id={id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddCount(e);
                      }}
                      addStyles={styles.modalButton}
                    >
                      <img src={plus} alt="plus" />
                    </Button>
                  </div>
                  <div>
                    <Button
                      disabled={disabled}
                      id={id}
                      onClick={(e) => {
                        addToBasket(e);
                      }}
                      addStyles={
                        disabled
                          ? [styles.buttonToCart, styles.buttonToCartDisable].join(' ')
                          : styles.buttonToCart
                      }
                    >
                      Добавить
                    </Button>
                  </div>
                </div>
              </Modal>

              <Button
                id={id}
                onClick={() => {
                  setModal(true);
                }}
                addStyles={styles.button}
              >
                Заказать
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.switchLineContainer}>
          <div className={styles.switchContainer}>
            <span
              className={
                active === 0 ? [styles.switchActive, styles.switch].join(' ') : styles.switch
              }
              onClick={() => setActive(0)}
            >
              Описание
            </span>
            <span
              className={
                active === 1 ? [styles.switchActive, styles.switch].join(' ') : styles.switch
              }
              onClick={() => setActive(1)}
            >
              Условия хранения
            </span>
            <span
              className={
                active === 2 ? [styles.switchActive, styles.switch].join(' ') : styles.switch
              }
              onClick={() => setActive(2)}
            >
              Доставка
            </span>
          </div>
          <div className={styles.switchLine}></div>
        </div>
        <div className={styles.switchTextContainer}>
          <div
            style={{ height: '207px' }}
            className={active === 0 ? styles.switchText : styles.dots}
          >
            {product.description}
          </div>
          <div
            style={{ height: '207px' }}
            className={active === 1 ? styles.switchText : styles.dots}
          >
            {product.category.conditions}
          </div>
          <div className={active === 2 ? '' : styles.dots} style={{ height: '207px' }}>
            <div className={styles.switchText} style={{ height: '100px' }}>
              <span>Доставка осуществляется двумя способами:</span>
              <span>
                <p>1. Самовывоз из Московского р-на, г. Минск </p>
                <p>2. На такси (по тарифам службы такси)</p>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ margin: '60px 0 40px' }} className={styles.title}>
        Также можете попробовать:
      </div>
      <div className={styles.offerContainer}>
        {suggestion.map((product) => (
          <Item
            // onClick={addToBasket}
            key={product._id}
            id={product._id}
            src={product.images[0]}
            title={product.title}
            price={product.price}
            weight={product.category.baseWeight}
            link={product.category.category}
          />
        ))}
      </div>
      <Toaster richColors />
    </motion.div>
  );
};

export default Product;
