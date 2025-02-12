import { ReactNode } from 'react';
import './globals.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>CV-AI</title>
        <link rel="icon" href="logo.svg" type="image/x-icon" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );  
}

export default Layout;
