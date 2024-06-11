import styles from './OrderForm.module.css';
import { Title } from '../../common/Title/Title';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cake from '../../assets/images/mainCake.png';
import { ReactComponent as Cross } from '../../assets/images/crossIcon.svg';
import { Button } from '../../common/Button/Button';
import { useValidate } from './useValidate/useValidate';
import { Modal } from '../../common/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { easeOut, motion } from 'framer-motion';
import axios from 'axios';
import { SERVER_URL } from '../../data/constants';
import { removeAllProducts, removeProduct } from '../../reducers/userSlice';
import { Input, Radio } from './Items/Items';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const initialState = {
  name: '',
  phone: '',
  date: '',
  delivery: 'selfCall',
  address: {
    streetPickUp: '',
  },
  payment: 'cash',
};

const OrderForm = () => {
  const [state, setState] = useState(initialState);
  const { error, validate } = useValidate();
  const [active, setActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { basket, user } = useSelector((state) => state.user);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value, id, type, checked } = target;
    const stateValue = type === 'checkbox' ? checked : value;
    setState({ ...state, [name]: stateValue });
    validate(name === 'address' ? id : name, value);
    if (name === 'address') {
      setState({ ...state, [name]: { ...state[name], [id]: stateValue } });
    }
  };

  useEffect(() => {
    const isFormInvalid =
      Object.values(state).some((value) => {
        if (typeof value === 'object') {
          return Object.values(value).some((subValue) => subValue.trim() === '');
        }
        return value.trim() === '';
      }) || Object.values(error).some((errMsg) => errMsg !== '');

    setIsDisabled(isFormInvalid);
  }, [state, error]);

  const handleSubmit = async () => {
    if (!isDisabled && basket.items) {
      await axios.post(`${SERVER_URL}/api/order`, {
        userId: user.id,
        basket: basket.id,
        data: state,
      });
      setModal(true);
      dispatch(removeAllProducts());
      setState(initialState);
    }
  };

  const removeItem = async ({ currentTarget }) => {
    const { id } = currentTarget;
    try {
      await axios.delete(`${SERVER_URL}/api/cart?id=${basket.id}&product=${id}`);
      dispatch(removeProduct({ id }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: easeOut }}
    >
      <Link className={styles.link} to="/catalog/all">
        Продолжить покупки
      </Link>
      <Title addStyles={styles.mainTitle} title="Оформление заказа" />
      <div className={styles.mainContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <span className={styles.formTitle}>Контакты:</span>
            <Input
              id="name"
              type="text"
              name="name"
              value={state.name}
              onChange={handleChange}
              label="Имя"
              error={error.name}
            />
            <Input
              id="phone"
              type="tel"
              name="phone"
              value={state.phone}
              onChange={handleChange}
              label="Номер телефона"
              error={error.phone}
            />
            <Input
              id="date"
              type="date"
              name="date"
              value={state.date}
              onChange={handleChange}
              addStyles={styles.formInputDate}
              error={error.date}
              label="Дата доставки"
            />
          </div>
          <div className={styles.inputContainer}>
            <span className={styles.formTitle}>Способ доставки:</span>
            <div className={styles.radioContainer}>
              <Radio
                name="delivery"
                value="selfCall"
                id="selfCall"
                checked={state.delivery === 'selfCall'}
                onChange={handleChange}
                onClick={() => {
                  setActive(false);
                  setState({
                    ...state,
                    address: { ...(state.address = {}) },
                  });
                  setState({
                    ...state,
                    address: {
                      ...(state.address = { streetPickUp: '' }),
                    },
                  });
                }}
                label="Самовывоз из Московского р-на, г. Минск."
              />
              <Radio
                id="taxi"
                name="delivery"
                value="taxi"
                onChange={handleChange}
                onClick={() => {
                  setActive(true);
                  setState({
                    ...state,
                    address: {
                      ...(state.address = {
                        street: '',
                        house: '',
                        entrance: '',
                        housing: '',
                        flat: '',
                        floor: '',
                      }),
                    },
                  });
                }}
                label="На такси (по тарифам службы такси)"
              />
            </div>
          </div>
          {!active && (
            <div>
              <div className={styles.inputGroup}>
                <select
                  id="streetPickUp"
                  name="address"
                  value={state.address.streetPickUp}
                  placeholder=" "
                  className={[styles.formInput, styles.formSelect].join(' ')}
                  onChange={handleChange}
                  style={{ marginBottom: '20px' }}
                >
                  {[
                    { value: '', label: 'Выберите ресторан' },
                    { value: 'Бурдейного', label: 'Бурдейного 23' },
                    { value: 'Харьковская', label: 'Харьковская 7' },
                    { value: 'Ландера', label: 'Ландера 19' },
                  ].map((option) => (
                    <option key={option.value} className={styles.option} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <span></span>
            </div>
          )}
          <div>
            {active && (
              <div className={styles.addressContainer}>
                <Input
                  id="street"
                  addStyles={styles.formInputAddress}
                  name="address"
                  type="text"
                  value={state.address.street}
                  onChange={handleChange}
                  label="Улица"
                  error={error.street}
                  style={{ fontSize: '12px' }}
                />
                <Input
                  id="house"
                  addStyles={styles.formInputAddress}
                  name="address"
                  type="text"
                  value={state.address.house}
                  onChange={handleChange}
                  label="Дом"
                  error={error.house}
                  style={{ fontSize: '12px' }}
                />
                <Input
                  id="entrance"
                  type="text"
                  addStyles={styles.formInputAddress}
                  name="address"
                  value={state.address.entrance}
                  onChange={handleChange}
                  label="Подъезд"
                />
                <Input
                  id="housing"
                  name="address"
                  addStyles={styles.formInputAddress}
                  type="text"
                  value={state.address.housing}
                  onChange={handleChange}
                  label="Корпус"
                />
                <Input
                  id="flat"
                  name="address"
                  type="text"
                  addStyles={styles.formInputAddress}
                  value={state.address.flat}
                  onChange={handleChange}
                  label="Квартира"
                  error={error.flat}
                  style={{ fontSize: '12px' }}
                />
                <Input
                  id="floor"
                  name="address"
                  addStyles={styles.formInputAddress}
                  type="text"
                  value={state.address.floor}
                  onChange={handleChange}
                  label="Этаж"
                />
              </div>
            )}
          </div>
          <div className={styles.inputContainer}>
            <span className={styles.formTitle}>Способ оплаты</span>
            <div style={{ marginBottom: '-10px' }} className={styles.radioContainer}>
              <Radio
                id="cash"
                name="payment"
                value="cash"
                checked={state.payment === 'cash'}
                onChange={handleChange}
                label="Наличные"
              />
              <Radio id="card" name="payment" value="card" onChange={handleChange} label="Картой" />
            </div>
          </div>
          <div>
            <textarea
              placeholder="Оставить комментарий"
              type="text"
              className={styles.formTextArea}
              name="comment"
              value={state.comment}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.formTitle}>Всего к оплате:</span>
            <div style={{ fontWeight: '700' }} className={styles.formTitle}>
              {basket.total} BYN
            </div>
          </div>
          <div
            data-tooltip-id="validateTooltip"
            data-tooltip-content={
              isDisabled
                ? 'Заполните корректно все поля для оформления заказа'
                : 'Ваша корзина пустая'
            }
            className={styles.confirmButtonContainer}
          >
            <Button
              disabled={isDisabled}
              addStyles={
                isDisabled ? [styles.formButton, styles.disabled].join(' ') : styles.formButton
              }
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
                handleChange(e);
              }}
            >
              Оформить заказ
            </Button>
            {isDisabled && (
              <Tooltip
                className={styles.tooltipContainer}
                classNameArrow={styles.tooltipArrow}
                id="validateTooltip"
                place="bottom"
                effect="solid"
              />
            )}
          </div>
        </form>
        <Modal modal={modal} setModal={setModal}>
          <div className={styles.contentContainer}>
            <img height={'152px'} width={'182px'} src={cake} alt="cake" />
            <Title addStyles={styles.modalTitle} title="Спасибо за заказ!" />
            <div className={styles.modalText}>
              Ваш заказ принят в обработку и вскоре вам позвонит по телефону менеджер для уточнения
              деталей.
            </div>
            <div className={styles.buttonContainerModal}>
              <Button onClick={() => navigate('/')} addStyles={styles.buttonModal}>
                На главную
              </Button>
              <Button
                onClick={() => navigate('/catalog/all')}
                addStyles={[styles.buttonModal, styles.buttonColorModal].join(' ')}
              >
                Продолжить покупки
              </Button>
            </div>
          </div>
        </Modal>
        <div className={styles.orderContainer}>
          <span style={{ fontSize: '18px' }}>Ваш заказ:</span>
          <div className={styles.orderTitle}>
            {basket.items?.map((el) => (
              <div key={el._id} className={styles.orderName}>
                <span>{el.product.title}</span>
                <div className={styles.price}>
                  <span>
                    {el.product.price}BYN (x{el.quantity})
                  </span>
                  <div id={el._id} onClick={removeItem}>
                    <Cross
                      style={{ cursor: 'pointer' }}
                      fill="#705A66"
                      width={'13px'}
                      height={'13px'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderForm;
