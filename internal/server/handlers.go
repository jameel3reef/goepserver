package server

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"goepserver/internal/assets"
	"goepserver/internal/utils"

	"github.com/gorilla/mux"
)

// handleUpload handles file uploads
func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}
	
	file, handler, err := r.FormFile("f")
	if err != nil {
		http.Error(w, "No file received", http.StatusBadRequest)
		return
	}
	defer file.Close()
	
	filename := handler.Filename
	if strings.Contains(filename, "..") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}
	
	uniqueFilename := utils.GetUniqueFilename(s.Config.UploadDir, filename, r.RemoteAddr)
	filePath := filepath.Join(s.Config.UploadDir, uniqueFilename)
	
	// Create the file
	dst, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()
	
	// Copy the file content
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	
	fmt.Fprintf(w, "File %s uploaded successfully", uniqueFilename)
}

// handleDownload handles file downloads
func (s *Server) handleDownload(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	filename := vars["filename"]
	
	if strings.Contains(filename, "..") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}
	
	filePath := filepath.Join(s.Config.UploadDir, filename)
	
	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	
	// Serve the file
	http.ServeFile(w, r, filePath)
}

// handleDeleteFile handles file deletion
func (s *Server) handleDeleteFile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	filename := vars["filename"]
	
	if strings.Contains(filename, "..") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}
	
	filePath := filepath.Join(s.Config.UploadDir, filename)
	
	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	
	// Delete the file
	if err := os.Remove(filePath); err != nil {
		http.Error(w, "Failed to delete file", http.StatusInternalServerError)
		return
	}
	
	// Redirect back to the uploaded files page
	http.Redirect(w, r, "/uploaded_files", http.StatusSeeOther)
}

// handleFileServe serves tool files
func (s *Server) handleFileServe(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	filename := vars["filename"]
	
	if filename == "favicon.ico" {
		// Try to serve favicon from embedded assets first
		faviconData, err := assets.EmbeddedFS.ReadFile("web/static/img/favicon.ico")
		if err != nil {
			// Fall back to filesystem
			http.ServeFile(w, r, filepath.Join(s.Config.StaticDir, "img", "favicon.ico"))
			return
		}
		
		w.Header().Set("Content-Type", "image/x-icon")
		w.Write(faviconData)
		return
	}
	
	if strings.Contains(filename, "..") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}
	
	// Check if file is in Linux enumeration
	for _, tool := range s.FileCatalog.Linux.Enumeration {
		if tool.Name == filename {
			http.ServeFile(w, r, tool.FilePath)
			return
		}
	}
	
	// Check if file is in Linux attacking
	for _, tool := range s.FileCatalog.Linux.Attacking {
		if tool.Name == filename {
			http.ServeFile(w, r, tool.FilePath)
			return
		}
	}
	
	// Check if file is in Windows enumeration
	for _, tool := range s.FileCatalog.Windows.Enumeration {
		if tool.Name == filename {
			http.ServeFile(w, r, tool.FilePath)
			return
		}
	}
	
	// Check if file is in Windows attacking
	for _, tool := range s.FileCatalog.Windows.Attacking {
		if tool.Name == filename {
			http.ServeFile(w, r, tool.FilePath)
			return
		}
	}
	
	// File not found
	http.Error(w, "File not found", http.StatusNotFound)
}
