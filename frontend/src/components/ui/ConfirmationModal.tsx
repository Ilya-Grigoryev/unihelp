import React from 'react';
import { createPortal } from 'react-dom';
import SvgIcon from '../SvgIcon';

export interface ConfirmationModalProps {
  /** Включить/выключить отображение модального окна */
  isOpen: boolean;
  /** Заголовок модального окна */
  title?: string;
  /** Основное сообщение вопроса */
  message: string;
  /** Текст предупреждения (необязательно) */
  warning?: string;
  /** Обработчик нажатия на кнопку "Да" */
  onConfirm: () => void;
  /** Обработчик нажатия на кнопку "Нет" */
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  warning,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-10001 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 mx-4 mb-25">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>

        {warning && (
          <div
            className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
            role="alert"
          >
            <SvgIcon name="info" className="w-10 h-10 mr-4 flex-shrink-0 text-yellow-700 rotate-180" />
            <span>{warning}</span>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#45b574] text-white hover:bg-[#61c38a] rounded-full transition cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
