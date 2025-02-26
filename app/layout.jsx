// app/layout.jsx
import './globals.css';
import { Inter } from 'next/font/google';

// Load the default Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Headless UI Clone",
  description: "A simplified clone of the Headless UI landing page using Next.js 13.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#FFDBCF] text-black font-sans antialiased">
        {/* Main navigation */}
        <header className="fixed w-full top-0 left-0 z-30 bg-black text-gray-400 bg-black z-50 backdrop-filter backdrop-blur-lg bg-opacity-10">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo / Brand */}
              <a href="/" className="racing-sans-one-regular text-black text-xl tracking-tight hover:opacity-80">
           HYPERSHIFT AI
              </a>
              {/* Desktop nav links */}
              <ul className="hidden md:flex items-center gap-6">
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Components
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-700">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            {/* Right side nav actions */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/tailwindlabs/headlessui"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block text-gray-700 hover:text-black"
              >
                GitHub
              </a>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
                Get Started
              </button>
            </div>
          </nav>
        </header>

        {/* Page content (hero, sections, etc.) */}
        <div className="pt-16">{children}</div>

        {/* Simple footer */}
        <footer className="border-t border-gray-200 py-6 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} HyperShift AI. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
