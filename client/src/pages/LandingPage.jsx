import { LoginButton, LogoutButton } from '../imports';

export default function LandingPage() {
  return (
    <div>
      <div className="flex gap-2">
        <LoginButton />
        <LogoutButton />
      </div>
      Landing Page
    </div>
  );
}
