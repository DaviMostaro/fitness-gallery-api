import { Router } from "express";
import * as pingController from '../controllers/ping';
import * as galleryController from '../controllers/gallery';
import { upload } from "../libs/multer";

export const mainRouter = Router();

mainRouter.get('/ping', pingController.ping);

mainRouter.post('/galleries', galleryController.createGallery);
mainRouter.get('/galleries', galleryController.getGalleries);
mainRouter.get('/gallery/:id', galleryController.getPhotosFromGallery);

mainRouter.post('/upload', upload.single('photo'), galleryController.upload);