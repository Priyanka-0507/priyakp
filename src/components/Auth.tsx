import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill,ArrowLeft,ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import TiltedCard from './Titled';
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://media.istockphoto.com/id/1368058797/photo/close-up-of-medicine-vials-on-a-production-line.webp?a=1&b=1&s=612x612&w=0&k=20&c=lIu7w0SJ8tEA9Xnn7e_7HAwCDN0LNKUh9ZZDZp2zqqQ=',
    'https://media.istockphoto.com/id/1135284188/photo/if-you-need-its-here.webp?a=1&b=1&s=612x612&w=0&k=20&c=BESYqHIccHzlUNRthSmOcaZGaJCVCbYS6nsUQyc4Hfs=',
    'https://media.istockphoto.com/id/1368429013/photo/3d-render-pharmaceutical-manufacture-background-with-glass-bottles-with-clear-liquid-on.jpg?s=612x612&w=0&k=20&c=Ea1318oat0ffleVBhp9JY05JNOVjtYAQdlL6pf0ivcQ='
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
<div className="min-h-screen bg-custom-bg bg-cover bg-center h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">      


      
      
      <TiltedCard  containerHeight="600px"
      containerWidth="600px"
      imageHeight="400px"
      imageWidth="600px"
      rotateAmplitude={12}
      scaleOnHover={1.2}
      showMobileWarning={false}
      showTooltip={false}
      displayOverlayContent={false}
      >
      
         <div className="flex flex-col items-center w-full">
           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
          <Pill className="w-12 h-12 text-teal-600" />
        
       
        <div className="py-8 sm:rounded-lg sm:px-20 w-full">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-teal-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-teal-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm text-teal-600 hover:text-teal-500"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
        </div>
        </TiltedCard>
      </div>
      
      

     
    
  );
}