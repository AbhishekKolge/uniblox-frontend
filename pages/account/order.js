import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import LoadingPage from '../../components/UI/LoadingPage/LoadingPage';
import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import Sidebar from '../../components/Account/Sidebar/Sidebar';
import Pagination from '../../components/UI/Pagination/Pagination';
import OrdersCard from '../../components/Order/OrdersCard';

import { useGetOrdersQuery } from '../../features/slices/orderApiSlice';

const Order = () => {
  const [queries, setQueries] = useState({
    page: 1,
  });

  const {
    data: ordersData,
    isError: ordersIsError,
    error: ordersError,
    isLoading: ordersLoading,
  } = useGetOrdersQuery({ ...queries });

  useEffect(() => {
    if (ordersIsError) {
      if (ordersError.data?.msg) {
        toast.error(ordersError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [ordersError, ordersIsError]);

  if (ordersLoading) {
    return <LoadingPage />;
  }

  if (ordersIsError) {
    return <ErrorPage />;
  }

  return (
    <section className='h-100 d-flex flex-column gap-2'>
      <Sidebar>
        <OrdersCard
          orders={ordersData?.orders}
          totalOrders={ordersData?.totalOrders || 0}
        />
        <Pagination
          numOfPages={ordersData?.numOfPages}
          queries={queries}
          setQueries={setQueries}
        />
      </Sidebar>
    </section>
  );
};

export default Order;
