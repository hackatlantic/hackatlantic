import { useEffect } from "react";
import { APPLICATION_URL } from "./components/landing/content";

export default function ApplyPage() {
  useEffect(() => {
    window.location.replace(APPLICATION_URL);
  }, []);
  return (
    <main
      style={{
        fontFamily: "Fredoka, sans-serif",
        padding: "3rem",
        color: "#152b3a",
      }}
    >
      <h1>Applications are open</h1>
      <p>Taking you to the Hack Atlantic application portal.</p>
      <a href={APPLICATION_URL}>Continue to your application →</a>
    </main>
  );
}
