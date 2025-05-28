import { useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import { Publication } from '@/api/publications';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/api/config';
import ConfirmationModal from './ui/ConfirmationModal';


export default function SolutionCard({ data, is_demo = false }: { data: Publication, is_demo: boolean }) {
  const [offer, setOffer] = useState<string>(String(data.price));
  const navigate = useNavigate();
  const [userInfoVisible, setUserInfoVisible] = useState<boolean>(false);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleConfirm = () => {
    // логика подтверждения
    setOpenConfirmationModal(false);
  };

  const handleCancel = () => {
    // логика отмены
    setOpenConfirmationModal(false);
  };

  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9.]/g, '')
    const parts = v.split('.')
    const intRaw = parts[0]
    const decParts = parts.slice(1)
    const decimalRaw = decParts.join('')
    const trimmedInt = intRaw.replace(/^0+(?=\d)/, '')
    const intPart = trimmedInt === '' ? '0' : trimmedInt
  
    let newValue = intPart
    if (parts.length > 1) {
      newValue = intPart + '.'
      if (decimalRaw.length > 0) {
        newValue += decimalRaw
      }
    }
  
    setOffer(newValue)
  }

  return (
    <div className={`text-black relative rounded-[30px] bg-unihelp-${data.is_offer ? 'mint' : 'blue'} bg-[url('/images/wavy-bg.svg')] font-monda p-6 shadow-lg`}>
      <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4 flex flex-col">
          <h3 className={`text-3xl font-bold ${data.is_offer ? 'text-unihelp-black' : 'text-unihelp-mint-dark'}`}>{data.title}</h3>

          <div className="flex items-center gap-8 text-base">
            <div className='group'>
              <span className="flex items-center gap-2 cursor-pointer underline hover:text-unihelp-purple-dark transition-colors"
              onClick={() => navigate(`/profile/${data.author.id}`)}
                onMouseEnter={() => setUserInfoVisible(true)}
                onMouseLeave={() => setUserInfoVisible(false)}
              >
                <SvgIcon name="user" className="w-5 h-5" />
                {data.author.name}
              </span>
              <div className={`absolute z-20 bg-white shadow-lg rounded-lg p-4 transition-opacity duration-300 ${userInfoVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center space-x-3 mb-3">
                { data.author.avatar ? (
                  <img
                    src={`${API_BASE_URL}${data.author.avatar}`}
                    alt={data.author.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="rounded-full overflow-hidden">
                    <SvgIcon name="user" className="w-8 h-8 text-white bg-gray-400 pt-1.5 pl-[9px]" />
                  </div>
                )}
                <span className="font-semibold text-gray-900">
                  {data.author.name}
                </span>
              </div>

              {/* Университет */}
              <div className="flex items-center space-x-2 mb-2">
                <SvgIcon name="university" className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800 text-sm">
                  {data.author.university}
                </span>
              </div>

              </div>
            </div>
            {data.is_offer && (
              <span className="flex items-center gap-2">
                <SvgIcon name="badge" className="w-5 h-5" />
                Was bought {data.bought} times
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-line">
            {data.description}
          </p>
          {!is_demo && (
          <div className="mt-auto flex items-center text-xl">
            <span>Offer your price:</span>
            <input
              type="text"
              inputMode="numeric"
              value={offer}
              onChange={handleOfferChange}
              className="mx-2 w-16 text-center bg-gray-300 text-unihelp-purple font-semibold text-xl rounded"
            />
            <span>€</span>
          </div>
          )}
        </div>

        <div className="flex-shrink-0 flex flex-col justify-between items-center">
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-lg">
              <SvgIcon name="university" className="w-5 h-5" />
              {data.university}
            </li>
            <li className="flex items-center gap-2 text-lg">
              <SvgIcon name="bookmark" className="w-5 h-5" />
              {data.faculty}
            </li>
            <li className="flex items-center gap-2 text-lg">
              <SvgIcon name="book" className="w-5 h-5" />
              {data.subject}
            </li>
          </ul>
          <div className={`font-monda my-7 p-2 rounded-2xl bg-unihelp-${data.is_offer ? 'mint' : 'blue'} border-1 border-unihelp-black flex flex-col items-center`}>
            <span className="text-sm">Recommended:</span>
            <p className="text-2xl pt-2">{data.price} €</p>
          </div>
          {!is_demo && (
          <>
            <button onClick={() => setOpenConfirmationModal(true)} className={`cursor-pointer mt-auto self-end rounded-full ${data.is_offer ? 'bg-unihelp-purple' : 'bg-[#45b574]'} text-white px-10 py-3 shadow hover:scale-105 transition-transform text-base`}>
              { data.is_offer && ('Get solution')}
              { !data.is_offer && ('Offer help')}
            </button>
            <ConfirmationModal
              isOpen={openConfirmationModal}
              title="Are you sure you want to place an order?"
              message={`After you click "Confirm" an order will be created to complete this task.\nA request to accept the order will be sent to the user: ${data.author.name}`}
              warning={`An amount of money equal to ${offer}€ will be frozen from your account.`}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          </>
          )}
        </div>
      </div>
    </div>
  );
}
