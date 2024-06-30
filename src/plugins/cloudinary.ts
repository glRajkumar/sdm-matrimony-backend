import { FastifyInstance } from 'fastify';
import { ConfigOptions, v2 as cloudinary } from 'cloudinary';

declare module 'fastify' {
  interface FastifyInstance {
    cloudinary: typeof cloudinary;
  }
}

async function cloudinaryConfig(fastify: FastifyInstance) {
  const config: ConfigOptions = {
    cloud_name: fastify.config.CLOUDINARY_CLOUD_NAME || '',
    api_secret: fastify.config.CLOUDINARY_API_SECRET || '',
    api_key: fastify.config.CLOUDINARY_API_KEY || '',
    secure: true,
  };

  cloudinary.config(config);

  fastify.decorate('cloudinary', cloudinary);

  // Hook to close Cloudinary (if needed) when Fastify closes
  // fastify.addHook('onClose', (instance, done) => {
  //   // Cloudinary doesn't have a close method, but if it did, you'd call it here
  //   done();
  // });
}

export default cloudinaryConfig