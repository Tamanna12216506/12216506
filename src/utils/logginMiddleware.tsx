const LOG_API_URL = "http://20.244.56.144/evaluation-service/log";

let accessToken: string = "";

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export const log = async (
  stack: string,
  level: LogLevel,
  logPackage: string,
  message: string
): Promise<void> => {
  if (!accessToken) {
    return;
  }
  try {
    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: logPackage,
        message
      })
    });
    if (!res.ok) {
      console.error("Log failed:", res.status);
    }
  } catch (err) {
    console.error("Log error:", err);
  }
};
