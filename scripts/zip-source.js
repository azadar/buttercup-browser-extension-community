import archiver from "archiver";
import { createWriteStream, mkdirSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

mkdirSync(resolve(rootDir, "release/firefox"), { recursive: true });

const output = createWriteStream(resolve(rootDir, "release/firefox/source.zip"));
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
    console.log(`Source zip created: ${archive.pointer()} bytes`);
});

archive.on("error", (err) => {
    throw err;
});

archive.pipe(output);

archive.glob("**/*", {
    cwd: rootDir,
    dot: true,
    ignore: [
        ".git/**",
        "node_modules/**",
        ".history/**",
        "dist/**",
        "release/**",
        "**/.DS_Store"
    ]
});

archive.finalize();
