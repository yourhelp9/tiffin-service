'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import axios from 'axios';
import Link from 'next/link';

const ContactUsPage = () => {
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
        <title>Contact Us - Lunchmate</title>
      </Head>

      {/* --- Main Content --- */}
      <main className="flex-grow">
        {/* ✅ Contact Header Section */}
        <section className="bg-gradient-to-r from-green-100 via-white to-green-50 py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Get in Touch with <span className="text-green-600">Lunchmate</span>
            </h1>
            <p className="text-lg text-gray-600">
              We'd love to hear from you! Whether you have a question about our service, feedback, or a partnership inquiry, please feel free to reach out.
            </p>
          </div>
        </section>

        {/* ✅ Contact Information & Map Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-10">
              {/* Office Details */}
              <div className="bg-green-50 p-8 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h3>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold block mb-2">Lunchmate Headquarters</span>
                  123, Tiffin Hub,<br />
                  Food Street, Bhopal, MP 462001<br />
                  India
                </p>
              </div>

              {/* General Inquiries */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Contact Details</h3>
                <div className="space-y-4">
                  <p className="flex items-center text-lg text-gray-700">
                    <span className="w-8 text-green-600 text-2xl">📞</span>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p className="flex items-center text-lg text-gray-700">
                    <span className="w-8 text-green-600 text-2xl">📧</span>
                    <strong>Email:</strong> info@lunchmate.com
                  </p>
                  <p className="flex items-center text-lg text-gray-700">
                    <span className="w-8 text-green-600 text-2xl">⏰</span>
                    <strong>Working Hours:</strong> Mon-Sat, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Section */}
            <div className="bg-gray-100 p-4 rounded-2xl shadow-lg h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Location</h2>
              
              {/* ✅ यहाँ आपको अपनी लोकेशन का Google Map Embed Code पेस्ट करना है */}
              <div className="w-full h-[400px] md:h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.4180404390176!2d77.42468597597143!3d23.250556108502573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c4194c7b8e19d%3A0xc07a4a4b268b8e3a!2sDB%20Mall!5e0!3m2!1sen!2sin!4v1701334654321!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '1rem' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Common Footer Section --- */}
      <footer id="contact" className="py-6 text-center mt-auto" style={{ backgroundColor: '#63ab45' }}>
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Lunchmate. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default ContactUsPage;