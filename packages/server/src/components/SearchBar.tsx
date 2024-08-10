export default function SearchBar() {
  return (
    <div className="relative flex-1 lg:max-w-sm mr-2 sm:mr-4 md:mr-3 xl:mr-6">
      <input
        autoComplete="off"
        className="w-full dark:bg-gray-950 pl-8 form-input-alt h-9 pr-3 focus:shadow-xl rounded-lg"
        name=""
        placeholder="Search for stuff (placeholder)..."
        spellCheck="false"
        type="text"
      />
      <svg
        className="absolute left-2.5 text-gray-400 top-1/2 transform -translate-y-1/2"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        focusable="false"
        role="img"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 32 32"
      >
        <path
          d="M30 28.59L22.45 21A11 11 0 1 0 21 22.45L28.59 30zM5 14a9 9 0 1 1 9 9a9 9 0 0 1-9-9z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
}
