import { Outlet } from 'react-router-dom';

/**
 * Layout for authentication pages, providing a centered form area.
 *
 * @returns {JSX.Element} The rendered authentication layout.
 */
function AuthLayout() {

  return (
    <main
      className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-slate-200 flex flex-col items-center justify-center px-4 py-8"
      aria-labelledby="auth-title"
    >
      <header className="w-full max-w-md mb-8">
        <h1
          id="auth-title"
          tabIndex={-1}
          className="w-full break-words !text-3xl md:!text-4xl font-extrabold text-center outline-none text-black"
        >
          Authentification
        </h1>
      </header>
      <section
        className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-6 md:p-10 flex items-center justify-center transition-all"
        aria-label="Zone de connexion"
      >
        <div className="w-full d-flex justify-center">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
