'use client';

import React, { useEffect, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

import { forwardRef } from 'react';
import { useSetParams } from '@/hooks/use-set-params';

export interface SpeechToTextProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SpeechToText = forwardRef<HTMLDivElement, SpeechToTextProps>(
  (props, ref) => {
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const { setParam } = useSetParams();

    // if (!browserSupportsSpeechRecognition) {
    //   return <div>Hello</div>;
    // }

    useEffect(() => {
      if (transcript) {
        setParam('query', transcript);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transcript]);

    return (
      <div ref={ref} {...props}>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button
          onClick={() => {
            console.log('start');
            SpeechRecognition.startListening({ language: 'vi-VN' });
          }}
        >
          Start
        </button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
      </div>
    );
  },
);
SpeechToText.displayName = 'SpeechToText';
