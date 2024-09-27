import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(Yup);

import styles from './LoginForm.module.css';

import { useLoginMutation } from '../../features/slices/authApiSlice';
import { loginHandler } from '../../features/actions/authActions';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const [
    login,
    {
      data: loginData,
      isSuccess: loginSuccess,
      isError: loginIsError,
      isLoading: loginLoading,
      error: loginError,
    },
  ] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email('Email is not valid')
        .required('required'),
      password: Yup.string()
        .trim()
        .password()
        .min(8, 'Must be minimum 8 characters')
        .minLowercase(1, 'Must include 1 lowercase letter')
        .minUppercase(1, 'Must include 1 uppercase letter')
        .minSymbols(1, 'Must include 1 special letter')
        .minNumbers(1, 'Must include 1 number letter')
        .required('required'),
    }),
    onSubmit: (values) => {
      login(values)
        .unwrap()
        .then((data) => {
          const { userId } = data;
          dispatch(
            loginHandler({
              userId,
            })
          );
          formik.resetForm();
        })
        .catch((error) => {
          if (error.data?.msg) {
            toast.error(error.data.msg.split(',')[0]);
          } else {
            toast.error('Something went wrong!, please try again');
          }
        });
    },
  });

  const testUserLoginHandler = (e) => {
    formik.setFieldValue('email', process.env.EMAIL);
    formik.setFieldValue('password', process.env.PASSWORD);
  };

  return (
    <div className={`card ${styles.card} m-auto p-3`}>
      <div className='card-body'>
        <h4 className='text-center mb-4'>Login</h4>
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email Address
            </label>
            <input
              required
              type='email'
              name='email'
              placeholder='Email Address'
              id='email'
              className={`form-control ${
                formik.touched.email && formik.errors.email && 'is-invalid'
              } ${formik.touched.email && !formik.errors.email && 'is-valid'} `}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='invalid-feedback'>{formik.errors.email}</div>
            )}
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              required
              type='password'
              name='password'
              placeholder='Password'
              id='password'
              className={`form-control ${
                formik.touched.password &&
                formik.errors.password &&
                'is-invalid'
              } ${
                formik.touched.password && !formik.errors.password && 'is-valid'
              } `}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />

            {formik.touched.password && formik.errors.password && (
              <div className='invalid-feedback'>{formik.errors.password}</div>
            )}
          </div>
          <button
            disabled={loginLoading || loginSuccess}
            type='submit'
            className='btn btn-primary w-100 mt-3 text-light'
          >
            Login
          </button>
          <button
            type='button'
            disabled={loginLoading || loginSuccess}
            className='btn btn-outline-primary w-100 mt-3'
            onClick={testUserLoginHandler}
          >
            Login As Test User
          </button>
        </form>
        <ul className='list-group list-group-flush'>
          <li className={`list-group-item ${styles.listItem}`}>
            <span className='mt-3 d-block text-center'>
              {`Don't have an account?`}
              <Link
                href='/auth/sign-up'
                className='text-primary fw-semibold text-decoration-none'
              >
                sign up
              </Link>
            </span>
          </li>
          <li className={`list-group-item text-center ${styles.listItem}`}>
            <Link
              href='/auth/forgot-password'
              className='text-primary fw-semibold text-decoration-none'
            >
              forgot password
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginForm;
