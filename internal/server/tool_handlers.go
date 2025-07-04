package server

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"goepserver/internal/utils"

	"github.com/gorilla/mux"
)

// ReorderRequest is the JSON structure for tool reordering
type ReorderRequest struct {
	Platform string   `json:"platform"`
	Category string   `json:"category"`
	Order    []string `json:"order"`
}

// handleToolUploadCheck checks if a tool already exists before uploading
func (s *Server) handleToolUploadCheck(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	platform := vars["platform"]
	category := vars["category"]
	
	// Validate platform and category
	if (platform != "linux" && platform != "windows") || (category != "enumeration" && category != "attacking") {
		http.Error(w, "Invalid platform or category", http.StatusBadRequest)
		return
	}
	
	// Parse multipart form
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}
	
	// Get uploaded file
	file, handler, err := r.FormFile("tool")
	if err != nil {
		http.Error(w, "No file received", http.StatusBadRequest)
		return
	}
	defer file.Close()
	
	// Get original filename
	filename := handler.Filename
	if strings.Contains(filename, "..") || strings.Contains(filename, "/") || strings.Contains(filename, "\\") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}
	
	// Check if the file already exists
	targetDir := filepath.Join(s.Config.BaseDir, platform, category)
	targetPath := filepath.Join(targetDir, filename)
	exists := false
	
	if _, err := os.Stat(targetPath); err == nil {
		exists = true
	}
	
	// Return file info and existence status
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"filename": filename,
		"platform": platform,
		"category": category,
		"exists": exists,
	})
}

// handleDeleteTool handles tool deletion with confirmation
func (s *Server) handleDeleteTool(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	platform := vars["platform"]
	category := vars["category"]
	filename := vars["filename"]
	
	// Delete the tool
	err := s.FileCatalog.DeleteTool(category, platform, filename, s.Config.BaseDir)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error deleting tool: %v", err), http.StatusInternalServerError)
		return
	}
	
	// Send success response
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Tool '%s' deleted successfully", filename)
}

// handleReorderTools handles tool reordering
func (s *Server) handleReorderTools(w http.ResponseWriter, r *http.Request) {
	// Parse JSON request
	var req ReorderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, fmt.Sprintf("Error parsing request: %v", err), http.StatusBadRequest)
		return
	}
	
	// Update the order
	err := s.FileCatalog.ReorderTools(req.Category, req.Platform, req.Order)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error reordering tools: %v", err), http.StatusInternalServerError)
		return
	}
	
	// Send success response
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Tools reordered successfully")
}

// handleToolUpload handles uploading a tool to a specific category
func (s *Server) handleToolUpload(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	platform := vars["platform"]
	category := vars["category"]
	
	// Validate platform and category
	if (platform != "linux" && platform != "windows") || (category != "enumeration" && category != "attacking") {
		http.Error(w, "Invalid platform or category", http.StatusBadRequest)
		return
	}
	
	// Parse multipart form
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}
	
	// Get confirmation parameter
	confirmed := r.FormValue("confirmed") == "true"
	
	// Get uploaded file
	file, handler, err := r.FormFile("tool")
	if err != nil {
		http.Error(w, "No file received", http.StatusBadRequest)
		return
	}
	defer file.Close()
	
	// Get original filename
	filename := handler.Filename
	if strings.Contains(filename, "..") || strings.Contains(filename, "/") || strings.Contains(filename, "\\") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}
	
	// Create target directory if it doesn't exist
	targetDir := filepath.Join(s.Config.BaseDir, platform, category)
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		http.Error(w, "Failed to create directory", http.StatusInternalServerError)
		return
	}
	
	// Check if the file already exists and confirmation is required
	filePath := filepath.Join(targetDir, filename)
	if _, err := os.Stat(filePath); err == nil && !confirmed {
		// File exists and no confirmation - return error requesting confirmation
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": "File already exists",
			"requiresConfirmation": true,
			"filename": filename,
			"platform": platform,
			"category": category,
		})
		return
	}
	
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
	
	// Get file permissions for executable files
	if platform == "linux" {
		// Make the file executable if it's a Linux tool
		if err := os.Chmod(filePath, 0755); err != nil {
			http.Error(w, "Failed to set executable permissions", http.StatusInternalServerError)
			return
		}
	}
	
	// Refresh the catalog
	files, err := utils.FindAllFiles(s.Config.BaseDir)
	if err != nil {
		http.Error(w, "Failed to refresh file catalog", http.StatusInternalServerError)
		return
	}
	s.FileCatalog.CategorizeFiles(files, s.Config.BaseDir)
	
	// Return the file info to update UI
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"filename": filename,
		"platform": platform,
		"category": category,
	})
}