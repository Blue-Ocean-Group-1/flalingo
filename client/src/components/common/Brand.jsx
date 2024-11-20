import { Link } from 'react-router-dom';

// TODO: Add icon
export default function Brand() {
  return (
    <Link to="/dashboard">
      <span className="inline-flex gap-2 items-center">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
          className="h-8 w-auto"
        />
        <h1 className="text-xl font-bold">PolyGlot</h1>
      </span>
    </Link>
  );
}
