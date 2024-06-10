import styles from './Auth.module.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from '../../common/Button/Button';
import { ReactComponent as Cross } from '../../assets/images/crossIcon.svg';
import { authLogin, authRegistration } from '../../services/AuthService';
import { fetchUser, logout, setUser } from '../../reducers/userSlice';
import { Toaster, toast } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
import { Title } from '../../common/Title/Title';
import Preloader from '../../common/Preloader/Preloader';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
export const Auth = ({ auth, setAuth }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });
  const [flag, setFlag] = useState(false);
  const { isAuth, user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  const password = watch('password');

  useEffect(() => {
    if (localStorage.getItem('token') && !isAuth) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuth]);

  useEffect(() => {
    if (password && password.length >= 5) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [password]);

  const onSubmit = async (data) => {
    try {
      if (flag) {
        if (data.password === data.passwordConfirm) {
          await authRegistration(data.email, data.password);
          setFlag(!flag);
          reset();
          toast.success('Пользователь был успешно зарегистрирован!');
        } else {
          reset();
          toast.error(`Введенные пароли не совпадают!`);
        }
      } else if (!flag) {
        const response = await authLogin(data.email, data.password);
        dispatch(setUser(response.data.user));
        localStorage.setItem('token', response.data.token);
        toast.success('Вход выполнен успешно!');
        reset();
        if (response.data.user.roles[0] === 'ADMIN') {
          navigate('/admin');
        }
        //sddddddddddd
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    if (error.response && error.response.status === 400) {
      toast.error('Введенные почта либо пароль некорректны!');
    } else {
      toast.error('Что-то пошло не так... Попробуйте позже.');
    }
  };

  const emailRegex = (value) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && isValid) {
      handleSubmit(onSubmit)();
    } //тост два раза вызывается
  };

  return (
    <div
      className={auth ? [styles.container, styles.active].join(' ') : styles.container}
      onClick={() => isAuth && setAuth(false)}
    >
      {!isAuth ? (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
            className={styles.modalContainer}
          >
            <div className={styles.crossContainer}>
              <Cross className={styles.cross} onClick={() => setAuth(false)} />
            </div>
            <h3 className={styles.title}>{flag ? 'Регистрация' : 'Вход'}</h3>
            <div className={styles.inputBlock}>
              <label className={styles.label} htmlFor="email">
                Почта:
              </label>
              <input
                className={styles.input}
                id="email"
                type="text"
                {...register('email', {
                  required: 'Это обязательное поле.',
                  validate: (value) => emailRegex(value) || 'Введите корректную почту.',
                  maxLength: { value: 30, message: 'Максимальная длина - 30.' },
                })}
              />
            </div>
            <div className={styles.error}>
              {errors?.email && <p>{errors.email.message || 'Введите корректную почту.'}</p>}
            </div>
            <div className={styles.inputBlock}>
              <label className={styles.label} htmlFor="password">
                Пароль:
              </label>
              <input
                id="password"
                type="password"
                className={[styles.passwordInput, styles.input].join(' ')}
                {...register('password', {
                  required: true,
                  minLength: { value: 5, message: 'Минимальная длина 5 символов.' },
                  maxLength: { value: 20, message: 'Максимальная длина 20 символов.' },
                })}
              />
            </div>
            <div className={styles.error}>
              {errors?.password && (
                <p>{errors.password.message || 'Минимальная длина 5 символов.'}</p>
              )}
            </div>
            {flag && (
              <div style={{ marginBottom: '10px' }} className={styles.inputBlock}>
                <label className={styles.label} htmlFor="passwordConfirm">
                  Повторите пароль:
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  disabled={!isPasswordValid}
                  className={[styles.passwordInput, styles.input].join(' ')}
                  {...register('passwordConfirm', {
                    required: true,
                  })}
                />
              </div>
            )}
            <Button
              disabled={!isValid}
              addStyles={!isValid ? [styles.disabled, styles.button].join(' ') : styles.button}
            >
              {flag ? 'Зарегистрироваться' : 'Войти'}
            </Button>
            <div className={styles.notRegisteredCont}>
              <span>{flag ? 'Уже есть аккаунт? ' : `До сих пор нету аккаунта? `}</span>
              <span
                className={styles.createText}
                onClick={() => {
                  setFlag(!flag);
                  reset();
                }}
              >
                {flag ? 'Войти' : ' Зарегистрироваться'}
              </span>
            </div>
          </form>
          <Toaster richColors />
        </>
      ) : (
        <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
          <Title title="Профиль" />
          {status === 'loading' ? (
            <Preloader />
          ) : (
            user &&
            user.email && (
              <>
                <span>{user.email}</span>
                <Button
                  addStyles={styles.button}
                  onClick={() => {
                    dispatch(logout());
                    navigate('/');
                  }}
                >
                  Выйти
                </Button>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};
