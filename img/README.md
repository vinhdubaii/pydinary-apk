# img/

Chua asset nguon cua app (khong phai asset cua web).

- `logo.png` — logo nguon de sinh toan bo icon Android (mipmap-*, cac mat do
  man hinh khac nhau). Nen la PNG **vuong 1024x1024**, co alpha (nen trong
  suot). `scripts/gen-icons.mjs` doc file nay va sinh ra `src-tauri/icons/`
  (roi tu dong duoc `tauri icon` copy tiep vao
  `src-tauri/gen/android/app/src/main/res/mipmap-*/` sau khi project Android
  da duoc scaffold).

Neu muon dung chung branding voi pydinary-app (ban Windows):

```bash
curl -o img/logo.png https://raw.githubusercontent.com/vinhdubaii/pydinary-app/main/img/logo.png
```

(hoac copy thang file logo.png tu repo pydinary-app neu ban da co san).
