import Navbar from '../Navbar';

export default function DefaultPageLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        <section className="hidden lg:block fixed z-20 inset-0 top-[3rem] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto bg-slate-700">
          {/* Sidebar content */}
        </section>
        <section className="lg:pl-[19.5rem]">{children}</section>
      </main>
    </div>
  );
}
