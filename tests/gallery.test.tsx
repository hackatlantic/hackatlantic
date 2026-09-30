import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PhotoGalleryPage from "../src/app/PhotoGalleryPage";
import photos from "../src/app/components/gallery/photos.json";
import inventory from "../docs/photo-gallery-source-inventory.json";

describe("complete photo gallery", () => {
  it("renders every source photo exactly once, in album and filename order", () => {
    render(<PhotoGalleryPage />);
    const sourceIds = inventory.albums.flatMap(album => album.photos.map(photo => photo.id));
    const cards = screen.getAllByRole("listitem");
    expect(cards.map(card => card.getAttribute("data-photo-id"))).toEqual(sourceIds);
    expect(new Set(sourceIds).size).toBe(inventory.photoCount);
    expect(cards).toHaveLength(49);
    expect(screen.getAllByRole("img")).toHaveLength(49);
    expect(screen.getByText("49 photos", { exact: true })).toBeVisible();
    expect(photos.filter(photo => photo.album === "Saturday")).toHaveLength(20);
    expect(photos.filter(photo => photo.album === "Sunday")).toHaveLength(29);
  });

  it("defers lower rows and does not request larger previews until opened", () => {
    render(<PhotoGalleryPage />);
    const images = screen.getAllByRole("img");
    images.forEach((image, index) => {
      expect(image).toHaveAttribute("loading", index < 5 ? "eager" : "lazy");
      expect(image).toHaveAttribute("width");
      expect(image).toHaveAttribute("height");
      expect(image.getAttribute("src")).not.toContain("-preview.webp");
      expect(image).toHaveAttribute("alt", photos[index].alt);
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens the selected photo, wraps keyboard navigation, and returns focus on Escape", async () => {
    const user = userEvent.setup();
    render(<PhotoGalleryPage />);
    const first = screen.getByRole("button", { name: /^Open photo 1:/ });
    await user.click(first);
    expect(screen.getByRole("dialog", { name: "Photo 1 of 49" })).toBeVisible();
    await user.keyboard("{ArrowLeft}");
    const last = screen.getByRole("dialog", { name: "Photo 49 of 49" });
    expect(within(last).getByRole("img")).toHaveAttribute("src", photos[48].preview.src);
    expect(within(last).getByRole("link", { name: "Open original" })).toHaveAttribute("href", photos[48].sourceUrl);
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByRole("dialog", { name: "Photo 2 of 49" })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(first).toHaveFocus();
  });

  it("traps focus in the viewer and supports its close button", async () => {
    const user = userEvent.setup();
    render(<PhotoGalleryPage />);
    const finalCard = screen.getByRole("button", { name: /^Open photo 49:/ });
    await user.click(finalCard);
    const close = screen.getByRole("button", { name: "Close photo viewer" });
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Next photo" })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.click(close);
    expect(finalCard).toHaveFocus();
  });

  it("keeps a failed preview accessible through its original link", async () => {
    const user = userEvent.setup();
    render(<PhotoGalleryPage />);
    await user.click(screen.getByRole("button", { name: /^Open photo 19:/ }));
    const dialog = screen.getByRole("dialog");
    fireEvent.error(within(dialog).getByRole("img"));
    expect(within(dialog).getByRole("status")).toHaveTextContent("could not load");
    expect(within(dialog).getByRole("link", { name: "Open original" })).toHaveAttribute("href", photos[18].sourceUrl);
    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("sets gallery metadata and restores it when unmounted", () => {
    document.title = "Original title";
    const meta = document.createElement("link");
    meta.rel = "canonical";
    meta.href = "https://www.hackatlantic.ca/";
    document.head.append(meta);
    const { unmount } = render(<PhotoGalleryPage />);
    expect(document.title).toBe("Photo Gallery | Hack Atlantic");
    expect(meta.href).toBe("https://www.hackatlantic.ca/photo-gallery");
    unmount();
    expect(meta.href).toBe("https://www.hackatlantic.ca/");
    expect(document.title).toBe("Original title");
    meta.remove();
  });
});
