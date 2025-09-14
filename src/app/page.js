'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import axios from 'axios';

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios
        .get('http://127.0.0.1:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const role = res.data.is_admin ? 'admin' : 'user';
          setUserRole(role);
          if (role === 'admin') router.push('/admin');
          else router.push('/menu');
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setUserRole(null);
          setLoading(false);
        });
    } else {
      setUserRole(null);
      setLoading(false);
    }
  }, [router]);

  const handleGetStarted = () => {
    if (userRole === 'admin') router.push('/admin');
    else if (userRole === 'user') router.push('/menu');
    else router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Head>
        <title>Tiffin Service</title>
      </Head>

      {/* ✅ Hero */}
      <section className="bg-gradient-to-r from-green-100 via-white to-green-50 py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Fresh, <span className="text-green-600">Homemade</span> Food Delivered
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Say goodbye to restaurant junk! Enjoy daily meals made by local chefs,
          cooked with love, and delivered straight to your door.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 text-white font-bold text-lg rounded-xl shadow-md hover:scale-105 transition"
          style={{ backgroundColor: '#63ab45' }}
        >
          Order Now
        </button>
      </section>

      {/* ✅ Features */}
      <section id="features" className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
              title: "Homemade Goodness",
              desc: "Pure home-style food, no artificial flavors, no shortcuts."
            },
            {
              img: "https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg",
              title: "Flexible Plans",
              desc: "Daily, weekly, or custom tiffin subscriptions – your choice."
            },
            {
              img: "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg",
              title: "On-Time Delivery",
              desc: "Meals delivered hot and fresh exactly when you need them."
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl shadow hover:shadow-lg p-6 transition text-center">
              <img src={item.img} alt={item.title} className="h-32 w-full object-cover rounded-xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ How It Works */}
      <section id="howitworks" className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {[
            { step: "1", title: "Sign Up", desc: "Create your free account in minutes." },
            { step: "2", title: "Choose Plan", desc: "Pick the meal plan that fits your lifestyle." },
            { step: "3", title: "Place Order", desc: "Select meals from our daily menu." },
            { step: "4", title: "Enjoy Meal", desc: "Delivered fresh to your doorstep." },
          ].map((item, i) => (
            <div key={i} className="bg-green-50 rounded-2xl p-6 shadow hover:shadow-md transition">
              <div className="text-3xl font-bold text-green-600 mb-3">{item.step}</div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Blog Section */}
      <section id="blog" className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          From Our Kitchen Blog
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
              title: "Secrets of Healthy Indian Tiffin",
              desc: "Discover the balance of spices, flavors, and nutrition."
            },
            {
              img: "https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg",
              title: "Why Homemade > Restaurant Food",
              desc: "The truth about freshness and health."
            },
            {
              img: "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg",
              title: "Quick Lunchbox Solutions",
              desc: "Save time and eat right with pre-planned meals."
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl shadow hover:shadow-lg p-6 transition">
              <img src={item.img} alt={item.title} className="rounded-xl mb-4 h-40 w-full object-cover" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Footer */}
      <footer id="contact" className="bg-green-600 py-6 text-center mt-10">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Tiffin Service. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
