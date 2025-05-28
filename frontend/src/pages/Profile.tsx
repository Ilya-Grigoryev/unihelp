// src/pages/Profile.tsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Wave from '@/assets/wave.svg?react';
import SvgIcon from '@/components/SvgIcon';
import { fetchProfile, updateProfile, uploadAvatar } from '@/api/profile';
import type { EditProfileParams, Profile } from '@/api/profile';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';



function ProfileAvatar({ isOwn, profile, onUpload }: {
  isOwn: boolean,
  profile: { avatar: string | null; created_at: string },
  onUpload: (file: File) => Promise<void>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(profile.avatar)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await onUpload(file);
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Hidden file input */}
      <input
        disabled={!isOwn}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar circle */}
      <div
        className={`w-48 h-48 rounded-full overflow-hidden border-4 border-unihelp-white \
                   ${isOwn ? 'cursor-pointer hover:opacity-80' : ''} transition shadow-2xl`}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          
          <img
            src={preview}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
          
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <SvgIcon name="user" className="relative left-4 top-2 w-20 h-20 text-gray-500" />
          </div>
        )}
      </div>
      {/* Joined date */}
      <p className="mt-4 text-sm">
        Joined us on{' '}
        {profile?.created_at
          ? new Date(profile.created_at).toLocaleDateString()
          : '—'}
      </p>
    </div>
  )
}


export default function Profile() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const isOwn = !params.id || params.id === user?.id.toString()
  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (isOwn && !user) return;
    
    fetchProfile(isOwn ? user!.id : +params.id!)
      .then(p => {
        setProfile(p);
        setName(p.name);
        setUniversity(p.university);
        setBio(p.bio);
      })
      .catch(err => {
        toast.error(err instanceof Error ? err.message : 'Failed to load');
      });
  }, [isOwn, user, params.id]);

  const handleSave = async () => {
    const payload: EditProfileParams = {
        name,
        university,
        bio
      };

      try {
        await updateProfile(payload, isOwn ? user!.id : +params.id!);
        toast.success('Your profile updated!');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Update failed');
      }
  };


  return (
    <>
    <div className="bg-unihelp-purple text-white font-monda relative pt-20">
      {profile && ( <section className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 lg:gap-x-16 gap-y-8">
        <div className="grid grid-cols-2 gap-x-4">

          <div className="flex flex-col items-center">
            {profile.avatar ? (
              <ProfileAvatar
                isOwn={isOwn}
                profile={profile}
                onUpload={async file => {
                  const fd = new FormData()
                  fd.append('file', file)
                    const avatar = await uploadAvatar(fd);
                    profile.avatar = avatar;
                    setProfile(profile);
                    toast.success('Avatar updated!')
                }}
              />
            ) : (
            <div className="flex flex-col items-center">
              <div
                className="w-48 h-48 rounded-full overflow-hidden border-4 border-unihelp-white \
                          transition shadow-2xl"
              >
            
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <SvgIcon name="user" className="relative left-4 top-2 w-20 h-20 text-gray-500" />
                  </div>
              </div>
              <p className="mt-4 text-sm">
                Joined us on{' '}
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : '—'}
              </p>
            </div>
            )}
          </div>

          {/* Name / Uni / Counts */}
          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-center gap-2">
              <SvgIcon name="user" className="w-7 h-7 text-white" />
              { isOwn ? (<input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 p-2 rounded bg-white text-black"
              />) : (
                <span className="text-xl font-bold">{profile.name}</span>
              )}
            </div>
            {/* University */}
            <div className="flex items-center gap-2">
              <SvgIcon name="university" className="w-7 h-7 text-white" />
              { isOwn ? (<input
                type="text"
                value={university}
                onChange={e => setUniversity(e.target.value)}
                className="flex-1 p-2 rounded bg-white text-black"
                />) : (
                  <span className="text-xl font-bold">{profile.university}</span>
                )}
            </div>
            {/* Active counts */}
            <div className="space-y-1 text-lg mt-10">
              <div className="flex items-center gap-2">
                <SvgIcon name="offers" className="w-5 h-5" />
                <span>Active offers:</span>
                <span className="font-bold">{profile?.active_offers ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <SvgIcon name="requests" className="w-5 h-5" />
                <span>Active requests:</span>
                <span className="font-bold">{profile?.active_requests ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          {/* Donut chart */}
          <div className="flex justify-center">
            <div
              className="w-48 h-48 rounded-full border-4 border-white  shadow-2xl"
              style={{
                background: `conic-gradient(
                  #00D4AB ${profile!.helped > 0 || profile!.got_help > 0 ? profile!.helped * 100 / (profile!.helped+profile!.got_help) : 0}%,
                  #8361E0 ${profile!.helped > 0 || profile!.got_help > 0 ? 100 - (profile!.helped * 100 / (profile!.helped+profile!.got_help)) : 0}%
                )`
              }}
            />

          </div>

          {/* Stats: helped / got help / rating / badges */}
          <div className="space-y-6 text-lg">
            <div className="flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full border-2 border-white bg-[#00D4AB]" />
              helped <strong className='text-2xl'>{profile?.helped ?? 0}</strong> times
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full border-2 border-white bg-[#8361E0]" />
              got help <strong className='text-2xl'>{profile?.got_help ?? 0}</strong> times
            </div>
            <div className="flex items-center gap-2">
              <SvgIcon name="star" className="w-6 h-6" />
              <strong className="text-2xl">{(profile?.rating ?? 0).toFixed(1)} / 5.0</strong>
            </div>
            {/* badges */}
            <div className="space-y-1 text-sm opacity-80">
              <div>
                <SvgIcon name="diamond" className="inline w-4 h-4 mr-1" />
                Top Rated Assistant
              </div>
              <div>
                <SvgIcon name="diamond" className="inline w-4 h-4 mr-1" />
                Trusted Client
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* ───────── BIO ───────── */}
        <div className="col-span-4 mt-12 mx-25">
            
          { isOwn ? (<>
            <label className="font-bold block mb-1">About me</label>
            <textarea
              rows={5}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-4 rounded bg-white text-black"
            />
          </>
          ) : (
            <div className="text-lg">
              <label className="font-bold block mb-1">{profile.bio}</label>
            </div>
          )}
        </div>

        {/* ───────── SAVE BUTTON ───────── */}
        { isOwn && (<div className="col-span-4 mt-6 text-center">
          <button
            onClick={handleSave}
            className="cursor-pointer px-12 py-3 w-40 rounded-full font-bold shadow-lg bg-unihelp-mint text-unihelp-purple hover:opacity-90 transition hover:scale-105"
          >
            Save
          </button>
        </div>)}
    </section>
    )}
    </div>
    <Wave className="bottom-0 w-full h-auto block text-unihelp-purple mt-[-0.3px]" />
    </>
  )
}
