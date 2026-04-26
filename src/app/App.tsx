import { useEffect, useRef, useState } from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { supabase } from '../lib/supabase';

const RATE_LIMIT_KEY = 'hackatlantic_last_signup_attempt';
const RATE_LIMIT_MS = 60_000;

function getRemainingCooldown(): number {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return 0;
    const elapsed = Date.now() - parseInt(raw, 10);
    const remaining = RATE_LIMIT_MS - elapsed;
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  } catch {
    return 0;
  }
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      toast.error(`Please wait ${remaining} second${remaining === 1 ? '' : 's'} before trying again.`);
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    } catch {
      // localStorage unavailable — proceed without rate limiting
    }

    const { error } = await supabase.from('email_signups').insert({ email });
    setLoading(false);

    if (!error) {
      toast.success("You're on the list! We'll notify you when applications open.");
      setEmail('');
    } else if (error.code === '23505') {
      toast.error("You're already signed up!");
    } else {
      toast.error('Something went wrong, try again.');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.opacity += star.speed * 0.01;
        if (star.opacity > 1 || star.opacity < 0) {
          star.speed *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
        gradient.addColorStop(0, `rgba(147, 197, 253, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative size-full overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#051124] to-[#000000]">
      <Toaster position="bottom-center" richColors />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 px-8 py-8 backdrop-blur-sm bg-[#0a1628]/30">
        <div className="flex items-center justify-end max-w-7xl mx-auto">
          {/* Right Social Icons */}
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-blue-100/70 hover:text-cyan-300 transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="w-7 h-7" />
            </a>
            <a
              href="#"
              className="text-blue-100/70 hover:text-cyan-300 transition-colors duration-200"
              aria-label="Discord"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a
              href="#"
              className="text-blue-100/70 hover:text-cyan-300 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-7 h-7" />
            </a>
          </div>
        </div>
      </nav>

      {/* Background Effects Container */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Stars Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Nebula Effects */}
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-cyan-400/15 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-[20%] left-[40%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[90px] animate-pulse [animation-delay:2s]" />

        {/* Wave Shapes SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[40%] opacity-30"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGradient1)"
          d="M0,160L48,165.3C96,171,192,181,288,186.7C384,192,480,192,576,181.3C672,171,768,149,864,154.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-[wave_8s_ease-in-out_infinite]"
        />
        <path
          fill="url(#waveGradient2)"
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-[wave_10s_ease-in-out_infinite_reverse]"
        />
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="max-w-5xl">
          <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-bold mb-6 tracking-tight" style={{ fontFamily: "'Dancing Script', cursive" }}>
            <span className="bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(147,197,253,0.5)]">
              Hack Atlantic
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-blue-200/80 mb-12 max-w-2xl mx-auto leading-relaxed font-semibold">
            Atlantic Canada's largest student-run hackathon
          </p>

          <div className="max-w-sm mx-auto">
            <p className="text-blue-200/90 text-2xl mb-4">Get Notified when applications open!</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full px-5 py-2 pr-24 text-sm rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 shadow-[0_0_40px_rgba(147,197,253,0.3)] transition-all duration-300"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-[#0a1628] text-white text-sm rounded-lg hover:bg-[#051124] transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? '...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25px) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}