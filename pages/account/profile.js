import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'yup-phone-lite';

import {
  useShowMeQuery,
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation,
  useUpdateProfileMutation,
} from '../../features/slices/userApiSlice';

import ProfileCard from '../../components/User/Profile/ProfileCard';
import LoadingPage from '../../components/UI/LoadingPage/LoadingPage';
import ProfileForm from '../../components/User/Profile/ProfileForm';
import Modal from '../../components/UI/Modal/Modal';
import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import Sidebar from '../../components/Account/Sidebar/Sidebar';

const ProfilePage = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const closeEditProfileButton = useRef(null);

  const {
    data: profileData,
    isLoading: profileLoading,
    isSuccess: profileSuccess,
    isError: profileIsError,
    error: profileError,
  } = useShowMeQuery(
    {},
    {
      skip: isLoggedIn ? false : true,
    }
  );

  const [
    uploadProfileImage,
    {
      isSuccess: uploadProfileImageSuccess,
      isError: uploadProfileImageIsError,
      error: uploadProfileImageError,
      isLoading: uploadProfileImageIsLoading,
    },
  ] = useUploadProfileImageMutation();

  const [
    removeProfileImage,
    {
      isSuccess: removeProfileImageSuccess,
      isError: removeProfileImageIsError,
      isLoading: removeProfileImageLoading,
      error: removeProfileImageError,
    },
  ] = useRemoveProfileImageMutation();

  const [
    updateProfile,
    {
      isSuccess: updateProfileSuccess,
      isError: updateProfileIsError,
      error: updateProfileError,
    },
  ] = useUpdateProfileMutation();

  const formik = useFormik({
    initialValues: {
      firstName: profileData?.user?.firstName || '',
      lastName: profileData?.user?.lastName || '',
      contactNo: profileData?.user?.contactNo || '',
      email: profileData?.user?.email || '',
      gender: profileData?.user?.gender || '',
      dob: profileData?.user?.dob || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .min(3, 'Must be minimum 3 characters')
        .max(20, 'Must not be more than 20 characters')
        .required('Required'),
      lastName: Yup.string()
        .trim()
        .max(20, 'Must not be more than 20 characters'),
      contactNo: Yup.string()
        .trim()
        .phone('IN', 'Please enter a valid contact no')
        .required('Required'),
      gender: Yup.string().oneOf(['MALE', 'FEMALE']),
      dob: Yup.date(),
    }),
    onSubmit: (values) => {
      const userData = { ...values };
      userData.contactNo = userData.contactNo.toString();
      userData.dob = userData.dob ? new Date(userData.dob) : null;
      userData.gender = userData.gender || null;
      delete userData.email;
      updateProfile(userData)
        .unwrap()
        .then(() => {
          closeEditProfileButton.current.click();
          toast.success('Profile updated successfully');
        })
        .catch((error) => {
          if (error.data?.msg) {
            toast.error(error.data.msg.split(',')[0]);
          } else {
            toast.error('Something went wrong!, please try again');
          }
        });
    },
  });

  const uploadProfileImageHandler = (file) => {
    const formData = new FormData();
    formData.append('image', file);
    let uploadingToast = toast.loading(
      'Uploading profile image, please be patient'
    );
    uploadProfileImage(formData)
      .unwrap()
      .then(() => {
        toast.dismiss(uploadingToast);
        toast.success('Profile photo uploaded successfully');
      })
      .catch((error) => {
        toast.dismiss(uploadingToast);
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

  const removeProfileImageHandler = (e) => {
    e.stopPropagation();
    let removingToast = toast.loading('Removing image, please be patient');
    removeProfileImage(profileData?.user?.profileImageId)
      .unwrap()
      .then(() => {
        toast.dismiss(removingToast);
        toast.success('Image deleted successfully');
      })
      .catch((error) => {
        toast.dismiss(removingToast);
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

  useEffect(() => {
    if (profileIsError) {
      if (profileError.data?.msg) {
        toast.error(profileError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [profileError, profileIsError]);

  if (profileLoading) {
    return <LoadingPage />;
  }

  if (profileIsError) {
    return <ErrorPage />;
  }

  return profileSuccess && profileData ? (
    <section className='h-100 d-flex flex-column gap-2'>
      <Sidebar>
        <ProfileCard
          onRemoveImage={removeProfileImageHandler}
          onUploadImage={uploadProfileImageHandler}
          buttonProps={{
            'data-bs-toggle': 'modal',
            'data-bs-target': '#profileForm',
          }}
          user={profileData.user}
          profileImage={profileData?.user?.profileImage}
        />
      </Sidebar>
      <Modal
        id='profileForm'
        title='Edit information'
        size='modal-lg'
        onSubmit={formik.handleSubmit}
        ref={closeEditProfileButton}
      >
        <ProfileForm formik={formik} />
      </Modal>
    </section>
  ) : null;
};

export default ProfilePage;
