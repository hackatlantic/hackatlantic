import { APPLICATION_URL } from "./components/landing/content";

export default function ApplyPage() {
  return (
    <main
      style={{
        fontFamily: "Fredoka, sans-serif",
        padding: "3rem",
        color: "#152b3a",
      }}
    >
      <h1>Applications are closed for 2026</h1>
      <p>Thanks for your interest in Hack Atlantic! Applications will reopen for our 2027 event.</p>
      <p><a href="/">Back to Hack Atlantic</a></p>
      <p>Already applied? <a href={APPLICATION_URL}>Open your applicant dashboard →</a></p>
    </main>
  );
}
