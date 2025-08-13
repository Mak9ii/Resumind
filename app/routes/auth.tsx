import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/putur";
export const meta = () => [
  { title: "Resumind | auth" },
  { name: "description", content: "Log into your account" },
];
function auth() {
  const loaction = useLocation();
  const nextLoaction = loaction.search.split("next=")[1];
  const navigate = useNavigate();
  const { isLoading, auth } = usePuterStore();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(nextLoaction);
  }, [auth.isAuthenticated, nextLoaction]);
  return (
    <main className="flex items-center justify-center bg-cover bg-[url('/images/bg-main.svg')">
      <div className="graident-borader shadow-lg ">
        <section className="flex flex-col gap-8 bg-white p-10 rounded-2xl">
          <div className="flex flex-col items-center gap-2  text-center">
            <h1>Welcome</h1>
            <h2>Log in to continue your job journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    <p>Log out </p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    <p>Log in</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default auth;
