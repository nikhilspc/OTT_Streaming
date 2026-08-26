import { useEffect, useState } from 'react';
import api from '../api';

export default function Subscribe() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('subscriptions/').then((res) => setPlans(res.data));
  }, []);

  const handleSubscribe = async (plan) => {
    if (!localStorage.getItem('access')) {
      alert('Please login first to subscribe.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Backend se Razorpay order banwao
      const orderRes = await api.post('payments/create-order/', { plan_id: plan.id });
      const { order_id, amount, currency, key_id } = orderRes.data;

      // Step 2: Razorpay checkout widget kholo
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'OTT Platform',
        description: `${plan.plan_name} Subscription`,
        order_id: order_id,
        handler: async function (response) {
          // Step 3: Payment successful hone ke baad backend se verify karwao
          try {
            await api.post('payments/verify/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert('Subscription activated successfully!');
          } catch (err) {
            alert('Payment verification failed.');
          }
        },
        theme: { color: '#2563eb' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Could not create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-container">
      <h2>Choose a Subscription Plan</h2>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.plan_name}</h3>
            <p className="price">₹{plan.price} / {plan.duration_days} days</p>
            <p>Quality: {plan.quality_tier}</p>
            <p>{plan.features}</p>
            <button onClick={() => handleSubscribe(plan)} disabled={loading}>
              {loading ? 'Processing...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}