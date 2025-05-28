import { useState } from 'react';

import Wave from '@/assets/wave.svg?react';
import GradientWave from '@/assets/gradient-wave.svg?react'
import { useNavigate } from 'react-router-dom';
import SearchForm from '@/components/SearchForm';


export default function About() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<'need' | 'help'>('need');

  const questions = {
    need: [
      {
        q: 'Can I stay anonymous?',
        a: 'Yes. You don’t have to share your full name or student ID.',
      },
      {
        q: 'Can I choose my helper?',
        a: 'You pick a helper based on prices, ratings and experience.',
      },
      {
        q: 'Is this service legal and compliant with uni regulations?',
        a: "Yes, it's peer-to-peer help focusing on understanding – not cheating.",
      },
      {
        q: 'What if the helper turns out to be a scammer?',
        a: 'This is impossible! You send payment only after the work is done.',
      },
    ],
    help: [
      {
        q: 'How do I start earning money here?',
        a: 'Register, post your offer on the subject you know and receive orders!',
      },
      {
        q: 'Can I be a helper if I’m not a straight-A student?',
        a: 'Yes! As long as you completed the subject, you can help.',
      },
      {
        q: 'How much can I earn?',
        a: 'You control your earnings. Set your own price per task or per hour.',
      },
      {
        q: 'What if the client turns out to be a scammer?',
        a: 'The client’s money is held securely from the start – you get paid once the help is complete.',
      },
    ],
  };

  return (
    <>
    <section className="bg-unihelp-purple pt-28 font-monda">
        <div className="w-full flex flex-row justify-evenly items-center">
          <img src="/images/bubbles/top-left.svg" alt="Top Left Bubble" className="size-1/4" />
          <span className="text-unihelp-white font-monda text-center text-2xl">
            <p>UNIque help!</p>
            <p>From students</p>
            <p>for students</p>
          </span>
          <img src="/images/bubbles/top-right.svg" alt="Top Right Bubble" className="size-1/4" />
        </div>

        <SearchForm note="Save hours. Skip stress. Get explained solutions from real students!" />
    </section>

      <Wave className="w-full h-auto text-unihelp-purple block mt-[-0.3px] absolute" />

    <section className="bg-unihelp-mint pt-12 font-monda">
      <div className="w-full flex flex-row justify-evenly items-center">
        <img src="/images/bubbles/bottom-left.svg" alt="Bottom Left Bubble" className="size-1/4" />
        <span className="text-unihelp-purple-dark font-monda text-center text-2xl">
        <p>HELPing is</p>
        <p>easy money!</p>
        <p>flexible schedule,</p>
        <p>no contracts</p>
        </span>
        <img src="/images/bubbles/bottom-right.svg" alt="Bottom Right Bubble" className="size-1/4" />
      </div>

      <div className="flex flex-col items-center justify-center mt-8 pb-7 px-4 text-center">
        <button onClick={() => {navigate('/signup')}}
            className="cursor-pointer bg-unihelp-purple text-white text-xl w-1/3 font-monda px-8 py-4 rounded-full shadow-2xl hover:bg-unihelp-purple/90 transition-transform duration-200 hover:scale-103">
        JOIN <span className="tracking-wide">our community of HELPERS!</span>
        </button>
        <p className="text-unihelp-purple-dark text-md mt-1 mb-4">
        You’ve solved it once. Share your valuable experience!
        </p>
      </div>
    </section>

    <Wave className="w-full h-auto text-unihelp-mint block mt-[-0.3px] absolute" />


    <section className="bg-unihelp-cream py-12 px-4 text-center font-monda">
      <h2 className="text-4xl text-unihelp-purple my-8">
        How it works?
      </h2>

      <div className="flex justify-center mb-8">
        <img
            src="/images/diagramm1.svg"
            alt="How it works"
            className="max-w-5xl w-2/3 h-auto mx-auto"
        />
      </div>

      <div className="text-justify grid grid-cols-3 gap-25 max-w-4xl mx-auto text-gray-800 text-lg leading-relaxed">
        {/* 1. Despair */}
          <p>
            It's Bob. <br />
            He's been staring at the same problem for hours.
            No idea where to start, no good explanation. And the deadline keeps getting closer...
          </p>

        {/* 2. New hope */}
          <p>
            It's Rob. <br />
            He is a student who’s been through this exact course, for him, it’s already behind.
            He knows exactly what Bob is missing and how to explain it.
          </p>

        {/* 3. Clarity */}
          <p>
            Win-win!<br /> 
            Rob made easy money on what he already knows.
            Bob finally got it and saved a ton of time.
            One day Bob and Rob will switch places.
          </p>
      </div>
    </section>

    <Wave className="w-full h-auto text-unihelp-white block mt-[-0.3px] absolute" />
    
    <section className="w-full bg-gradient-to-r from-[#BCBDFA] to-[#C0F5D6] py-20 px-4 font-monda">
        <h2 className="text-4xl text-unihelp-purple-dark mb-16 text-center">
            Let’s expain it step by step!
        </h2>
        <div className="flex justify-center mb-8">
        <img
            src="/images/diagramm2.svg"
            alt="Step by step diagram"
            className="max-w-5xl w-2/3 max h-auto mx-auto"
        />
        </div>
    </section>

    <GradientWave className="w-full h-auto block mt-[-0.1px] absolute" />

    <div className="bg-unihelp-cream pt-20 px-4 font-monda">
      <h2 className="text-3xl text-center text-unihelp-purple mb-10">Frequently Asked Questions</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-white shadow-md rounded-full overflow-hidden flex w-1/3">
          <button
            className={`px-6 py-3 transition font-bold w-1/2  ${
              tab === 'need'
                ? 'bg-gradient-to-r from-[#5B4CCC] to-[#5893AC] text-white text-md'
                : 'text-gray-400 hover:bg-gray-100 cursor-pointer text-sm'
            }`}
            onClick={() => setTab('need')}
          >
            I need help
          </button>
          <button
            className={`px-6 py-3 transition font-bold w-1/2 ${
              tab === 'help'
                ? 'bg-gradient-to-r from-[#5893AC] to-[#54DA8C] text-white text-md'
                : 'text-gray-400 hover:bg-gray-100 cursor-pointer text-sm'
            }`}
            onClick={() => setTab('help')}
          >
            I can help
          </button>
        </div>
      </div>

      {/* FAQ layout */}
      <div className="max-w-6xl mx-auto flex w-full justify-between items-start">
        <div className="flex-1 mx-10">
          {questions[tab].map((item, idx) => (
            <details key={idx} className="bg-white/80 p-4 rounded-xl shadow my-4 bg-[url('/images/faq-bg.png')]">
              <summary className="cursor-pointer font-monda font-bold text-gray-800 text-lg">
                {item.q}
              </summary>
              <p className="mt-2 text-lg text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>

        {/* Illustration */}
        <div className="flex justify-end">
          <img
            src={
              tab === 'need'
                ? '/images/faq-need.png'
                : '/images/faq-help.png'
            }
            alt="FAQ Illustration"
            className="h-[400px]"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-20 pb-7 px-4 text-center">
        <button onClick={() => {navigate('/signup')}}
            className="cursor-pointer bg-unihelp-purple text-white text-xl w-1/4 font-monda px-8 py-4 rounded-full shadow-2xl hover:bg-unihelp-purple/90 transition-transform duration-200 hover:scale-103">
        JOIN US!
        </button>
        <p className="text-unihelp-purple-dark text-md mt-1 mb-4">
        We know the value of knowledge!
        </p>
      </div>
    </div>
      
    </>
  );
}
