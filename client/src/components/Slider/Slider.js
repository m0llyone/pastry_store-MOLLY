import styles from './Slider.module.css';
import Carousel from 'nuka-carousel';
import { Title } from '../../common/Title/Title';
import { Button } from '../../common/Button/Button';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Item } from '../../common/Item/Item';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../data/constants';
import { fetchProducts } from '../../reducers/productSlice';
import Preloader from '../../common/Preloader/Preloader';

export const Slider = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === 'loading') {
    return <Preloader />;
  }

  return (
    <div className={styles.container}>
      <Title title="Бестселлеры" addStyles={styles.title} />
      <Carousel
        className={styles.carousel}
        cellAlign="center"
        wrapAround={true}
        speed={2000}
        pauseOnHover={true}
        autoplay={true}
        slidesToShow={window.document.documentElement.clientWidth < 550 ? 2 : 3}
        defaultControlsConfig={{
          containerClassName: styles.sliderContainer,
          nextButtonText: ' ',
          prevButtonText: ' ',
          nextButtonClassName: [styles.button, styles.nextButton].join(' '),
          prevButtonClassName: [styles.button, styles.prevButton].join(' '),
          pagingDotsContainerClassName: styles.dotsContainer,
          nextButtonStyle: {
            backgroundPosition: 'center ',
          },
          prevButtonStyle: {
            backgroundPosition: 'center ',
          },
          pagingDotsClassName: styles.dots,
        }}
      >
        {products
          .filter((product) => product.isBestseller)
          .map((product) => (
            <div className={styles.itemContainer} key={product.id}>
              <Item
                id={product.id}
                src={product.images[0]}
                alt={product.category.category}
                title={product.title}
                price={product.price}
                weight={product.baseWeight}
                link={product.category.category}
                addStyles={styles.containerItem}
              />
            </div>
          ))}
      </Carousel>
      <Link to="catalog/all">
        <Button addStyles={styles.buttonView}>Посмотреть весь ассортимент</Button>
      </Link>
    </div>
  );
};
