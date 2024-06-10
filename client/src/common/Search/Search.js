import { useEffect, useState } from 'react';
import styles from './Search.module.css';
import { getAuthHeader } from '../../reducers/productSlice';
import axios from 'axios';
import { SERVER_URL } from '../../data/constants';
import search from '../../assets/images/search.svg';
import { useNavigate } from 'react-router-dom';

export const Search = () => {
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/products`, {
          params: { all: true },
          headers: getAuthHeader(),
        });
        setProducts(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    return product.title.toLowerCase().includes(value.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          placeholder="Поиск.."
          className={styles.formSearch}
          type="text"
          maxLength={30}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <img src={search} alt="search" />
      </div>
      {value && (
        <div className={styles.searchList}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                onClick={() => navigate(`/catalog/${product.category.category}/${product.id}`)}
                key={product.id}
              >
                {product.title}
              </div>
            ))
          ) : (
            <div className={styles.notFoundText}>Ничего не найдено</div>
          )}
        </div>
      )}
    </div>
  );
};
