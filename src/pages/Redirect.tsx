import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { log } from "../utils/logginMiddleware";

function Redirect() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToOriginal = async () => {
      if (!shortcode) return;

      try {
        const response = await fetch(`http://localhost:5000/api/resolve/${shortcode}`);
        const data = await response.json();

        if (response.ok && data.originalUrl) {
          await log("frontend", "info", "redirect", `Redirecting ${shortcode} to ${data.originalUrl}`);
          window.location.href = data.originalUrl;
        } else {
          await log("frontend", "error", "redirect", `Shortcode not found: ${shortcode}`);
          navigate("/notfound");
        }
      } catch (err) {
        await log("frontend", "fatal", "redirect", "Server error during redirect");
        navigate("/notfound");
      }
    };

    redirectToOriginal();
  }, [shortcode, navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Redirecting...</h2>
      <p>If you're not redirected in a moment, please check the URL.</p>
    </div>
  );
}

export default Redirect;
