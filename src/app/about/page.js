'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import axios from 'axios';
import Link from 'next/link';

const AboutUsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const role = res.data.is_admin ? 'admin' : 'user';
          setUserRole(role);
          setLoading(false);
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
  }, []);

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
    <div className="min-h-screen flex flex-col font-sans">
      <Head>
        <title>About Us - Lunchmate</title>
      </Head>

      {/* --- About Us Hero Section --- */}
      <section className="bg-gradient-to-r from-green-100 via-white to-green-50 py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Our Story: The Journey of <span className="text-green-600">Lunchmate</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
          We started with a simple vision: to bring the authentic taste of home-cooked meals to everyone. Lunchmate is a platform that connects you with passionate local chefs who prepare fresh, healthy, and delicious food with love.
        </p>
      </section>

      {/* --- About Us Page Content --- */}
      <main className="flex-grow">
        {/* ✅ Introduction Section */}
        <section className="py-20 px-6 bg-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
              Bringing Authenticity to Your Table
            </h2>
            <p className="text-lg text-gray-700">
              At <strong>Lunchmate</strong>, we believe that nothing beats the comfort and taste of a home-cooked meal. We're not just a tiffin service; we're a community built on a passion for good food and a commitment to health. We empower talented home chefs, support local communities, and promote a healthier lifestyle for our customers, one meal at a time.
            </p>
          </div>
        </section>

        {/* ✅ Our Mission & Vision */}
        <section className="py-20 px-6 bg-green-50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700">
                To provide hygienic, delicious, and diverse homemade meals that feel just like food from your own kitchen. We empower talented home chefs, support local communities, and promote a healthier lifestyle for our customers, one meal at a time.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-lg text-gray-700">
                To be the most trusted and loved provider of homemade meals, setting a new standard for food delivery that prioritizes authenticity, quality, and well-being.
              </p>
            </div>
          </div>
        </section>

        {/* ✅ Meet Our Chefs */}
        <section className="py-20 px-6 bg-white text-center">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-16">
              The Hands Behind the Flavors
            </h2>
            <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">

              {/* Chef 1 */}
              <div className="bg-green-50 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 text-center md:text-left">
                <img
                  src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg"
                  alt="Chef Reena"
                  className="w-32 h-32 rounded-full object-cover shadow-lg flex-shrink-0"
                  style={{ border: '4px solid #63ab45' }}
                />
                <div>
                  <h4 className="mt-4 md:mt-0 text-2xl font-bold text-gray-800">Reena Sharma</h4>
                  <p className="text-green-600 font-medium mb-2">Head Chef - North Indian Cuisine</p>
                  <p className="text-gray-600">
                    With over 20 years of experience, Reena brings the authentic flavors of Punjab to your thali, prepared with traditional recipes and a lot of care.
                  </p>
                </div>
              </div>

              {/* Chef 2 */}
              <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 text-center md:text-left border border-gray-200">
                <img
                  src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg"
                  alt="Chef Mohan"
                  className="w-32 h-32 rounded-full object-cover shadow-lg flex-shrink-0"
                  style={{ border: '4px solid #63ab45' }}
                />
                <div>
                  <h4 className="mt-4 md:mt-0 text-2xl font-bold text-gray-800">Mohan Singh</h4>
                  <p className="text-green-600 font-medium mb-2">Specialist - South Indian Delicacies</p>
                  <p className="text-gray-600">
                    Mohan's food is a journey to Kerala and Tamil Nadu, with every bite bursting with traditional spices and genuine taste.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ✅ Our Promise */}
        <section className="pt-20 pb-10 px-6 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
              Our <span style={{ color: '#63ab45' }}>Commitment</span> to You
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Item 1 */}
              <div className="flex items-start space-x-6 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: '#63ab45' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Hygiene & Freshness</h4>
                  <p className="mt-1 text-gray-600">Every meal is prepared in a clean environment with the freshest ingredients.</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start space-x-6 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: '#63ab45' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h19.58a1 1 0 0 1 .91.56L22 17zM20 12h-2V5h-2v7H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h19.58a1 1 0 0 1 .91.56L22 9z"></path><path d="M10 2l-1 1v2l1-1zM14 2l1 1v2l-1-1z"></path></svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Authentic Taste</h4>
                  <p className="mt-1 text-gray-600">We bring you genuine regional flavors, prepared with traditional recipes.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start space-x-6 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: '#63ab45' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Customer First</h4>
                  <p className="mt-1 text-gray-600">Your satisfaction is our priority. We are always here to help.</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer id="contact" className="py-6 text-center mt-auto" style={{ backgroundColor: '#63ab45' }}>
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Lunchmate. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default AboutUsPage;
