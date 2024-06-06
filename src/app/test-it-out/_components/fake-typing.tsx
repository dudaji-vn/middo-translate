import React from 'react';

const FakeTyping = ({ name }: { name?: string }) => {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 flex -translate-y-full rounded-tr-[12px] bg-white  p-1 pl-3 text-sm text-neutral-600">
        <span>
          <span className="font-semibold">{name}</span>&nbsp;is typing&nbsp;
          <div className="inline-flex space-x-[1.5px]">
            <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.2s]"></div>
            <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.1s]"></div>
            <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500"></div>
          </div>
        </span>
      </div>
    </div>
  );
};

export default FakeTyping;
