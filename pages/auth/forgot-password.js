import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <section className='px-1 py-5 py-md-5 bg-primary bg-opacity-10 h-100'>
      <div className='container'>
        <ForgotPasswordForm />
      </div>
    </section>
  );
};

export async function getStaticProps(context) {
  return {
    props: {
      isAuthPage: true,
    },
  };
}

export default ForgotPassword;
