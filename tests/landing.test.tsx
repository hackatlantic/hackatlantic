import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LandingNav } from "../src/app/components/landing/LandingNav";
import { LandingFAQ } from "../src/app/components/landing/LandingFAQ";
import {
  ApplyLink,
  DrawnAccent,
  ScrollTitle,
} from "../src/app/components/landing/LandingMotion";
import { CoastPostcard } from "../src/app/components/landing/CoastPostcard";
import {
  APPLICATION_URL,
  faqs,
  sponsors,
} from "../src/app/components/landing/content";
import {
  ditherColor,
  sampleCells,
} from "../src/app/components/landing/dither.mjs";

const preferences = vi.hoisted(() => ({ reduced: true }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => preferences.reduced,
}));
beforeEach(() => {
  preferences.reduced = true;
  window.history.replaceState(null, "", "/");
});

describe("application links", () => {
  it("points both button sizes at the production application portal", () => {
    render(
      <>
        <ApplyLink />
        <ApplyLink compact />
      </>,
    );
    for (const link of screen.getAllByRole("link", { name: "Apply now" }))
      expect(link).toHaveAttribute("href", APPLICATION_URL);
    expect(APPLICATION_URL).toBe("https://apply.hackatlantic.ca/");
  });
});

describe("mobile navigation", () => {
  it("opens a named modal with navigation and an Apply link", async () => {
    const user = userEvent.setup();
    render(<LandingNav />);
    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Explore Hack Atlantic",
    });
    expect(
      within(dialog).getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
    expect(
      within(dialog).getByRole("link", { name: "Apply now" }),
    ).toHaveAttribute("href", APPLICATION_URL);
    expect(
      within(dialog).getByRole("button", { name: "Close navigation menu" }),
    ).toHaveFocus();
  });
  it("closes with Escape and restores focus to the menu button", async () => {
    const user = userEvent.setup();
    render(<LandingNav />);
    const trigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });
  it("closes with its explicit close control", async () => {
    const user = userEvent.setup();
    render(<LandingNav />);
    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Close navigation menu" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("traps keyboard focus inside the menu", async () => {
    const user = userEvent.setup();
    render(<LandingNav />);
    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    const dialog = screen.getByRole("dialog");
    for (let i = 0; i < 12; i++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });
  it("closes and focuses the selected section instead of jumping back to the header", async () => {
    const user = userEvent.setup();
    render(
      <>
        <LandingNav />
        <section id="faq">
          <h2>FAQ section</h2>
        </section>
      </>,
    );
    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("link", { name: "03 FAQ" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(document.getElementById("faq")).toHaveFocus();
    expect(window.location.hash).toBe("#faq");
  });
});

describe("FAQ", () => {
  it("has a keyboard-operable control for every question", () => {
    render(<LandingFAQ />);
    expect(screen.getAllByRole("button")).toHaveLength(faqs.length);
    for (const button of screen.getAllByRole("button"))
      expect(button).toHaveAttribute("aria-expanded", "false");
  });
  it("expands with Enter and collapses with Space", async () => {
    const user = userEvent.setup();
    render(<LandingFAQ />);
    const question = screen.getByRole("button", {
      name: "What is a hackathon?",
    });
    question.focus();
    await user.keyboard("{Enter}");
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(faqs[0].answer)).toBeVisible();
    await user.keyboard(" ");
    expect(question).toHaveAttribute("aria-expanded", "false");
  });
  it("keeps only the selected question expanded", async () => {
    const user = userEvent.setup();
    render(<LandingFAQ />);
    const first = screen.getByRole("button", { name: faqs[0].question });
    const second = screen.getByRole("button", { name: faqs[1].question });
    await user.click(first);
    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });
});

describe("motion and source content", () => {
  it("keeps the date readable before the decorative stroke draws", () => {
    render(<DrawnAccent>September 26–27</DrawnAccent>);
    expect(screen.getByText("September 26–27")).toBeVisible();
    expect(document.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
  it("renders the scroll heading as ordinary text with reduced motion", () => {
    render(<ScrollTitle id="test-heading" text="Build something together." />);
    expect(
      screen.getByRole("heading", { name: "Build something together." }),
    ).toHaveTextContent("Build something together.");
    expect(document.querySelector("h2 [aria-hidden]")).toBeNull();
  });
  it("retains every supporter without duplicating UNB", () => {
    expect(sponsors).toHaveLength(10);
    expect(new Set(sponsors.map((item) => item.name)).size).toBe(10);
    expect(
      sponsors.filter((item) => item.name === "University of New Brunswick"),
    ).toHaveLength(1);
  });
  it("keeps the original postcard available and does not autoplay", async () => {
    const user = userEvent.setup();
    render(<CoastPostcard image="/photos/hopewellrocks.png" />);
    expect(screen.getByRole("img")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Original", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: /animation/ })).toBeNull();
    await user.click(
      screen.getByRole("button", { name: "Pixels", exact: true }),
    );
    expect(
      screen.getByRole("button", { name: "Pixels", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: /animation/ })).toBeNull();
    await user.click(
      screen.getByRole("button", { name: "Original", exact: true }),
    );
    expect(
      screen.getByRole("button", { name: "Original", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

describe("Canvas dither sampling", () => {
  it("averages cells including a partial edge cell", () => {
    const data = new Uint8ClampedArray([
      100, 50, 0, 255, 200, 100, 100, 255, 0, 0, 255, 128,
    ]);
    const cells = sampleCells(data, 3, 1, 2);
    expect(cells).toHaveLength(2);
    expect(cells[0]).toMatchObject({ r: 150, g: 75, b: 50, a: 1 });
    expect(cells[1]).toMatchObject({ x: 2, r: 0, b: 255 });
  });
  it("returns bounded, deterministic dither colors", () => {
    const cell = { x: 9, y: 18, r: 220, g: 10, b: 128, a: 1 };
    expect(ditherColor(cell)).toBe(ditherColor(cell));
    expect(ditherColor(cell)).not.toContain("NaN");
    const channels = ditherColor(cell, 1)
      .match(/[\d.]+/g)!
      .map(Number);
    expect(
      channels.slice(0, 3).every((value) => value >= 0 && value <= 255),
    ).toBe(true);
  });
});
