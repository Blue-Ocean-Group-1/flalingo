import Navbar from '../Navbar';
import PropTypes from 'prop-types';
import ProgressSidebar from '../common/ProgressSidebar';

export default function DefaultPageLayout({ children }) {
  return (
    <div>
      <main className="max-w-8xl mx-auto">
        <section className="hidden lg:block fixed z-20 inset-0 right-auto w-[19rem] pb-10 px-6 overflow-y-auto ">
          <ProgressSidebar />
        </section>
        <section>
          <div className="lg:pl-[19rem]">
            <Navbar />
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

DefaultPageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
