import { Avatar, Typography } from '@/components/data-display';
import { notFound } from 'next/navigation';
import React from 'react';
import ValidateInvitation from './_components/validate-ivitation';
import { ExpiredVerifyToken } from '@/components/verifications/expired-verify-token';
import { InvalidVerifyToken } from '@/components/verifications/invalid-verify-token';
import { ClientInviteTime } from '@/components/verifications/client-invite-time';
import { getStationInvitationByToken } from '@/features/stations/services/station.service';

const StationVerify = async ({
  searchParams: { token },
}: {
  searchParams: {
    token: string;
  };
}) => {
  if (!token) {
    notFound();
  }
  const invitation = await getStationInvitationByToken(token);

  console.log('station invitation==>', invitation);
  if (invitation.statusCode === 410 || invitation.isExpired) {
    return (
      <ExpiredVerifyToken
        token={token}
        title="Please ask the station owner to resend the invitation
      "
      />
    );
  }

  if (invitation.statusCode) {
    return <InvalidVerifyToken token={token} status={invitation.statusCode} />;
  }

  const { station, email, invitedAt } = invitation;

  return (
    <main className="flex h-[calc(100vh-52px)] items-center justify-center  px-8 md:px-2  ">
      <div className="max-w-screen flex flex-col items-center gap-8  leading-8 md:max-w-screen-sm xl:max-w-screen-md">
        <Typography className="station-y-3 max-w-full break-words text-center text-[1.35rem] font-semibold text-primary-500-main sm:text-[2rem]">
          {email}
          <span className="leading-[48px] text-neutral-800">, </span>
          <br />
          <span className="max-w-full break-words  text-[1.35rem] font-semibold  leading-[48px] text-neutral-800 dark:text-neutral-50 sm:text-[2rem]">
            You&apos;ve been invited to join
          </span>
        </Typography>
        <div className="station-y-3 h-auto w-fit min-w-[320px]">
          <div className="flex w-full flex-col  items-center justify-center gap-4  rounded-[12px] bg-primary-100 p-3 dark:bg-neutral-800 dark:text-neutral-50 sm:min-w-[290px]">
            <Avatar
              variant={'outline'}
              src={station?.avatar || '/avatar.svg'}
              alt="avt"
              className="h-24 w-24 bg-white "
            />
            <Typography className="max-w-full break-words text-center text-[18px] font-semibold text-neutral-800 dark:text-neutral-50">
              {station?.name}
            </Typography>
          </div>
          <div className="flex flex-col justify-center gap-x-3 gap-y-2 divide-[#D9D9D9] dark:text-neutral-50 max-md:items-center md:flex-row  md:divide-x ">
            <Typography className="text-sm font-light  text-neutral-500 dark:text-neutral-100">
              By&nbsp;
              <span className="px-1 text-base font-normal leading-[18px] dark:text-neutral-100">
                {station?.owner?.email}
              </span>
            </Typography>
            <ClientInviteTime invitedAt={invitedAt} />
          </div>
        </div>
        <p className="max-w-[100vw] break-words px-3 text-base font-normal text-neutral-600 dark:text-neutral-50">
          Accept this invitation to join to&nbsp;
          {station?.name}. Or you could decline it.
        </p>
        <ValidateInvitation token={token} />
      </div>
    </main>
  );
};

export default StationVerify;
