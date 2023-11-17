import Image from 'next/image';
import { forwardRef } from 'react';
export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>((props, ref) => {
  return (
    <div className={`relative h-fit w-fit`} ref={ref} {...props}>
      <Image alt="logo" src="/logo.png" className="object-cover" fill />
    </div>
  );
});
Logo.displayName = 'Logo';
