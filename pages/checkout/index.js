import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { useGetAllAddressesQuery } from '../../features/slices/addressApiSlice';
import {
  useGetCartPriceQuery,
  useCreateOrderMutation,
  useVerifyOrderMutation,
} from '../../features/slices/orderApiSlice';
import { useGetAllCouponsQuery } from '../../features/slices/couponApiSlice';

import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import LoadingPage from '../../components/UI/LoadingPage/LoadingPage';

import { initializeRazorpay } from '../../helpers/razorpay';

const CheckoutPage = () => {
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [addressId, setAddressId] = useState('');
  const router = useRouter();

  const {
    data: addressesData,
    isError: addressesIsError,
    error: addressesError,
    isSuccess: addressesSuccess,
    isLoading: addressesLoading,
  } = useGetAllAddressesQuery({});
  const {
    data: cartPriceData,
    isError: cartPriceIsError,
    error: cartPriceError,
    isSuccess: cartPriceSuccess,
    isLoading: cartPriceLoading,
  } = useGetCartPriceQuery({
    coupon: appliedCoupon,
  });
  const {
    data: couponsData,
    isError: couponsIsError,
    error: couponsError,
    isSuccess: couponsSuccess,
    isLoading: couponsLoading,
  } = useGetAllCouponsQuery({ status: 1, all: 1 });
  const [
    createOrder,
    {
      isSuccess: createOrderSuccess,
      isError: createOrderIsError,
      error: createOrderError,
      isLoading: createOrderIsLoading,
    },
  ] = useCreateOrderMutation();
  const [
    verifyOrder,
    {
      isSuccess: verifyOrderSuccess,
      isError: verifyOrderIsError,
      error: verifyOrderError,
      isLoading: verifyOrderIsLoading,
    },
  ] = useVerifyOrderMutation();

  const couponHandler = (e) => {
    setCoupon(e.target.value);
  };

  const applyCouponHandler = () => {
    setAppliedCoupon(coupon);
  };

  const addressHandler = (e) => {
    setAddressId(e.target.id);
  };

  const paymentHandler = () => {
    if (!addressId) {
      toast.error('Please select address');
      return;
    }
    createOrder({ addressId, coupon: appliedCoupon })
      .unwrap()
      .then(({ order, key, user }) => {
        initializeRazorpay().then(() => {
          const options = {
            key: key,
            amount: order.amount,
            currency: order.currency,
            name: process.env.RAZORPAY_NAME,
            order_id: order.id,
            handler: function (response) {
              const details = {
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                orderId: response.razorpay_order_id,
              };
              verifyOrder(details)
                .unwrap()
                .then(() => {
                  toast.success('Order placed successfully');
                  router.push({
                    pathname: '/account/order',
                  });
                })
                .catch((error) => {
                  if (error.data?.msg) {
                    toast.error(error.data.msg.split(',')[0]);
                  } else {
                    toast.error('Something went wrong!, please try again');
                  }
                });
            },
            prefill: {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              contact: user.contactNo,
            },
          };
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
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

  if (
    addressesIsError ||
    cartPriceIsError ||
    couponsIsError ||
    createOrderIsError ||
    verifyOrderIsError
  ) {
    return <ErrorPage />;
  }

  if (
    addressesLoading ||
    cartPriceLoading ||
    couponsLoading ||
    createOrderIsLoading ||
    verifyOrderIsLoading
  ) {
    return <LoadingPage />;
  }

  return (
    <section>
      {addressesData?.addresses?.length ? (
        cartPriceData.total ? (
          <div className='row'>
            <div className='col-6'>
              {addressesData?.addresses.map((address, index) => {
                return (
                  <div
                    className='form-check form-switch row d-flex align-items-center mb-3'
                    key={address.id}
                  >
                    <div className='col-1'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='address'
                        id={address.id}
                        onChange={addressHandler}
                        checked={addressId === address.id}
                      />
                    </div>
                    <label
                      className='form-check-label col-11'
                      htmlFor={address.id}
                    >
                      <div className='card'>
                        <div className='card-body position-relative d-flex flex-column'>
                          <span className='badge rounded-pill text-bg-primary position-absolute top-20 end-0 me-3'>
                            {address.type}
                          </span>
                          <span className='text-capitalize'>
                            {address.address}
                          </span>
                          <span className='text-capitalize'>
                            {address.city} - {address.pincode}
                          </span>
                          <span className='text-capitalize'>
                            {address.state}
                          </span>
                          <span className='text-capitalize'>
                            {address.country}
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className='col-6'>
              <div className='row'>
                <div className='col-8'>
                  <select className='form-select' onChange={couponHandler}>
                    <option value=''>Select</option>
                    {!!couponsData?.coupons?.length &&
                      couponsData?.coupons.map((coupon) => {
                        return (
                          <option key={coupon.id} value={coupon.id}>
                            {coupon.code}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <button
                  onClick={applyCouponHandler}
                  type='button'
                  className='btn btn-secondary col-4'
                >
                  {cartPriceData.coupon === coupon && coupon
                    ? 'Applied'
                    : 'Apply'}
                </button>
              </div>
              <ul className='list-group list-group-flush mt-3'>
                <li className='list-group-item ps-0'>
                  <span>{`Sub Total: Rs. ${
                    cartPriceData?.subTotal || 0
                  }`}</span>
                </li>
                <li className='list-group-item ps-0'>
                  <span>{`Discount: Rs. ${cartPriceData?.discount || 0}`}</span>
                </li>
                <li className='list-group-item ps-0'>
                  <h3>{`Total: Rs. ${cartPriceData?.total || 0}`}</h3>
                </li>
              </ul>
              <button
                onClick={paymentHandler}
                className='btn btn-success w-100 text-light'
              >
                Pay Now
              </button>
            </div>
          </div>
        ) : (
          <div className='d-flex flex-column justify-content-center align-items-center'>
            <div>No Products added. Please add a product to continue</div>
            <Link className='btn btn-primary mt-3' href='/'>
              Add Products To Cart
            </Link>
          </div>
        )
      ) : (
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <div>No Address added. Please add a address to continue</div>
          <Link className='btn btn-primary mt-3' href='/account/address'>
            Add Address
          </Link>
        </div>
      )}
    </section>
  );
};

export default CheckoutPage;
