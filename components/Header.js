import React from 'react';
import Link from 'next/link';

function Header() {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">ImmortalSEO</div>
          {/* <nav>
            <Link href="/">Home</Link>
            <Link href="/about-llms-txt">About LLMs.txt</Link>
            <Link href="/docs">Documentation</Link>
            <Link href="/token-analytics">Token Analytics</Link>
          </nav> */}
        </div>
      </div>
    </header>
  );
}

export default Header;