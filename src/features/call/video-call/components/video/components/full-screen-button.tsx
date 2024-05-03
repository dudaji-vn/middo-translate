import {  Maximize, Minimize } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
interface FullScreenButtonProps {
  setFullScreenWeb: () => void;
  isExpandFull: boolean;
}
const FullScreenButton = ({setFullScreenWeb, isExpandFull}: FullScreenButtonProps) => {
  return (
    <div className="absolute bottom-2 right-2 cursor-pointer hover:opacity-70 z-20"
        onClick={setFullScreenWeb}
      >
        {
          isExpandFull ? <Minimize className='text-neutral-100' size={20} /> : <Maximize className='text-neutral-100' size={20} />
        }
      </div>
  );
}

export default memo(FullScreenButton);

