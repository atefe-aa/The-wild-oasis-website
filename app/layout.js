import Logo from "./_components/Logo";
import Navigation from "./_components/Navigation";

export const metadata = {
  title: "The wild oasis",
  description: "The way to see cabins",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Logo />
          <Navigation />
        </header>
        <main>{children}</main>
        <footer>Copyright by wild oasis</footer>
      </body>
    </html>
  );
}
