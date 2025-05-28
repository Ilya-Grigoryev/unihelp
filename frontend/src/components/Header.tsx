import { Link, useNavigate } from "react-router-dom";
import SvgIcon from '@/components/SvgIcon';
import Wave from '@/assets/wave.svg?react';
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';


export default function Header() {
  const [showWave, setShowWave] = useState(true);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowWave(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed w-full h-[70px] z-10000">
      <div className="mx-auto py-3 flex justify-between bg-unihelp-purple">
        <Link to="/" className="pl-9 text-5xl font-londrina-solid text-unihelp-mint">
          UNI:HELP
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 font-monda text-md text-white">
          {isAuthenticated && (
            <Link to="" className="flex px-3 py-2 rounded-full hover:bg-black/10 transition-colors duration-200 items-center gap-2">
            <SvgIcon name="home" className="w-7 h-5 text-white"/>
            Home
          </Link>
          )}

          <Link to="/search" className="flex px-3 py-2 rounded-full hover:bg-black/10 transition-colors duration-200 items-center gap-2">
            <SvgIcon name="search" className="w-5 h-5 text-white"/>
            Search
          </Link>

          <Link to="/about" className="flex px-3 py-2 rounded-full hover:bg-black/10 transition-colors duration-200 items-center gap-2">
          <SvgIcon name="magic" className="w-6 h-5 text-white"/>
            How it works
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 font-monda text-md text-white">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/messages')}
                className="pl-0.5 pr-2 py-2 rounded-full hover:bg-black/10 transition-colors duration-200 cursor-pointer"
              >
                <SvgIcon name="mail" className="w-8 h-5 text-white" />
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="flex content-between justify-between gap-2 bg-unihelp-purple-dark px-0.5 py-0.5 rounded-full font-medium transition-colors duration-200 hover:bg-unihelp-white hover:text-unihelp-purple-dark cursor-pointer"
              >
                <div className="rounded-full overflow-hidden">
                  <SvgIcon name="user" className="w-8 h-8 text-unihelp-purple-dark bg-green-500 pt-1.5 pl-[9px]" />
                </div>
                <span className="mt-1 mr-3">profile</span>
              </button>

              <button
                onClick={logout}
                className="p-2 mr-4 rounded-full hover:bg-black/10 transition-colors duration-200 cursor-pointer"
              >
                <SvgIcon name="logout" className="w-5 h-5 text-white" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-white/80 transition-colors duration-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="mr-9 border-1 text-uni-purple px-4 py-1 rounded-full font-medium hover:bg-uni-mint hover:text-unihelp-purple-dark hover:bg-unihelp-white transition-colors duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      {!showWave && (
      <Wave className="w-full h-auto text-unihelp-purple block mt-[-0.3px] z-[-10]" />
      )}
    </header>
  );
}
