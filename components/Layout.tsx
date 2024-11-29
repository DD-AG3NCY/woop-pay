import React from "react";
import Header from "./Heading";
import Footer from './Footer';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <article className="h-screen w-full flex justify-center items-center bg-gradient-to-tr to-[#268ec8] from-[#06225c]">
        <section className="h-screen w-full absolute top-0 z-0 bg-repeat bg-[url('/double-bubble-dark.webp')] bg-blend-hard-light bg-[length:350px] opacity-20"></section>

        <Container maxWidth="sm" className="w-full z-10">
          <Box
            component="form"
            className="p-2 rounded-3xl shadow-md w-full bg-gradient-to-tr to-[#4f4ce3] from-[#1082b2] border border-[rgba(33,35,167,0.5)]"
          >
            {children}
          </Box>
        </Container>
      </article>
      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </>
  );
}
