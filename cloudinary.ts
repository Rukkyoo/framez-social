const CLOUD_NAME = 'drjgzzt0p';
const UPLOAD_PRESET = 'framez-uploads';

export const uploadToCloudinary = async (file: any, options: any = {}) => {
  const uploadParams = {
    upload_preset: UPLOAD_PRESET,
    ...options,
  };

  const formData = new FormData();

  if (typeof file === 'string' && file.startsWith('data:')) {
    formData.append('file', file);
  } else if (file instanceof Blob) {
    formData.append('file', file);
  } else {
    formData.append('file', file);
  }
  Object.keys(uploadParams).forEach(key => {
    if (uploadParams[key] !== undefined && uploadParams[key] !== null) {
      formData.append(key, uploadParams[key].toString());
    }
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cloudinary error response:', errorText);
    throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
