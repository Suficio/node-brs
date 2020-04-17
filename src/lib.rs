use std::io::Result;

use brs::{ WriteData, write_save };
use wasm_bindgen::prelude::*;

// Writing

/// Write a save file from js call.
#[wasm_bindgen]
pub fn write_save_from_js(w: &JsValue) -> JsValue {
    let mut file: Vec<u8> = Vec::new();
    let data: WriteData = w.into_serde().unwrap();

    let _ = match write_save(&mut file, &data) {
        Ok(()) => (),
        Err(e) => return JsValue::from_str(&e.to_string()),
    };

    match JsValue::from_serde(&file) {
        Ok(d) => d,
        Err(e) => JsValue::from_str(&e.to_string()),
    }
}

// Reading

/// Read a save file from js call.
#[wasm_bindgen]
pub fn read_save_from_js(w: &JsValue) -> JsValue {
    let data: Vec<u8> = w.into_serde().unwrap();
    let data = read_save(&data[..]).unwrap();
    JsValue::from_serde(&data).unwrap()
}

fn read_save(w: &[u8]) -> Result<WriteData> {
    let reader = brs::Reader::new(&w[..])?;
    let header1 = reader.read_header1()?;
    let header2 = header1.read_header2()?;
    
    header2.into_write_data() // <3
}