'use client';

import './style.css';

import {
  FileTextOutline,
  ImageOutline,
  MicOutline,
} from '@easy-eva-icons/react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { forwardRef, useEffect } from 'react';

import { useSetParams } from '@/hooks/use-set-params';

export interface TranslateBarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const TranslateBar = forwardRef<HTMLDivElement, TranslateBarProps>(
  (props, ref) => {
    const { transcript, listening } = useSpeechRecognition();
    const { setParam, removeParam } = useSetParams();

    useEffect(() => {
      if (transcript) {
        setParam('query', transcript);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transcript]);

    useEffect(() => {
      if (listening) {
        setParam('listening', 'true');
      } else {
        removeParam('listening');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listening]);

    return (
      <div ref={ref} {...props}>
        <p>{transcript}</p>
        {listening ? (
          <div className="toolWrapper !w-[284px]">
            <button
              onClick={() => {
                SpeechRecognition.stopListening();
              }}
              className="circleButton big"
            >
              <div className="h-6 w-6 rounded-[4px] bg-primary"></div>
            </button>
          </div>
        ) : (
          <div className="toolWrapper">
            <button className="circleButton big">
              <FileTextOutline className="h-7 w-7 text-primary"></FileTextOutline>
            </button>
            <button
              onClick={() => {
                SpeechRecognition.abortListening();
                SpeechRecognition.startListening({
                  language: 'vi-VN',
                  continuous: true,
                });
              }}
              className="circleButton big"
            >
              <MicOutline className="h-7 w-7 text-primary"></MicOutline>
            </button>
            <button className="circleButton big">
              <ImageOutline className="h-7 w-7 text-primary"></ImageOutline>
            </button>
          </div>
        )}
      </div>
    );
  },
);
TranslateBar.displayName = 'TranslateBar';
