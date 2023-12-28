'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';
import {
  InputCropImage,
  InputCropImageRef,
} from '@/components/form/InputCropImage';
import { useRef, useState } from 'react';

import { Camera } from 'lucide-react';
import { PageLoading } from '@/components/loading/PageLoading';
import toast from 'react-hot-toast';
import { updateInfoUserService } from '@/services/userService';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth';

export default function UpdateUserAvatar() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, setData: setDataAuth } = useAuthStore();
  const inputCropImage = useRef<InputCropImageRef>(null);

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = inputCropImage.current?.getCropData();
    if (!file) {
      toast.error('Please choose image!');
      return;
    }
    try {
      setLoading(true);
      let image = await uploadImage(file);
      let imgUrl = image.secure_url;
      if (!imgUrl) throw new Error('Upload image failed!');
      let res = await updateInfoUserService({ avatar: imgUrl });
      setDataAuth({
        user: {
          ...user,
          avatar: res.data.avatar,
        },
      });
      toast.success('Update avatar success!');
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoading />}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>
          <div className="cursor-pointer transition-all hover:opacity-80">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
              <Camera
                width={20}
                height={20}
                className="stroke-primary"
              ></Camera>
            </span>
            <span className="mt-2 block text-center text-sm font-light">
              Avatar
            </span>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={onSubmitForm}>
            <h3 className="text-[24px]">Change avatar</h3>
            <div>
              <InputCropImage ref={inputCropImage} />
            </div>
            <div className="mt-6 flex items-center justify-end">
              <AlertDialogCancel className="mr-2 border-0 bg-transparent hover:!border-0 hover:!bg-transparent">
                <p>Cancel</p>
              </AlertDialogCancel>
              <button
                className={`rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:opacity-80`}
                type="submit"
                disabled={loading}
              >
                Save
              </button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
