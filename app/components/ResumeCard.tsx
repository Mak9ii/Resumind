import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import "/images/resume_01.png?url";
import { usePuterStore } from "~/lib/putur";

function ResumeCard({
  resume: { id, jobTitle, companyName, feedback, imagePath, resumePath },
}: {
  resume: Resume;
}) {
  const [resumeUrl, setRumesUrl] = useState("");
  const { fs } = usePuterStore();
  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setRumesUrl(url);
    };
    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card flex animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2 ">
          {companyName && (
            <h2 className="text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && <h3 className="text-lg  text-gray-500">{jobTitle}</h3>}
          {!jobTitle && !companyName && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className=" gradient-border animate-in fade-in duration-1000">
          <div className=" w-full h-full ">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[300px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
}

export default ResumeCard;
