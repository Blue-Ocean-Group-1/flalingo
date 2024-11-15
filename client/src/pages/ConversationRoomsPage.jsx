import Navbar from '../components/Navbar';
import DefaultPageLayout from '../components/layout/DefaultPageLayout';

const FAKE_ROOMS = [];

const FAKE_USER_ROOMS = [];
export default function ConversationRoomsPage() {
  return (
    <DefaultPageLayout>
      <section className="max-w-4xl sm:mx-auto p-3">
        <h1>Your Language(s)</h1>
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-2">
          <RoomsCard />
          <RoomsCard />
          <RoomsCard />
          <RoomsCard />
          <RoomsCard />
          <RoomsCard />
        </div>
      </section>
    </DefaultPageLayout>
  );
}

function RoomsCardSection({ rooms }) {}

function RoomsCard() {
  return (
    <div className="w-full bg-slate-50 rounded-md">
      <img
        className="min-h-16 max-w-20 m-3 bg-slate-300"
        src=""
        alt="flag-img"
      />
    </div>
  );
}
