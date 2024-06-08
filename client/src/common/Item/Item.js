import styles from './Item.module.css';
import { Link } from 'react-router-dom';
import { Button } from '../Button/Button';
import cart from '../../assets/images/cart.svg';
export const Item = ({ id, src, title, price, weight, onClick, link, addStyles }) => {
  return (
    <div className={addStyles}>
      <div className={styles.productContainer} key={id}>
        <div className={styles.hoverContainer}>
          <Link to={`/catalog/${link}/${id}`}>
            <Button addStyles={styles.buttonHover}>Подробней</Button>
          </Link>
          <img
            className={styles.imageHover}
            width={'393px'}
            height={'393px'}
            src={src}
            alt={title}
          />
        </div>
        <div className={styles.productInfo}>
          <div className={styles.titleContainer}>
            <span className={styles.productTitle}>{title}</span>
            <div className={styles.toCartContainer}>
              <img
                className={styles.cartImg}
                id={id}
                onClick={onClick}
                style={{ cursor: 'pointer' }}
                src={cart}
                alt="cart"
              />
            </div>
          </div>
          <div className={styles.price}>
            {price} BYN/ {weight}
          </div>
        </div>
      </div>
    </div>
  );
};
