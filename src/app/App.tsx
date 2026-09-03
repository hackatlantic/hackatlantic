import {
  ArrowDown,
  ArrowUpRight,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import { MotionConfig } from "motion/react";
import skyBackground from "../imports/skybackground.png";
import grosMorne from "../imports/grosmorne-1.png";
import confederationSky from "../imports/confederationsky.png";
import confederationBridge from "../imports/confederationbridge-1.png";
import { LandingNav } from "./components/landing/LandingNav";
import { LandingFAQ } from "./components/landing/LandingFAQ";
import {
  ApplyLink,
  DrawnAccent,
  Reveal,
  ScrollTitle,
  ScenicLayer,
} from "./components/landing/LandingMotion";
import { CoastPostcard } from "./components/landing/CoastPostcard";
import { sponsors } from "./components/landing/content";
import "../styles/landing.css";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="landing-page" id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <LandingNav />
        <main id="main" tabIndex={-1}>
          <section className="landing-hero" aria-labelledby="hero-title">
            <div className="hero-art" aria-hidden="true">
              <img
                className="hero-sky"
                src={skyBackground}
                alt=""
                fetchPriority="high"
              />
              <ScenicLayer className="hero-rocks">
                <img
                  src="/photos/hopewellrocks.png"
                  alt=""
                  fetchPriority="high"
                />
              </ScenicLayer>
              <div className="hero-scrim" />
            </div>
            <div className="landing-container hero-content">
              <p className="eyebrow hero-eyebrow">
                <span className="status-dot" /> Applications are open
              </p>
              <h1 id="hero-title">
                Hack Atlantic
              </h1>
              <p className="hero-description">
                Atlantic Canada’s largest student-run hackathon.
              </p>
              <p className="hero-date">
                <DrawnAccent>September 26–27</DrawnAccent>
                <span>· In-person event</span>
              </p>
              <div className="hero-actions">
                <ApplyLink />
                <a className="landing-text-link" href="#about">
                  Explore the weekend <ArrowDown aria-hidden="true" size={18} />
                </a>
              </div>
            </div>
          </section>

          <section
            className="landing-about"
            id="about"
            aria-labelledby="about-title"
          >
            <div className="landing-container">
              <p className="eyebrow">The weekend</p>
              <div className="about-grid">
                <div>
                  <ScrollTitle
                    id="about-title"
                    text="Big ideas start with a little curiosity."
                  />
                  <p className="section-copy">
                    Your first “Hello World” or your next ambitious prototype.
                    There’s a place for both here.
                  </p>
                </div>
                <Reveal className="about-copy">
                  <p>
                    Spend 24 hours making something with people who are just as
                    curious as you. Build a team, try unfamiliar tools, and turn
                    an idea into a working project.
                  </p>
                  <p>
                    We’ll bring the workshops, mentors, meals, and late-night
                    snacks. You bring a laptop and a willingness to give it a
                    go.
                  </p>
                  <a className="landing-text-link" href="#faq">
                    First hackathon? Start here{" "}
                    <ArrowDown aria-hidden="true" size={18} />
                  </a>
                </Reveal>
              </div>
              <dl className="weekend-facts">
                <div>
                  <dt>Time to build</dt>
                  <dd>24 hours</dd>
                </div>
                <div>
                  <dt>Your team</dt>
                  <dd>1–4 people</dd>
                </div>
                <div>
                  <dt>Experience needed</dt>
                  <dd>Just curiosity</dd>
                </div>
              </dl>
            </div>
            <figure className="gros-scene">
              <ScenicLayer>
                <img
                  src={grosMorne}
                  alt="An illustrated boat crossing the fjord at Gros Morne, between green cliffs."
                  loading="lazy"
                  width="1536"
                  height="1024"
                />
              </ScenicLayer>
            </figure>
          </section>

          <section
            className="landing-sponsors"
            id="sponsors"
            aria-labelledby="sponsors-title"
          >
            <div className="landing-container">
              <div className="section-heading-row">
                <div>
                  <p className="eyebrow">Made possible together</p>
                  <h2 id="sponsors-title">Our supporters.</h2>
                </div>
                <p>
                  Thank you to the organizations helping bring Hack Atlantic to
                  life.
                </p>
              </div>
              <div className="sponsor-grid">
                {sponsors.map((sponsor) => (
                  <div className="sponsor-tile" key={sponsor.name}>
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                      loading="lazy"
                      width="220"
                      height="96"
                    />
                  </div>
                ))}
              </div>
              <div className="sponsor-contact">
                <p>Want to support the next generation of builders?</p>
                <a
                  className="landing-text-link"
                  href="mailto:team@hackatlantic.ca"
                >
                  Become a sponsor <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          <figure
            className="bridge-scene"
            aria-label="Illustration of Confederation Bridge across the Atlantic water"
          >
            <img
              className="bridge-sky"
              src={confederationSky}
              alt=""
              loading="lazy"
              width="1536"
              height="1024"
            />
            <ScenicLayer className="bridge-layer">
              <img
                src={confederationBridge}
                alt=""
                loading="lazy"
                width="1573"
                height="1024"
              />
            </ScenicLayer>
          </figure>

          <section className="landing-faq" id="faq" aria-labelledby="faq-title">
            <div className="landing-container faq-grid">
              <div className="faq-intro">
                <p className="eyebrow">Before you pack</p>
                <h2 id="faq-title">
                  Good questions.
                  <br />
                  Straight answers.
                </h2>
                <p>New to hackathons? You’re in good company.</p>
                <a
                  className="landing-text-link"
                  href="mailto:team@hackatlantic.ca"
                >
                  Ask us something else{" "}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
              <LandingFAQ />
            </div>
          </section>

          <section className="landing-finale" aria-labelledby="finale-title">
            <div className="landing-container finale-grid">
              <Reveal>
                <p className="eyebrow">See you this September</p>
                <h2 id="finale-title">
                  Your next project
                  <br />
                  starts <DrawnAccent>here.</DrawnAccent>
                </h2>
                <p>One weekend. A new team. Something you made together.</p>
                <ApplyLink />
              </Reveal>
              <CoastPostcard image="/photos/hopewellrocks.png" />
            </div>
          </section>
        </main>
        <footer className="landing-footer">
          <div className="landing-container footer-main">
            <a className="landing-wordmark" href="#top">
              Hack Atlantic<span>.</span>
            </a>
            <p>Student-built. Atlantic-inspired.</p>
            <nav aria-label="Social links">
              <a
                href="mailto:team@hackatlantic.ca"
                aria-label="Email Hack Atlantic"
              >
                <Mail />
              </a>
              <a
                href="https://www.instagram.com/hackatlantic"
                aria-label="Hack Atlantic on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram />
              </a>
              <a
                href="https://www.linkedin.com/company/hack-atlantic/"
                aria-label="Hack Atlantic on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin />
              </a>
            </nav>
          </div>
          <div className="landing-container footer-bottom">
            <span>© 2026 Hack Atlantic</span>
            <div>
              <a href="https://apply.hackatlantic.ca/privacy">Privacy</a>
              <a href="https://apply.hackatlantic.ca/terms">Terms</a>
              <a href="#top">Back to top ↑</a>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
