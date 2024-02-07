import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="p-4 sm:px-8 lg:px-44">
        <div className="mx-auto max-2-3x1 space-y-20">{children}</div>
      </main>
    </div>
  );
};
