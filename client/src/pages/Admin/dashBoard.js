import { Card, CardHeader } from '@mui/material';
import { Button } from '../../common/Button/Button';
import { logout } from '../../reducers/userSlice';
import styles from './Admin.module.css';
import { useDispatch } from 'react-redux';

export const Dashboard = () => {
  const dispatch = useDispatch();
  return (
    <Card className={styles.containerBoard}>
      <CardHeader title="Страница Администратора" className={styles.titleBoard} />
      <Button onClick={() => dispatch(logout())} addStyles={styles.button_logout}>
        Выход
      </Button>
    </Card>
  );
};
