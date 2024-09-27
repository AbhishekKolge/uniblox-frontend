import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import Spinner from '../../components/UI/Spinner/Spinner';

import { useVerifyMutation } from '../../features/slices/authApiSlice';

const VerifyPage = (props) => {
  const { authorized, email, token } = props;
  const router = useRouter();

  const [verify] = useVerifyMutation();

  useEffect(() => {
    if (authorized) {
      verify({ email, token })
        .unwrap()
        .then(() => {
          toast.success('Verification successful');
          router.push({
            pathname: '/auth/login',
          });
        })
        .catch((error) => {
          if (error.data?.msg) {
            toast.error(error.data.msg.split(',')[0]);
            router.push({
              pathname: '/auth/login',
            });
          } else {
            toast.error('Verification failed');
            router.push({
              pathname: '/auth/login',
            });
          }
        });
    } else {
      router.push({
        pathname: '/auth/login',
      });
    }
  }, [token, email, router, verify, authorized]);

  return (
    <section className='px-1 py-5 py-md-5 bg-primary bg-opacity-10 h-100'>
      <div className='container d-flex justify-content-center flex-column text-center h-100 gap-2'>
        <Spinner />
        <h4>Verifying Your Email...!!!</h4>
        <p>Sit back and relax, we are verifying your email address</p>
      </div>
    </section>
  );
};

export async function getServerSideProps(context) {
  const { email, token } = context.query;

  return {
    props: {
      isAuthPage: true,
      authorized: email && token,
      email,
      token,
    },
  };
}

export default VerifyPage;
