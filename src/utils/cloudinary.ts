import type { ConfigOptions } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { env } from './enums.js';

export function getCloudinary() {
  const config: ConfigOptions = {
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_secret: env.CLOUDINARY_API_SECRET,
    api_key: env.CLOUDINARY_API_KEY,
    secure: true,
  }

  cloudinary.config(config)

  return cloudinary
}

export async function getImgUrl(file: any): Promise<string> {
  const buffer = await (file as Blob).arrayBuffer()
  const nodeBuffer = Buffer.from(buffer)

  const cloudinary = getCloudinary()
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'my_uploads' },
      (error: any, result: any) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    uploadStream.end(nodeBuffer)
  })

  return result.url
}