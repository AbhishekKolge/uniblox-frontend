import { useRef } from 'react';

import { formatISTDate } from '../../../helpers/time';

import ProfileImage from '../../UI/ProfileImage/ProfileImage';

import styles from './ProfileCard.module.css';

const ProfileCard = (props) => {
  const { user, buttonProps, onRemoveImage, onUploadImage, profileImage } =
    props;

  return (
    <div className='row'>
      <div className='col-12'>
        <div className='card'>
          <div className='card-header d-flex align-items-center justify-content-between'>
            <h4 className='card-title'>Personal Information</h4>
            <button
              {...buttonProps}
              className='btn btn-primary border-dark btn-sm'
            >
              Edit Information
            </button>
          </div>
          <div className='card-body'>
            <div className='d-flex flex-column gap-3'>
              <ProfileImage
                onUpload={onUploadImage}
                onCancel={onRemoveImage}
                profileImage={profileImage}
              />

              <div className='d-flex flex-column gap-2'>
                <ul className='list-group'>
                  <li className='list-group-item no-border'>
                    <span className='fw-semibold'>Name: </span>
                    <span>{`${user.firstName} ${user.lastName}`}</span>
                  </li>
                  <li className='list-group-item no-border'>
                    <span className='fw-semibold'>Email: </span>
                    <span>{user.email}</span>
                  </li>
                  <li className='list-group-item no-border'>
                    <span className='fw-semibold'>Contact: </span>
                    <span>{user.contactNo}</span>
                  </li>
                  <li className='list-group-item no-border'>
                    <span className='fw-semibold'>Gender: </span>
                    <span className='capitalize'>
                      {user.gender || 'Not set'}
                    </span>
                  </li>
                  <li className='list-group-item no-border'>
                    <span className='fw-semibold'>DOB: </span>
                    <span>
                      {user.dob ? formatISTDate(user.dob) : 'Not set'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
