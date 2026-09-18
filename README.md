# Pydinary APK (Android, Tauri)

Bản Android của [Pydinary – Music Player](https://github.com/vinhdubaii/pydinary-web),
đóng gói bằng Tauri v2. Repo song song với
[pydinary-app](https://github.com/vinhdubaii/pydinary-app) (bản Windows) —
cùng triết lý: **không chứa và không clone** source của pydinary-web. App
load thẳng `https://pydinary.pages.dev/`, y hệt việc mở link đó trên trình
duyệt điện thoại, chỉ là đóng gói thành 1 app riêng, có icon riêng.

## Khác gì so với bản Windows (pydinary-app)?

Android không có khái niệm "cửa sổ desktop", nên các phần sau **không tồn
tại** ở repo này:

- Titlebar tự vẽ (3 nút minimize/maximize/close), F11 fullscreen, khoá kích
  thước cửa sổ — Android luôn chạy toàn màn hình sẵn, không có gì để "khoá".
- Auto-updater (`tauri-plugin-updater`) — **Google Play cấm app tự tải và
  tự cài đè lên chính nó**, kể cả khi không đăng lên Play Store. Plugin này
  chính thức không hỗ trợ Android. App phát hành qua file `.apk` đính vào
  GitHub Release — người dùng tự vào trang Release tải bản mới khi cần,
  không có cơ chế tự động.

## Cấu trúc

```
scripts/gen-icons.mjs     Gọi `tauri icon` sinh icon (kể cả Android mipmap-*)
img/logo.png              Logo nguồn (PNG vuông) để sinh bộ icon
src-tauri/
  src/lib.rs              Entry point dùng chung — bắt buộc cho Android (JNI
                            gọi thẳng run() qua #[tauri::mobile_entry_point])
  src/main.rs             Chỉ gọi lib::run() — giữ cấu trúc chuẩn Tauri mobile
  tauri.conf.json          url trỏ thẳng pydinary.pages.dev, không window
                            chrome, không plugin updater
  capabilities/default.json  Quyền tối thiểu (core:default) — không cần quyền
                              điều khiển cửa sổ như bản Windows
  gen/android/             Project Kotlin/Gradle thật — xem mục dưới, ĐƯỢC
                            COMMIT vào git (khác mọi thứ khác trong repo)
.github/workflows/
  setup-android.yml        Chạy THỦ CÔNG 1 lần duy nhất — sinh gen/android/
  release.yml               Chạy khi push tag vX.Y.Z — build .apk đã ký,
                            đính vào draft release
```

## Setup Android — chạy 1 lần duy nhất

`src-tauri/gen/android/` là project Android/Gradle thật do lệnh
`tauri android init` sinh ra — nơi cấu hình chữ ký release sống. Khác với
`src-tauri/icons/` hay web content (sinh lại mỗi lần, không commit), thư mục
này **phải được commit vào git** và giữ nguyên qua các lần build sau, không
sinh lại từ đầu mỗi lần — nếu không, cấu hình chữ ký sẽ mất theo.

Vì lệnh `tauri android init` cần Android SDK/NDK/Gradle thật để chạy, việc
này được làm trong CI, không cần cài gì trên máy bạn:

1. Vào repo trên GitHub → tab **Actions** → chọn workflow **setup-android**
   → bấm **Run workflow**.
2. Chờ chạy xong (vài phút) — nó tự cài SDK/NDK/Java, chạy `tauri android
   init`, rồi tự commit `src-tauri/gen/android/` thẳng vào repo.
3. **Kiểm tra 1 việc còn lại** (không tự động hoá được, vì mình không có
   môi trường Android thật để xác nhận trước): mở file
   `src-tauri/gen/android/app/build.gradle.kts` vừa được commit, tìm khối
   `signingConfigs { ... }`. Nếu **đã có sẵn** một khối đọc từ
   `keystore.properties` — không cần làm gì thêm, bỏ qua bước này. Nếu
   **chưa có**, làm theo đúng hướng dẫn chính thức của Tauri tại
   <https://v2.tauri.app/distribute/sign/android/> (mục "Configure Gradle
   to use the signing key") để thêm khối đó vào, rồi commit lại — dán nguyên
   đoạn code mẫu trong trang đó là đủ.

Chỉ cần làm 1 lần. Sau đó `release.yml` dùng lại y nguyên project đã commit
mỗi lần có tag mới.

## Bắt buộc trước khi tag lần đầu: 3 GitHub Secret ký APK

Vào **Settings → Secrets and variables → Actions → New repository secret**,
tạo:

- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`
- `ANDROID_KEY_BASE64` — nội dung base64 của file keystore

Đây là keystore Android thật (khác hoàn toàn với key ký update bên
pydinary-app — 2 cơ chế ký độc lập nhau). **Giữ bản gốc thật kỹ**: mất
keystore này thì không bao giờ phát hành được bản cập nhật hợp lệ cho
người dùng cũ nữa (Android coi app ký bằng key khác là 1 app hoàn toàn
khác, không cho cài đè lên bản cũ).

## Phát hành bản mới

```bash
git tag v1.0.0
git push origin v1.0.0
```

`release.yml` tự build, ký, và đính file `.apk` (dạng "universal" — 1 file
chạy được trên mọi kiến trúc CPU) vào 1 **draft release** mới — bạn tự viết
release note rồi bấm **Publish** như bên pydinary-app.

## Cài trên điện thoại

Vì không phát hành qua Google Play, máy Android sẽ tự hiện cảnh báo
"nguồn không xác định" / Play Protect khi cài file `.apk` tải từ GitHub —
đây là hành vi mặc định của Android với mọi app cài ngoài Play Store, người
dùng cần bấm "Cài đặt dù sao" / cho phép cài từ nguồn này.
