import { useLayoutEffect, useState, type AnchorHTMLAttributes } from "react";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { recapContent as content } from "./content";
import type { JudgeContent, Layout, ParticipantResponse, PhotoStoryContent, ProjectContent, SponsorContent } from "./types";
import "../../../styles/recap.css";

function rows<T>(items: T[], columns: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / columns) }, (_, row) =>
    items.slice(row * columns, (row + 1) * columns),
  );
}

function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}

function Navigation({ layout }: { layout: Layout }) {
  return (
    <nav className="navigation" aria-label="Main navigation">
      <div className="nav-links">
        {["Recap", "Winners", "Judges", "Sponsors"].map((label) => (
          <a className="navigation-link" key={label} href={`#${layout}-${label.toLowerCase()}`}>
            {label}
          </a>
        ))}
      </div>
      <div className="nav-social">
        <a className="social-link" href="mailto:team@hackatlantic.ca" aria-label="Email Hack Atlantic">
          <Mail size={24} aria-hidden="true" />
        </a>
        <ExternalLink className="social-link" href="https://www.instagram.com/hackatlantic" aria-label="Hack Atlantic on Instagram">
          <Instagram size={24} aria-hidden="true" />
        </ExternalLink>
        <ExternalLink className="social-link" href="https://www.linkedin.com/company/hack-atlantic/" aria-label="Hack Atlantic on LinkedIn">
          <Linkedin size={24} aria-hidden="true" />
        </ExternalLink>
      </div>
    </nav>
  );
}

function Hero({ layout }: { layout: Layout }) {
  return (
    <section className="hero" id={`${layout}-top`} aria-labelledby={`${layout}-title`}>
      <div className="hero-art" aria-hidden="true">
        <img className="cover-image" src={content.hero.image} alt="" decoding="async" />
      </div>
      <Navigation layout={layout} />
      <div className="hero-content">
        <div className="hero-copy">
          <h1 className="hero-title" id={`${layout}-title`}>{content.hero.title}</h1>
          <p className="hero-description">{content.hero.description}</p>
          <a className="hero-link" href={`#${layout}-stats`}><p className="hero-link-label">{content.hero.cta}</p></a>
        </div>
      </div>
    </section>
  );
}

function Statistics({ layout }: { layout: Layout }) {
  return (
    <section className="statistics" id={`${layout}-stats`} aria-labelledby={`${layout}-stats-title`} tabIndex={-1}>
      <h2 className="stats-title" id={`${layout}-stats-title`}>2026 by the numbers</h2>
      <div className="stats-grid">
        {rows(content.statistics, layout === "mobile" ? 2 : 3).map((row, index) => (
          <div className="stats-row" key={index}>
            {row.map((stat) => <div className="stat" key={stat.label}><p className="stat-value">{stat.value}</p><p className="stat-label">{stat.label}</p></div>)}
          </div>
        ))}
      </div>
    </section>
  );
}

function ParticipantQuote({ response, index, layout }: { response: ParticipantResponse; index: number; layout: Layout }) {
  return (
    <div className={index === 0 ? "response-left" : "response-right"}>
      <div className="quote-frame" style={layout === "mobile" ? response.mobileFrame : response.desktopFrame}>
        <div className="quote-rotation" style={{ transform: response.rotation }}>
          <div className="quote">
            <p className="quote-label">{response.label}</p>
            <h3 className="quote-question">{response.question}</h3>
            <p className="quote-answer">{response.answer}</p>
            <p className="quote-author">{response.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoStory({ story, layout }: { story: PhotoStoryContent; layout: Layout }) {
  const photos = (
    <div className="photo-stack" key="photos">
      {story.photos.map((photo, index) => (
        <div className={["photo-left", "photo-right", "photo-offset"][index]} key={photo.src}>
          <figure className="polaroid"><div className="photo-window">
            <img className="cover-image" src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
          </div></figure>
        </div>
      ))}
    </div>
  );
  const responses = (
    <div className="responses" key="responses">
      {story.responses.map((response, index) => <ParticipantQuote key={response.id} response={response} index={index} layout={layout} />)}
    </div>
  );
  return <div className="story">{layout === "desktop" && story.photosOnRight ? [responses, photos] : [photos, responses]}</div>;
}

function Stories({ layout }: { layout: Layout }) {
  return (
    <section className="cream-section" id={`${layout}-recap`} aria-labelledby={`${layout}-recap-title`} tabIndex={-1}>
      <div className="recap-heading"><h2 className="recap-title" id={`${layout}-recap-title`}>Recap</h2></div>
      <div className="stories">
        {content.stories.map((story) => <PhotoStory key={story.photos[0].src} story={story} layout={layout} />)}
      </div>
      <div className="albums">
        {content.albums.map((album) => <ExternalLink className="link" key={album.href} href={album.href}><p className="album-label">{album.label}</p></ExternalLink>)}
      </div>
    </section>
  );
}

function Project({ project, finalist }: { project: ProjectContent; finalist: boolean }) {
  return (
    <ExternalLink className={finalist ? "finalist" : "project"} href={project.href}>
      <p className="project-award">{project.award}</p>
      <div className="project-heading"><h4 className="project-name">{project.name}</h4></div>
      {project.members.length === 1 ? <p className="project-member">{project.members[0]}</p> : (
        <div className="project-members">
          {project.members.map((member, index) => <p className={index === 0 ? "project-member-line" : "line"} key={member}>{member}</p>)}
        </div>
      )}
    </ExternalLink>
  );
}

function Winners({ layout }: { layout: Layout }) {
  return (
    <section className="winners" id={`${layout}-winners`} aria-labelledby={`${layout}-winners-title`} tabIndex={-1}>
      <h2 className="section-title" id={`${layout}-winners-title`}>Meet the winners</h2>
      {content.awards.map((group) => (
        <div className="award-group" key={group.title}>
          <h3 className="group-title">{group.title}</h3>
          <div className="projects">
            {rows(group.projects, layout === "mobile" ? 1 : group.projects.length).map((row, index) => (
              <div className="project-row" key={index}>
                {row.map((project) => <Project key={project.href} project={project} finalist={group.title === "Our finalists"} />)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Judge({ judge }: { judge: JudgeContent }) {
  return (
    <div className="judge">
      <div className={judge.image ? "portrait" : "initials-portrait"}>
        {judge.image ? <div className="portrait-window"><img src={judge.image} style={judge.crop} alt={judge.name} loading="lazy" decoding="async" /></div> : <p className="initials" aria-hidden="true">{judge.initials}</p>}
      </div>
      <div className="judge-info">
        <h3 className="judge-name">{judge.name}</h3>
        {judge.roles.length === 1 ? <p className="judge-role">{judge.roles[0]}</p> : (
          <div className="judge-roles">
            {judge.roles.map((role, index) => <p className={index === 0 ? "judge-role-line" : "judge-role-last"} key={role}>{role}</p>)}
          </div>
        )}
      </div>
    </div>
  );
}

function Judges({ layout }: { layout: Layout }) {
  return (
    <section className="cream-section" id={`${layout}-judges`} aria-labelledby={`${layout}-judges-title`} tabIndex={-1}>
      <h2 className="section-title" id={`${layout}-judges-title`}>Thank you, judges</h2>
      <div className="judge-grid">
        {rows(content.judges, layout === "mobile" ? 2 : 4).map((row, index) => <div className="judge-row" key={index}>{row.map((judge) => <Judge key={judge.name} judge={judge} />)}</div>)}
      </div>
    </section>
  );
}

function Sponsor({ sponsor, layout, gold }: { sponsor: SponsorContent; layout: Layout; gold: boolean }) {
  return (
    <div className={gold ? "gold-tile" : "sponsor-tile"}>
      <div className="sponsor-image-size" style={layout === "mobile" ? sponsor.mobileSize : sponsor.desktopSize}>
        <div className="crop-window"><img src={sponsor.image} style={sponsor.crop} alt={sponsor.name} loading="lazy" decoding="async" /></div>
      </div>
    </div>
  );
}

function Sponsors({ layout }: { layout: Layout }) {
  return (
    <section className="sponsors" id={`${layout}-sponsors`} aria-labelledby={`${layout}-sponsors-title`} tabIndex={-1}>
      <h2 className="section-title" id={`${layout}-sponsors-title`}>Thank you, sponsors</h2>
      {content.sponsors.map((group) => (
        <div className="sponsor-group" key={group.title}>
          <h3 className="sponsor-title">{group.title}</h3>
          <div className="sponsor-grid">
            {rows(group.logos, layout === "mobile" ? 2 : group.desktopColumns).map((row, index) => (
              <div className="sponsor-row" key={index}>{row.map((sponsor) => <Sponsor key={sponsor.name} sponsor={sponsor} layout={layout} gold={group.desktopColumns === 4} />)}</div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Closing({ layout }: { layout: Layout }) {
  return <>
    <div className="closing"><h2 className="stat-value">See you next year</h2><p className="stat-label">Hack Atlantic</p></div>
    <footer className="footer">
      <ExternalLink className="footer-brand" href="https://hackatlantic.ca"><p className="underlined">Hack Atlantic</p></ExternalLink>
      <a className="back-to-top" href={`#${layout}-top`}><p className="underlined">Back to top ↑</p></a>
    </footer>
  </>;
}

export function RecapPage() {
  const measureViewport = () => ({
    width: window.innerWidth,
    availableWidth: document.documentElement.clientWidth || window.innerWidth,
  });
  const [viewport, setViewport] = useState(measureViewport);
  const layout: Layout = viewport.width < 768 ? "mobile" : "desktop";

  useLayoutEffect(() => {
    document.documentElement.classList.add("recap-document");
    const resize = () => {
      // Keep deep links on the visible composition across the breakpoint.
      const prefix = window.innerWidth < 768 ? "mobile" : "desktop";
      const hash = window.location.hash.replace(/^#(?:desktop|mobile)-/, `#${prefix}-`);
      if (hash !== window.location.hash) window.history.replaceState(null, "", hash);
      setViewport(measureViewport());
    };
    // Measure again after mounting: the long page may have added a scrollbar.
    resize();
    window.addEventListener("resize", resize);
    return () => {
      document.documentElement.classList.remove("recap-document");
      window.removeEventListener("resize", resize);
    };
  }, []);

  useLayoutEffect(() => {
    // A bookmarked section may belong to the other reference composition.
    const hash = window.location.hash.replace(/^#(?:desktop|mobile)-/, `#${layout}-`);
    if (hash !== window.location.hash) window.history.replaceState(null, "", hash);
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" });
  }, [layout]);

  return (
    <div className="recap-page">
      <a className="skip" href={`#${layout}-winners`}>Skip to winners</a>
      <main className={`recap-view recap-${layout}`} style={{ zoom: viewport.availableWidth / (layout === "mobile" ? 390 : 1440) }} data-layout={layout}>
        <div className="canvas">
          <Hero layout={layout} /><Statistics layout={layout} /><Stories layout={layout} />
          <Winners layout={layout} /><Judges layout={layout} /><Sponsors layout={layout} /><Closing layout={layout} />
        </div>
      </main>
    </div>
  );
}
