import { v4 } from "uuid";
import { prisma } from "../libs/prisma"
import sharp from "sharp";
import fs from "fs/promises";

export const getPhotos = async (galleryId: number) => {
    const photos = await prisma.photo.findMany({
        where: { galleryId },
        select: {id: true, filename: true}
    });

    const photosWithUrl = photos.map(photo => ({
        id: photo.id,
        url: `${process.env.BASE_URL}/images/${photo.filename}`,
        thumb: `${process.env.BASE_URL}/images/thumb/${photo.filename}`
    }));

    return photosWithUrl;   
}

export const handleRawPhoto = async (tmpPath: string) => {
    const newName = v4() + '.jpg';

    const image = await sharp(tmpPath)
        .resize(1000, 1000, {fit: 'cover'})
        .toBuffer();

    await sharp(image)
        .resize(200)
        .toFile(`./public/images/thumb/${newName}`);

    await sharp(image)
        .composite([
            { input: './src/assets/watermark.png'}
        ])
        .toFile(`./public/images/${newName}`);
    
    await fs.unlink(tmpPath);
    return newName;

}

export const createPhoto = async (galleryId: number, filename: string) => {
    const newPhoto = await prisma.photo.create({
        data: { galleryId, filename }
    });
    return newPhoto;
}