import { Link } from 'react-router-dom';

export default function Brand() {
  return (
    <Link to="/dashboard">
      <span className="inline-flex gap-2 items-center h-10">
        <img
          className="h-10 w-10 object-cover"
          src="/PolyGlot_Globe.png"
          alt="placeholder"
        />
        <h1 className="hidden sm:block text-jet text-3xl font-bold">
          PolyGlot
        </h1>
      </span>
    </Link>
  );
}
