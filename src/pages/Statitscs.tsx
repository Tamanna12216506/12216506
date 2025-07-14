import React, { useState } from "react";
import { log } from "../utils/logginMiddleware";

type Input = {
  longUrl: string;
  validity: string;
  shortcode: string;
};

function generateRandomShortcode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function Home() {
  const [inputList, setInputList] = useState<Input[]>([
    { longUrl: "", validity: "", shortcode: "" }
  ]);
  const [shortenedLinks, setShortenedLinks] = useState<any[]>([]);
  const [clickStats, setClickStats] = useState<Record<string, any[]>>({});

  const updateField = (index: number, field: keyof Input, value: string) => {
    const updated = [...inputList];
    updated[index][field] = value;
    setInputList(updated);
  };

  const submitLinks = async () => {
    for (let item of inputList) {
      if (!item.longUrl.trim()) continue;

      const urlCheck = /^https?:\/\/.+/i;
      if (!urlCheck.test(item.longUrl)) {
        await log("frontend", "error", "input", `Invalid URL: ${item.longUrl}`);
        continue;
      }

      let shortcode = item.shortcode?.trim() || generateRandomShortcode();
      const exists = shortenedLinks.some((link) => link.shortcode === shortcode);
      if (exists) {
        await log("frontend", "warn", "shortener", `Shortcode already in use: ${shortcode}`);
        continue;
      }

      const minutes = item.validity ? parseInt(item.validity) : 30;
      const expiresAt = new Date(Date.now() + minutes * 60000).toISOString();
      const createdAt = new Date().toISOString();

      const shortened = {
        original: item.longUrl,
        shortcode,
        expiresAt,
        createdAt
      };

      setShortenedLinks((prev) => [...prev, shortened]);

      await log("frontend", "info", "shortener", `Shortened ${item.longUrl} to ${shortcode}`);
    }
  };

  const handleClick = (link: any) => {
    const timestamp = new Date().toISOString();
    const referrer = document.referrer || "Direct";
    const location = "India"; // Simulated
    const code = link.shortcode;

    const newClick = {
      timestamp,
      referrer,
      location
    };

    setClickStats((prev) => {
      const updated = { ...prev };
      if (!updated[code]) {
        updated[code] = [];
      }
      updated[code].push(newClick);
      return updated;
    });

    window.open(link.original, "_blank");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h1>URL Shortener</h1>

      {inputList.map((entry, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Original URL"
            value={entry.longUrl}
            onChange={(e) => updateField(i, "longUrl", e.target.value)}
            style={{ width: "250px", marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Validity (minutes)"
            value={entry.validity}
            onChange={(e) => updateField(i, "validity", e.target.value)}
            style={{ width: "150px", marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Custom Code"
            value={entry.shortcode}
            onChange={(e) => updateField(i, "shortcode", e.target.value)}
            style={{ width: "150px" }}
          />
        </div>
      ))}

      <button onClick={submitLinks}>Generate Short URLs</button>
      <button
        style={{ marginLeft: "10px" }}
        onClick={() =>
          setInputList((prev) => [
            ...prev,
            { longUrl: "", validity: "", shortcode: "" }
          ])
        }
      >
        Add More
      </button>

      <div style={{ marginTop: "30px" }}>
        {shortenedLinks.map((link, idx) => (
          <div key={idx} style={{ marginBottom: "25px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <p>
              <strong>Short URL:</strong>{" "}
              <a href="#" onClick={() => handleClick(link)}>
                http://localhost:3000/{link.shortcode}
              </a>
            </p>
            <p><strong>Original URL:</strong> {link.original}</p>
            <p><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
            <p><strong>Expires At:</strong> {new Date(link.expiresAt).toLocaleString()}</p>
            <p><strong>Click Count:</strong> {clickStats[link.shortcode]?.length || 0}</p>

            {clickStats[link.shortcode]?.map((click, cIdx) => (
              <div key={cIdx} style={{ paddingLeft: "20px", fontSize: "14px" }}>
                🔸 <strong>Time:</strong> {new Date(click.timestamp).toLocaleString()}<br />
                🔸 <strong>Referrer:</strong> {click.referrer}<br />
                🔸 <strong>Location:</strong> {click.location}
                <hr />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
