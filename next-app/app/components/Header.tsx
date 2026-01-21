export default function Header() {
  return (
    <header className="header-gradient fixed top-0 left-0 right-0 z-[950] pt-8 px-8 pb-[120px] pointer-events-none text-center relative">
      <h1 className="title-font text-[42px] font-bold text-winter-text mb-3 pointer-events-auto relative z-10 drop-shadow-sm">
        Карта сугробов
      </h1>
      <p className="text-lg leading-relaxed text-text-secondary font-normal pointer-events-auto relative z-10">
        развлекательные локации, которые согревают зиму
      </p>
    </header>
  );
}
