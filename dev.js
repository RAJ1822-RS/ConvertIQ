import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const isWin = process.platform === "win32";

const children = [];

function launch(command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: isWin,
    cwd: root
  });
  children.push(child);
  return child;
}

const api = launch("node", ["server/index.js"]);
const web = launch("npm", ["run", "dev"]);

function shutdown(signal) {
  console.log(`\nStopping ConvertIQ (${signal})...`);

  for (const child of children) {
    try {
      if (isWin) {
        spawn("taskkill", [
          "/pid",
          String(child.pid),
          "/T",
          "/F"
        ]);
      } else {
        child.kill("SIGTERM");
      }
    } catch {
      // ignore kill errors
    }
  }

  setTimeout(() => process.exit(0), 400);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

api.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(
      `ConvertIQ API exited with code ${code}. Check that port 5000 is free.`
    );
  }
});