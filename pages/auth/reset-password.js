import ResetPasswordForm from '../../components/Auth/ResetPasswordForm';

const ResetPassword = (props) => {
  const { authorized, email, token } = props;

  return (
    <section className='px-1 py-5 py-md-5 bg-primary bg-opacity-10 h-100'>
      <div className='container'>
        <ResetPasswordForm
          authorized={authorized}
          email={email}
          token={token}
        />
        ;
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

export default ResetPassword;
