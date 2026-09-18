// Entry point cho desktop — repo nay khong build/phat hanh ban desktop
// (xem pydinary-app cho ban Windows), nhung `tauri android init` va cac
// lenh CLI khac mong doi cau truc chuan main.rs + lib.rs ton tai san, nen
// giu file nay du chi la 1 dong goi lai run() trong lib.rs.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    pydinary_apk_lib::run();
}
