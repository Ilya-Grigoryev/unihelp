// src/pages/NewPublication.tsx
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { fetchSearchSuggestions, SuggestionsResponse } from '@/api/searchSuggestions';
import Wave from '@/assets/wave.svg?react';
import { createPublication, NewPublicationParams } from '@/api/publications';
import { useNavigate } from 'react-router-dom';
import SolutionCard from '../components/SolutionCard';
import { useAuth } from '@/contexts/AuthContext';

export default function NewPublication() {
  const authContext = useAuth();
  const navigate = useNavigate();
  // --- FORM STATE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [type, setType] = useState<'offer' | 'request'>('offer');

  // nested suggestions from API
  const [suggestions, setSuggestions] = useState<SuggestionsResponse>({});
  // inputs + dropdown flags
  const [uniInput, setUniInput] = useState('');
  const [showUni, setShowUni] = useState(false);
  const [facultyInput, setFacultyInput] = useState('');
  const [showFaculty, setShowFaculty] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');
  const [showSubject, setShowSubject] = useState(false);

  // fetch once
  useEffect(() => {
    fetchSearchSuggestions().then(setSuggestions);
  }, []);

  // derive lists
  const uniList = Object.keys(suggestions);
  const filteredUnis = uniList.filter(u =>
    u.toLowerCase().includes(uniInput.toLowerCase())
  );

  const facultyList = suggestions[uniInput]
    ? Object.keys(suggestions[uniInput])
    : [];
  const filteredFaculties = facultyList.filter(f =>
    f.toLowerCase().includes(facultyInput.toLowerCase())
  );

  const subjectList =
    suggestions[uniInput]?.[facultyInput] ?? [];
  const filteredSubjects = subjectList.filter(s =>
    s.toLowerCase().includes(subjectInput.toLowerCase())
  );

  // handlers
  const handleUniSelect = (u: string) => {
    setUniInput(u);
    setShowUni(false);
    setFacultyInput('');
    setSubjectInput('');
  };
  const handleFacultySelect = (f: string) => {
    setFacultyInput(f);
    setShowFaculty(false);
    setSubjectInput('');
  };
  const handleSubjectSelect = (s: string) => {
    setSubjectInput(s);
    setShowSubject(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload: NewPublicationParams = {
      title,
      description,
      price: typeof price === 'number' ? price : 0,
      type,
      university: uniInput,
      faculty: facultyInput,
      subject: subjectInput,
    };

    try {
      await createPublication(payload);
      navigate('/');
      toast.success('Your publication was added!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create publication');
    }
  };

  return (
    <>
      <section className="bg-unihelp-purple text-center pt-20 font-monda text-white">
        <h1 className="text-3xl">New publication</h1>
        <form
            onSubmit={handleSubmit}
            className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 py-10 font-monda"
        >
            {/* ───────── LEFT COLUMN ───────── */}
            <div className="space-y-1">
            {/* Title */}
            <div>
                <label className="block mb-1 font-bold text-white text-left">Title:</label>
                <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={100}
                className="w-full p-2 rounded bg-white text-black"
                required
                />
                <p className="text-xs text-gray-200 mt-1 w-full text-right">{title.length}/100</p>
            </div>

            {/* Description */}
            <div>
                <label className="block mb-1 font-bold text-white text-left">Description:</label>
                <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={1000}
                rows={5}
                className="w-full p-2 rounded bg-white text-black"
                required
                />
                <p className="text-xs text-gray-200 mt-1 w-full text-right">
                {description.length}/1000
                </p>
            </div>

            {/* Price */}
            <div>
                <label className="block mb-1 font-bold text-white text-left">Price:</label>
                <div className="flex items-center">
                <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="flex-1 p-2 rounded-l bg-white text-black"
                    required
                />
                <span className="px-3 py-2 rounded-r bg-gray-100 text-unihelp-black">€</span>
                </div>
            </div>
            </div>

            {/* ───────── RIGHT COLUMN ───────── */}
            <div className="space-y-6">
            {/* Type */}
            <div>
                <span className="block font-bold text-white text-left">Type:</span>
                <div className="mt-2 flex items-center space-x-12">
                {['offer', 'request'].map(opt => (
                    <label key={opt} className="inline-flex items-center ">
                    <input
                        type="radio"
                        name="type"
                        value={opt}
                        checked={type === opt}
                        onChange={() => setType(opt as 'offer'|'request')}
                        className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white bg-white peer-checked:bg-unihelp-green-dark transition" />
                    <span className="ml-2 text-white capitalize">
                        {opt} <span className=" ml-3 text-sm opacity-70">{opt === 'offer' ? '(I want to help)' : '(I\'m looking for help)'}</span>
                        </span>
                    </label>
                ))}
                </div>
            </div>

            {/* University */}
            <div className="relative">
                <label className="block mb-1 font-bold text-white text-left">Uni:</label>
                <input
                type="text"
                value={uniInput}
                onChange={e => { setUniInput(e.target.value); setShowUni(true); }}
                onFocus={() => setShowUni(true)}
                onBlur={() => setTimeout(() => setShowUni(false), 100)}
                maxLength={50}
                className="w-full p-2 rounded bg-white text-black"
                required
                />
                {showUni && filteredUnis.length > 0 && (
                <ul className="absolute z-50 w-full bg-white text-black border rounded mt-1 max-h-40 overflow-auto">
                    {filteredUnis.map((u, i) => (
                    <li
                        key={i}
                        onMouseDown={() => handleUniSelect(u)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        {u}
                    </li>
                    ))}
                </ul>
                )}
            </div>

            {/* Faculty */}
            <div className="relative">
                <label className="block mb-1 font-bold text-white text-left">Faculty:</label>
                <input
                type="text"
                value={facultyInput}
                onChange={e => { setFacultyInput(e.target.value); setShowFaculty(true); }}
                onFocus={() => setShowFaculty(true)}
                onBlur={() => setTimeout(() => setShowFaculty(false), 100)}
                maxLength={50}
                className={`w-full p-2 rounded bg-white text-black ${!(uniList.includes(uniInput)) ? 'opacity-70 cursor-not-allowed' : ''}`}
                required
                disabled={!(uniList.includes(uniInput))}
                />
                {showFaculty && filteredFaculties.length > 0 && (
                <ul className="absolute z-50 w-full bg-white text-black border rounded mt-1 max-h-40 overflow-auto">
                    {filteredFaculties.map((f, i) => (
                    <li
                        key={i}
                        onMouseDown={() => handleFacultySelect(f)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        {f}
                    </li>
                    ))}
                </ul>
                )}
            </div>

            {/* Subject */}
            <div className="relative">
                <label className="block mb-1 font-bold text-white text-left">Subject:</label>
                <input
                type="text"
                value={subjectInput}
                onChange={e => { setSubjectInput(e.target.value); setShowSubject(true); }}
                onFocus={() => setShowSubject(true)}
                onBlur={() => setTimeout(() => setShowSubject(false), 100)}
                maxLength={50}
                className={`w-full p-2 rounded bg-white text-black ${!(facultyList.includes(facultyInput)) ? 'opacity-70 cursor-not-allowed' : ''}`}
                required
                disabled={!(facultyList.includes(facultyInput))}
                />
                {showSubject && filteredSubjects.length > 0 && (
                <ul className="absolute z-50 w-full bg-white text-black border rounded mt-1 max-h-40 overflow-auto">
                    {filteredSubjects.map((s, i) => (
                    <li
                        key={i}
                        onMouseDown={() => handleSubjectSelect(s)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        {s}
                    </li>
                    ))}
                </ul>
                )}
            </div>
            </div>

            {/* ───────── Full-width Submit Button ───────── */}
            <div className="lg:col-span-2 text-center -mt-10">
            <button
                type="submit"
                className="cursor-pointer hover:scale-103 text-xl px-20 py-2 bg-unihelp-mint text-unihelp-purple font-bold rounded-full shadow hover:opacity-90 transition"
            >
                Publish
            </button>
            </div>
        </form>
      </section>

      <Wave className="w-full h-auto text-unihelp-purple block mt-[-0.3px]" />
      <div className='mx-20'>
        <h2 className="text-3xl text-left font-monda text-unihelp-purple-dark mt-10 mb-5">
          Check your publication:
        </h2>
        <div className='w-[60%] mx-auto'>
          {authContext.user && (
            <SolutionCard is_demo={true} data={{
              id: 0,
              is_offer: type === 'offer',
              title: title === '' ? 'Homework num. 1' : title,
              university: uniInput === '' ? 'Default University' : uniInput,
              faculty: facultyInput === '' ? 'Default Faculty' : facultyInput,
              subject: subjectInput === '' ? 'Default Subject' : subjectInput,
              author: authContext.user,
              bought: 0,
              price: typeof price === 'number' ? price : 0,
              description: description === '' ? 'Default description' : description,
              is_active: true,
              created_at: new Date().toISOString()
            }}/>
          )}
        </div>
      </div>
    </>
  );
}
