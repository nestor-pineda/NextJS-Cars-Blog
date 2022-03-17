import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header>
        <Link href="/">
          <a>
            <h1>
              <span>Top Cars</span>
              <span>Hotwheels</span>
            </h1>
            <h2>For car lovers</h2>
          </a>
        </Link>
      </header>

      <div className="page-content">{children}</div>

      <footer>
        <p>Copyright 2022 Néstor Pineda</p>
      </footer>
    </div>
  );
}
