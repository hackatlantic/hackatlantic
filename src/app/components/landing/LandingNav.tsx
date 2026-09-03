import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, ArrowUpRight, Instagram, Linkedin, Mail } from "lucide-react";
import { APPLICATION_URL } from "./content";

const links = [
  { label: "About", id: "about" },
  { label: "Sponsors", id: "sponsors" },
  { label: "FAQ", id: "faq" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const destination = useRef<string | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      setHidden(scrollingDown && currentScrollY > 120);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className={`landing-header${hidden && !open ? " is-hidden" : ""}`}>
      <nav className="landing-nav" aria-label="Main navigation">
        <div className="desktop-nav-links">
          {links.map(({ label, id }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <div className="desktop-social-links">
            <a
              href="mailto:team@hackatlantic.ca"
              aria-label="Email Hack Atlantic"
            >
              <Mail size={22} />
            </a>
            <a
              href="https://www.instagram.com/hackatlantic"
              aria-label="Hack Atlantic on Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://www.linkedin.com/company/hack-atlantic/"
              aria-label="Hack Atlantic on LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={22} />
            </a>
          </div>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                className="menu-trigger"
                aria-label="Open navigation menu"
              >
                <Menu size={24} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="mobile-menu-overlay" />
              <Dialog.Content
                className="mobile-menu"
                onCloseAutoFocus={(event) => {
                  const id = destination.current;
                  destination.current = null;
                  if (!id) return;
                  const section = document.getElementById(id);
                  if (section) {
                    event.preventDefault();
                    section.setAttribute("tabindex", "-1");
                    section.focus({ preventScroll: true });
                    section.scrollIntoView({ block: "start" });
                    window.history.replaceState(null, "", `#${id}`);
                  }
                }}
              >
                <div className="mobile-menu-header">
                  <Dialog.Title>Explore Hack Atlantic</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="menu-close"
                      aria-label="Close navigation menu"
                    >
                      <X size={24} />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="mobile-menu-description">
                  September 26–27, 2026. Applications are open.
                </Dialog.Description>
                <nav aria-label="Mobile navigation">
                  {links.map(({ label, id }, index) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        destination.current = id;
                        setOpen(false);
                      }}
                    >
                      <span className="menu-index">0{index + 1}</span>
                      {label}
                      <ArrowUpRight size={24} aria-hidden="true" />
                    </a>
                  ))}
                </nav>
                <a className="landing-button" href={APPLICATION_URL}>
                  Apply now <ArrowUpRight size={20} aria-hidden="true" />
                </a>
                <div className="mobile-menu-social">
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
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}
