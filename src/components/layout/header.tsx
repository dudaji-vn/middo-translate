'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Google, Menu, MessageCircleOutline } from '@easy-eva-icons/react';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '@/components/sheet';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/actions';
import Image from 'next/image';
import Link from 'next/link';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';

type Props = {};

export const Header = (props: Props) => {
  const { data, status } = useSession();

  return (
    <div className="flex items-center justify-between px-[5vw] py-5">
      <Link href={NEXT_PUBLIC_URL}>
        <div className="w-[100px] md:w-[120px]">
          <Image
            src="/logo.png"
            alt="logo"
            priority
            quality={100}
            width={500}
            height={500}
          />
        </div>
      </Link>
      <div className="flex gap-2">
        <Link href="/online-conversation">
          <Button.Icon color="secondary" shape="square">
            <MessageCircleOutline />
          </Button.Icon>
        </Link>
        {status === 'authenticated' ? (
          <Sheet>
            <SheetTrigger>
              <div>
                <Button.Icon color="secondary" shape="square">
                  <Menu />
                </Button.Icon>
              </div>
            </SheetTrigger>

            <SheetContent>
              <div className="flex flex-col items-center gap-2">
                <Avatar>
                  <AvatarImage src={data.user?.image as string} />
                  <AvatarFallback>
                    {data.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-2 text-center">{data.user?.name}</h3>
              </div>
              <SheetFooter className="mt-3">
                <Button
                  className="w-full"
                  onClick={() => signOut()}
                  color="error"
                >
                  Logout
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ) : (
          <Button.Icon
            onClick={() => signIn()}
            color="secondary"
            shape="square"
          >
            <Google />
          </Button.Icon>
        )}
      </div>
    </div>
  );
};
