'use client';
import { Button } from '@/components/actions';
import { JayTextAnimation } from '@/components/jay-text-animation';
import { HeaderNavLandingMobile } from '@/components/layout/header/header-nav-landing.mobile';
import { navLandingPageItems } from '@/components/layout/header/header.config';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import { ArrowRightFromLine, Sparkles, StarIcon, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Landing() {
  const [isScrollDown, setScrollDown] = useState(false);
  const isMobile = useAppStore((state) => state.isMobile);
  const videoRef = useRef<any>();
  const [isPlayVideo, setIsPlayVideo] = useState<boolean>(false);
  useEffect(() => {
    const changeClass = () => {
      const scrollValue = document.documentElement.scrollTop;
      if (scrollValue > 10) {
        setScrollDown(true);
      } else {
        setScrollDown(false);
      }
    };
    changeClass();
    window.addEventListener('scroll', changeClass);
    return () => {
      window.removeEventListener('scroll', changeClass);
    };
  }, []);
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.addEventListener('play', () => {
      setIsPlayVideo(true);
    });
  }, [videoRef.current]);

  const handleScroll = (href: string) => {
    const targetElement = document.getElementById(href);
    if (!targetElement) {
      return;
    }
    targetElement.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-x-hidden">
      <div
        className={cn(
          'fixed z-10 flex h-[76px] w-full items-center justify-between pl-5 pr-1 md:!px-[5vw]',
          isScrollDown && 'bg-white/80 shadow-2 backdrop-blur-xl',
        )}
      >
        <Link href={ROUTE_NAMES.ROOT} className="block w-[90px] cursor-pointer">
          <Image src="/logo.png" priority alt="logo" width={500} height={500} />
        </Link>
        {isMobile ? (
          <HeaderNavLandingMobile navItems={navLandingPageItems} />
        ) : (
          <div className="hidden items-center justify-end gap-12 md:flex">
            {navLandingPageItems.map((item, index) => {
              return (
                <Button
                  onClick={() => handleScroll(item.href)}
                  key={index}
                  size="md"
                  shape="square"
                  variant="ghost"
                  color="default"
                >
                  {item.name}
                </Button>
              );
            })}
            <Link href={NEXT_PUBLIC_URL}>
              <Button
                size="md"
                shape="square"
                variant="default"
                color="primary"
              >
                Explore Product
                <ArrowRightFromLine className="ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="h-fit w-full bg-[url('/landing-page/hero.jpg')] px-5 pb-12 pt-[108px] md:flex md:flex-row-reverse md:px-[5vw]">
        <div className="relative h-fit md:w-[44%] md:min-w-[44%]">
          {!isPlayVideo && (
            <div
              onClick={() => {
                if (videoRef.current) videoRef.current.play();
              }}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
            >
              <div className="z-10 cursor-pointer rounded-full bg-white/60 p-3 hover:bg-primary-500-main/60">
                <Play className="size-7" color="white" />
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="video-intro w-full object-contain before:!bg-none"
            width="100%"
            height="auto"
            controls
            autoPlay
            loop
            poster="/landing-page/group.png"
          >
            <source src="/video/video-middo-intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center md:mr-8 md:items-start">
          <JayTextAnimation />
          <p className="mt-8 text-center text-neutral-600 md:text-left">
            Middo can be your trusted tool to do all translation work. Beisde
            that we also provide a barrier-free language conversation platform.{' '}
          </p>
          <Link href={NEXT_PUBLIC_URL}>
            <Button
              size="lg"
              shape="square"
              variant="default"
              color="primary"
              className="mt-8"
            >
              Explore Product
              <ArrowRightFromLine className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      <div id="solution">
        <div className="flex flex-col-reverse gap-10 py-10 md:flex-row md:items-center md:py-[5vw]">
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
              <p className="mt-2 text-neutral-600">
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
        <div className="flex flex-col-reverse items-center gap-10 bg-primary-100 pt-10 md:flex-row-reverse md:justify-between md:pt-[5vw]">
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
              <p className="mt-2 text-neutral-600">
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
        <div className="flex flex-col-reverse items-center gap-10 py-10 md:flex-row md:!gap-16 md:py-[5vw]">
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
              <p className="mt-2 text-neutral-600">
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
      </div>
      <div
        id="about-us"
        className="bg-gradient-to-b from-primary-100 to-transparent px-5 py-12 md:px-[5vw] md:py-[72px]"
      >
        <div className="flex w-full items-center justify-center gap-3 text-primary">
          <Sparkles className="size-7" />
          <h3>About us</h3>
        </div>
        <h1 className="w-full text-center text-[48px]">Dudaji Vietnam</h1>
        <p className="mt-8 text-center text-neutral-600">
          Dudaji supports you to quickly build a deep learning utilization
          service in a timely and timely place.
        </p>
        <p className="mt-8 text-center">
          To put machine learning and deep learning techniques into practice,
          you can not only design algorithms, but also there is a great need for
          infrastructure know-how, such as data preprocessing, building a
          distributed development environment, resource management, and process
          management.Based on the experience of conducting various AI projects,
          Dudaji accelerates the implementation of related data and ideas as a
          service quickly.
        </p>
      </div>
      <div className="flex h-fit w-full flex-col items-center justify-center bg-[url('/landing-page/hero.jpg')] px-5 py-12">
        <h1 className="text-primary-500-main">Ready to get started?</h1>
        <a href={NEXT_PUBLIC_URL}>
          <Button
            size="lg"
            shape="square"
            variant="default"
            color="primary"
            className="mt-5"
          >
            Explore Product
            <ArrowRightFromLine className="ml-2" />
          </Button>
        </a>
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
