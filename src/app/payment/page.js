'use client';

import Head from 'next/head';

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <Head>
        <title>Payment</title>
      </Head>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Manual Payment
        </h1>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-gray-600 mb-6">
            Apna subscription activate ya renew karne ke liye, neeche diye gaye QR code ko scan karke payment karein. Payment hone ke baad, screenshot admin ko bhej dein.
          </p>
          <div className="flex justify-center mb-6">
            {/* Yahan aap apna QR code image daal sakte hain */}
            <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-semibold border-4 border-dashed border-gray-400">
              QR Code Here
            </div>
          </div>
          <p className="text-sm text-gray-500">
            QR code ko scan karein ya <a href="#" className="text-indigo-600 hover:underline">yahan click karein</a> payment details ke liye.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;