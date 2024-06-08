import styles from './Navigation.module.css';
import pizza from '../../assets/images/pizza.png';
import shu from '../../assets/images/shu.png';
import brownie from '../../assets/images/brownie.png';
import cake from '../../assets/images/cake.png';
import { Button } from '../../common/Button/Button';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { imgSrc: cake, alt: 'cake', path: 'cakes', label: 'Торты' },
  { imgSrc: shu, alt: 'pastry', path: 'pastry', label: 'Выпечка' },
  { imgSrc: brownie, alt: 'brownie', path: 'brownie', label: 'Пирожное' },
  { imgSrc: pizza, alt: 'pizza', path: 'pizza', label: 'Пицца' },
];

const NavItem = ({ imgSrc, alt, onClick, children }) => {
  return (
    <div className={styles.linkContainer}>
      <img src={imgSrc} alt={alt} />
      <Button onClick={onClick} addStyles={styles.button}>
        {children}
      </Button>
    </div>
  );
};

export const Navigation = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(`catalog/${path}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        {navItems.map(({ imgSrc, alt, path, label }) => (
          <NavItem key={path} imgSrc={imgSrc} alt={alt} onClick={() => navigateTo(path)}>
            {label}
          </NavItem>
        ))}
      </div>
    </div>
  );
};
