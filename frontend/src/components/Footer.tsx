import FooterImg from '@/assets/footer.svg?react';

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden text-unihelp-white">
      {/* SVG-фон волной */}
      <FooterImg className="w-full h-auto fill-current text-unihelp-purple block" />

      {/* Контейнер поверх SVG */}
      <div className="absolute inset-0 flex flex-row items-end justify-between px-6 py-6">
        {/* Левая часть (центрированный текст) */}
        <div className="flex-1"></div>
        <div className="flex-1 text-sm text-center">
          <p>UNIHELP GmbH. All rights reserved.</p>
        </div>

        {/* Правая часть */}
        <div className="flex-1 text-sm text-right">
          <p>Made with ❤️ for Vienna’s</p>
          <p>student community.</p>
          <p>This project is growing.</p>
          <p>
            Contact in Telegram:{' '}
            <a
              href="https://t.me/gvirgorye"
              className="underline hover:text-gray-200 transition"
            >
              @gvirgorye
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
