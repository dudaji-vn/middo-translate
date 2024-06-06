import { MessagesSquare } from 'lucide-react';
import React from 'react';

const page = () => {
  return (
    <div className="relative size-16 rounded-full bg-opacity-0 p-2">
      <button className="relative w-fit  rounded-full bg-white p-4 shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]">
        <MessagesSquare className={`h-6 w-6 stroke-primary-500-main`} />
      </button>
    </div>
  );
};

export default page;
