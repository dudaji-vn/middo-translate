'use client';

import { forwardRef } from 'react';
import { useRoomJoiner } from './room-joiner-context';
export interface UsernameInputProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const UsernameInput = forwardRef<HTMLDivElement, UsernameInputProps>(
  (props, ref) => {
    const { setUserName, username } = useRoomJoiner();
    return (
      <div ref={ref} {...props} className="w-full">
        <input
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full"
          type="text"
          name="Name"
          id="Name"
          placeholder="Enter your name"
        />
      </div>
    );
  },
);
UsernameInput.displayName = 'UsernameInput';
