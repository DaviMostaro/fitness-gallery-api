import { RequestHandler } from "express";
import * as GalleryService from "../services/gallery";
import * as PhotoService from "../services/photo";
import fs from "fs/promises";

export const createGallery: RequestHandler = async (req, res) => {
  const { title } = req.body;

  if (title && title.length > 0) {
    const newGallery = await GalleryService.createGallery(title);
    res.status(201).json({ gallery: newGallery });
  } else {
    res.json({ error: "Title is required" });
  }
};

export const getGalleries: RequestHandler = async (req, res) => {
  const galleries = await GalleryService.getGalleries();
  res.json({ list: galleries });
};

export const getPhotosFromGallery: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const gallery = await GalleryService.getGallery(parseInt(id));
  const photos = await PhotoService.getPhotos(parseInt(id));

  res.json({ gallery, photos });
};

export const upload: RequestHandler = async (req, res) => {
  if (req.file) {
    const { gallery } = req.body;

    if (gallery) {
      const gal = await GalleryService.getGallery(parseInt(gallery));
      if (gal) {
        const filename = await PhotoService.handleRawPhoto(req.file.path);
        await PhotoService.createPhoto(gal.id, filename);

        res.status(201).json({});
      } else {
        await fs.unlink(req.file.path);
        res.json({ error: "Galeria inexistente" });
      }
    } else {
        await fs.unlink(req.file.path);
        res.json({ error: "Galeria inexistente" });
    }
  } else {
    res.json({ error: "Nenhum arquivo enviado" });
  }
};
