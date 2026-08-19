import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  glass = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border transition-all duration-200',
          glass
            ? 'glass-panel text-slate-100'
            : 'bg-slate-900/90 text-slate-100 border-slate-800 shadow-sm',
          hoverable &&
            'hover:border-slate-700 hover:shadow-md hover:shadow-emerald-950/10 cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
