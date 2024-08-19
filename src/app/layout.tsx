import { ReactNode } from 'react';
import './globals.css';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>CV AI</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
