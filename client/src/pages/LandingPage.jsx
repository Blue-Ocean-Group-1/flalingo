import { LoginButton, SignupButton } from '../imports';
import world_landmarks_main from '../../public/world_landmarks_main.png';
import PolyGlot_Globe from '../../public/PolyGlot_Globe.png';

export default function LandingPage() {
  return (
    <div>
      <div>
        <img
          className="size-1/12 ml-24"
          src={PolyGlot_Globe}
          alt="placeholder"
        />
      </div>
      <div className="flex justify-center relative">
        <img
          className="size-9/12 rounded-3xl ring-4 ring-offset-4 ring-offset-zinc-800 ring-argentBlue "
          src={world_landmarks_main}
          alt="world landmarks"
        />
        <p className="absolute top-1/2">this is a child</p>
      </div>
      <div className="flex gap-2 mt-6 justify-center">
        <LoginButton />
        <SignupButton />
      </div>
    </div>
  );
}
