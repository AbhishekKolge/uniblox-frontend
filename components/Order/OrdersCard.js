import { Fragment, useState } from 'react';
import { JsonViewer } from '@textea/json-viewer';

const OrdersCard = (props) => {
  const { orders, totalOrders } = props;
  const [showRowId, setShowRowId] = useState(null);

  const toggleShow = (id) => {
    setShowRowId((prevState) => {
      return prevState === id ? null : id;
    });
  };

  return (
    <div className='row'>
      <div className='fs-8'>
        <div className='card'>
          <div className='card-header d-flex align-items-center justify-content-between'>
            <h4 className='card-title'>{`Orders (${totalOrders})`}</h4>
          </div>
          <div className='card-body'>
            <div className='d-flex flex-column gap-3'>
              {orders.length ? (
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col' className='text-center'></th>
                      <th scope='col' className='text-center'>
                        Order ID
                      </th>
                      <th scope='col' className='text-center'>
                        Coupon
                      </th>
                      <th scope='col' className='text-center'>
                        Total Products
                      </th>
                      <th scope='col' className='text-center'>
                        Discount
                      </th>
                      <th scope='col' className='text-center'>
                        Sub Total
                      </th>
                      <th scope='col' className='text-center'>
                        Total
                      </th>
                      <th scope='col' className='text-center'>
                        Paid
                      </th>
                      <th scope='col' className='text-center'>
                        Delivered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      return (
                        <Fragment key={order.id}>
                          <tr>
                            <td className='text-center'>
                              {showRowId !== order.id ? (
                                <button
                                  onClick={toggleShow.bind(null, order.id)}
                                  className='btn'
                                >
                                  <i className='bi bi-chevron-right'></i>
                                </button>
                              ) : (
                                <button
                                  onClick={toggleShow.bind(null, order.id)}
                                  className='btn'
                                >
                                  <i className='bi bi-chevron-down'></i>
                                </button>
                              )}
                            </td>
                            <td className='text-center'>{order.orderId}</td>
                            <td className='text-center'>
                              {order?.coupon?.code || '-'}
                            </td>
                            <td className='text-center'>
                              {order.products?.length || 0}
                            </td>
                            <td className='text-center'>
                              {order?.discount | '-'}
                            </td>
                            <td className='text-center'>
                              {order?.subTotal || '-'}
                            </td>
                            <td className='text-center'>
                              {order?.total || '-'}
                            </td>
                            <td className='text-center'>
                              {order.isPaid ? (
                                <span className='text-success'>
                                  <i className='bi bi-check2'></i>
                                </span>
                              ) : (
                                <span className='text-danger'>
                                  <i className='bi bi-x-lg'></i>
                                </span>
                              )}
                            </td>
                            <td className='text-center'>
                              {order.isDelivered ? (
                                <span className='text-success'>
                                  <i className='bi bi-check2'></i>
                                </span>
                              ) : (
                                <span className='text-danger'>
                                  <i className='bi bi-x-lg'></i>
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td colSpan={8}>
                              <div
                                className={`collapse ${
                                  showRowId === order.id ? 'show' : ''
                                }`}
                              >
                                <JsonViewer value={order} />
                              </div>
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <span>No orders found</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;
