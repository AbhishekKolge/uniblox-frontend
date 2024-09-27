import toast from 'react-hot-toast';

import { authActions } from '../slices/authSlice';
import { checkTimeIsExpired, calculateRemainingTime } from '../../helpers/time';
import {
  saveAuthToLocal,
  getAuthFromLocal,
  removeAuthFromLocal,
} from '../../helpers/storage';

const logoutHandler = (config) => {
  return (dispatch) => {
    removeAuthFromLocal();
    dispatch(authActions.logout());
    !config?.isSession && toast.error('Logged out');
  };
};

const checkLoginStatus = () => {
  return (dispatch) => {
    const authDetails = getAuthFromLocal();

    if (authDetails) {
      const accessExpired = checkTimeIsExpired(
        authDetails.accessExpirationTime
      );

      if (accessExpired) {
        removeAuthFromLocal();
        dispatch(authActions.logout());
        toast.error('Session Expired');
        return;
      }

      dispatch(authActions.login(authDetails));
      const autoLogoutTime = calculateRemainingTime(
        authDetails.accessExpirationTime
      );
      setTimeout(() => {
        removeAuthFromLocal();
        dispatch(authActions.logout());
        toast.error('Session Expired');
      }, autoLogoutTime);
      return;
    }

    removeAuthFromLocal();
    dispatch(authActions.logout());
  };
};

const loginHandler = (authDetails) => {
  return (dispatch) => {
    const { userId } = authDetails;

    const accessExpirationTime =
      Date.now() + +process.env.ACCESS_EXPIRATION_TIME;

    saveAuthToLocal({
      accessExpirationTime,
      userId,
    });
    dispatch(
      authActions.login({
        accessExpirationTime,
        userId,
      })
    );

    toast.success('Logged in successfully');

    const autoLogoutTime = calculateRemainingTime(accessExpirationTime);

    setTimeout(() => {
      removeAuthFromLocal();
      dispatch(authActions.logout());
      toast.error('Session Expired');
    }, autoLogoutTime);
  };
};

export { checkLoginStatus, loginHandler, logoutHandler };
