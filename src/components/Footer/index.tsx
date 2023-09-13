export default function Footer() {
  return (
    <footer className="p-7 bg-white dark:bg-black flex flex-wrap items-center justify-center sm:justify-between gap-3 fixed bottom-0 w-full">
      <p className="text-xs text-black/40 dark:text-white/40">
        © 2023 LeQuocHuy
      </p>
      <ul className="flex items-center text-black/40 dark:text-white/40 text-xs">
        <li>
          <a
            href="#"
            className="px-2 py-1 hover:text-black dark:hover:text-white transition-all duration-300"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#"
            className="px-2 py-1 hover:text-black dark:hover:text-white transition-all duration-300"
          >
            Support
          </a>
        </li>
        <li>
          <a
            href="#"
            className="px-2 py-1 hover:text-black dark:hover:text-white transition-all duration-300"
          >
            Contact Us
          </a>
        </li>
      </ul>
    </footer>
  );
}
