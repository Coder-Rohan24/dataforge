import '../index.css'; // Tailwind CSS
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { signupUser, loginUser } from '../api';
import { useNavigate } from 'react-router-dom'; // ✅ Add this

const LoginSignupPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const isFormValid = isValidEmail(email) && password.length > 0;
  const handleSignup = async () => {
    try {
      const res = await signupUser({ name, email, password });
      console.log(res.data);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      alert("Signup successful!");
      navigate('/profile'); // Redirect to home page or login page
      setIsSignUp(false); // Switch to login view
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
    }
  };
  
  const handleLogin = async () => {
    if (!isFormValid) return;
    try {
      console.log("Login form values:", { email, password }); // ✅ LOG form state
      const res = await loginUser({ email, password });
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate('/profile');
    } catch (err) {
      console.error("Login error:", err); // ✅ Detailed logging
      console.error("Response:", err.response?.data); // ✅ Backend error
      alert(err.response?.data?.detail || "Login failed");
    }
  };
  
  
  return (  
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white font-montserrat">
        <div className={`relative w-full max-w-5xl min-h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ${isSignUp ? 'right-panel-active' : ''}`}>
          
          {/* Sign Up Form */}
          <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out z-20 ${isSignUp ? 'translate-x-full opacity-100' : 'opacity-0 z-0'}`}>
            <form className="bg-white flex flex-col items-center justify-center h-full px-12 text-center">
              <h1 className="text-3xl font-bold text-blue-700">Create Account</h1>
              <div className="flex justify-center space-x-4 my-6">
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition"><i className="fab fa-google"></i></a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition"><i className="fab fa-linkedin-in"></i></a>
              </div>
              <p className="text-sm text-gray-500 mb-4">Or use your email for registration</p>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-100 focus:ring-2 ring-blue-300 rounded-md p-3 w-full mb-3 outline-none" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-100 focus:ring-2 ring-blue-300 rounded-md p-3 w-full mb-3 outline-none" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-100 focus:ring-2 ring-blue-300 rounded-md p-3 w-full mb-3 outline-none" />
              <button onClick={handleSignup} type="button" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 px-10 rounded-full transition-transform transform hover:scale-95 uppercase tracking-wider">Sign Up</button>
            </form>
          </div>

          {/* Sign In Form */}
          <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out z-30 ${isSignUp ? 'opacity-0 z-0' : 'opacity-100 z-20'}`}>
            <form className="bg-white flex flex-col items-center justify-center h-full px-12 text-center">
              <h1 className="text-3xl font-bold text-blue-700">Sign In</h1>
              <div className="flex justify-center space-x-4 my-6">
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition"><i className="fab fa-google"></i></a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition"><i className="fab fa-linkedin-in"></i></a>
              </div>
              <p className="text-sm text-gray-500 mb-4">Or use your email to login</p>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-100 focus:ring-2 ring-blue-300 rounded-md p-3 w-full mb-3 outline-none" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-100 focus:ring-2 ring-blue-300 rounded-md p-3 w-full mb-3 outline-none" />
              <a href="#" className="text-xs text-blue-600 mt-2 mb-4 hover:underline">Forgot your password?</a>
              <button onClick={handleLogin} type="button" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 px-10 rounded-full transition-transform transform hover:scale-95 uppercase tracking-wider">Sign In</button>
            </form>
          </div>

          {/* Overlay Section */}
          <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-50 transition-transform duration-700 ${isSignUp ? '-translate-x-full' : ''}`}>
            <div className={`bg-gradient-to-br from-blue-500 to-blue-700 text-white absolute left-[-100%] w-[200%] h-full transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-1/2' : ''}`}>
              
              <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ${isSignUp ? 'translate-x-0' : '-translate-x-1/4'}`}>
                <h1 className="text-3xl font-bold">Welcome Back!</h1>
                <p className="text-sm font-light mt-4 mb-6">To stay connected with us, please log in with your personal info</p>
                <button onClick={() => setIsSignUp(false)} className="bg-transparent border border-white text-white text-sm font-semibold py-3 px-10 rounded-full uppercase tracking-wider hover:bg-white hover:text-blue-700 transition">Sign In</button>
              </div>

              <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ${isSignUp ? 'translate-x-1/4' : 'translate-x-0'}`}>
                <h1 className="text-3xl font-bold">Hello, Friend!</h1>
                <p className="text-sm font-light mt-4 mb-6">Enter your personal details and start your journey with us</p>
                <button onClick={() => setIsSignUp(true)} className="bg-transparent border border-white text-white text-sm font-semibold py-3 px-10 rounded-full uppercase tracking-wider hover:bg-white hover:text-blue-700 transition">Sign Up</button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
