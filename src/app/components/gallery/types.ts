export interface ImageVariant {
  src: string;
  width: number;
  height: number;
  bytes: number;
}

export interface GalleryPhoto {
  id: string;
  album: string;
  folderId: string;
  filename: string;
  sourceUrl: string;
  sourceSha256: string;
  width: number;
  height: number;
  alt: string;
  thumbnail: ImageVariant;
  largeThumbnail: ImageVariant;
  preview: ImageVariant;
}
