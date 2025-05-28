// src/pages/SignUp.tsx
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '@/api/auth';

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName]               = useState('');
  const [university, setUniversity]   = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]             = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name, university, email, password, repeat_password: confirmPassword,
      });
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-unihelp-purple flex flex-col items-center pt-16 font-monda">
      {/* Логотип */}
      <h1
        className="transition-transform hover:scale-105 font-londrina-solid text-7xl text-unihelp-mint mb-12 cursor-pointer"
        onClick={() => navigate('/')}
      >
        UNI:HELP
      </h1>

      {/* Карточка формы */}
      <div className="bg-[#ECE8DE] px-8 py-4 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="font-lilita-one text-center text-3xl font-bold text-unihelp-purple mb-6 mt-2">
          Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => {
              setError(null);
              setName(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400 bg-white"
            required
          />

          {/* University */}
          <input
            type="text"
            placeholder="University"
            value={university}
            onChange={e => {
              setError(null);
              setUniversity(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400 bg-white"
            required
          />

          {/* E-mail */}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => {
              setError(null);
              setEmail(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400 bg-white"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => {
              setError(null);
              setPassword(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400 bg-white"
            required
          />

          {/* Repeat password */}
          <input
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={e => {
              setError(null);
              setConfirmPassword(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400 bg-white"
            required
          />

          {/* Ошибка несовпадения */}
          {error && (
            <p className="text-red-700 text-sm text-center">
              {error}
            </p>
          )}

          {/* Кнопка регистрации с спиннером */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 rounded-full shadow-md text-black font-bold
                       bg-unihelp-mint transition-transform hover:scale-105 cursor-pointer
                       disabled:bg-gray-400 disabled:opacity-75 disabled:cursor-wait"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              'Create account'
            )}
          </button>

          {/* или */}
          <div className="flex items-center my-1">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-sm text-gray-600">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          {/* Ссылка на логин */}
          <div className="text-center">
            <a
              href="/login"
              className="text-sm text-gray-600 hover:text-unihelp-purple"
            >
              Log In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
