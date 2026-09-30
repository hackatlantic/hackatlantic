import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import App from "../src/app/App";

function resize(width: number, scrollbarWidth = 0) {
  act(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: width - scrollbarWidth });
    window.dispatchEvent(new Event("resize"));
  });
}

beforeEach(() => {
  resize(1440);
  window.history.replaceState(null, "", "/");
  vi.mocked(Element.prototype.scrollIntoView).mockClear();
});

describe("recap navigation and responsive compositions", () => {
  it.each([375, 390, 430, 767, 768, 1024, 1440, 1920])("renders one accessible composition at %ipx", (width) => {
    resize(width);
    render(<App />);
    const mobile = width < 768;
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("data-layout", mobile ? "mobile" : "desktop");
    expect(main.style.zoom).toBe(String(width / (mobile ? 390 : 1440)));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getAllByRole("link")).toHaveLength(7);
    for (const label of ["Recap", "Winners", "Judges", "Sponsors"]) {
      expect(within(nav).getByRole("link", { name: label, exact: true })).toHaveAttribute("href", `#${mobile ? "mobile" : "desktop"}-${label.toLowerCase()}`);
    }
    expect(within(nav).getByRole("link", { name: "Email Hack Atlantic" })).toHaveAttribute("href", "mailto:team@hackatlantic.ca");
    expect(within(nav).getByRole("link", { name: "Hack Atlantic on Instagram" })).toHaveAttribute("href", "https://www.instagram.com/hackatlantic");
    expect(within(nav).getByRole("link", { name: "Hack Atlantic on LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/company/hack-atlantic/");
    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href")!;
      if (href.startsWith("#")) expect(document.getElementById(href.slice(1))).not.toBeNull();
    }
  });

  it("fills wide screens without side gutters or extending beneath the scrollbar", () => {
    resize(1920, 15);
    render(<App />);
    expect(screen.getByRole("main").style.zoom).toBe(String(1905 / 1440));
    resize(390, 15);
    expect(screen.getByRole("main").style.zoom).toBe(String(375 / 390));
  });

  it("retargets section links when resizing across the reference breakpoint", () => {
    render(<App />);
    window.history.replaceState(null, "", "#desktop-winners");
    resize(390);
    expect(window.location.hash).toBe("#mobile-winners");
    expect(screen.getByRole("link", { name: "Skip to winners" })).toHaveAttribute("href", "#mobile-winners");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "instant" });
    resize(1440);
    expect(window.location.hash).toBe("#desktop-winners");
    expect(screen.getByRole("link", { name: "Back to top ↑" })).toHaveAttribute("href", "#desktop-top");
  });

  it("opens a desktop bookmark in the mobile composition", () => {
    resize(390);
    window.history.replaceState(null, "", "#desktop-sponsors");
    render(<App />);
    expect(window.location.hash).toBe("#mobile-sponsors");
    expect(document.getElementById("mobile-sponsors")).not.toBeNull();
  });

  it("provides a keyboard skip link and one tab stop per project", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    expect(screen.getByRole("link", { name: "Skip to winners" })).toHaveFocus();
    const winners = screen.getByRole("region", { name: "Meet the winners" });
    expect(within(winners).getAllByRole("link")).toHaveLength(10);
    expect(winners.querySelectorAll("a [tabindex], a [role=link]")).toHaveLength(0);
  });

  it("cleans up document styles and resize subscriptions when leaving the homepage", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<App />);
    expect(document.documentElement).toHaveClass("recap-document");
    unmount();
    expect(document.documentElement).not.toHaveClass("recap-document");
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});

describe("approved recap content", () => {
  it("replaces the pre-event content with all recap sections", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "2026 by the numbers", "Recap", "Meet the winners", "Thank you, judges", "Thank you, sponsors", "See you next year",
    ]);
    expect(screen.queryByText("Applications are open")).toBeNull();
    expect(screen.queryByText("Frequently Asked Questions")).toBeNull();
    expect(screen.getAllByText("PARTICIPANT Q&A")).toHaveLength(8);
    expect(screen.getAllByRole("img", { name: /Hack Atlantic weekend/ })).toHaveLength(12);
    expect(screen.queryByRole("link", { name: "Photo album ↗" })).toBeNull();
    expect(screen.queryByRole("link", { name: "More photos ↗" })).toBeNull();
    expect(screen.getByRole("link", { name: "Photo gallery" })).toHaveAttribute("href", "/photo-gallery");
  });

  it("preserves the ten project destinations and makes external links safe", () => {
    render(<App />);
    const winners = screen.getByRole("region", { name: "Meet the winners" });
    expect(within(winners).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual([
      "https://devpost.com/software/sim4food", "https://devpost.com/software/packflow",
      "https://devpost.com/software/smoke-or-fire-fumee-ou-feu", "https://devpost.com/software/cloakfile",
      "https://devpost.com/software/eazz-mechanic-iecq48", "https://devpost.com/software/dylamo",
      "https://devpost.com/software/thorpe-watch", "https://devpost.com/software/skylattice",
      "https://devpost.com/software/activatemio", "https://devpost.com/software/recall-9r06xn",
    ]);
    for (const a of document.querySelectorAll('a[target="_blank"]')) expect(a.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("shows the reference's 13 sponsors and seven judges without duplicates", () => {
    render(<App />);
    const sponsors = screen.getByRole("region", { name: "Thank you, sponsors" });
    expect(within(sponsors).getAllByRole("img").map((img) => img.getAttribute("alt"))).toEqual([
      "Gray Wolf", "UNB", "NBIF", "SnapTrade", "Uride", "introhive", "Bluebird Consulting",
      "Elaras Consulting", "SmartSkin Technologies", "NordVPN", "MLH", "snowflake", "Red Bull",
    ]);
    const judges = screen.getByRole("region", { name: "Thank you, judges" });
    expect(within(judges).getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Jessica Venoitte", "Promise Abel", "Yousef Khirallah", "Mantas Groza", "Mike Waugh", "Robert Foley", "Nick McCullum",
    ]);
    expect(within(judges).getAllByRole("img")).toHaveLength(6);
  });

  it("serves byte-identical reference images with the correct file extensions", () => {
    const manifest = JSON.parse(readFileSync(resolve("public/recap/asset-manifest.json"), "utf8"));
    const assets = Object.values(manifest.assets) as { path: string; sha256: string }[];
    expect(assets).toHaveLength(23);
    for (const asset of assets) {
      const bytes = readFileSync(resolve("public", "." + asset.path));
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(asset.sha256);
      expect(bytes.subarray(0, 3).toString("hex")).toBe(asset.path.endsWith(".png") ? "89504e" : "ffd8ff");
    }
  });
});
