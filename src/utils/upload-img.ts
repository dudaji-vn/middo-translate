type CloudinaryUploadResponse = {
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

export const uploadImage = async (
  file: File,
  folder: string = 'img',
): Promise<CloudinaryUploadResponse> => {
  let fileUpload = file;
  const { signature, timestamp } = await getSignature();
  const formData = new FormData();
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const cloudinaryKey = process.env.NEXT_PUBLIC_CLOUDINARY_KEY!;
  // console.log('cloudinaryKey', fileUpload);
  formData.append('file', fileUpload);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', cloudinaryKey);
  const response = await fetch(url, {
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
