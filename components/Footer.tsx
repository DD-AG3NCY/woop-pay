export default function Footer() {
  const ALEX_HANDLE = "alerex_eth";
  const ALEX_LINK = `https://twitter.com/${ALEX_HANDLE}`;
  return (
    <footer className="flex justify-center mt-20">
      <p className="text-lg">
        Built with 💗 and ☕ by{" "}
        <a
          className="font-semibold hover:underline"
          target="_blank"
          rel="noreferrer"
          href={ALEX_LINK}
        >
          @alerex {"  "}
        </a>
      </p>
    </footer>
  );
}
