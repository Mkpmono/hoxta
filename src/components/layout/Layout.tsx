import { Header } from "./Header";
import { Footer } from "./Footer";
import { WaveBackground } from "../ui/WaveBackground";

interface LayoutProps {
  children: React.ReactNode;
  showWaves?: boolean;
}

export function Layout({ children, showWaves = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {showWaves && <WaveBackground />}
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
