import React from 'react';
import Footer from './Footer';
import Header from './Heading';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      className="
        min-h-screen flex flex-col relative
        bg-primary-gradient
      "
    >
      {/* Background Image */}
      <div
        className="
          absolute inset-0 z-0 opacity-20
          bg-repeat bg-[url('/double-bubble-dark.webp')]
          bg-[length:350px] bg-blend-hard-light
        "
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />

        <main className="flex-grow flex justify-center items-center">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
