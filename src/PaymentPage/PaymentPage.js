import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./PaymentPage.css";

const PaymentPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const price = queryParams.get('price');

  useEffect(() => {
    if (price) {
      setAmount(parseInt(price, 10));
    }
  }, [price]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
        amount: amount,
        description: 'پرداخت بابت خدمات پرستاری',
        email: email,
        phone: phone,
        callbackUrl: 'http://yourwebsite.com/callback'
      });

      if (response.data.status === 100) {
        window.location.href = `https://www.zarinpal.com/pg/StartPay/${response.data.authority}`;
      } else {
        console.error('خطا در دریافت لینک پرداخت:', response.data.message);
      }
    } catch (error) {
      console.error('خطا در درخواست پرداخت:', error);
    }
  };

  return (
    <div className="payment-page">
      <h1>صفحه پرداخت</h1>
      <form onSubmit={handleSubmit}>
        <label>
          نام و نام خانوادگی:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          آدرس ایمیل:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          شماره تماس:
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          مبلغ پرداختی:
          <input type="number" value={amount} readOnly />
        </label>
        <button type="submit">پرداخت</button>
      </form>
    </div>
  );
};

export default PaymentPage;
