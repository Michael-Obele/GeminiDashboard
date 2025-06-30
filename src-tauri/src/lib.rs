use tauri::command;
use tauri_plugin_store::StoreBuilder;
use tauri_plugin_shell::{ShellExt, process::CommandEvent};

#[command]
async fn execute_gemini(app: tauri::AppHandle, args: Vec<String>) -> Result<String, String> {
    let path = std::path::PathBuf::from(".settings.dat");
    let store = StoreBuilder::new(&app, path).build().map_err(|e| e.to_string())?;

    let cli_path = match store.get("cliPath") {
        Some(path) if !path.is_null() => path.as_str().unwrap_or("gemini").to_string(),
        _ => "gemini".to_string(),
    };

    println!("Using Gemini CLI path: {}", cli_path);
    println!("Executing with args: {:?}", args);

    let shell = app.shell();
    let (mut rx, _child) = shell
        .command(cli_path)
        .args(&args)
        .spawn()
        .map_err(|e| {
            println!("Error spawning command: {}", e);
            e.to_string()
        })?;

    let mut output = String::new();
    let mut error_output = String::new();

    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stdout(bytes) => {
                let line = String::from_utf8_lossy(&bytes).to_string();
                println!("STDOUT: {}", line);
                output.push_str(&line);
            },
            CommandEvent::Stderr(bytes) => {
                let line = String::from_utf8_lossy(&bytes).to_string();
                println!("STDERR: {}", line);
                error_output.push_str(&line);
            },
            _ => {}
        }
    }

    if !error_output.is_empty() {
        println!("Command finished with error.");
        Err(error_output)
    } else {
        println!("Command finished successfully.");
        Ok(output)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![execute_gemini])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
