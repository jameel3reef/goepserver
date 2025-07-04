# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-07-04

### Added
- Initial release of GoEPServer
- Web-based file upload and download functionality
- Comprehensive reverse shell generator with 200+ payloads
- Support for reverse shells, bind shells, MSFVenom, and HoaxShell
- Modern web UI with light/dark theme support
- Cross-platform support (Linux, Windows, macOS)
- Standalone binary with embedded web assets
- Static linking for maximum portability
- Command-line upload support (curl, PowerShell)
- Tool management system with drag & drop organization
- Syntax highlighting with Prism.js
- Real-time IP/port detection
- Responsive design for mobile and desktop
- Search and filter functionality for shells
- One-click copy to clipboard
- OS filtering (Linux, Windows, macOS)
- Shell type selection (bash, cmd, powershell, etc.)
- Encoding options (URL, Base64, etc.)
- Expandable/collapsible shell categories
- Theme persistence with localStorage
- Smooth theme transition animations
- Security features (input validation, path traversal protection)

### Features
- **Core Server**: HTTP file server with upload/download capabilities
- **Reverse Shell Generator**: Comprehensive collection of penetration testing payloads with credit to [0dayCTF](https://github.com/0dayCTF/reverse-shell-generator)
- **Web Interface**: Modern, responsive UI with theme support
- **Cross-Platform**: Builds for Linux, Windows, and macOS
- **Standalone**: Single binary with no external dependencies
- **Security**: Input validation and secure file handling

### Technical Details
- Built with Go 1.21+
- Embedded web assets using Go's embed package
- Static linking for portability (CGO_ENABLED=0)
- Binary size optimization with -ldflags="-s -w"
- Gorilla Mux for routing
- HTML templates with partial support
- CSS Grid and Flexbox for modern layouts
- Vanilla JavaScript (no external JS dependencies)
- CDN-hosted libraries (Font Awesome, Prism.js, Sortable.js)

### Build System
- Simple build script for standalone binary
- Cross-platform build script for multiple architectures
- Optimized binary sizes (~8MB)
- No external dependencies required
