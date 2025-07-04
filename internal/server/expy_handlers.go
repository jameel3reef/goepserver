package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"goepserver/internal/expy"

	"github.com/gorilla/mux"
)

// handleExpy serves the expy.html page
func (s *Server) handleExpy(w http.ResponseWriter, r *http.Request) {
    // Define the data to pass to the template
    data := map[string]interface{}{
        "ActivePage": "expy",
        "ServerIP":   s.Config.ServerIP,
        "ServerPort": s.Config.Port,
    }
    
    // Execute the template
    s.renderTemplate(w, "expy.html", data)
}

// handleExpyGenerate handles the generation of attack files
func (s *Server) handleExpyGenerate(w http.ResponseWriter, r *http.Request) {
    // Debug log
    fmt.Println("Received expy generate request")
    
    // Parse form
    if err := r.ParseMultipartForm(32 << 20); err != nil {
        fmt.Println("Failed to parse multipart form:", err)
        // Try regular form parsing instead
        if err := r.ParseForm(); err != nil {
            fmt.Println("Failed to parse form:", err)
            http.Error(w, "Failed to parse form", http.StatusBadRequest)
            return
        }
    }
    
    // Print all form values for debugging
    fmt.Println("Form values:")
    for key, values := range r.Form {
        fmt.Printf("%s: %v\n", key, values)
    }
    
    // Get form values
    payloadType := r.FormValue("payload_type")
    attackType := r.FormValue("type")
    name := r.FormValue("name")
    
    // Get payload-specific parameters
    var opts expy.GenerateOptions
    opts.Type = attackType
    opts.Name = name
    opts.PayloadType = payloadType
    
    if payloadType == "reverse_shell" {
        listenerIP := r.FormValue("listener_ip")
        listenerPort := r.FormValue("listener_port")
        
        if listenerIP == "" {
            http.Error(w, "Missing required parameter: listener_ip", http.StatusBadRequest)
            return
        }
        
        // For Library_ms, port is always 80
        if attackType == "Library_ms" {
            listenerPort = "80"
        } else if listenerPort == "" {
            http.Error(w, "Missing required parameter: listener_port", http.StatusBadRequest)
            return
        }
        
        opts.ListenerIP = listenerIP
        opts.ListenerPort = listenerPort
    } else if payloadType == "execute_command" {
        command := r.FormValue("command")
        
        if command == "" {
            http.Error(w, "Missing required parameter: command", http.StatusBadRequest)
            return
        }
        
        opts.Command = command
    } else {
        http.Error(w, "Invalid payload type", http.StatusBadRequest)
        return
    }
    
    // Make sure expy output directory exists
    expyDir := filepath.Join(s.Config.BaseDir, "expy")
    if err := os.MkdirAll(expyDir, 0755); err != nil {
        fmt.Println("Failed to create expy directory:", err)
        http.Error(w, "Failed to create expy directory", http.StatusInternalServerError)
        return
    }
    
    opts.OutputDir = expyDir
    
    // Generate file
    fmt.Println("Generating file with options:", opts)
    result, err := expy.GenerateFile(opts)
    if err != nil {
        fmt.Println("Failed to generate file:", err)
        http.Error(w, fmt.Sprintf("Failed to generate file: %v", err), http.StatusInternalServerError)
        return
    }
    
    // Return result
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(result); err != nil {
        fmt.Println("Failed to encode result:", err)
        http.Error(w, "Failed to encode result", http.StatusInternalServerError)
        return
    }
    fmt.Println("File generated successfully:", result.Filename)
}

// handleExpyDownload handles downloading generated attack files
func (s *Server) handleExpyDownload(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	filename := vars["filename"]
	
	// Validate filename
	if filename == "" || filepath.Ext(filename) == "" {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}
	
	// Build file path
	filePath := filepath.Join(s.Config.BaseDir, "expy", filename)
	
	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	
	// Serve the file for download
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	http.ServeFile(w, r, filePath)
}
func (s *Server) handleExpyFiles(w http.ResponseWriter, r *http.Request) {
    expyDir := filepath.Join(s.Config.BaseDir, "expy")
    
    // List files in the expy directory
    files, err := os.ReadDir(expyDir)
    if err != nil {
        if os.IsNotExist(err) {
            // If directory doesn't exist, return empty list
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(map[string]interface{}{
                "Files": []string{},
            })
            return
        }
        
        http.Error(w, "Failed to list files", http.StatusInternalServerError)
        return
    }
    
    // Extract filenames
    var fileNames []string
    for _, file := range files {
        if !file.IsDir() {
            fileNames = append(fileNames, file.Name())
        }
    }
    
    // Return as JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "Files": fileNames,
    })
}

// handleExpyDelete handles deletion of ExPy files
func (s *Server) handleExpyDelete(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    filename := vars["filename"]
    
    // Validate filename
    if strings.Contains(filename, "..") {
        http.Error(w, "Invalid filename", http.StatusBadRequest)
        return
    }
    
    // Build file path
    filePath := filepath.Join(s.Config.BaseDir, "expy", filename)
    
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
    
    // Return success
    w.WriteHeader(http.StatusOK)
    fmt.Fprintf(w, "File '%s' deleted successfully", filename)
}