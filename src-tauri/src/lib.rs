// Entry point dung chung cho Tauri mobile: Android goi thang vao run() qua
// JNI nho macro #[tauri::mobile_entry_point], main.rs (desktop) cung goi
// lai chinh ham nay. Day la cau truc bat buoc cua Tauri khi project co
// muc tieu mobile — khac voi pydinary-app (chi build Windows) chi co
// main.rs, khong co lib.rs.
//
// App khong co custom command/plugin nao ca — cua so chi load thang
// https://pydinary.pages.dev/ (khai trong tauri.conf.json), giong dung
// tinh than "khong dong goi source cua web" cua pydinary-app. Khac voi
// ban Windows, o day KHONG co:
//   - Titlebar tu ve / F11 fullscreen / khoa kich thuoc cua so — Android
//     khong co khai niem cua so desktop, luon toan man hinh san.
//   - tauri-plugin-updater — Google Play cam app tu tai/cai de chinh no
//     (chinh sach chong tu cap nhat ngoai Play Store). App nay phat hanh
//     qua file .apk dinh vao GitHub Release, nguoi dung tu tai ban moi khi
//     can, khong co co che tu dong kiem tra/cai.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("loi khi khoi dong Pydinary");
}
