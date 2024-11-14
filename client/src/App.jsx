import {
  React,
  Router,
  Routes,
  Route,
  useAuth0,
  LoginButton,
  LogoutButton,
  ServerTest,
  useState,
  LoadingOverlay,
} from './imports';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { pageIsLoading, setPageIsLoading } = useState(true);

  return (
    <Router>
      {pageIsLoading && (
        <LoadingOverlay isLoading={isLoading || pageIsLoading} />
      )}
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center">
          <LoginButton />
        </div>
      ) : (
        <>
          <LogoutButton />
          <Routes>
            <Route path="/" element={<ServerTest />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
