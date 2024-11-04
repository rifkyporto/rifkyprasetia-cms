import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
      <p>
        Powered by{" "}
        <a
          href="https://localdiskzha.com"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          localdiskzha
        </a>
      </p>
    </footer>
  )
}

export default Footer;
