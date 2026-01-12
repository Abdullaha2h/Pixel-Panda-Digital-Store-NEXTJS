import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="fixed md:bottom-0 md:right-4 bottom-24 right-0 backdrop-blur-md z-50">
      <div className="flex items-center bg-background/70 border px-4 py-2 shadow-lg">
        <p className="text-sm dark:text-white text-zinc-800 md:block hidden">
          Created by Abdullah |
        </p>
        <a
          href="https://www.linkedin.com/in/muhammad-abdullah-08879822a/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative transition-all md:px-1 px-0 duration-300"
        >
          {/* Glow effect - background only */}
          <div className="absolute inset-0 rounded-full  bg-primary/20 group-hover:bg-primary/40 blur-md group-hover:blur-lg transition-all duration-300 scale-0 group-hover:scale-100"></div>

          {/* Font Awesome LinkedIn Icon with primary color */}
          <FontAwesomeIcon
            icon={faLinkedin}
            className="text-primary relative z-10 w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />
        </a>
      </div>
    </footer>
  );
}