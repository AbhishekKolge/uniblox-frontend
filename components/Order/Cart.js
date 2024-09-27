import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { useRemoveFromCartMutation } from '../../features/slices/productApiSlice';

import { getDiscountedPrice } from '../../helpers/helper';

import styles from './Cart.module.css';

const Cart = (props) => {
  const { data, onClose } = props;

  const [
    removeFromCart,
    {
      isSuccess: removeFromCartSuccess,
      isError: removeFromCartIsError,
      error: removeFromCartError,
    },
  ] = useRemoveFromCartMutation();

  const removeFromCartHandler = (id) => {
    removeFromCart(id)
      .unwrap()
      .then(() => {
        toast.success('Removed from cart');
      })
      .catch((error) => {
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

  const subTotal = data.reduce((total, item) => {
    return total + getDiscountedPrice(item);
  }, 0);

  return (
    <div className={styles.cartSideBar}>
      <button
        onClick={onClose}
        type='button'
        className={`btn-close position-absolute top-1 end-0 rounded-circle text-light bg-white translate-middle ${styles.closeBtn}`}
      ></button>
      <h3>Cart</h3>

      {!!data?.length && (
        <Link
          href='/checkout'
          className='btn btn-primary border-dark btn-md w-100'
        >
          Checkout
        </Link>
      )}
      <div className='fw-semibold mt-3 d-flex justify-content-between w-100'>
        <span>{`Subtotal ${data?.length || 0} items:`}</span>{' '}
        <span>Rs. {subTotal.toFixed(2)}</span>
      </div>

      <div className='d-flex justify-content-center mt-3'>
        {!!data.length ? (
          <div className={`w-100 ${styles.listContainer}`}>
            {data.map((product) => {
              let priceEl = (
                <span className='fw-semibold'>
                  Rs. {getDiscountedPrice(product)}
                </span>
              );

              return (
                <div key={product.id} className='card mb-3'>
                  <div className='row g-0'>
                    <div className='col-10'>
                      <div className='card-body d-flex flex-column'>
                        <h6>{product.name}</h6>

                        <small className='text-muted d-flex align-items-center mb-1'>
                          <span className='me-2'>Color</span>
                          <input disabled type='color' value={product.color} />
                        </small>

                        {priceEl}
                      </div>
                    </div>
                    <div className='col-2'>
                      <button
                        type='button'
                        className={`btn btn-danger text-light align-self-end position-absolute translate-middle ${styles.removeCartButton}`}
                        onClick={removeFromCartHandler.bind(this, product.id)}
                      >
                        <i className='bi bi-trash3-fill'></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <h5 className='mt-3'>No products in the cart.</h5>
        )}
      </div>
    </div>
  );
};

export default Cart;
