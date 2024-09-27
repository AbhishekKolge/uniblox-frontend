import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Image from 'next/image';
import StarRatings from 'react-star-ratings';

import { formatISTDateTime } from '../../helpers/time';

import BackButton from '../../components/UI/Button/BackButton';
import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import LoadingPage from '../../components/UI/LoadingPage/LoadingPage';
import Review from '../../components/Review/Review';

import {
  useGetSingleProductQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from '../../features/slices/productApiSlice';

import styles from './product.module.css';

const ProductDetailsPage = () => {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const {
    data: productData,
    isError: productIsError,
    error: productError,
    isLoading: productIsLoading,
  } = useGetSingleProductQuery(router.query?.productId, {
    skip: !router.query?.productId,
  });

  const [
    addToWishlist,
    {
      isSuccess: addToWishlistSuccess,
      isError: addToWishlistIsError,
      error: addToWishlistError,
    },
  ] = useAddToWishlistMutation();

  const [
    removeFromWishlist,
    {
      isSuccess: removeFromWishlistSuccess,
      isError: removeFromWishlistIsError,
      error: removeFromWishlistError,
    },
  ] = useRemoveFromWishlistMutation();
  const [
    addToCart,
    {
      isSuccess: addToCartSuccess,
      isError: addToCartIsError,
      error: addToCartError,
    },
  ] = useAddToCartMutation();

  const [
    removeFromCart,
    {
      isSuccess: removeFromCartSuccess,
      isError: removeFromCartIsError,
      error: removeFromCartError,
    },
  ] = useRemoveFromCartMutation();

  useEffect(() => {
    if (productIsError) {
      if (productError.data?.msg) {
        toast.error(productError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [productError, productIsError]);

  if (productIsLoading) {
    return <LoadingPage />;
  }

  if (productIsError) {
    return <ErrorPage />;
  }

  const addToCartHandler = (id) => {
    addToCart(id)
      .unwrap()
      .then(() => {
        toast.success('Added to cart');
      })
      .catch((error) => {
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

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

  const addToWishlistHandler = (id) => {
    addToWishlist(id)
      .unwrap()
      .then(() => {
        toast.success('Added to wish list');
      })
      .catch((error) => {
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

  const removeFromWishlistHandler = (id) => {
    removeFromWishlist(id)
      .unwrap()
      .then(() => {
        toast.success('Removed from wish list');
      })
      .catch((error) => {
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

  const cartActionHandler = (id) => {
    if (!isLoggedIn) {
      router.push({
        pathname: '/auth/login',
      });
      return;
    }
    if (productData?.product.isAddedToCart) {
      removeFromCartHandler(id);
    } else {
      addToCartHandler(id);
    }
  };

  const wishlistHandler = (id) => {
    if (!isLoggedIn) {
      router.push({
        pathname: '/auth/login',
      });
      return;
    }
    if (productData?.product.isWishListed) {
      removeFromWishlistHandler(id);
    } else {
      addToWishlistHandler(id);
    }
  };

  let priceEl = (
    <h4 className='fw-semibold'>Rs. {productData?.product.price}</h4>
  );

  if (productData?.product.discountAmount) {
    if (productData?.product.discount === 'FIXED') {
      priceEl = (
        <span className='d-flex gap-2 align-items-center'>
          <h4 className='fw-semibold mb-0'>
            Rs.{' '}
            {(
              productData?.product.price - productData?.product.discountAmount
            ).toFixed(2)}
          </h4>
          <span className={`text-secondary ${styles.originalPrice}`}>
            Rs. {productData?.product.price}
          </span>
          <span className={`text-success ${styles.discountPrice}`}>
            (Rs. {productData?.product.discountAmount} OFF)
          </span>
        </span>
      );
    } else {
      priceEl = (
        <span className='d-flex gap-2 align-items-center'>
          <h4 className='fw-semibold'>
            Rs.{' '}
            {(
              productData?.product.price -
              (productData?.product.discountAmount / 100) *
                productData?.product.price
            ).toFixed(2)}
          </h4>
          <span className={`text-secondary ${styles.originalPrice}`}>
            Rs. {productData?.product.price}
          </span>
          <span className={`text-success ${styles.discountPrice}`}>
            ({productData?.product.discountAmount}% OFF)
          </span>
        </span>
      );
    }
  }

  const isOutOfStock = productData?.product?.inventory < 1;

  return (
    <section className='h-100 d-flex flex-column gap-2'>
      <BackButton pathname='/' className='align-self-start' />
      <div className='row'>
        <div className='col-6'>
          <div className='card'>
            <div className='card-body'>
              <Image
                src={productData?.product.image}
                alt='product-image'
                width={200}
                height={200}
                className={styles.image}
              />
            </div>
          </div>
        </div>
        <div className='col-6'>
          <div className='card'>
            <div className='card-body'>
              <h3 className='text-uppercase fw-bold'>
                {productData?.product.name}
              </h3>
              <div className='d-flex align-items-center'>
                <StarRatings
                  rating={productData?.product.averageRating}
                  starRatedColor='gold'
                  numberOfStars={5}
                  name='rating'
                  starDimension='40px'
                  starSpacing='1px'
                />
                <span className='ms-3'>{`${productData?.product.numOfReviews} Reviews`}</span>
              </div>
              <div className='mt-2'>{priceEl}</div>
              <p className='mt-2'>{productData?.product.description}</p>
              <h6 className='mt-6'>Details</h6>
              <ul className='list-group mt-3'>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Featured</span>
                  <span>{productData?.product.featured ? 'Yes' : 'No'}</span>
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Color</span>
                  <input
                    disabled
                    type='color'
                    value={productData?.product.color}
                  />
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Category</span>
                  <span>{productData?.product.category.name}</span>
                </li>
              </ul>
              <button
                onClick={wishlistHandler.bind(this, productData?.product.id)}
                className='btn btn-secondary mt-3 w-100'
              >
                {productData?.product.isWishListed
                  ? 'Remove From Wishlist'
                  : 'Add To Wishlist'}
              </button>
              {isOutOfStock ? (
                <button disabled className='btn btn-primary mt-3 w-100'>
                  Out of stock
                </button>
              ) : (
                <button
                  onClick={cartActionHandler.bind(
                    this,
                    productData?.product.id
                  )}
                  className='btn btn-primary mt-3 w-100'
                >
                  {productData?.product.isAddedToCart
                    ? 'Remove From Cart'
                    : 'Add To Cart'}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className='mt-3 col-12'>
          <Review isLoggedIn={isLoggedIn} productId={router.query?.productId} />
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      open: true,
    },
  };
}

export default ProductDetailsPage;
