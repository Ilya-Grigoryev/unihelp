// src/components/FilterPanel.tsx
import { useState, ChangeEvent, useEffect } from 'react';

export interface SearchFilters {
  tab: 'need' | 'help';
  minPrice: number;
  maxPrice: number;
  boughtCount: number;
  helperName: string;
  faculty?: string;
  subject?: string;
}

type TabType = 'need' | 'help';

interface FilterPanelProps {
  helpers: string[];
  tab: TabType;
  maxPrice: number;
  onFilterChange?: (updates: Partial<SearchFilters>) => void;
}

export default function FilterPanel({
  helpers,
  tab,
  maxPrice,
  onFilterChange,
}: FilterPanelProps) {
  const [tabValue, setTabValue] = useState<TabType>(tab);
  const [minPriceValue, setMinPriceValue] = useState<number>(0);
  const [maxPriceValue, setMaxPriceValue] = useState<number>(maxPrice);
  const [boughtCountValue, setBoughtCountValue] = useState<number>(0);
  const [helperNameValue, setHelperNameValue] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // синхронизируем внутренний maxPriceValue с новым пропом maxPrice
  useEffect(() => {
    setMaxPriceValue(maxPrice);
    setMinPriceValue(prev => Math.min(prev, maxPrice));
  }, [maxPrice]);

  const updateFilter = (updates: Partial<SearchFilters>) => {
    if (onFilterChange) onFilterChange(updates);
  };

  const filteredHelpers = helpers.filter(name =>
    name.toLowerCase().includes(helperNameValue.toLowerCase())
  );

  const handleTabClick = (newTab: TabType) => {
    setTabValue(newTab);
    setHelperNameValue('');
    updateFilter({ tab: newTab, helperName: '', boughtCount: 0, minPrice: 0, maxPrice: 1000 });

    // Сбрасываем boughtCount при переходе на "I can help"
    if (newTab === 'help') {
      setBoughtCountValue(0);
      updateFilter({ boughtCount: 0 });
    }
  };

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value > maxPriceValue) value = maxPriceValue;
    setMinPriceValue(value);
    updateFilter({ minPrice: value });
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value < minPriceValue) value = minPriceValue;
    setMaxPriceValue(value);
    updateFilter({ maxPrice: value });
  };

  const handleBoughtChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    setBoughtCountValue(value);
    updateFilter({ boughtCount: value });
  };

  const handleHelperInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHelperNameValue(value);
    updateFilter({ helperName: value });
    setShowSuggestions(true);
  };

  const handleHelperSelect = (name: string) => {
    setHelperNameValue(name);
    updateFilter({ helperName: name });
    setShowSuggestions(false);
  };

  return (
    <aside className="sticky top-20 self-start z-20 rounded-[40px] bg-[#ECE8DE] shadow-xl p-6 max-h-[calc(100vh-5rem)] overflow-visible">
      {/* Toggle Buttons */}
      <div className="w-full bg-[#f0ece2] rounded-full flex shadow-md mb-6 overflow-hidden">
        <button
          className={`px-6 py-3 font-bold w-1/2 transition ${
            tabValue === 'need'
              ? 'bg-gradient-to-r from-[#5B4CCC] to-[#5893AC] text-white text-sm'
              : 'text-gray-400 hover:bg-[#6a6aeb29] text-sm cursor-pointer'
          }`}
          onClick={() => handleTabClick('need')}
        >
          Requests
        </button>
        <button
          className={`px-6 py-3 font-bold w-1/2 transition ${
            tabValue === 'help'
              ? 'bg-gradient-to-r from-[#5893AC] to-[#54DA8C] text-white text-sm'
              : 'text-gray-400 hover:bg-[#c0f5d66e] text-sm cursor-pointer'
          }`}
          onClick={() => handleTabClick('help')}
        >
          Offers
        </button>
      </div>

      {/* Min Price Filter */}
      <div className="mb-6">
        <label className="font-bold block">Min:</label>
        <div className="relative mt-2">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#36495F] text-white py-1 px-3 rounded">
            &gt; {minPriceValue} €
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={minPriceValue}
            onChange={handleMinChange}
            className="w-full h-2 rounded-full accent-[#54DA8C]"
          />
        </div>
      </div>

      {/* Max Price Filter */}
      <div className="mb-6">
        <label className="font-bold block">Max:</label>
        <div className="relative mt-2">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#36495F] text-white py-1 px-3 rounded">
            &lt; {maxPriceValue} €
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={maxPriceValue}
            onChange={handleMaxChange}
            className="w-full h-2 rounded-full accent-[#54DA8C]"
          />
        </div>
      </div>

      {tabValue === 'help' && (
        <div className="mb-6 flex items-center space-x-2">
          <label className="font-bold">Was bought:</label>
          <input
            type="number"
            min={0}
            value={boughtCountValue}
            onChange={handleBoughtChange}
            className="w-20 p-2 border rounded bg-white"
          />
          <span>times</span>
        </div>
      )}

      {/* Helper Autocomplete */}
      <div className="relative overflow-visible">
        <label className="font-bold">Author:</label>
        <input
          type="text"
          value={helperNameValue}
          onChange={handleHelperInput}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          className="w-full mt-2 p-2 border rounded bg-white"
        />
        {showSuggestions && (
          <ul className="absolute z-50 w-full bg-white border rounded mt-1 max-h-40 overflow-auto">
            {filteredHelpers.map((name, idx) => (
              <li
                key={idx}
                onMouseDown={() => handleHelperSelect(name)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
