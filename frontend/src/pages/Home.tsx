import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Wave from '@/assets/wave.svg?react';
import SvgIcon from '@/components/SvgIcon';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCurrentUserPublications } from '@/api/users';
import { deletePublication, Publication, updatePublicationState } from '@/api/publications';
import toast from 'react-hot-toast';

type Activity = {
  id: number;
  title: string;
  university: string;
  faculty: string;
  subject: string;
  status: 'action' | 'partner' | 'ended';
  role: 'helper' | 'asker';
  rating: number | null;
  partner: string;
};


function ActivityCard({
    data,
    onContinue,
  }: {
    data: Activity;
    onContinue: () => void;
  }) {
    const { title, university, faculty, subject, status, role, rating, partner } = data;
    const isAction = status === 'action';
  
    return (
      <div className={`bg-unihelp-white border ${role === 'helper' ? 'border-unihelp-green-dark' : 'border-unihelp-blue-dark'} rounded-2xl flex flex-col shadow-xl`}>
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start">
            <div className='mr-10'>
                <h3 className={`text-2xl font-medium ${role === 'helper' ? 'text-unihelp-green-dark' : 'text-unihelp-blue-dark'} mb-3`}>
                    {title}
                </h3>
                <div
                onClick={() => {/* navigate(`/profile/${author}`) */}}
                className={`flex items-center gap-1 cursor-pointer ${role === 'helper' ? 'text-unihelp-green-dark' : 'text-unihelp-blue-dark'} hover:underline`}
                >
                    <SvgIcon name="user" className="w-5 h-5" />
                    <span className="text-base">{partner}</span>
                </div>
            </div>
    

          <ul className={`space-y-2 ${role === 'helper' ? 'text-unihelp-green-dark' : 'text-unihelp-blue-dark'}`}>
            <li className="flex items-center gap-2">
              <SvgIcon name="university" className="w-5 h-5" />
              <span>{university}</span>
            </li>
            <li className="flex items-center gap-2">
              <SvgIcon name="bookmark" className="w-5 h-5" />
              <span>{faculty}</span>
            </li>
            <li className="flex items-center gap-2">
              <SvgIcon name="book" className="w-5 h-5" />
              <span>{subject}</span>
            </li>
          </ul>
          </div>
  
        </div>
  
        <button
          onClick={onContinue}
          className={`${role === 'helper' ? 
            'text-unihelp-green-dark bg-unihelp-green border-unihelp-green-dark' 
            : 
            'text-unihelp-blue-dark bg-unihelp-blue border-unihelp-blue-dark'} 
            cursor-pointer flex items-center justify-between text-lg font-medium pl-2 pr-6 hover:opacity-90 transition rounded-2xl border hover:scale-103 -m-[1px]
            ${status === 'ended' ? 'bg-unihelp-white text-black' : ''}
            `}
        >
          <div className="flex justify-start">
            {status !== 'ended' && (
                <span
                className={`inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-sm font-medium 
                    ${role === 'helper' ? 
                        (isAction
                        ? 'bg-unihelp-green-dark text-white'
                        : 'border-[1.5px] border-unihelp-green-dark text-unihelp-green-dark')
                        : 
                        (isAction
                        ? 'bg-unihelp-blue-dark text-white'
                        : 'border-[1.5px] border-unihelp-blue-dark text-unihelp-blue-dark')
                    }
                `}
                >
                    <div className='size-7'>
                        <SvgIcon name="info" className="" />
                    </div>
                {isAction ? 'action needed' : "partner's move"}
                </span>
            )} 
            {status === 'ended' && (
                <>
                  {rating !== null ? (
                    Array.from({ length: 5 }, (_, index) => (
                      <SvgIcon
                        key={index}
                        name="star"
                        className={`h-6 w-6 mx-1 ${
                          index < rating ? 'text-[#FBE488]' : 'text-unihelp-white'
                        }`}
                      />
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">not rated</span>
                  )}
                </>
            )}
          </div>
          <span className='flex-1 w-full flex justify-end mx-7'>
            {role === 'asker' || status === 'ended' ? 'back to task' : 'continue helping'}
            </span>
          <SvgIcon name="arrow-right" className="h-10 mt-4" />
        </button>
      </div>
    );
}


function PublicationMiniCard({ data, onDelete }: { data: Publication, onDelete: (id: number) => void; }) {

    const navigate = useNavigate();
  const [active, setActive] = useState(data.is_active);

  const handleEdit = () => {
    navigate(`/publication/${data.id}`);
  };

  const handleToggle = (checked: boolean) => {
    updatePublicationState(data.id, checked).then(() => {
      setActive(checked);
      toast.success(`Publication ${checked ? 'activated' : 'deactivated'} successfully`);
    }).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update publication');
    });
  };

  const disabledClass = !active ? 'opacity-50 filter grayscale' : '';

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        await deletePublication(data.id).then(() => {
          onDelete(data.id);
        });
        toast.success('Publication deleted successfully');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete publication');
      }
    }
  };

  return (
    <div
      className={`overflow-hidden border ${disabledClass} ${
        data.is_offer ? 'border-unihelp-green-dark' : 'border-unihelp-blue-dark'
      } rounded-2xl flex flex-col shadow-xl`}
    >
      <div className={`p-6 flex-1 ${
        data.is_offer ? 'bg-unihelp-green' : 'bg-unihelp-blue'
      }`}>
        <div className="flex justify-between items-start">
          <div className="w-3/5">
            <h3
              className={`text-2xl font-medium ${
                data.is_offer ? 'text-unihelp-green-dark' : 'text-unihelp-blue-dark'
              } mb-2`}
            >
              {data.title}
            </h3>
            {data.is_offer && (
              <div
                className={`flex items-center gap-1 mb-3 ${
                  data.is_offer ? 'text-unihelp-green-dark' : 'text-unihelp-blue-dark'
                }`}
              >
                <SvgIcon name="badge" className="w-5 h-5" />
                <span className="text-base">Was bought {data.bought} times</span>
              </div>
            )}
            <p className="text-gray-700 text-base leading-snug mb-4 mr-4">
              {data.description.length > 120
                ? data.description.slice(0, 120) + '…'
                : data.description}
            </p>
          </div>

          <ul
            className={`space-y-2 ${
              data.is_offer ? 'text-unihelp-green-dark' : 'text-unihelp-blue-dark'
            }`}
          >
            <li className="flex items-center gap-2">
              <SvgIcon name="university" className="w-5 h-5" />
              <span>{data.university}</span>
            </li>
            <li className="flex items-center gap-2">
              <SvgIcon name="bookmark" className="w-5 h-5" />
              <span>{data.faculty}</span>
            </li>
            <li className="flex items-center gap-2">
              <SvgIcon name="book" className="w-5 h-5" />
              <span>{data.subject}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={`px-6 py-4 flex items-center justify-between border-t pointer-events-auto
      ${
        data.is_offer ? 'border-unihelp-green-dark' : 'border-unihelp-blue-dark'
      }`}>
      <div className="flex items-center space-x-3">
        {/* Edit */}
        <button
            onClick={handleEdit}
            className="cursor-pointer flex items-center gap-2 px-3 py-1 border border-unihelp-black text-unihelp-black 
                    rounded-full text-sm font-medium hover:bg-unihelp-black hover:text-white transition"
        >
            <SvgIcon name="edit" className="w-4 h-4" />
            Edit
        </button>

        {/* Delete */}
        <button
            onClick={handleDelete}
            className="cursor-pointer flex items-center gap-2 px-3 py-1 border border-red-500 text-red-500 
                    rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition"
        >
            <SvgIcon name="trash" className="w-4 h-4" />
            Delete
        </button>
        </div>

        <label className="flex items-center space-x-3">
            <span className="text-base text-gray-700">
                {active ? 'Active' : 'Disabled'}
            </span>
            <div className="relative cursor-pointer">
                <input
                type="checkbox"
                checked={active}
                onChange={e => handleToggle(e.target.checked)}
                className="sr-only peer"
                />
                {/* дорожка */}
                <div className="w-12 h-6 bg-gray-200 rounded-full peer-checked:bg-[#85e995] transition-colors" />
                {/* ползунок */}
                <div
                className="absolute top-0 left-0 w-6 h-6 bg-white rounded-full border border-gray-300
                            peer-checked:translate-x-full transition-transform"
                />
            </div>
        </label>
      </div>
    </div>
  );
}



export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [myActivity] = useState<(Activity)[]>([
    {
      id: 1,
      title: 'Modelling Aufgabenblatt 1',
      university: 'University of Vienna',
      faculty: 'Informatik',
      subject: 'Modellierung',
      status: 'action',
      role: 'helper',
      rating: null,
      partner: 'John Doe',
    },
    {
      id: 2,
      title: 'Modelling Aufgabenblatt 1',
      university: 'University of Vienna',
      faculty: 'Informatik',
      subject: 'Modellierung',
      status: 'partner',
      role: 'asker',
      rating: null,
      partner: 'Jane Smith',
    },
  ]);

  const [prevActivity] = useState<Activity[]>([
    {
      id: 3,
      title: 'Modelling Aufgabenblatt 1',
      university: 'University of Vienna',
      faculty: 'Informatik',
      subject: 'Modellierung',
      status: 'ended',
      role: 'helper',
      rating: null,
      partner: 'Jane Smith',
    },
    {
      id: 4,
      title: 'Modelling Aufgabenblatt 1',
      university: 'University of Vienna',
      faculty: 'Informatik',
      subject: 'Modellierung',
      status: 'ended',
      role: 'helper',
      rating: 2,
      partner: 'Jane Smith',
    },
  ]);

const [displayed, setDisplayed] = useState<Publication[]>([]);

useState(() => {
    fetchCurrentUserPublications().then((publications: Publication[]) => {
        setDisplayed(publications);
    });
});

  return (
  <div className='relative'>
    <div className="relative">
      <section className="bg-unihelp-purple pt-24 pb-10 font-monda text-center">
        <h1 className="text-3xl text-white">
          Welcome back, <strong>{ user?.name }</strong>!
        </h1>
      </section>

      <Wave className="w-full h-auto text-unihelp-purple block mt-[-0.3px] absolute" />

      <div className="bg-unihelp-mint pt-12 pb-10 font-monda">
        <div className="container mx-auto px-6 space-y-12">
          <div>
            <h2 className="text-xl font-monda text-unihelp-black mb-6">
              Your activity:
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {myActivity.map(a => (
                <ActivityCard key={a.id} data={a} onContinue={() => navigate(`/task/${a.id}`)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-monda text-unihelp-black mb-6">
              Your previous activity:
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {prevActivity.map(a => (
                <ActivityCard key={a.id} data={a} onContinue={() => navigate(`/review/${a.id}`)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Wave className="w-full h-auto text-unihelp-mint block mt-[-0.3px] absolute" />
    <div className="py-12 my-10 font-monda">
        <div className="container mx-auto px-6 space-y-12">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-monda text-unihelp-black">
                Your current publications:
              </h2>
              <Link
                to="/publication/new"
                className="mx-auto shadow-2xl bg-gradient-to-r w-full from-unihelp-purple-dark to-unihelp-green text-unihelp-white px-4 py-2 rounded-full font-medium hover:scale-103 hover:opacity-90 transition"
              >
                <span className='flex font-bold justify-center'> Add New Publication! </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {displayed.map(a => (
                <PublicationMiniCard key={a.id} data={a} 
                onDelete={(id: number) =>
                         setDisplayed(prev => prev.filter(p => p.id !== id))
                       }
                   />
              ))}
            </div>
          </div>
        </div>
  </div>
  </div>
  );
}

