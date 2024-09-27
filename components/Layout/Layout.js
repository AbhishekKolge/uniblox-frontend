import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import { useLogoutMutation } from '../../features/slices/authApiSlice';
import { useGetCartQuery } from '../../features/slices/orderApiSlice';
import {
  logoutHandler,
  checkLoginStatus,
} from '../../features/actions/authActions';
import { useFirstRender } from '../../hooks/optimization';

import LoadingPage from '../UI/LoadingPage/LoadingPage';
import Cart from '../Order/Cart';

import styles from './Layout.module.css';

const Layout = (pageProps) => {
  const { children, isAuthPage, hideSidebar, open } = pageProps;
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { firstRender } = useFirstRender();
  const [toggleCart, setToggleCart] = useState(false);

  const {
    data: cartData,
    isError: cartIsError,
    error: cartError,
    isSuccess: cartSuccess,
    isLoading: cartLoading,
  } = useGetCartQuery(
    {},
    {
      skip: !isLoggedIn,
    }
  );

  const [logout] = useLogoutMutation();

  const onLogout = () => {
    logout()
      .then(() => {
        dispatch(logoutHandler());
        router.push({
          pathname: '/auth/login',
        });
      })
      .catch((error) => {
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

  const toggleCartHandler = () => {
    setToggleCart((prevState) => !prevState);
  };

  const closeCartHandler = () => {
    setToggleCart(false);
  };

  useEffect(() => {
    firstRender && dispatch(checkLoginStatus());
  }, [dispatch, firstRender]);

  useEffect(() => {
    if (isLoggedIn && isAuthPage && !open) {
      router.replace('/');
    }
    if (isLoggedIn === false && !isAuthPage && !open) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, isAuthPage, router, open]);

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setToggleCart(false);
    });
  }, [router]);

  return (isLoggedIn === false && isAuthPage) ||
    open ||
    (isLoggedIn && !isAuthPage) ||
    open ? (
    <>
      <nav
        className={`navbar navbar-expand-md  fixed-top bg-primary ${styles.nav}`}
      >
        <div className="container">
          <Link href="/" className="navbar-brand">
            <h1 className="text-light">E-Commerce</h1>
          </Link>
          <button
            className={`navbar-toggler ${styles.navToggler}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto">
              {isLoggedIn === false ? (
                <>
                  <li className="nav-item">
                    <Link
                      href="/auth/login"
                      className={`${
                        router.pathname == "/auth/login" ? styles.current : ""
                      } nav-link ${
                        styles.link
                      } d-flex flex-column align-items-center`}
                    >
                      <i className="bi bi-box-arrow-in-right  d-none d-md-block mb-2"></i>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/auth/sign-up"
                      className={`${
                        router.pathname == "/auth/sign-up" ? styles.current : ""
                      } nav-link ${
                        styles.link
                      } d-flex flex-column align-items-center`}
                    >
                      <i className="bi bi-person-plus-fill d-none d-md-block  mb-2"></i>
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      href="/account/profile"
                      className={`${
                        router.pathname == "/account/profile"
                          ? styles.current
                          : ""
                      } nav-link ${
                        styles.link
                      } d-flex flex-column align-items-center`}
                    >
                      <i className="bi bi-person-circle d-none d-md-block mb-2"></i>
                      Account
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={toggleCartHandler}
                      className="btn d-flex flex-column align-items-center text-light"
                    >
                      <i className="bi bi-cart d-none d-md-block position-relative">
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {cartData?.cart?.length || 0}
                        </span>
                      </i>
                      Cart
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={onLogout}
                      className="btn d-flex flex-column align-items-center text-light"
                    >
                      <i className="bi bi-box-arrow-right d-none d-md-block"></i>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main>
        {isAuthPage || hideSidebar ? (
          children
        ) : (
          <div className="container-fluid h-100">
            <div className="row h-100">
              <div className="col-sm p-3 h-100 bg-light">
                {isLoggedIn && toggleCart && (
                  <Cart
                    onClose={closeCartHandler}
                    data={cartData?.cart || []}
                  />
                )}
                <div className="container h-100">{children}</div>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer></footer>
    </>
  ) : (
    <main>
      <LoadingPage />
    </main>
  );
};

export default Layout;
