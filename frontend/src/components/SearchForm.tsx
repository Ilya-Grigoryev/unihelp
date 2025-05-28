import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SvgIcon from '@/components/SvgIcon';
import {
  fetchSearchSuggestions,SuggestionsResponse } from '@/api/searchSuggestions';

interface SearchFormProps {
  note?: string;
}

export default function SearchForm({ note }: SearchFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const universityFromUrl = searchParams.get('university') ?? '';
  const facultyFromUrl  = searchParams.get('faculty')  ?? '';
  const subjectFromUrl  = searchParams.get('subject') ?? '';

  const [nestedSuggestions, setNestedSuggestions] = useState<SuggestionsResponse>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  useEffect(() => {
    const uni_faculty = universityFromUrl && facultyFromUrl ? `${decodeURIComponent(universityFromUrl)} · ${decodeURIComponent(facultyFromUrl)}` : '';

    setUniFacultyInput(uni_faculty);
    setFacultySelected(!!facultyFromUrl);
    setSubjectInput(decodeURIComponent(subjectFromUrl));
  }, [facultyFromUrl, subjectFromUrl, universityFromUrl]);

  useEffect(() => {
    fetchSearchSuggestions().then(setNestedSuggestions);
  }, []);

  //  { "University · Faculty": [subjects] }
  const searchSuggestions = useMemo<Record<string, string[]>>(() => {
    const flat: Record<string, string[]> = {};
    Object.entries(nestedSuggestions).forEach(([univ, facMap]) => {
      Object.entries(facMap).forEach(([fac, subs]) => {
        flat[`${univ} · ${fac}`] = subs;
      });
    });
    return flat;
  }, [nestedSuggestions]);

  const [uniFacultyInput, setUniFacultyInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [facultySelected, setFacultySelected] = useState(false);

  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const allFaculties = Object.keys(searchSuggestions);
  const selectedSubjects = searchSuggestions[uniFacultyInput] || [];

  const filteredFaculties = allFaculties.filter(name => {
    const lower = name.toLowerCase();
    return uniFacultyInput
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .every(w => lower.includes(w));
  });

  const filteredSubjects = selectedSubjects.filter(subj => {
    const lower = subj.toLowerCase();
    return subjectInput
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .every(w => lower.includes(w));
  });

  const handleFacultySelect = (item: string) => {
    setUniFacultyInput(item);
    setFacultySelected(true);
    setShowFacultyDropdown(false);
    setSubjectInput('');
  };

  const onSearch = () => {
    const parts = uniFacultyInput ? uniFacultyInput.split(' · ') : [];
    const universityPart = (parts[0] || '').trim();
    const facultyPart   = (parts[1] || '').trim();

    const u = encodeURIComponent(universityPart);
    const f = encodeURIComponent(facultyPart);
    const s = encodeURIComponent(subjectInput.trim());

    navigate(`/search?university=${u}&faculty=${f}&subject=${s}`);
  };

  return (
    <div className="mt-8 flex flex-col items-center relative z-1000 pb-7">
      <div className="flex flex-wrap justify-center items-start gap-2 bg-unihelp-white rounded-full p-2 w-3/4 max-w-4xl shadow-2xl relative">
        {/* Faculty */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Find your faculty/uni"
            value={uniFacultyInput}
            onChange={e => {
              setUniFacultyInput(e.target.value);
              setFacultySelected(false);
              setShowFacultyDropdown(true);
            }}
            onFocus={() => setShowFacultyDropdown(true)}
            onBlur={() => setTimeout(() => setShowFacultyDropdown(false), 100)}
            className="font-monda w-full rounded-l-full px-6 py-3 text-gray-600 placeholder-gray-400 border border-[#d4d4d4] bg-white shadow focus:outline-none focus:border-[#b4b4b4]"
          />
          {showFacultyDropdown && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 z-50 shadow-xl rounded-xl overflow-hidden max-h-40 overflow-y-auto">
              {filteredFaculties.length > 0 ? (
                filteredFaculties.map((item, i) => (
                  <li
                    key={i}
                    className="px-4 py-3 hover:bg-unihelp-purple/90 hover:text-white cursor-pointer transition-colors text-sm border-b last:border-b-0 border-gray-100"
                    onMouseDown={() => handleFacultySelect(item)}
                  >
                    🎓 {item}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-gray-500 italic text-sm">
                  No results
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Subject */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Find your subject"
            value={subjectInput}
            onChange={e => {
              setSubjectInput(e.target.value);
              setShowSubjectDropdown(true);
            }}
            onFocus={() => setShowSubjectDropdown(true)}
            onBlur={() => setTimeout(() => setShowSubjectDropdown(false), 100)}
            disabled={!facultySelected}
            className={`font-monda w-full rounded-r-full px-6 py-3 text-gray-700 placeholder-gray-400 border border-[#d4d4d4] bg-white shadow focus:outline-none focus:border-[#b4b4b4] ${
              !facultySelected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          {facultySelected && showSubjectDropdown && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 z-50 shadow-xl rounded-xl overflow-hidden max-h-40 overflow-y-auto">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subj, i) => (
                  <li
                    key={i}
                    className="px-4 py-3 hover:bg-unihelp-purple/90 hover:text-white cursor-pointer transition-colors text-sm border-b last:border-b-0 border-gray-100"
                    onMouseDown={() => {
                      setSubjectInput(subj);
                      setShowSubjectDropdown(false);
                    }}
                  >
                    📘 {subj}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-gray-500 italic text-sm">
                  No results
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={onSearch}
          className="cursor-pointer text-2xl w-12 h-12 rounded-full bg-white shadow flex items-center justify-center border border-[#d4d4d4] hover:border-[#b4b4b4] hover:scale-105 transition-transform"
        >
          <SvgIcon name="search" className="w-6 h-6 text-[#5f5f5f]" />
        </button>
      </div>
      {note && (
        <p className="mt-1 mb-4 text-white text-center text-md">{note}</p>
      )}
    </div>
  );
}
