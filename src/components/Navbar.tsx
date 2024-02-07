//

import { useTheme } from "@/hooks/useTheme";
import { HiMiniMoon, HiMiniSun } from "react-icons/hi2";
import { SiYoutube, SiGithub } from "react-icons/si";
import { GiSpellBook } from "react-icons/gi";

//A navbar component that will be used to house app-wide navigation and settings
export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="mx-auto w-full max-w-3x1 space-y-20">
        <div className="flex justify-between">
          <div className="flex flex-1 items-center justify-start">
            {/* Link and site name/icon */}

            <a href="/" className="text-primary size-10 p-2">
              <GiSpellBook className="size-full" />
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <nav className="flex items-center space-x-1">
              <ThemeToggle />
              <a
                href="https://www.youtube.com"
                target="_blank"
                className="size-10 p-2 text-primary hover:text-[#ff0000] 
                dark:hover:text-[#ff0000]"
                // Brand color from https://brandcolors.net/b/youtube
              >
                <SiYoutube className="h-full w-full" />
              </a>
              <a
                href="https://www.github.com/"
                target="_blank"
                className="size-10 p-2 text-primary hover:text-[#4078c0] 
                dark:hover:text-[#4078c0]"
              >
                <SiGithub className="h-full w-full" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
//che do sang toi
function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      className="size-10 p-2 hover:text-amber-500 dark:hover:text-amber-400"
      onClick={() => toggleDarkMode()}
    >
      {isDarkMode ? (
        <HiMiniMoon className="h-full w-full" />
      ) : (
        <HiMiniSun className="h-full w-full" />
      )}
    </button>
  );
}
