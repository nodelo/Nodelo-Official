const cloudinary = require('../config/cloudinary');
const { getFileType } = require('../middleware/upload');

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} mimetype - File mimetype
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = async (fileBuffer, mimetype, folder = 'nodelo/messages') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto', // Auto-detect image, video, or raw
      use_filename: true,
      unique_filename: true,
    };

    // For PDFs and documents, use raw upload
    if (mimetype === 'application/pdf' || mimetype.includes('document')) {
      uploadOptions.resource_type = 'raw';
      uploadOptions.format = 'pdf';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            duration: result.duration, // For videos
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of { buffer, mimetype, originalname }
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Array>} Array of uploaded file results
 */
const uploadMultipleFiles = async (files, folder = 'nodelo/messages') => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map((file) => {
    if (!file.buffer || !file.mimetype) {
      throw new Error('Invalid file object. Missing buffer or mimetype.');
    }
    
    return uploadToCloudinary(file.buffer, file.mimetype, folder)
      .then((result) => ({
        url: result.url,
        type: getFileType(file.mimetype),
        fileName: file.originalname || 'unnamed',
        fileSize: result.bytes,
        publicId: result.publicId,
      }))
      .catch((error) => {
        console.error(`Failed to upload file ${file.originalname}:`, error);
        throw new Error(`Failed to upload ${file.originalname}: ${error.message}`);
      });
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise}
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    // Determine resource type from public ID or try both
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleFiles,
  deleteFromCloudinary,
};

