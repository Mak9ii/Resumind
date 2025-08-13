import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/putur";
import { useEffect, useState } from "react";
import { Link } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback about your resume" },
  ];
}

export default function Home() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const loaction = useLocation();
  const navigate = useNavigate();
  const { kv, isLoading, auth } = usePuterStore();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);

      setLoadingResumes(false);
    };
    loadResumes();
  }, []);
  return (
    <main className="bg-cover bg-[url('/images/bg-main.svg')]">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your resume & applications</h1>
          {!loadingResumes && resumes.length === 0 ? (
            <h2>No resumes found.Upload your first resume to get feedback</h2>
          ) : (
            <h2>review your submissions and check AI-powered feedback </h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume: Resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to={"/upload"}
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}{" "}
        {resumes?.length !== 0 && (
          <Link
            to={"/wipe"}
            className="primary-button w-fit text-xl font-semibold"
          >
            Delete Resumes
          </Link>
        )}
      </section>
    </main>
  );
}
