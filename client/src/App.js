import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { routes } from './data/routes';
import { useState, useEffect, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Preloader from './common/Preloader/Preloader';
import { fetchBasket, fetchUser, setRole } from './reducers/userSlice';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AdminPage from './pages/Admin/Admin';
export const AppContext = createContext();

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const userId = useSelector((state) => state.user.user?.id);
  const { status, counter, user, isAdmin } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUser()).then((response) => {
        const payload = response.payload;
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role[0];
        if (payload && payload.id) {
          dispatch(fetchBasket(payload.id));
          if (role === 'ADMIN') dispatch(setRole());
        }
      });
    }
  }, [dispatch, userId]);

  console.log(user);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (status === 'loading') {
    return <Preloader />;
  }

  return (
    <div className="App">
      <Header counter={counter} />
      {!isAdmin ? (
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            {routes.map((link) => (
              <Route key={link.path} path={link.path} element={<link.element />} preve exact />
            ))}
          </Routes>
        </AnimatePresence>
      ) : (
        <AdminPage />
      )}
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
