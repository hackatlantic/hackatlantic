import { Mail, Instagram, Linkedin } from "lucide-react";
import skyBackground from "../imports/skybackground.png";
import hopewellRocks from "../imports/hopewellrocks-2.png";
import grosMorne from "../imports/grosmorne-1.png";
import confederationSky from "../imports/confederationsky.png";
import confederationBridge from "../imports/confederationbridge-1.png";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { supabase } from "../lib/supabase";

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
  const [email, setEmail] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const faqs = [
    {
      question: "What is a hackathon?",
      answer:
        "A hackathon is an event where students come together to build projects, learn new skills, and connect with other hackers. No experience required!",
    },
    {
      question: "Who can attend?",
      answer:
        "High school/university students can attend.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Hack Atlantic is completely free! We'll provide meals, snacks, swag, and prizes throughout the weekend.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring your laptop, chargers, sleeping bag, and deodorant..",
    },
    {
      question: "Do I need a team?",
      answer:
        "Teams can be 1-4 people. Go solo, bring a team, or find one at the event!",
    },
    {
      question: "What can I build?",
      answer:
        "Anything! We encourage you to build whatever you're passionate about. We will have a hardware and software category, as well as side prizes..",
    },
    {
      question: "Is there travel support?",
      answer:
        "We are not able to offer travel reimbursements at this time.",
    },
    {
      question: "What if I'm a beginner?",
      answer:
        "Perfect! We'll have workshops, mentors, and resources to help you learn and build your first project.",
    },
    {
      question: "Will there be food?",
      answer:
        "Absolutely! We'll provide all meals, snacks, and drinks throughout the event. Dietary restrictions will be accommodated.",
    },
    {
      question: "Can I work on existing projects?",
      answer:
        "All projects must be started from scratch at the hackathon. You can use libraries and frameworks, but the core work must be done during the event.",
    },
    {
      question: "What are the prizes?",
      answer:
        "Prizes will be anounced closer to the event.",
    },
    {
      question: "How long is the hackathon?",
      answer:
        "Hack Atlantic is a 24-hour hackathon, giving you plenty of time to build something amazing!",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () =>
      window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async () => {
    if (!email) return;
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      toast.error(`Please wait ${remaining} second${remaining === 1 ? '' : 's'} before trying again.`);
      return;
    }
    setLoading(true);
    try { localStorage.setItem(RATE_LIMIT_KEY, String(Date.now())); } catch {}
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

  const handleJoinSubmit = async () => {
    if (!joinEmail) return;
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      toast.error(`Please wait ${remaining} second${remaining === 1 ? '' : 's'} before trying again.`);
      return;
    }
    setJoinLoading(true);
    try { localStorage.setItem(RATE_LIMIT_KEY, String(Date.now())); } catch {}
    const { error } = await supabase.from('email_signups').insert({ email: joinEmail });
    setJoinLoading(false);
    if (!error) {
      toast.success("You're on the list! We'll notify you when applications open.");
      setJoinEmail('');
    } else if (error.code === '23505') {
      toast.error("You're already signed up!");
    } else {
      toast.error('Something went wrong, try again.');
    }
  };

  return (
    <div
      className="size-full bg-slate-900 overflow-y-auto overflow-x-hidden"
      style={{ fontFamily: "Fredoka, sans-serif" }}
    >
      <Toaster position="bottom-center" richColors />

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div
          className="backdrop-blur-md rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between"
          style={{
            backgroundColor: "rgba(255, 250, 245, 0.5)",
          }}
        >
          <div className="flex items-center gap-6">
            <a
              href="#about"
              className="text-gray-800 hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a
              href="#faq"
              className="text-gray-800 hover:text-blue-600 transition-colors"
            >
              FAQ
            </a>
            <a
              href="#join"
              className="text-gray-800 hover:text-blue-600 transition-colors"
            >
              Join Us
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:team@hackatlantic.ca"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://www.instagram.com/hackatlantic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/hack-atlantic/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen z-20">
        {/* Sky Background Layer - fills full hero height */}
        <div className="absolute inset-0">
          <img
            src={skyBackground}
            alt="Sky Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
          />
        </div>

        {/* Hopewell Rocks Layer - covers full hero, anchored left */}
        <div
          className="absolute inset-x-0 top-0 -bottom-[220px] z-30 transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, calc(${mousePosition.y}px + 50px)) scale(1.05)`,
          }}
        >
          <img
            src={hopewellRocks}
            alt="Hopewell Rocks"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "left center",
              display: "block",
            }}
          />
        </div>

        {/* Content */}
        <div className="absolute top-1/3 left-0 z-40 px-8 md:px-16">
          <h1
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 whitespace-nowrap"
            style={{
              textShadow:
                "0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.3)",
              letterSpacing: "0.05em",
            }}
          >
            Hack Atlantic
          </h1>
          <p
            className="text-2xl md:text-3xl text-gray-800 mb-8 font-normal"
            style={{
              textShadow:
                "0 0 8px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.2)",
            }}
          >
            Atlantic Canada's largest student run hackathon
          </p>
          <div className="flex flex-col items-start gap-3">
            <p
              className="text-xl text-gray-900 font-normal"
              style={{
                textShadow:
                  "0 0 6px rgba(255, 255, 255, 0.5), 0 0 12px rgba(255, 255, 255, 0.2)",
              }}
            >
              Notify me when applications open
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your email"
                className="backdrop-blur-md text-gray-900 px-6 py-3 rounded-lg shadow-lg border-2 border-gray-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
                style={{
                  backgroundColor: "rgba(255, 250, 245, 0.5)",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 font-medium whitespace-nowrap"
              >
                {loading ? '...' : 'Notify Me'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section
        id="about"
        className="relative bg-[#4A1A1A] min-h-screen px-6 z-10"
        style={{
          marginTop: "clamp(-200px, calc(-150px - 0.092 * (100vw - 480px)), -150px)",
          paddingTop: "clamp(400px, calc(400px + 0.184 * (100vw - 480px)), 500px)",
          paddingBottom: "375px",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-12 text-white">
            About Hack Atlantic
          </h2>
          <div className="text-xl md:text-2xl text-white/90 space-y-6 font-normal">
            <p>
              Hack Atlantic is Atlantic Canada's largest
              student-run hackathon, where over 100 hackers will
              compete for amazing prizes. Whether you're a
              writing your first 'Hello World' or prototyping
              the next billion dollar startup, we have a spot
              for you!
            </p>
            <p>
              Join us and expect workshops, a long night of
              coding, lots of caffeine, and real projects.
              You'll meet sponsors and employers who want to
              support you as well as see what you're capable of.
              It's going to be insane.
            </p>
          </div>
        </div>
      </section>

      {/* Gros Morne Section */}
      <section className="relative -mt-[170px] md:-mt-[230px] z-20">
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <img
            src={grosMorne}
            alt="Gros Morne"
            className="w-full"
            style={{
              display: "block",
              transform: "scale(1.05)",
            }}
          />
        </div>
      </section>

      {/* Join Us Section */}
      <section
        id="join"
        className="relative bg-[#0A1628] min-h-screen py-20 px-6 -mt-[300px]"
        style={{ paddingBottom: "400px" }}
      >
        <div className="max-w-3xl mx-auto mt-[300px]">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 text-center">
            Join Us!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column */}
            <div>
              {/* Join the org team */}
              <div className="md:mt-0">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Join the org team
                </h3>
                <p className="text-base text-white/80 mb-4 font-normal">
                  Help organize Atlantic Canada's largest student
                  hackathon
                </p>
                <a
                  href="/join"
                  className="inline-block bg-white text-[#0A1628] px-6 py-3 rounded-lg font-bold hover:bg-white/90 transition-all text-sm"
                >
                  Apply Now
                </a>
              </div>

              {/* Sponsor Section - Below on left */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Sponsor Hack Atlantic
                </h3>
                <p className="text-base text-white/80 font-normal">
                  email us at team@hackatlantic.ca
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Join as a competitor - Staggered down */}
              <div className="md:mt-16">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Join as a competitor
                </h3>
                <p className="text-base text-white/80 mb-4 font-normal">
                  Be the first to know when hacker applications go
                  live
                </p>
                <input
                  type="email"
                  value={joinEmail}
                  onChange={(e) => setJoinEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinSubmit()}
                  placeholder="Enter your email"
                  className="w-full backdrop-blur-md text-gray-900 px-4 py-3 rounded-lg shadow-lg border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  }}
                />
                <button
                  onClick={handleJoinSubmit}
                  disabled={joinLoading}
                  className="mt-3 w-full bg-white text-[#0A1628] px-4 py-3 rounded-lg font-bold hover:bg-white/90 transition-all text-sm disabled:opacity-50"
                >
                  {joinLoading ? '...' : 'Notify Me'}
                </button>
              </div>
            </div>
          </div>

          {/* Sponsors Coming Soon */}
          <div className="mt-16 text-center">
            <p className="text-4xl md:text-5xl text-white/80 font-normal">
              Sponsors coming soon ;)
            </p>
          </div>
        </div>
      </section>

      {/* Confederation Bridge Section */}
      <section className="relative -mt-[150px] z-10">
        {/* Sky Background Layer - Full Image */}
        <img
          src={confederationSky}
          alt="Confederation Sky"
          className="w-full"
          style={{ display: "block" }}
        />

        {/* Bridge Layer with Parallax - Positioned Absolutely Over Sky */}
        <div
          className="absolute top-0 left-0 right-0 z-20 transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <img
            src={confederationBridge}
            alt="Confederation Bridge"
            className="w-full"
            style={{
              display: "block",
              transform: "scale(1.05)",
            }}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="relative bg-[#0D2818] min-h-screen py-20 px-6 -mt-[200px]"
      >
        <div className="max-w-3xl mx-auto mt-[175px]">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white" id="faq">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              {faqs.slice(0, 6).map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 cursor-pointer transition-all hover:bg-white/15"
                  onClick={() =>
                    setOpenFAQ(openFAQ === index ? null : index)
                  }
                >
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {faq.question}
                    </h3>
                    <span className="text-white text-xl flex-shrink-0">
                      {openFAQ === index ? "−" : "+"}
                    </span>
                  </div>
                  {openFAQ === index && (
                    <p className="mt-3 text-base text-white/80 font-normal">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {faqs.slice(6, 12).map((faq, index) => (
                <div
                  key={index + 6}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 cursor-pointer transition-all hover:bg-white/15"
                  onClick={() =>
                    setOpenFAQ(
                      openFAQ === index + 6 ? null : index + 6,
                    )
                  }
                >
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {faq.question}
                    </h3>
                    <span className="text-white text-xl flex-shrink-0">
                      {openFAQ === index + 6 ? "−" : "+"}
                    </span>
                  </div>
                  {openFAQ === index + 6 && (
                    <p className="mt-3 text-base text-white/80 font-normal">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
