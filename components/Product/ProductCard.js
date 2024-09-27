import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './ProductCard.module.css';

const ProductCard = (props) => {
  const {
    product,
    onCartAdd,
    onCartRemove,
    onAddToWishlist,
    onRemoveFromWishlist,
    isLoggedIn,
  } = props;

  const router = useRouter();

  const cartActionHandler = (id) => {
    if (!isLoggedIn) {
      router.push({
        pathname: '/auth/login',
      });
      return;
    }
    if (product.isAddedToCart) {
      onCartRemove(id);
    } else {
      onCartAdd(id);
    }
  };

  const wishlistHandler = (id) => {
    if (!isLoggedIn) {
      router.push({
        pathname: '/auth/login',
      });
      return;
    }
    if (product.isWishListed) {
      onRemoveFromWishlist(id);
    } else {
      onAddToWishlist(id);
    }
  };

  let priceEl = <span className='fw-semibold'>Rs. {product.price}</span>;

  if (product.discountAmount) {
    if (product.discount === 'FIXED') {
      priceEl = (
        <span className='d-flex gap-2 align-items-center'>
          <span className='fw-semibold'>
            Rs. {(product.price - product.discountAmount).toFixed(2)}
          </span>
          <span className={`text-secondary ${styles.originalPrice}`}>
            Rs. {product.price}
          </span>
          <span className={`text-success ${styles.discountPrice}`}>
            (Rs. {product.discountAmount} OFF)
          </span>
        </span>
      );
    } else {
      priceEl = (
        <span className='d-flex gap-2 align-items-center'>
          <span className='fw-semibold'>
            Rs.{' '}
            {(
              product.price -
              (product.discountAmount / 100) * product.price
            ).toFixed(2)}
          </span>
          <span className={`text-secondary ${styles.originalPrice}`}>
            Rs. {product.price}
          </span>
          <span className={`text-success ${styles.discountPrice}`}>
            ({product.discountAmount}% OFF)
          </span>
        </span>
      );
    }
  }

  return (
    <div className='col-3'>
      <div className='card'>
        <Link href={`/products/${product.id}`}>
          <div className='position-relative'>
            <Image
              priority={true}
              src={product.image}
              className={`card-img-top img-thumbnail ${styles.productImage}`}
              alt='product image'
              width={150}
              height={150}
            ></Image>
            <span
              className={`badge text-bg-success text-light fw-normal position-absolute ${styles.reviewTag}`}
            >
              {product.averageRating} <i className='bi bi-star-fill'></i> |{' '}
              {product.numOfReviews}
            </span>
          </div>
        </Link>
        <div className='card-body'>
          <h5 className='card-title'>{product.name}</h5>
          <p className='card-text text-secondary'>
            {product.description.slice(0, 10)}
            {product.description.length > 10 ? '...' : ''}
          </p>
          {priceEl}
          <div></div>
          <button
            onClick={wishlistHandler.bind(this, product.id)}
            className='btn btn-secondary mt-3 w-100'
          >
            {product.isWishListed ? 'Remove From Wishlist' : 'Add To Wishlist'}
          </button>
          <button
            onClick={cartActionHandler.bind(this, product.id)}
            className='btn btn-primary mt-3 w-100'
          >
            {product.isAddedToCart ? 'Remove From Cart' : 'Add To Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
