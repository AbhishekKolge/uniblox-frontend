import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

import {
  DROPZONE_IMAGE_FORMAT,
  MAX_FILE_SIZE,
} from '../../../helpers/defaults';
import { validateDropzoneSingleFile } from '../../../helpers/helper';

import styles from './ProfileImage.module.css';

const ProfileImage = (props) => {
  const { onUpload, onCancel, profileImage } = props;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      ...DROPZONE_IMAGE_FORMAT,
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      validateDropzoneSingleFile(rejectedFiles, MAX_FILE_SIZE);
      if (acceptedFiles[0]) {
        onUpload(acceptedFiles[0]);
      }
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div
      className={`mx-auto pointer position-relative ${styles.profileImageContainer}`}
    >
      {!!profileImage && (
        <button
          onClick={onCancel}
          type='button'
          className='btn-close position-absolute top-1 end-0 rounded-circle text-light bg-white'
        ></button>
      )}
      <div {...getRootProps({})} className={styles.profileImageWrapper}>
        <Image
          priority={true}
          src={profileImage || '/profile-placeholder.png'}
          width={80}
          height={80}
          className={styles.profileImage}
          alt='profile image'
        />

        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default ProfileImage;
