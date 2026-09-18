// Sinh bo icon (Android + cac nen tang khac) tu img/logo.png bang `tauri
// icon`. Duoc goi tu tauri.conf.json (beforeDevCommand / beforeBuildCommand)
// nen ca `npm run tauri dev` lan `npm run tauri android build` lan GitHub
// Actions deu tu chay — khong can commit src-tauri/icons/ vao git.
//
// Sau khi src-tauri/gen/android/ da ton tai (tu luc chay setup-android.yml
// mot lan), `tauri icon` se TU DONG cap nhat luon ca icon trong
// gen/android/app/src/main/res/mipmap-*/ moi lan chay — khong can copy tay.
// Truoc khi gen/android/ ton tai (lan chay dau tien), no chi sinh vao
// src-tauri/icons/ de `tauri android init` doc lai luc scaffold.
//
// Co cache: luu hash cua logo.png vao src-tauri/icons/.source-hash. Neu hash
// khong doi va cac file icon can thiet van con, script bo qua, khong chay lai.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "img", "logo.png");
const OUT_DIR = path.join(ROOT, "src-tauri", "icons");
const STAMP = path.join(OUT_DIR, ".source-hash");

// Vai file dai dien de xac nhan `tauri icon` da chay xong thanh cong — chi
// can vai file, khong can liet ke het (Android sinh rat nhieu mat do man
// hinh: mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi x thuong/round/foreground).
const REQUIRED_ICONS = [
  "128x128.png",
  path.join("android", "mipmap-xxxhdpi", "ic_launcher.png"),
];

function fail(message) {
  console.error(`[gen-icons] ${message}`);
  process.exit(1);
}

function hashFile(filePath) {
  const bytes = fs.readFileSync(filePath);
  return createHash("sha256").update(bytes).digest("hex");
}

function readStamp() {
  try {
    return fs.readFileSync(STAMP, "utf8").trim();
  } catch {
    return null;
  }
}

function allIconsPresent() {
  return REQUIRED_ICONS.every((name) => fs.existsSync(path.join(OUT_DIR, name)));
}

function runTauriIcon() {
  // Windows khong cho spawn thang file .cmd/.bat (npx.cmd) neu khong bat
  // shell:true — xem gen-icons.mjs cua pydinary-app de biet chi tiet loi
  // EINVAL gap phai. Bat shell:true luon cho dong nhat (an toan tren ca
  // Linux runner cua GitHub Actions, noi script nay chay that).
  const quote = (value) =>
    process.platform === "win32" ? `"${value}"` : `'${value}'`;

  execFileSync("npx", ["tauri", "icon", quote(SOURCE), "--output", quote(OUT_DIR)], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    fail(
      "khong tim thay img/logo.png.\n" +
        "Dat logo (PNG vuong, nen 1024x1024, co alpha) vao img/logo.png roi chay lai."
    );
  }

  const currentHash = hashFile(SOURCE);

  if (currentHash === readStamp() && allIconsPresent()) {
    console.log("[gen-icons] icon da co va logo khong doi — bo qua.");
    return;
  }

  console.log("[gen-icons] dang sinh icon tu img/logo.png ...");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  try {
    runTauriIcon();
  } catch (error) {
    fail(`chay \`tauri icon\` that bai: ${error.message}`);
  }

  const missing = REQUIRED_ICONS.filter(
    (name) => !fs.existsSync(path.join(OUT_DIR, name))
  );

  if (missing.length > 0) {
    fail(
      `\`tauri icon\` chay xong nhung thieu file: ${missing.join(", ")}.\n` +
        "Kiem tra lai img/logo.png co dung la PNG vuong khong."
    );
  }

  fs.writeFileSync(STAMP, `${currentHash}\n`, "utf8");
  console.log(`[gen-icons] xong — ${OUT_DIR}`);
}

main();
