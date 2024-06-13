'use client';
import { JayTextAnimation } from '@/components/jay-text-animation';
import { HeaderLandingPage } from '@/components/layout/header/header-landing-page';
import { cn } from '@/utils/cn';
import { Play, Sparkles, StarIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ROUTE_NAMES } from '@/configs/route-name';
import { usePlatformStore } from '@/features/platform/stores';
import { useRouter } from 'next/navigation';
import DownloadAppButton from './_components/download-app-button';
import UserGuide from './_components/user-guide';
import VideoPlayer from '@/components/video/video-player';

export default function Landing() {
  const isMobile = usePlatformStore((state) => state.platform) === 'mobile';
  const [isScrollDown, setScrollDown] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const changeClass = () => {
      const scrollValue = document.documentElement.scrollTop;
      if (scrollValue > 10 && !isScrollDown) {
        setScrollDown(true);
      } else if (scrollValue <= 10 && isScrollDown) {
        setScrollDown(false);
      }
    };
    changeClass();
    window.addEventListener('scroll', changeClass);
    return () => {
      window.removeEventListener('scroll', changeClass);
    };
  }, [isScrollDown]);

  // useEffect(() => {
  //   if (!videoRef.current) {
  //     return;
  //   }
  //   videoRef.current.addEventListener('play', () => {
  //     setIsPlayVideo(true);
  //   });
  // }, []);

  useEffect(() => {
    document.body.style.overflow = 'unset';
  }, []);

  useEffect(() => {
    if (isMobile) {
      router.push(ROUTE_NAMES.TRANSLATION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  if (isMobile) return;

  return (
    <div className="relative overflow-x-hidden">
      <div
        className={cn(
          'fixed z-10 flex h-fit w-full items-center justify-between ',
          isScrollDown && 'bg-white/80 dark:bg-neutral-900 shadow-2 backdrop-blur-xl',
        )}
      >
        <HeaderLandingPage />
      </div>
      <div className="w-full bg-[#FAFAFA] dark:bg-[#050505] bg-[url('/landing-page/hero.png')] dark:bg-[url('/landing-page/hero-dark.png')] bg-contain bg-center bg-no-repeat px-5 pb-12 pt-[108px] md:flex md:flex-row-reverse md:px-[5vw]">
        <div className="relative h-fit md:w-[48%] md:min-w-[48%]">
          <VideoPlayer 
            file={{
              url: '/video/video-middo-intro.mp4',
              name: 'Middo Intro Video',
              type: 'video/mp4',
            }}
            className='rounded-2xl'
            poster='/landing-page/group.png'
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center md:mr-8 md:items-start">
          <JayTextAnimation />
          <p className="mt-8 text-center text-neutral-600 dark:text-neutral-200 md:text-left">
            Middo can be your trusted tool to do all translation work. Beisde
            that we also provide a barrier-free language conversation platform.{' '}
          </p>
          <div className="mt-8">
            <DownloadAppButton />
          </div>
        </div>
      </div>
      <div id="solution">
        <div className="flex flex-col-reverse gap-10 py-10 md:flex-row md:items-center md:py-[5vw] dark:bg-background">
          <div className="pr-5 md:w-[48%]">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/landing-page/translation.png" alt="translation" />
            }
          </div>
          <div className="items-center justify-center px-5 md:flex md:flex-1 md:!px-0 md:!pr-[5vw]">
            <div>
              <div className="flex items-center justify-start gap-3 text-primary">
                <Sparkles className="size-7" />
                <h3>Solution</h3>
              </div>
              <h1 className="text-[48px]">Translation</h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-200">
                Middo provides an ESL translation method to guarantee a
                high-accuracy translate.
              </p>
              <div className="mt-8 flex flex-col items-start justify-start gap-8">
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Support more than 50 languages
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Speech-to-text input support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    More than 100+ example phrase at all situations
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Save and share your translated easily
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center gap-10 bg-primary-100 pt-10 md:flex-row-reverse md:justify-between md:pt-[5vw] dark:bg-neutral-900">
          <div className="flex h-full items-end md:w-[48%]">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/landing-page/conversation.png" alt="translation" />
            }
          </div>
          <div className="flex-1 items-center justify-center px-5 md:flex md:!px-0 md:!pl-[5vw]">
            <div>
              <div className="flex items-center justify-start gap-3 text-primary">
                <Sparkles className="size-7" />
                <h3>Solution</h3>
              </div>
              <h1 className="text-[48px]">Conversation</h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-200">
                All-in-one conversation platform that integrated Middo
                translation that could help you have unlimited connections with
                everyone around the world.
              </p>
              <div className="mt-8 flex flex-col items-start justify-start gap-8">
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Integrated Middo translation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Video & Audio call that support for your work
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Feel free to use your native language to speak with foreign
                    one
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">Sharing files easily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center gap-10 py-10 md:flex-row md:!gap-16 md:py-[5vw] dark:bg-background">
          <div className="flex h-full items-end px-5 md:w-[48%] md:!px-0 md:!pl-[5vw]">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/landing-page/middo-call.png" alt="translation" />
            }
          </div>
          <div className="flex-1 items-center justify-center px-5 md:flex md:!px-0 md:!pr-[5vw]">
            <div>
              <div className="flex items-center justify-start gap-3 text-primary">
                <Sparkles className="size-7" />
                <h3>Solution</h3>
              </div>
              <h1 className="text-[48px]">Middo Call</h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-200">
                Middo Call is one of the most fantastic feature of Middo
                Conversation that could support your work more easily.
              </p>
              <div className="mt-8 flex flex-col items-start justify-start gap-8">
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">Support screen sharing</span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">Live translated caption</span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Save all your discussion through call
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">Support on all devices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center gap-10 bg-primary-100 pt-10 md:flex-row-reverse md:justify-between md:pt-[5vw] dark:bg-neutral-900">
          <div className="flex h-full items-end md:w-[48%]">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/landing-page/extension.png" alt="extension" />
            }
          </div>
          <div className="flex-1 items-center justify-center px-5 md:flex md:!px-0 md:!pl-[5vw]">
            <div>
              <div className="flex items-center justify-start gap-3 text-primary">
                <Sparkles className="size-7" />
                <h3>Solution</h3>
              </div>
              <h1 className="text-[48px]">Extension</h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-200">
                Transform your website with Middo Extension in just a few
                clicks. Capture leads, provide real-time support, and boost your
                business – all within your website.
              </p>
              <div className="mt-8 flex flex-col items-start justify-start gap-8">
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Integrated Middo conversation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Easily manage clients list
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Grow your business with a powerful report tool
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarIcon className="size-7 text-primary-500-main" />
                  <span className="font-semibold">
                    Create your own script for any conversation with clients
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="FAQ" className="bg-white px-5 py-12 md:px-[5vw] md:py-[72px] dark:bg-background">
        <div className="flex w-full items-center justify-center gap-3 text-primary">
          <Sparkles className="size-7" />
          <h3>Help Center</h3>
        </div>
        <h1 className="w-full text-center text-[48px]">User Guide</h1>
        <div className="mt-10">
          <UserGuide />
        </div>
      </div>
      <div
        id="about-us"
        className="bg-gradient-to-b dark:from-[#050505] dark:to-[#050505]/0 from-primary-100 to-transparent px-5 py-12 md:px-[5vw] md:py-[72px]"
      >
        <div className="flex w-full items-center justify-center gap-3 text-primary">
          <Sparkles className="size-7" />
          <h3>About us</h3>
        </div>
        <h1 className="w-full text-center text-[48px]">Dudaji Vietnam</h1>
        <p className="mt-8 text-center text-neutral-600 dark:text-neutral-200">
          Dudaji supports you to quickly build a deep learning utilization
          service in a timely and timely place.
        </p>
        <p className="mt-8 text-center dark:text-neutral-50">
          To put machine learning and deep learning techniques into practice,
          you can not only design algorithms, but also there is a great need for
          infrastructure know-how, such as data preprocessing, building a
          distributed development environment, resource management, and process
          management.Based on the experience of conducting various AI projects,
          Dudaji accelerates the implementation of related data and ideas as a
          service quickly.
        </p>
      </div>
      <div className="flex h-fit w-full flex-col items-center justify-center bg-[url('/landing-page/hero.png')] bg-[#FAFAFA] dark:bg-[#050505] dark:bg-[url('/landing-page/hero-dark.png')] bg-no-repeat bg-center bg-cover px-5 py-12">
        <h1 className="text-primary-500-main">Ready to get started?</h1>
        <div className="mt-8">
          <DownloadAppButton />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 p-5 md:flex-row md:justify-between">
        <span className="font-semibold">
          Dudaji, Inc © All Rights Reserved.
        </span>
        <span>contact@dudaji.vn</span>
      </div>
    </div>
  );
}
