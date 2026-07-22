import { spawnSync } from "bun";
import { readdirSync, rmSync, mkdirSync } from "fs";
import { join } from "path";

const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");

const ROOT = import.meta.dir + "/..";
const ARTIFACTS_DIR = join(ROOT, "artifacts");
const PIPE = ["pipe", "pipe", "pipe"] as const;
const INHERIT = ["inherit", "inherit", "inherit"] as const;

// Step 1: Build
if (!skipBuild) {
	console.log("🔨 Building canary...");
	const result = spawnSync(["bun", "run", "build:canary"], {
		cwd: ROOT,
		stdio: INHERIT,
	});
	if (result.exitCode !== 0) {
		console.error("❌ Build failed");
		process.exit(1);
	}
	console.log("");
}

// Step 2: Find the Setup tar.gz
const setupFile = readdirSync(ARTIFACTS_DIR).find(
	(f) => f.includes("Setup") && f.endsWith(".tar.gz"),
);
if (!setupFile) {
	console.error("❌ No Setup.tar.gz found in artifacts/");
	process.exit(1);
}
console.log(`📦 Found artifact: ${setupFile}`);

// Step 3: Extract to temp directory
const tmpDir = `/tmp/electrobun-deploy-${Date.now()}`;
const setupPath = join(ARTIFACTS_DIR, setupFile);

mkdirSync(tmpDir, { recursive: true });
console.log(`📂 Extracting to ${tmpDir}...`);
const extractResult = spawnSync(
	["tar", "xzf", setupPath, "-C", tmpDir],
	{ cwd: ROOT, stdio: INHERIT },
);
if (extractResult.exitCode !== 0) {
	console.error("❌ Extraction failed");
	cleanup(tmpDir);
	process.exit(1);
}
console.log("");

// Step 4: Run installer
const installerPath = join(tmpDir, "installer");
console.log("🚀 Running installer...");
const installResult = spawnSync([installerPath], {
	cwd: tmpDir,
	stdio: INHERIT,
});
if (installResult.exitCode !== 0) {
	console.error("❌ Installer failed");
	cleanup(tmpDir);
	process.exit(1);
}
console.log("");

// Step 5: Cleanup
cleanup(tmpDir);

// Step 6: Done
const appDir = join(
	process.env.HOME ?? "~",
	".local/share/myenglishankier.electrobun.dev/canary/app",
);
console.log(`✅ Installed to: ${appDir}`);
console.log(`▶️  Run: ${join(appDir, "bin/launcher")}`);

function cleanup(dir: string) {
	try {
		rmSync(dir, { recursive: true, force: true });
		console.log(`🧹 Cleaned up ${dir}`);
	} catch {}
}
