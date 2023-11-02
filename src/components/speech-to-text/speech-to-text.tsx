'use client';

import React, { useEffect, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

import { forwardRef } from 'react';

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

    // if (!browserSupportsSpeechRecognition) {
    //   return <div>Hello</div>;
    // }

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
