import { Avatar, Typography } from '@/components/data-display';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { notFound } from 'next/navigation';
import React from 'react';
import ValidateInvitation from './_components/validate-ivitation';
import InvalidVerifyToken from './_components/invalid-verify-token';
import ExpiredVerifyToken from './_components/expired-verify-token';
import ClientInviteTime from './_components/client-invite-time';

const SpaceVerify = async ({
  searchParams: { token },
}: {
  searchParams: {
    token: string;
  };
}) => {
  if (!token) {
    notFound();
  }
  const invitation = await businessAPI.getInvitationByToken(token);

  console.log('invitation==>', invitation);
  if (invitation.statusCode === 410 || invitation.isExpired) {
    return <ExpiredVerifyToken token={token} />;
  }

  if (invitation.statusCode) {
    return <InvalidVerifyToken token={token} status={invitation.statusCode} />;
  }

  const { space, email, invitedAt } = invitation;

  return (
    <main className="flex h-[calc(100vh-52px)] items-center justify-center  px-8 md:px-2  ">
      <div className="max-w-screen flex flex-col items-center gap-8  leading-8 md:max-w-screen-sm xl:max-w-screen-md">
        <Typography className="max-w-full space-y-3 break-words text-center text-[1.35rem] font-semibold text-primary-500-main sm:text-[2rem]">
          {email}
          <span className="leading-[48px] text-neutral-800">, </span>
          <br />
          <span className="max-w-full break-words text-[1.35rem] font-semibold leading-[48px] text-neutral-800 sm:text-[2rem]">
            You&apos;ve been invited to join
          </span>
        </Typography>
        <div className="h-auto w-fit min-w-[320px] space-y-3">
          <div className="flex w-full flex-row  items-center justify-center gap-4 rounded-[12px] bg-primary-100 p-3 sm:min-w-[320px]">
            <Avatar
              src={space?.avatar || '/avatar.svg'}
              alt="avt"
              className="h-24 w-24 bg-white"
            />
            <Typography className="text-[18px]  font-semibold text-neutral-800">
              {space?.name}
            </Typography>
          </div>
          <div className="flex flex-col justify-center gap-x-3 gap-y-2 divide-[#D9D9D9] max-md:items-center max-md:divide-y md:flex-row  md:divide-x ">
            <Typography className="text-sm font-light  text-neutral-500">
              By&nbsp;
              <span className="px-1 text-base font-normal leading-[18px]">
                {space?.owner?.email}
              </span>
            </Typography>
            <ClientInviteTime invitedAt={invitedAt} />
          </div>
        </div>
        <p className="max-w-[100vw] break-words px-3 text-base font-normal text-neutral-600">
          Accept this invitation to join to&nbsp;
          {space?.name}. Or you could decline it.
        </p>
        <ValidateInvitation token={token} />
      </div>
    </main>
  );
};

export default SpaceVerify;
