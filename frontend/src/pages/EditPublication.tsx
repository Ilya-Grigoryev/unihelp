// src/pages/EditPublication.tsx
import {
    useState,
    useEffect,
    FormEvent,
  } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import toast from 'react-hot-toast';
  import Wave from '@/assets/wave.svg?react';
  import {
    fetchPublicationById,
    editPublication,
    EditPublicationParams,
    Publication,
  } from '@/api/publications';
  import SolutionCard from '@/components/SolutionCard';
  
  export default function EditPublication() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
  
    const [publication, setPublication] = useState<Publication | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | ''>('');
  
  
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!id) return;
      fetchPublicationById(+id)
        .then((pub: Publication) => {
          setPublication(pub);
          setTitle(pub.title);
          setDescription(pub.description);
          setPrice(pub.price);
        })
        .catch(err => {
          toast.error(err instanceof Error ? err.message : 'Failed to load');
        })
        .finally(() => setLoading(false));
    }, [id]);

  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!id) return;
  
      const payload: EditPublicationParams = {
        title,
        description,
        price: typeof price === 'number' ? price : 0
      };
  
      try {
        await editPublication(+id, payload);
        navigate('/', { replace: true });
        toast.success('Publication updated!');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Update failed');
      }
    };
  
    if (loading) {
      return <div className="p-10 text-center">Loading…</div>;
    }
  
    return (
      <>
      <section className="bg-unihelp-purple text-center pt-20 font-monda text-white">
        <h1 className="text-3xl">Edit publication</h1>
        <form
            onSubmit={handleSubmit}
            className="container mx-auto px-6 grid grid-cols-1 gap-y-20 py-10 font-monda"
        >
            <div className="space-y-1 w-[50%] mx-auto">
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
            <div className="lg:col-span-2 text-center -mt-10">
            <button
                type="submit"
                className="cursor-pointer hover:scale-103 text-xl px-20 py-2 bg-unihelp-mint text-unihelp-purple font-bold rounded-full shadow hover:opacity-90 transition"
            >
                Save
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
          {publication && <SolutionCard 
            is_demo={true} 
            data={{
            ...publication,
            title: title,
            description: description,
            price: typeof price === 'number' ? price : 0,
            id: publication.id,
            }}
          />}
        </div>
      </div>
      </>
    );
  }
  