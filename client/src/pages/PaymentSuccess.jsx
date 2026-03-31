import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const listingId = localStorage.getItem('pendingListingId');

    if (!orderId || !listingId) {
      setStatus('failed');
      return;
    }

    const verify = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          'http://localhost:5000/api/cashfree/verify-payment',
          { orderId, listingId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setTransaction(res.data.transaction);
          setStatus('success');
          localStorage.removeItem('pendingListingId');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error(err);
        setStatus('failed');
      }
    };

    verify();
  }, []);

  if (status === 'verifying') return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-semibold animate-pulse">Verifying payment...</p>
    </div>
  );

  if (status === 'failed') return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-2xl font-bold text-red-500">❌ Payment Failed</p>
      <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-6 py-2 rounded">
        Go Home
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <p className="text-4xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        {transaction && (
          <div className="text-left mt-4 space-y-2 text-gray-700">
            <p><span className="font-semibold">Item:</span> {transaction.listingTitle}</p>
            <p><span className="font-semibold">Amount:</span> ₹{transaction.amount}</p>
            <p><span className="font-semibold">Seller:</span> {transaction.sellerName}</p>
            <p><span className="font-semibold">Transaction ID:</span> {transaction.transactionId}</p>
          </div>
        )}
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg w-full"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;