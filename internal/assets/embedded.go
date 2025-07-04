package assets

import (
	"embed"
	"io"
	"io/fs"
	"net/http"
	"path"
	"strings"
)

//go:embed web
var EmbeddedFS embed.FS

// EmbeddedFile implements http.File interface
type EmbeddedFile struct {
	fs.File
	info fs.FileInfo
}

func (ef *EmbeddedFile) Readdir(count int) ([]fs.FileInfo, error) {
	return nil, fs.ErrInvalid
}

func (ef *EmbeddedFile) Seek(offset int64, whence int) (int64, error) {
	if seeker, ok := ef.File.(io.Seeker); ok {
		return seeker.Seek(offset, whence)
	}
	return 0, fs.ErrInvalid
}

func (ef *EmbeddedFile) Stat() (fs.FileInfo, error) {
	return ef.info, nil
}

// EmbeddedFileSystem implements http.FileSystem
type EmbeddedFileSystem struct {
	fs embed.FS
}

func (efs EmbeddedFileSystem) Open(name string) (http.File, error) {
	// Clean the path and remove leading slash
	name = strings.TrimPrefix(path.Clean(name), "/")
	
	// Add web prefix if not present
	if !strings.HasPrefix(name, "web/") {
		name = "web/" + name
	}
	
	// Try to open the file
	file, err := efs.fs.Open(name)
	if err != nil {
		return nil, err
	}
	
	// Get file info
	info, err := file.Stat()
	if err != nil {
		file.Close()
		return nil, err
	}
	
	return &EmbeddedFile{File: file, info: info}, nil
}

// GetFileSystem returns the embedded filesystem
func GetFileSystem() http.FileSystem {
	return EmbeddedFileSystem{fs: EmbeddedFS}
}

// GetTemplate reads a template from the embedded filesystem
func GetTemplate(templatePath string) ([]byte, error) {
	// Remove leading slash and ensure we're looking in the right place
	templatePath = strings.TrimPrefix(templatePath, "/")
	if !strings.HasPrefix(templatePath, "web/templates/") {
		templatePath = "web/templates/" + templatePath
	}
	
	return EmbeddedFS.ReadFile(templatePath)
}

// GetStaticFS returns a subdirectory of the embedded filesystem for static files
func GetStaticFS() (fs.FS, error) {
	return fs.Sub(EmbeddedFS, "web/static")
}

// IsEmbedded returns true if assets are embedded
func IsEmbedded() bool {
	return true
}
