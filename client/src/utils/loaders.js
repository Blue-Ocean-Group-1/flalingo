import { redirect } from 'react-router-dom';

const redirectIfNoUser = () => {
  const user = false;
  if (!user) {
    return redirect('/');
  }
  return null;
};

export { redirectIfNoUser };
