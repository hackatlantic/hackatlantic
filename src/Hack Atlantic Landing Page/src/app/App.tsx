import { Mail, Instagram, Linkedin } from 'lucide-react';
import heroBackground from '../imports/ChatGPT_Image_Apr_27,_2026,_01_43_37_AM.png';
import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');

  return (
    <div className="size-full bg-slate-900 overflow-auto" style={{ fontFamily: 'Fredoka, sans-serif' }}>
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="backdrop-blur-md rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(255, 250, 245, 0.5)' }}>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-gray-800 hover:text-blue-600 transition-colors">About</a>
            <a href="#2026" className="text-gray-800 hover:text-blue-600 transition-colors">2026</a>
            <a href="#sponsors" className="text-gray-800 hover:text-blue-600 transition-colors">Sponsors</a>
            <a href="#faq" className="text-gray-800 hover:text-blue-600 transition-colors">FAQ</a>
            <a href="#team" className="text-gray-800 hover:text-blue-600 transition-colors">Team</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@hackatlantic.ca" className="text-gray-700 hover:text-blue-600 transition-colors">
              <Mail size={20} />
            </a>
            <a href="#instagram" className="text-gray-700 hover:text-blue-600 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#linkedin" className="text-gray-700 hover:text-blue-600 transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBackground}
            alt="Hopewell Rocks Illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 -mt-[68px]">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 whitespace-nowrap" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.3)' }}>
            Hack Atlantic
          </h1>
          <p className="text-2xl md:text-3xl text-gray-800 mb-8 font-normal" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.2)' }}>
            Atlantic Canada's largest student run hackathon
          </p>
          <div className="flex flex-col items-start gap-3">
            <p className="text-xl text-gray-900 font-normal" style={{ textShadow: '0 0 6px rgba(255, 255, 255, 0.5), 0 0 12px rgba(255, 255, 255, 0.2)' }}>
              Notify me when applications open
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="backdrop-blur-md text-gray-900 px-6 py-3 rounded-lg shadow-lg border-2 border-gray-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
              style={{ backgroundColor: 'rgba(255, 250, 245, 0.5)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}