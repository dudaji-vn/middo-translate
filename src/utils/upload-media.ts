export type CloudinaryUploadResponse = {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
};

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

const CLOUDINARY_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_KEY!;

export const uploadMultiMedia = async (
  files: File[],
): Promise<CloudinaryUploadResponse[]> => {
  const { signature, timestamp } = await getSignature();

  // use Promise.all to upload multiple files
  const uploadFiles = files.map((file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('api_key', CLOUDINARY_KEY); // snake case is required by cloudinary
    return fetch(UPLOAD_URL, {
      method: 'post',
      body: formData,
    });
  });
  const responses = await Promise.all(uploadFiles);
  const dataResponse = await Promise.all(responses.map((res) => res.json()));
  return dataResponse;
};

export const uploadImage = async (
  file: File,
  folder: string = 'img',
): Promise<CloudinaryUploadResponse> => {
  let fileUpload = file;
  const { signature, timestamp } = await getSignature();
  const formData = new FormData();
  formData.append('file', fileUpload);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', CLOUDINARY_KEY); // snake case is required by cloudinary
  const response = await fetch(UPLOAD_URL, {
    method: 'post',
    body: formData,
  });
  const dataResponse = await response.json();
  return dataResponse;
};

async function getSignature() {
  const response = await fetch('/api/cloudinary/sign');
  const data = await response.json();
  const { signature, timestamp } = data;
  return { signature, timestamp };
}

export async function deleteByPublicId(publicId: string) {
  try {
    const response = await fetch('/api/cloudinary', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
