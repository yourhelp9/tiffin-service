'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import axios from 'axios';
import Link from 'next/link';

const HomePage = () => {
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
    <div className="min-h-screen flex flex-col font-sans">
      <Head>
        <title>Tiffin Service</title>
      </Head>

     {/* ✅ Hero Section - Clean & Responsive (Enhanced) */}
<section className="bg-white py-20 px-6 relative overflow-hidden">
  
  {/* --- Background Elements --- */}
  {/* Large abstract circle at top left */}
  <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-green-100 opacity-60 filter blur-2xl z-0"></div>
  {/* Medium abstract blob at bottom right */}
  <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-yellow-50 opacity-70 filter blur-xl z-0"></div>
  {/* Small floating dots */}
  <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-green-300 animate-bounce-slow"></div>
  <div className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-yellow-300 animate-bounce-slow delay-300"></div>
  <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-green-200 animate-bounce-slow delay-700"></div>

  {/* --- Content --- */}
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
    
    {/* Left Column: Text and Button */}
    <div className="text-center lg:text-left">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
        Fresh, <span className="text-green-600">Homemade</span> Food Delivered
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 max-w-lg mx-auto lg:mx-0 mb-8">
        Say goodbye to restaurant junk! Enjoy daily meals made by local chefs,
        cooked with love, and delivered straight to your door.
      </p>
      <button
        onClick={handleGetStarted}
        className="px-8 sm:px-10 py-4 sm:py-5 text-white font-bold text-lg sm:text-xl rounded-full shadow-lg hover:scale-105 transition-all duration-300"
        style={{ backgroundColor: '#63ab45' }}
      >
        Order Now
      </button>
    </div>

    {/* Right Column: Image with Frame */}
    <div className="relative flex justify-center lg:justify-end p-6 sm:p-8">
      <div className="bg-green-50 rounded-full w-64 h-64 sm:w-96 sm:h-96 absolute z-0 transform translate-x-1/4 translate-y-1/4"></div>
      <img
        src="https://i.ibb.co/5XVDHhhj/lunchthali.png"
        alt="Delicious Indian Lunch Thali"
        className="w-auto max-w-sm sm:max-w-md lg:max-w-xl h-auto object-contain rounded-3xl shadow-2xl relative z-10 transform hover:scale-100 transition-transform duration-500"
      />
    </div>
  </div>
</section>


      {/* ✅ Plans Section (Corrected to green theme) */}
      <section id="plans" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
            Choose Your <span style={{ color: '#63ab45' }}>Plan</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 justify-center">
            {/* Trial Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg" style={{ backgroundColor: '#63ab45' }}>
                21% Off
              </div>
              <h3 className="text-4xl font-bold text-gray-900 line-through">₹150</h3>
              <p className="text-6xl font-extrabold my-4" style={{ color: '#63ab45' }}>₹ 119</p>
              <p className="text-2xl font-semibold text-gray-800 mb-4">Trial Plan</p>
              <Link href="/plan">
                <button className="text-white font-bold py-3 px-8 rounded-xl transition-colors w-full" style={{ backgroundColor: '#63ab45', hoverBackgroundColor: '#51943c' }}>
                  Subscribe
                </button>
              </Link>
              <p className="text-gray-600 text-sm mt-4">Total Thali: 1</p>
            </div>

            {/* Weekly Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg" style={{ backgroundColor: '#63ab45' }}>
                17% Off
              </div>
              <h3 className="text-4xl font-bold text-gray-900 line-through">₹900</h3>
              <p className="text-6xl font-extrabold my-4" style={{ color: '#63ab45' }}>₹ 749</p>
              <p className="text-2xl font-semibold text-gray-800 mb-4">Weekly Plan</p>
              <Link href="/plan">
                <button className="text-white font-bold py-3 px-8 rounded-xl transition-colors w-full" style={{ backgroundColor: '#63ab45', hoverBackgroundColor: '#51943c' }}>
                  Subscribe
                </button>
              </Link>
              <p className="text-gray-600 text-sm mt-4">Total Thali: 7</p>
            </div>

            {/* Monthly Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg" style={{ backgroundColor: '#63ab45' }}>
                40% Off
              </div>
              <h3 className="text-4xl font-bold text-gray-900 line-through">₹2499</h3>
              <p className="text-6xl font-extrabold my-4" style={{ color: '#63ab45' }}>₹ 1499</p>
              <p className="text-2xl font-semibold text-gray-800 mb-4">Monthly Plan</p>
              <Link href="/plan">
                <button className="text-white font-bold py-3 px-8 rounded-xl transition-colors w-full" style={{ backgroundColor: '#63ab45', hoverBackgroundColor: '#51943c' }}>
                  Subscribe
                </button>
              </Link>
              <p className="text-gray-600 text-sm mt-4">Total Thali: 14</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ We Don't Serve from Restaurants! - Corrected color */}
<section className="py-20 px-6 bg-white relative overflow-hidden">
  {/* Background decorative circle */}
  <div className="absolute top-0 left-0 w-full h-full">
    <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 rounded-full bg-green-100 opacity-50"></div>
  </div>

  <div className="max-w-7xl mx-auto text-center relative z-10">
    {/* Heading */}
    <div className="bg-[#f0f9f3] py-8 rounded-full shadow-lg inline-block px-12">
      <h2 className="text-3xl font-bold text-gray-800">
        We DON'T serve food from <span className="text-green-600">Restaurants!</span>
      </h2>
    </div>

    {/* Subheading */}
    <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
      Our food is prepared fresh daily by local home chefs.
    </p>

    {/* Features Grid */}
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-center">
      
      {/* Card 1 */}
      <div className="flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <img
          src="https://homeskitchen.in/img/home-food.jpeg"
          alt="Homemade Food Chef"
          className="w-60 h-60 rounded-full object-cover border-4 border-green-500 shadow-md"
        />
        <p className="mt-4 text-center font-semibold text-gray-700">
          100% Homemade Food
        </p>
      </div>

      {/* Card 2 */}
      <div className="flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <img
          src="https://tinyurl.com/mv37e659"
          alt="Restaurant Food"
          className="w-60 h-60 rounded-full object-cover border-4 border-green-500 shadow-md"
        />
        <p className="mt-4 text-center font-semibold text-gray-700">
          Freshly Prepared!
        </p>
      </div>

      {/* Card 3 */}
      <div className="flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <img
          src="https://tinyurl.com/y642dvds"
          alt="Authentic Taste of Home"
          className="w-60 h-60 rounded-full object-cover border-4 border-green-500 shadow-md"
        />
        <p className="mt-4 text-center font-semibold text-gray-700">
          Authentic Taste of Home
        </p>
      </div>

      {/* Card 4 */}
      <div className="flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <img
          src="https://tinyurl.com/45752cbp"
          alt="Safe Delivery"
          className="w-60 h-60 rounded-full object-cover border-4 border-green-500 shadow-md"
        />
        <p className="mt-4 text-center font-semibold text-gray-700">
          100% Safe Delivery
        </p>
      </div>

    </div>
  </div>
</section>


      {/* ✅ Why Us? - A Visual Layout */}
<section className="py-20 px-6 bg-green-50 relative overflow-hidden">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

    {/* Left Column: Image with Description */}
    <div className="relative">
      <img
        src="https://tinyurl.com/mhkskvvx"
        alt="Homemade tiffin being prepared"
        className="rounded-3xl shadow-2xl w-full h-auto object-cover"
      />
      <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Taste the Difference</h3>
        <p className="text-gray-600">
          We bring you authentic, regional flavors that feel just like home.
        </p>
      </div>
    </div>

    {/* Right Column: Key Benefits List */}
    <div className="space-y-10">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
        Why Choose <span className="text-green-600">Lunchmate?</span>
      </h2>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#63ab45' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-800">100% Homemade Food</h4>
          <p className="mt-1 text-gray-600">
            Our meals are prepared daily by local home chefs, ensuring a fresh and authentic taste with no artificial additives.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#63ab45' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09A5.5 5.5 0 0 1 17.5 3c3.87 0 7 3.13 7 7s-3.13 7-7 7l-1.45 1.32z"></path></svg>
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-800">Made with Passion</h4>
          <p className="mt-1 text-gray-600">
            Our talented chefs pour their heart into every dish, creating delicious, healthy, and hygienic meals.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#63ab45' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-800">Flexible Delivery</h4>
          <p className="mt-1 text-gray-600">
            Whether it's a one-time order or a monthly subscription, we deliver fresh and hot meals right to your doorstep.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ✅ How It Works - Updated with Corrected Colors */}
<section id="howitworks" className="py-20 px-6 bg-white relative overflow-hidden">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-16">
      Ordering in <span style={{ color: '#63ab45' }}>4 Easy Steps</span>
    </h2>

    <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start space-y-12 md:space-y-0">
      
      {/* Visual Connector Line for Desktop */}
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 z-0 transform -translate-y-1/2" style={{ backgroundColor: '#63ab45' }}></div>
      
      {/* Step 1 */}
      <div className="relative z-10 flex flex-col items-center p-6 w-full md:w-1/4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 transform hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#63ab45' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <h4 className="font-bold text-xl mb-2 text-gray-800">Sign Up</h4>
        <p className="text-gray-600">Create your free account in minutes.</p>
      </div>

      {/* Step 2 */}
      <div className="relative z-10 flex flex-col items-center p-6 w-full md:w-1/4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 transform hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#63ab45' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <h4 className="font-bold text-xl mb-2 text-gray-800">Choose Plan</h4>
        <p className="text-gray-600">Pick the meal plan that fits your lifestyle.</p>
      </div>

      {/* Step 3 */}
      <div className="relative z-10 flex flex-col items-center p-6 w-full md:w-1/4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 transform hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#63ab45' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <h4 className="font-bold text-xl mb-2 text-gray-800">Place Order</h4>
        <p className="text-gray-600">Select meals from our daily menu.</p>
      </div>

      {/* Step 4 */}
      <div className="relative z-10 flex flex-col items-center p-6 w-full md:w-1/4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 transform hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#63ab45' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h4 className="font-bold text-xl mb-2 text-gray-800">Enjoy Meal</h4>
        <p className="text-gray-600">Delivered fresh to your doorstep.</p>
      </div>

    </div>
  </div>
</section>

      {/* ✅ Manage Your Daily Tiffin Service with ApnThali App (Corrected colors) */}
      <section className="py-20 px-6 bg-green-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Manage Your Daily Tiffin <br /> Service with <span className="text-green-600">LunchMate Website</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-xl mb-8">
              Get delicious & affordable tiffin delivery in Bhopal with LunchMate. We offer daily meal subscriptions, customizable
              menus, and convenient delivery. Order your tiffin online today!
            </p>
          
          </div>
          <div className="flex justify-center md:justify-end relative">
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGd6N25jczlwMHptM210N2k4cm95bzVldDlwczFpODF0MzQ0eWR1MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gstx1m9h5oXF1Qs/giphy.gif"
              alt="LunchMate App on Phone"
              className="w-164 h-auto object-contain rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* ✅ Frequently Asked Questions (Corrected colors) */}
      <section className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="flex justify-center md:justify-start">
            <img
              src="https://images.onlymyhealth.com/imported/images/2024/June/12_Jun_2024/Main-WHO-guidelines-cooked-food.jpg"
              alt="Delicious Thali"
              className="w-160 h-auto object-contain rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-green-600 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700 mb-10">
              We provide only delicious food, friendly service, and affordable prices.
            </p>

            <div className="space-y-4">
              {[
                {
                  question: "Do you know Lunch Mate tiffin service?",
                  answer: "LunchMate is a premium tiffin service offering fresh, homemade meals delivered daily to your doorstep. We focus on hygiene, taste, and convenience."
                },
                {
                  question: "Can I customize my tiffin in service?",
                  answer: "Yes, we offer various customization options including meal choices, delivery times, and dietary preferences. Check our plans for more details!"
                },
                {
                  question: "Is the Veg Thali (veg tiffin service) suitable for vegetarians?",
                  answer: "Absolutely! Our Veg Thali is specifically designed for vegetarians, offering a wide range of delicious and nutritious plant-based options."
                },
                {
                  question: "Do you offer delivery in tiffin service?",
                  answer: "Yes, we offer reliable and timely delivery services right to your home or office, ensuring your food arrives hot and fresh."
                },
              ].map((faq, index) => (
                <details key={index} className="bg-gray-50 p-5 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
                  <summary className="flex justify-between items-center text-lg font-semibold text-gray-800">
                    {faq.question}
                    <svg className="w-5 h-5 text-gray-500 transform transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Join as a Customer Section */}
<section className="py-20 px-6 bg-green-50 relative">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    {/* Image Section */}
    <div className="relative flex justify-center md:justify-end">
      {/* Orange circle container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full" style={{ backgroundColor: '#ffddaf' }}></div>
      <div className="relative z-10 w-[300px] h-[300px] rounded-full overflow-hidden shadow-lg">
        <img
          src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg"
          alt="Happy customer with homemade food"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    {/* Content Section */}
    <div className="text-center md:text-left space-y-4">
      <h3 className="uppercase font-bold tracking-widest" style={{ color: '#63ab45' }}>
        Join Our Community
      </h3>
      <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
        Order Homemade Food Right Away
      </h2>
      <p className="text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
        Say goodbye to unhealthy takeout. With Lunchmate, you can get delicious, homemade food delivered to your door in no time. Place your daily order or schedule meals in advance.
      </p>
      
      {/* Get Started Button */}
      <div className="pt-4">
        <Link href="/login">
          <button
            className="px-8 py-4 text-white font-bold text-lg rounded-xl shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: '#63ab45' }}
          >
            Get Started Now
          </button>
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* ✅ Footer - Corrected color and fixed layout */}
      <footer id="contact" className="py-6 text-center mt-auto" style={{ backgroundColor: '#63ab45' }}>
        <p className="text-white text-sm">
          © {new Date().getFullYear()} LunchMate. All Rights Reserved | Designed with ❤️ by PS
        </p>
      </footer>
    </div>
  );
};

export default HomePage;