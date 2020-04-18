use std::fs::File;

use brs::{ WriteData, write_save };
use wasm_bindgen::prelude::*;
use serde_wasm_bindgen;

// Writing

/// Write a save file from js call.
#[wasm_bindgen]
pub fn write_save_from_js(w: JsValue) -> JsValue {
    let mut file: Vec<u8> = Vec::new();
    let data: WriteData = serde_wasm_bindgen::from_value(w).unwrap();

    let _ = match write_save(&mut file, &data) {
        Ok(()) => (),
        Err(e) => return JsValue::from_str(&e.to_string()),
    };

    match serde_wasm_bindgen::to_value(&file) {
        Ok(d) => d,
        Err(e) => JsValue::from_str(&e.to_string()),
    }
}

// Write a save file and immediately save to file.
#[wasm_bindgen]
pub fn write_save_from_js_to_file(w: JsValue, f: JsValue) -> JsValue {
    let path: String = serde_wasm_bindgen::from_value(f).unwrap();
    let mut file = File::open(path).unwrap();

    let data: WriteData = serde_wasm_bindgen::from_value(w).unwrap();
    let _ = match write_save(&mut file, &data) {
        Ok(()) => (),
        Err(e) => return JsValue::from_str(&e.to_string()),
    };

    JsValue::from_bool(true)
}

// Reading

/// Read a save file from js call.
#[wasm_bindgen]
pub fn read_save_from_js(w: JsValue) -> JsValue {
    let data: Vec<u8> = serde_wasm_bindgen::from_value(w).unwrap();
    let reader = brs::Reader::new(&data[..]).unwrap();
    let data = reader.read_header1().unwrap().read_header2().unwrap().into_write_data().unwrap();

    match serde_wasm_bindgen::to_value(&data) {
        Ok(d) => d,
        Err(e) => JsValue::from_str(&e.to_string()),
    }
}

/// Read a save file from file.
#[wasm_bindgen]
pub fn read_save_from_js_from_file(f: JsValue) -> JsValue {
    let path: String = serde_wasm_bindgen::from_value(f).unwrap();
    let file = File::open(path).unwrap();
    let reader = brs::Reader::new(file).unwrap();
    let data = reader.read_header1().unwrap().read_header2().unwrap().into_write_data().unwrap();

    match serde_wasm_bindgen::to_value(&data) {
        Ok(d) => d,
        Err(e) => JsValue::from_str(&e.to_string()),
    }
}