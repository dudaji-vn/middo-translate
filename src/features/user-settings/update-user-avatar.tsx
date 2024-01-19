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
} from '@/components/form/Input-crop-image';
import { useRef, useState } from 'react';

import { Button } from '@/components/actions';
import { Camera } from 'lucide-react';
import { PageLoading } from '@/components/loading/page-loading';
import toast from 'react-hot-toast';
import { updateInfoUserService } from '@/services/user.service';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth.store';

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
            <div className="inline-flex items-center justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-0 transition-all focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 font-semibold text-primary bg-primary-200 md:hover:bg-primary-300 md:active:bg-primary-400 active:bg-primary-400 disabled:bg-primary-100 disabled:text-primary-200 rounded-full p-0 w-12 h-12">
              <Camera />
            </div>

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
              <Button shape="square" disabled={loading} type="submit">
                Save
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
