import { Mail, Instagram, Linkedin } from "lucide-react";
import skyBackground from "../imports/skybackground.png";
import hopewellRocks from "../imports/hopewellrocks-2.png";
import grosMorne from "../imports/grosmorne-1.png";
import confederationSky from "../imports/confederationsky.png";
import confederationBridge from "../imports/confederationbridge-1.png";
import { useState, useEffect } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is a hackathon?",
      answer:
        "A hackathon is an event where students come together to build projects, learn new skills, and connect with other hackers. No experience required!",
    },
    {
      question: "Who can attend?",
      answer:
        "Any student 18+ from Atlantic Canada is welcome! Whether you're in high school, university, or college, we'd love to have you.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Hack Atlantic is completely free! We'll provide meals, snacks, swag, and prizes throughout the weekend.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring your laptop, chargers, student ID, and yourself! We'll take care of the rest.",
    },
    {
      question: "Do I need a team?",
      answer:
        "Nope! You can come solo and find a team at the event, or bring your own team of up to 4 people.",
    },
    {
      question: "What can I build?",
      answer:
        "Anything! We encourage you to build whatever you're passionate about. There will be different prize categories to compete in.",
    },
    {
      question: "Is there travel support?",
      answer:
        "Yes! We offer travel reimbursements for students coming from outside the local area. Details will be sent to accepted hackers.",
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
        "We'll have over $10,000 in prizes across multiple categories! Details will be announced closer to the event.",
    },
    {
      question: "How long is the hackathon?",
      answer:
        "Hack Atlantic is a 36-hour hackathon, giving you plenty of time to build something amazing!",
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

  return (
    <div
      className="size-full bg-slate-900 overflow-auto"
      style={{ fontFamily: "Fredoka, sans-serif" }}
    >
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
              href="mailto:hello@hackatlantic.ca"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Mail size={20} />
            </a>
            <a
              href="#instagram"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#linkedin"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Sky Background Layer - fills full hero height */}
        <div className="absolute inset-0">
          <img
            src={skyBackground}
            alt="Sky Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
          />
        </div>

        {/* Hopewell Rocks Layer - drives hero height */}
        <div
          className="relative z-30 transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, calc(${mousePosition.y}px + 50px)) scale(1.05)`,
          }}
        >
          <img
            src={hopewellRocks}
            alt="Hopewell Rocks"
            className="w-full block"
            style={{
              height: "auto",
              display: "block"
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
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="backdrop-blur-md text-gray-900 px-6 py-3 rounded-lg shadow-lg border-2 border-gray-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
              style={{
                backgroundColor: "rgba(255, 250, 245, 0.5)",
              }}
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <section
        id="about"
        className="relative bg-[#4A1A1A] min-h-screen py-20 px-6 z-10"
        style={{
          marginTop: "-200px",
          paddingTop: "calc(24rem)",
          paddingBottom: "200px",
        }}
      >
        <div className="max-w-3xl mx-auto -mt-[75px]">
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
      <section className="relative -mt-[180px] z-20">
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
                  href="#"
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
                  placeholder="Enter your email"
                  className="w-full backdrop-blur-md text-gray-900 px-4 py-3 rounded-lg shadow-lg border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  }}
                />
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
      <section className="relative -mt-[150px]">
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