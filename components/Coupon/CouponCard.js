import styles from './CouponCard.module.css';

import { formatISTDateTime } from '../../helpers/time';

const CouponCard = (props) => {
  const { coupons, totalCoupons } = props;

  return (
    <div className='row'>
      <div className='fs-8'>
        <div className='card'>
          <div className='card-header d-flex align-items-center justify-content-between'>
            <h4 className='card-title'>{`Coupons (${totalCoupons})`}</h4>
          </div>
          <div className='card-body'>
            <div className='d-flex flex-column gap-3'>
              {coupons.length ? (
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col' className='text-center'>
                        Code
                      </th>
                      <th scope='col' className='text-center'>
                        Amount
                      </th>
                      <th scope='col' className='text-center'>
                        Valid From
                      </th>
                      <th scope='col' className='text-center'>
                        Valid Till
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => {
                      let isValid = coupon.valid;
                      if (new Date(coupon.expiryTime).getTime() < Date.now()) {
                        isValid = false;
                      }
                      return (
                        <tr key={coupon.id}>
                          <td className='text-center'>{coupon.code}</td>
                          <td className='text-center'>
                            {coupon.type === 'PERCENTAGE'
                              ? `${coupon.amount}%`
                              : `₹ ${coupon.amount}`}
                          </td>
                          <td className='text-center'>
                            {formatISTDateTime(coupon.startTime)}
                          </td>
                          <td className='text-center'>
                            {formatISTDateTime(coupon.expiryTime)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <span>No Coupons Found</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
