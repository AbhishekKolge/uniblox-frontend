import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';

import ProductCard from '../components/Product/ProductCard';
import ErrorPage from '../components/UI/ErrorPage/ErrorPage';
import ProductFilterForm from '../components/Product/ProductFilterForm';
import Pagination from '../components/UI/Pagination/Pagination';
import LoadingPage from '../components/UI/LoadingPage/LoadingPage';

import {
  useGetAllProductsQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from '../features/slices/productApiSlice';
import { useGetAllCategoriesQuery } from '../features/slices/categoryApiSlice';
import { useGetAllSizesQuery } from '../features/slices/sizeApiSlice';

const ProductsPage = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [queries, setQueries] = useState({
    search: '',
    sort: 'latest',
    featured: '',
    categoryId: '',
    sizeId: '',
    priceSort: '',
    page: 1,
  });

  const {
    data: productsData,
    isError: productsIsError,
    error: productsError,
    isLoading: productsIsLoading,
  } = useGetAllProductsQuery({ ...queries });

  const {
    data: categoriesData,
    isError: categoriesIsError,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  const {
    data: sizesData,
    isError: sizesIsError,
    error: sizesError,
  } = useGetAllSizesQuery();

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
    if (productsIsError) {
      if (productsError.data?.msg) {
        toast.error(productsError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [productsError, productsIsError]);

  useEffect(() => {
    if (categoriesIsError) {
      if (categoriesError.data?.msg) {
        toast.error(categoriesError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [categoriesError, categoriesIsError]);

  useEffect(() => {
    if (sizesIsError) {
      if (sizesError.data?.msg) {
        toast.error(sizesError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [sizesError, sizesIsError]);

  if (productsIsLoading) {
    return <LoadingPage />;
  }

  if (productsIsError) {
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

  return (
    <section className='h-100 d-flex flex-column gap-2'>
      <ProductFilterForm
        categories={categoriesData?.categories || []}
        sizes={sizesData?.sizes || []}
        queries={queries}
        setQueries={setQueries}
      />
      <div className='row g-3'>
        {productsData?.products?.length ? (
          productsData.products.map((product) => {
            return (
              <ProductCard
                onCartAdd={addToCartHandler}
                onCartRemove={removeFromCartHandler}
                onAddToWishlist={addToWishlistHandler}
                onRemoveFromWishlist={removeFromWishlistHandler}
                product={product}
                key={product.id}
                isLoggedIn={isLoggedIn}
              />
            );
          })
        ) : (
          <p>No Products Found</p>
        )}
      </div>
      <Pagination
        numOfPages={productsData?.numOfPages || 0}
        queries={queries}
        setQueries={setQueries}
      />
    </section>
  );
};

export async function getStaticProps(context) {
  return {
    props: {
      open: true,
    },
  };
}

export default ProductsPage;
