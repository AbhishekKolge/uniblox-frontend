import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './Sidebar.module.css';

const Sidebar = (props) => {
  const { children } = props;
  const router = useRouter();

  return (
    <section className='h-100'>
      <h2 className='text-bold'>My Account</h2>
      <div className='row py-4'>
        <div className='col-3'>
          <ul className='list-group'>
            <li
              className={`${
                router.pathname == '/account/profile' ? styles.current : ''
              } list-group-item`}
            >
              <Link href='/account/profile' className='reset-link'>
                Profile
              </Link>
            </li>
            <li
              className={`${
                router.pathname == '/account/address' ? styles.current : ''
              } list-group-item`}
            >
              <Link href='/account/address' className='reset-link'>
                Addresses
              </Link>
            </li>
            <li
              className={`${
                router.pathname == '/account/order' ? styles.current : ''
              } list-group-item`}
            >
              <Link href='/account/order' className='reset-link'>
                Orders & Returns
              </Link>
            </li>
          </ul>
        </div>
        <div className='col-9'>{children}</div>
      </div>
    </section>
  );
};

export default Sidebar;
