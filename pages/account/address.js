import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AddressCard from '../../components/Address/AddressCard';
import Modal from '../../components/UI/Modal/Modal';
import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import LoadingPage from '../../components/UI/LoadingPage/LoadingPage';
import AddressForm from '../../components/Address/AddressForm';
import Sidebar from '../../components/Account/Sidebar/Sidebar';

import {
  useGetAllAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '../../features/slices/addressApiSlice';

const CouponsPage = (props) => {
  const closeAddBtnRef = useRef(null);
  const closeDeleteBtnRef = useRef(null);
  const [action, setAction] = useState('');
  const [currentAddress, setCurrentAddress] = useState({
    address: '',
    city: '',
    pincode: '',
    state: '',
    type: 'HOME',
  });
  const [addressId, setAddressId] = useState('');

  const {
    data: addressesData,
    isError: addressesIsError,
    error: addressesError,
    isSuccess: addressesSuccess,
    isLoading: addressesLoading,
  } = useGetAllAddressesQuery({});

  const [
    createAddress,
    {
      isSuccess: createAddressSuccess,
      isError: createAddressIsError,
      error: createAddressError,
    },
  ] = useCreateAddressMutation();

  const [
    deleteAddress,
    {
      isSuccess: deleteAddressSuccess,
      isError: deleteAddressIsError,
      error: deleteAddressError,
    },
  ] = useDeleteAddressMutation();

  const [
    updateAddress,
    {
      isSuccess: updateAddressSuccess,
      isError: updateAddressIsError,
      error: updateAddressError,
    },
  ] = useUpdateAddressMutation();

  const formik = useFormik({
    initialValues: {
      address: currentAddress.address,
      city: currentAddress.city,
      pincode: currentAddress.pincode,
      state: currentAddress.state,
      type: currentAddress.type,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      address: Yup.string().min(10).max(200).required(),
      city: Yup.string().min(3).max(20).required(),
      pincode: Yup.number().integer().required(),
      state: Yup.string().min(3).max(20).required(),
      type: Yup.string().oneOf(['HOME', 'OFFICE']).optional(),
    }),
    onSubmit: (values) => {
      const addressDetails = { ...values };
      if (action === 'ADD') {
        createAddress(addressDetails)
          .unwrap()
          .then(() => {
            formik.resetForm();
            closeAddBtnRef.current.click();
            toast.success('Address created successfully');
          })
          .catch((error) => {
            if (error.data?.msg) {
              toast.error(error.data.msg.split(',')[0]);
            } else {
              toast.error('Something went wrong!, please try again');
            }
          });
      }

      if (action === 'UPDATE') {
        updateAddress({ addressData: addressDetails, addressId })
          .unwrap()
          .then(() => {
            formik.resetForm();
            closeAddBtnRef.current.click();
            toast.success('Address updated successfully');
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

  useEffect(() => {
    if (addressesIsError) {
      if (addressesError.data?.msg) {
        toast.error(addressesError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [addressesError, addressesIsError]);

  if (addressesIsError) {
    return <ErrorPage />;
  }

  if (addressesLoading) {
    return <LoadingPage />;
  }

  const deleteAddressHandler = (e) => {
    e.preventDefault();
    deleteAddress(addressId)
      .unwrap()
      .then(() => {
        closeDeleteBtnRef.current.click();
        toast.success('Address deleted successfully');
      })
      .catch((error) => {
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

  const onDeleteHandler = (id) => {
    setAddressId(id);
  };

  const onAddHandler = () => {
    setAction('ADD');
    setAddressId('');
    setCurrentAddress({
      address: '',
      city: '',
      pincode: '',
      state: '',
      type: 'HOME',
    });
  };

  const onEditHandler = ({ id, addressDetails }) => {
    setAction('UPDATE');
    setAddressId(id);
    setCurrentAddress(addressDetails);
  };

  return (
    <section className='h-100 d-flex flex-column gap-2'>
      <Sidebar>
        {addressesSuccess && addressesData ? (
          <AddressCard
            buttonProps={{
              'data-bs-toggle': 'modal',
              'data-bs-target': '#addAddressForm',
            }}
            deleteButtonProps={{
              'data-bs-toggle': 'modal',
              'data-bs-target': '#deleteAddressModal',
            }}
            addresses={addressesData?.addresses}
            onAdd={onAddHandler}
            onDelete={onDeleteHandler}
            onEdit={onEditHandler}
          />
        ) : null}
      </Sidebar>

      <Modal
        onSubmit={formik.handleSubmit}
        id='addAddressForm'
        title='Add Address'
        ref={closeAddBtnRef}
      >
        <AddressForm action={action} formik={formik} />
      </Modal>
      <Modal
        onSubmit={deleteAddressHandler}
        id='deleteAddressModal'
        title='Delete Address'
        actionText='Delete'
        ref={closeDeleteBtnRef}
      >
        <span className='fs-6'>
          Are you sure? This action is not reversible.
        </span>
      </Modal>
    </section>
  );
};

export default CouponsPage;
