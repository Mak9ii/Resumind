import { Link } from "react-router";
import { usePuterStore } from "~/lib/putur";
function Navbar() {
  const { auth } = usePuterStore();
  return (
    <div className="flex flex-row ">
      <nav className="navbar !p-4">
        <Link to="/">
          <p className="text-2xl font-bold text-graident max-sm:!text-sm">
            RESUMIND
          </p>
        </Link>
        <Link to="/upload" className="primary-button w-fit max-sm:!text-sm">
          Upload Rsume
        </Link>
      </nav>
      <button
        className="primary-button w-fit h-fit self-center mx-4 max-sm:!text-sm mx-2 "
        onClick={() => {
          auth.signOut();
          window.location.reload();
        }}
      >
        Log out
      </button>
    </div>
  );
}

export default Navbar;
