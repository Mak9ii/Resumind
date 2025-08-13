import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "../lib/putur";
import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind | wipe" },
    { name: "description", content: "Clear your storage" },
  ];
}
const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="flex flex-col bg-[url('/images/bg-small.svg')] bg-cover items-center justify-center gap-2 self-center h-[100dvh]">
      <h2>Authenticated as: {auth.user?.username}</h2>
      <div className="font-semibold">Existing files:</div>
      <div className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.id} className="flex flex-row flex-wrap">
            <p>{files.indexOf(file) + 1}-</p>
            <p>{file.name}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => {
            handleDelete();
            navigate("/");
          }}
        >
          Wipe App Data
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WipeApp;
