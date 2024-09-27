import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import StarRatings from 'react-star-ratings';

import Modal from '../../components/UI/Modal/Modal';
import Pagination from '../../components/UI/Pagination/Pagination';

import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '../../features/slices/reviewApiSlice';

import { formatISTDateTime } from '../../helpers/time';

import styles from './Review.module.css';

const Review = (props) => {
  const { isLoggedIn, productId } = props;
  const closeDeleteBtnRef = useRef(null);
  const { userId } = useSelector((state) => state.auth);
  const [isEdit, setIsEdit] = useState({
    id: '',
    enable: false,
  });
  const [deleteId, setDeleteId] = useState(null);
  const [queries, setQueries] = useState({
    page: 1,
  });

  const {
    data: reviewsData,
    isError: reviewsIsError,
    error: reviewsError,
    isLoading: reviewsIsLoading,
  } = useGetProductReviewsQuery({ queries, productId });
  const [
    createReview,
    {
      isSuccess: createReviewSuccess,
      isError: createReviewIsError,
      error: createReviewError,
    },
  ] = useCreateReviewMutation();
  const [
    updateReview,
    {
      isSuccess: updateReviewSuccess,
      isError: updateReviewIsError,
      error: updateReviewError,
    },
  ] = useUpdateReviewMutation();
  const [
    deleteReview,
    {
      isSuccess: deleteReviewSuccess,
      isError: deleteReviewIsError,
      error: deleteReviewError,
    },
  ] = useDeleteReviewMutation();

  const formik = useFormik({
    initialValues: {
      rating: 5,
      comment: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      rating: Yup.number().integer().min(1).max(5).required('required'),
      comment: Yup.string().trim().max(100),
    }),
    onSubmit: (values) => {
      const clonedValues = values;
      if (!clonedValues.comment) {
        delete clonedValues.comment;
      }
      if (isEdit.enable) {
        updateReview({ reviewData: clonedValues, reviewId: isEdit.id })
          .unwrap()
          .then(() => {
            formik.resetForm();
            setIsEdit({
              id: '',
              enable: false,
            });
            toast.success('Review edited successfully');
          })
          .catch((error) => {
            if (error.data?.msg) {
              toast.error(error.data.msg.split(',')[0]);
            } else {
              toast.error('Something went wrong!, please try again');
            }
          });
      } else {
        createReview({ reviewData: clonedValues, productId })
          .unwrap()
          .then(() => {
            formik.resetForm();
            toast.success('Review added successfully');
          })
          .catch((error) => {
            if (error.data?.msg) {
              toast.error(error.data.msg.split(',')[0]);
            } else {
              toast.error('Something went wrong!, please try again');
            }
          });
      }
    },
  });

  const editReviewHandler = (review) => {
    setIsEdit({
      id: review.id,
      enable: true,
    });
    review.rating && formik.setFieldValue('rating', review.rating);
    review.comment && formik.setFieldValue('comment', review.comment);
  };

  const ratingHandler = (e) => {
    formik.setFieldValue('rating', +e.target.value);
  };

  const setDeleteHandler = (id) => {
    setDeleteId(id);
  };

  const deleteReviewHandler = (e) => {
    e.preventDefault();
    deleteReview(deleteId)
      .unwrap()
      .then(() => {
        closeDeleteBtnRef.current.click();
        toast.success('Review deleted successfully');
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
    <div>
      <h3>{`Reviews ${reviewsData?.totalReviews || 0}`}</h3>
      {isLoggedIn && (
        <form noValidate onSubmit={formik.handleSubmit} className='mt-3'>
          <select
            value={formik.values.rating}
            onChange={ratingHandler}
            name='rating'
            id='rating'
            className='form-select'
          >
            <option value={1}>Poor</option>
            <option value={2}>Fair</option>
            <option value={3}>Good</option>
            <option value={4}>Very Good</option>
            <option value={5}>Excellent</option>
          </select>
          {formik.touched.rating && formik.errors.rating && (
            <div className='invalid-feedback'>{formik.errors.rating}</div>
          )}
          <div className='form-floating mt-3'>
            <textarea
              name='comment'
              value={formik.values.comment}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={`form-control ${styles.commentTextArea} ${
                formik.touched.comment && formik.errors.comment && 'is-invalid'
              } ${
                formik.touched.comment && !formik.errors.comment && 'is-valid'
              }`}
              placeholder='Leave a comment here'
              id='floatingTextarea'
            ></textarea>
            <label htmlFor='floatingTextarea'>Comments</label>
            {formik.touched.comment && formik.errors.comment && (
              <div className='invalid-feedback'>{formik.errors.comment}</div>
            )}
          </div>
          <button type='submit' className='btn btn-primary mt-3 w-100'>
            {isEdit.enable ? 'Edit Review' : 'Add Review'}
          </button>
        </form>
      )}
      {!!reviewsData?.reviews?.length ? (
        <>
          {reviewsData?.reviews.map((review) => {
            const canEdit = isLoggedIn && userId === review.user.id;
            return (
              <div key={review.id} className='card mt-3'>
                <div className='card-body'>
                  <strong>{`${review.user.firstName} ${review.user.lastName}`}</strong>
                  <div>{formatISTDateTime(review.createdAt)}</div>
                  <StarRatings
                    rating={review.rating}
                    starRatedColor='gold'
                    numberOfStars={5}
                    name='rating'
                    starDimension='20px'
                    starSpacing='1px'
                  />
                  <div className='mt-2'>{review.comment}</div>
                  {!!canEdit && (
                    <div className='mt-2'>
                      <button
                        type='button'
                        onClick={editReviewHandler.bind(this, review)}
                        className='btn btn-warning ms-auto text-light'
                      >
                        <i className='bi bi-pencil-fill'></i>
                      </button>

                      <button
                        type='button'
                        data-bs-toggle='modal'
                        data-bs-target='#deleteReviewModal'
                        className='btn btn-danger text-light ms-2'
                        onClick={setDeleteHandler.bind(this, review.id)}
                      >
                        <i className='bi bi-trash3-fill'></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <Pagination
            numOfPages={reviewsData?.numOfPages || 0}
            queries={queries}
            setQueries={setQueries}
          />
        </>
      ) : (
        <h4 className='mt-3'>No reviews yet</h4>
      )}

      <Modal
        onSubmit={deleteReviewHandler}
        id='deleteReviewModal'
        title='Delete Review'
        actionText='Delete'
        ref={closeDeleteBtnRef}
      >
        <span className='fs-6'>
          Are you sure? This action is not reversible.
        </span>
      </Modal>
    </div>
  );
};

export default Review;
