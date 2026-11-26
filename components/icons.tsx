import type { ComponentProps } from 'react';

export function Icon({ name, ...props }: ComponentProps<'svg'> & { name: 'up' | 'down' | 'left' | 'right' | 'diagonal' | 'instagram' | 'pin' | 'phone' | 'face' | 'spark' | 'eye' }) {
  const drawing = {
    up: <path d="M12 20V4m-6 6 6-6 6 6" />,
    down: <path d="M12 4v16m-6-6 6 6 6-6" />,
    left: <path d="M20 12H4m6-6-6 6 6 6" />,
    right: <path d="M4 12h16m-6-6 6 6-6 6" />,
    diagonal: <path d="M6 18 18 6M7 6h11v11" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <path d="M8 3H5a2 2 0 0 0-2 2c0 9 7 16 16 16a2 2 0 0 0 2-2v-3l-4.5-2-1.7 2a12 12 0 0 1-6.8-6.8L10 7.5 8 3Z" />,
    face: <><path d="M16.8 22c-.4-1.9-.2-3.3.1-4.1 2.6.1 3.6-.8 3.2-2.6l-.4-2.1 1.7-.6a.6.6 0 0 0 .2-1L19 8.7C18.3 4 15.1 2 11 2a7.5 7.5 0 0 0-7.7 7.3c0 3.8 3.1 6.4 3.1 9.8 0 1.1-.2 2-.6 2.9" /><path d="M14 9.8c.9-.5 1.7-.5 2.5 0" /></>,
    spark: <><path d="M11 2c0 5.6 3.4 9 9 9-5.6 0-9 3.4-9 9 0-5.6-3.4-9-9-9 5.6 0 9-3.4 9-9Z" /><path d="M19 14c0 2.5 1.5 4 4 4-2.5 0-4 1.5-4 4 0-2.5-1.5-4-4-4 2.5 0 4-1.5 4-4Z" /></>,
    eye: <><path d="M2 13c3-4 6.3-6 10-6s7 2 10 6c-3 4-6.3 6-10 6s-7-2-10-6Z" /><circle cx="12" cy="13" r="2.8" /><path d="M5 5.5c4.6-2.8 9.4-2.8 14 0" /></>,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{drawing[name]}</svg>;
}
