// src/pages/Search.tsx
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Wave from '@/assets/wave.svg?react';
import SolutionCard from '@/components/SolutionCard';
import SearchForm from '@/components/SearchForm';
import FilterPanel from '@/components/FilterPanel';
import { fetchPublications, FetchPublicationParams } from '@/api/publications';
import { SearchFilters } from '@/components/FilterPanel';
import { Publication } from '@/api/publications';

export default function Search() {
  const [searchParams] = useSearchParams();

  const universityParam = searchParams.get('university') ?? undefined;
  const facultyParam = searchParams.get('faculty') ?? undefined;
  const subjectParam = searchParams.get('subject') ?? undefined;

  const [filters, setFilters] = useState<SearchFilters>({
    tab: 'help',
    minPrice: 0,
    maxPrice: 100,
    boughtCount: 0,
    helperName: '',
  });

  const [allSolutions, setAllSolutions] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params: FetchPublicationParams = {
      tab: filters.tab,
      university: universityParam,
      faculty: facultyParam,
      subject: subjectParam,
    };

    fetchPublications(params)
      .then((data) => setAllSolutions(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    }, [filters.tab, facultyParam, subjectParam, universityParam]);

  const maxPriceLimit = useMemo(() => {
    return allSolutions.length
      ? Math.max(...allSolutions.map((s) => s.price))
      : filters.maxPrice;
  }, [allSolutions, filters.maxPrice]);

  const helperList = useMemo(
    () => Array.from(new Set(allSolutions.map((s) => s.author))),
    [allSolutions]
  );

  const displayed = useMemo(
    () =>
      allSolutions
        .filter(
          (s) => s.price >= filters.minPrice && s.price <= filters.maxPrice
        )
        .filter((s) => (s.bought ?? 0) >= filters.boughtCount)
        .filter((s) =>
          filters.helperName ? s.author.name === filters.helperName : true
        ),
    [allSolutions, filters]
  );

  const onFilterChange = (updates: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      <section className="bg-unihelp-purple pt-20 font-monda">
        <SearchForm note="Didn't find your subject, faculty or university?" />
      </section>

      <div className="min-h-screen bg-unihelp-background">
        <Wave className="w-full h-auto text-unihelp-purple block mt-[-0.3px]" />

        <div className="container mx-auto grid grid-cols-[300px_1fr] gap-8">
          <FilterPanel
            helpers={helperList.map((helper) => helper.name)}
            tab={filters.tab}
            maxPrice={maxPriceLimit}
            onFilterChange={onFilterChange}
          />

          <main className="space-y-8">
            {loading && <div>Loading…</div>}
            {error && <div className="text-red-500">Error: {error}</div>}
            {!loading &&
              !error &&
              displayed.map((sol) => (
                <SolutionCard key={sol.id} data={sol} is_demo={false} />
              ))}
          </main>
        </div>
      </div>
    </>
  );
}
