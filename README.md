# GoEPServer 🚀

**GoEPServer** is a powerful, modern web-based file server and penetration testing toolkit with an integrated comprehensive reverse shell generator. Built with Go and featuring a sleek, theme-aware web interface.

## ✨ Features

### 🔧 **Core Functionality**
- **File Upload/Download**: Drag & drop web interface with CLI support
- **Tool Management**: Organize penetration testing tools by platform and category
- **Web Interface**: Clean, responsive design with light/dark theme support
- **Command Line Integration**: Upload files via curl, PowerShell, or web interface

### 🛡️ **Reverse Shell Generator**
- **Comprehensive Collection**: 200+ reverse/bind shells and MSFVenom payloads
- **Multiple Categories**: Reverse shells, bind shells, MSFVenom, and HoaxShell
- **Advanced Features**: 
  - OS filtering (Linux, Windows, macOS)
  - Search functionality
  - Shell type selection (bash, cmd, powershell, etc.)
  - Encoding options (URL, Base64, etc.)
  - One-click copy to clipboard
  - Syntax highlighting with Prism.js
- **Credit to 0dayCTF**: Based on the [0dayCTF reverse shell generator](https://github.com/0dayCTF/reverse-shell-generator)

### 🎨 **Modern UI**
- **Theme Support**: Automatic light/dark mode with smooth transitions
- **Syntax Highlighting**: Code blocks with proper language detection
- **Expandable Cards**: Collapsible shell categories for better organization
- **Real-time Updates**: Dynamic IP/port detection from browser location

### 📦 **Deployment**
- **Standalone Binary**: All web assets embedded, no external dependencies
- **Cross-Platform**: Support for Linux, Windows, and macOS
- **Portable**: Static linking, works on any system without glibc dependencies
- **Lightweight**: ~8MB binary size with full functionality

## 🚀 Quick Start

### Option 1: Download Pre-built Binary
```bash
# Download the latest release for your platform
wget https://github.com/jameel3reef/goepserver/releases/latest/download/goepserver-linux-amd64
chmod +x goepserver-linux-amd64
./goepserver-linux-amd64
```

### Option 2: Build from Source
```bash
# Clone the repository
git clone https://github.com/jameel3reef/goepserver.git
cd goepserver

# Build standalone binary
./build.sh

# Run the server
./goepserver
```

### Option 3: Cross-Platform Build
```bash
# Build for all platforms
./build-cross-platform.sh

# Find binaries in dist/ folder
ls -la dist/
```

### After building, you can download the tools from the LinWinTools repository or just run the `tools.sh` script to automatically download and organize the tools:
```bash
cd goepserver
./tools.sh
```

## 🌐 Usage

### Web Interface
1. **Start the server**: `./goepserver`
2. **Open browser**: Navigate to `http://localhost:80`
3. **Upload files**: Use the web interface or drag & drop
4. **Generate shells**: Visit `/reverse-shell` for the payload generator
5. **Theme toggle**: Switch between light and dark modes

### Command Line Upload
```bash
# Linux/macOS
curl http://localhost:80/upload -F 'f=@yourfile'

# Windows PowerShell
Invoke-RestMethod -Uri http://localhost:80/upload -Method Post -Form @{f=Get-Item -Path "yourfile"}
```

### Command Line Options
```bash
./goepserver -h
Usage:
  -p int    Port number (default 80)
  -i string Interface to bind to (default "lo")
  -cli      Run in CLI mode
```

## 🔒 Security Features

- **Input Validation**: All file uploads and downloads are validated
- **Path Traversal Protection**: Prevents directory traversal attacks
- **Safe File Handling**: Secure file operations with proper error handling
- **Cross-Platform Compatibility**: Works consistently across different operating systems

## 📁 Project Structure

```
goepserver/
├── cmd/goepserver/          # Application entry point
│   └── main.go
├── internal/                # Internal packages
│   ├── assets/             # Embedded web assets
│   ├── config/             # Configuration handling
│   ├── server/             # HTTP server and handlers
│   ├── models/             # Data models
│   ├── utils/              # Utility functions
│   └── expy/               # Expy functionality
├── web/                    # Web assets (templates, CSS, JS)
│   ├── templates/          # HTML templates
│   └── static/             # Static assets (CSS, JS, images)
├── build.sh                # Build script for standalone binary
├── build-cross-platform.sh # Cross-platform build script
├── go.mod                  # Go module definition
└── README.md               # This file
```

## 🛠️ Development

### Building
```bash
# Development build
go build -o goepserver ./cmd/goepserver/

# Production build (optimized)
./build.sh

# Cross-platform build
./build-cross-platform.sh
```

### Adding New Shells
1. Edit `web/static/js/reverse-shell.js`
2. Add new shell data to the `shellData` object
3. Follow the existing pattern for shell categories

## 📋 Reverse Shell Categories

### Reverse Shells
- **Bash**: Traditional and modern bash reverse shells
- **Python**: Various Python-based reverse shells
- **PHP**: Web-based PHP reverse shells
- **Ruby**: Ruby reverse shell variants
- **Perl**: Perl-based reverse shells
- **Java**: Java reverse shell implementations
- **C**: Compiled C reverse shells
- **PowerShell**: Windows PowerShell reverse shells
- **And many more...**

### Bind Shells
- **netcat**: Traditional nc bind shells
- **Python**: Python bind shell variants
- **PHP**: PHP-based bind shells
- **Bash**: Bash bind shells

### MSFVenom Payloads
- **Linux**: ELF executables and shellcode
- **Windows**: PE executables and shellcode
- **macOS**: Mach-O executables
- **Multi-platform**: Cross-platform payloads

### HoaxShell
- **PowerShell**: Advanced PowerShell-based shells
- **Obfuscated**: Encoded and obfuscated variants

## 🎯 Use Cases

- **Penetration Testing**: Quick payload generation and file serving
- **Red Team Operations**: Centralized file distribution
- **Security Training**: Educational reverse shell examples
- **CTF Competitions**: Rapid payload deployment
- **Development**: Local file server with modern UI

## 🔧 Configuration

The server creates the following directories on first run:
- `$HOME/goepserver/uploads/` - Uploaded files storage
- `$HOME/goepserver/linux/enumeration/` - Linux enumeration tools
- `$HOME/goepserver/linux/attacking/` - Linux attacking tools
- `$HOME/goepserver/windows/enumeration/` - Windows enumeration tools
- `$HOME/goepserver/windows/attacking/` - Windows attacking tools

## 📊 Binary Sizes

| Platform | Architecture | Size |
|----------|-------------|------|
| Linux    | amd64       | ~8.6MB |
| Linux    | arm64       | ~8.2MB |
| Windows  | amd64       | ~8.8MB |
| macOS    | amd64       | ~8.6MB |
| macOS    | arm64       | ~8.2MB |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is for educational and authorized security testing purposes only. Users are responsible for complying with all applicable laws and regulations. The authors are not responsible for any misuse of this software.

## 🔗 Contact

For questions or further information, you can reach out to:

  - Author: Jameel Abdalla
  - Alias: MrAlphaQ
  - Linkedin: [jameel-abdalla](https://www.linkedin.com/in/jameel-abdalla)
  - YouTube: [MrAlphaQ](https://www.youtube.com/@MrAlphaQ)
  - Email: [mralphaq23@gmail.com](mailto:mralphaq23@gmail.com)

---

**Made with ❤️ By MrAlphaQ for the security community**
