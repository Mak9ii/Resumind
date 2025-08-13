import { prepareInstructions } from "../../constants/index";
import React, { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pfd2img";
import { usePuterStore } from "~/lib/putur";
import { generateUUID } from "~/lib/utils";

export const meta = () => [
  { title: "Resumind | Upload" },
  { name: "description", content: "Upload your resume" },
];

function Upload() {
  const navigate = useNavigate();
  const { auth, isLoading, ai, fs, kv } = usePuterStore();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [file, setFile] = useState<File>(new File([], ""));
  const handleFileSelect = (file: File) => {
    setFile(file);
  };

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  const handleAnalyze = async ({
    jobTitle,
    jobDescription,
    companyName,
    file,
  }: {
    jobTitle: string;
    jobDescription: string;
    companyName: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) return setStatusText("ERROR: failed to upload file");

    setStatusText("converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusText("ERROR:faild to convert PDF to image");

    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("ERROR: failed to upload image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();

    const data = {
      id: uuid,
      jobDescription,
      jobTitle,
      companyName,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing...");
    try {
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription })
      );
      if (!feedback) return setStatusText("ERROR: Failed to analyze resume");

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;
      data.feedback = JSON.parse(feedbackText);
    } catch (err: unknown) {
      let errorMessage = "";
      if (typeof err === "object" && err !== null) {
        const { success, error } = err as unknown as {
          success: boolean;
          error: { delegate: string };
        };
        errorMessage = error.delegate;
      }
      if (errorMessage === "usage-limited-chat")
        return setStatusText(
          errorMessage + " " + "try creating another account in putur"
        );
    }

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete,redirecting...");

    navigate(`/resume/${uuid}`);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    handleAnalyze({
      jobTitle,
      jobDescription,
      companyName,
      file,
    });
  };
  return (
    <main className="bg-cover bg-[url('/images/bg-main.svg')]">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                className="w-100"
                alt="scaning"
              />
            </>
          ) : (
            <h2>
              Drop your resume for{" "}
              <abbr title="applicant tracking system">ATS</abbr> score and
              improvment tips
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <label htmlFor="company-name">Company name</label>
              <input type="text" name="company-name" id="company-name" />

              <label htmlFor="job-title">Job title</label>
              <input type="text" name="job-title" id="job-title" />

              <label htmlFor="job-description">Job-description</label>
              <textarea rows={5} name="job-description" id=""></textarea>

              <label htmlFor="uploader">Upload resume</label>
              <FileUploader onFileSelect={handleFileSelect} />
              <button className="primary-button" type="submit">
                Analyze resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default Upload;
