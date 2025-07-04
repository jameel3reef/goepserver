package server

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"goepserver/internal/assets"
	"goepserver/internal/config"
	"goepserver/internal/models"
	"goepserver/internal/utils"

	"github.com/gorilla/mux"
)

// Server represents the HTTP server
type Server struct {
	Config      *config.Config
	Router      *mux.Router
	FileCatalog *models.FileCatalog
}

// NewServer creates a new server instance
func NewServer(conf *config.Config) (*Server, error) {
	// Get IP address
	ip, err := utils.GetIPAddress(conf.Interface)
	if err != nil {
		log.Printf("Failed to get IP for interface %s: %v, using 127.0.0.1", conf.Interface, err)
		ip = "127.0.0.1"
	}
	conf.ServerIP = ip
	
	// Set directories
	conf.UploadDir = filepath.Join(conf.BaseDir, "uploads")
	conf.TemplateDir = filepath.Join("web", "templates")
	conf.StaticDir = filepath.Join("web", "static")
	
	// Create uploads directory if it doesn't exist
	if err := os.MkdirAll(conf.UploadDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create uploads directory: %v", err)
	}
	
	// Find and categorize files
	files, err := utils.FindAllFiles(conf.BaseDir)
	if err != nil {
		return nil, fmt.Errorf("failed to find files: %v", err)
	}
	
	fileCatalog := models.NewFileCatalog()
	fileCatalog.CategorizeFiles(files, conf.BaseDir)
	
	// Create router
	router := mux.NewRouter()
	
	return &Server{
		Config:     conf,
		Router:     router,
		FileCatalog: fileCatalog,
	}, nil
}

// StartWebServer starts the web server
func StartWebServer(conf *config.Config) {
	server, err := NewServer(conf)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}
	
	// Set up routes
	server.setupRoutes()
	
	// Start server
	addr := fmt.Sprintf("%s:%d", server.Config.ServerIP, server.Config.Port)
	log.Printf("Server started at http://%s", addr)
	log.Fatal(http.ListenAndServe(addr, server.Router))
}

// setupRoutes configures all the routes for the server
func (s *Server) setupRoutes() {
	// Serve static files from embedded assets
	staticFS, err := assets.GetStaticFS()
	if err != nil {
		log.Printf("Failed to get embedded static files, falling back to filesystem: %v", err)
		s.Router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(s.Config.StaticDir))))
	} else {
		s.Router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.FS(staticFS))))
	}
	
	// Home page
	s.Router.HandleFunc("/", s.handleIndex).Methods("GET")
	
	// Uploaded files
	s.Router.HandleFunc("/uploaded_files", s.handleUploadedFiles).Methods("GET")
	
	// Reverse shell generator
	s.Router.HandleFunc("/reverse-shell", s.handleReverseShell).Methods("GET")
	
	// File upload
	s.Router.HandleFunc("/upload", s.handleUpload).Methods("POST")
	
	// Tool upload check route
	s.Router.HandleFunc("/tools/upload-check/{platform}/{category}", s.handleToolUploadCheck).Methods("POST")
	
	// Tool upload to specific category
	s.Router.HandleFunc("/tools/upload/{platform}/{category}", s.handleToolUpload).Methods("POST")
	
	// File download
	s.Router.HandleFunc("/uploads/{filename}", s.handleDownload).Methods("GET")
	
	// Delete file
	s.Router.HandleFunc("/delete_file/{filename}", s.handleDeleteFile).Methods("POST")
	
	// Tool management routes
	s.Router.HandleFunc("/tools/delete/{platform}/{category}/{filename}", s.handleDeleteTool).Methods("POST")
	s.Router.HandleFunc("/tools/reorder", s.handleReorderTools).Methods("POST")
	
	// API endpoints
	s.Router.HandleFunc("/api/tool-data", s.handleToolDataAPI).Methods("GET")
	s.Router.HandleFunc("/api/uploaded-files", s.handleUploadedFilesAPI).Methods("GET")
	// ExPy routes
    s.Router.HandleFunc("/expy", s.handleExpy).Methods("GET")
    s.Router.HandleFunc("/api/expy/generate", s.handleExpyGenerate).Methods("POST")
    s.Router.HandleFunc("/expy/download/{filename}", s.handleExpyDownload).Methods("GET")
    s.Router.HandleFunc("/api/expy/files", s.handleExpyFiles).Methods("GET")
    s.Router.HandleFunc("/api/expy/delete/{filename}", s.handleExpyDelete).Methods("POST")
    
	// Serve tool files
	s.Router.HandleFunc("/{filename}", s.handleFileServe).Methods("GET")


}

// handleIndex serves the index.html page
func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
    // Define the data to pass to the template
    data := map[string]interface{}{
        "ActivePage": "home",
        "ServerIP":   s.Config.ServerIP,
        "ServerPort": s.Config.Port,
    }
    
    // Execute the template
    s.renderTemplate(w, "index.html", data)
}

// handleUploadedFiles serves the uploads.html page
func (s *Server) handleUploadedFiles(w http.ResponseWriter, r *http.Request) {
    // Define the data to pass to the template
    data := map[string]interface{}{
        "ActivePage": "uploads",
        "ServerIP":   s.Config.ServerIP,
        "ServerPort": s.Config.Port,
    }
    
    // Execute the template
    s.renderTemplate(w, "uploads.html", data)
}

// handleReverseShell serves the reverse-shell.html page
func (s *Server) handleReverseShell(w http.ResponseWriter, r *http.Request) {
    // Define the data to pass to the template
    data := map[string]interface{}{
        "ActivePage": "reverse-shell",
        "ServerIP":   s.Config.ServerIP,
        "ServerPort": s.Config.Port,
    }
    
    // Execute the template
    s.renderTemplate(w, "reverse-shell.html", data)
}

// renderTemplate renders a template with the given data
func (s *Server) renderTemplate(w http.ResponseWriter, tmpl string, data map[string]interface{}) {
    // Try to use embedded templates first
    if assets.IsEmbedded() {
        // Read templates from embedded assets
        layoutData, err := assets.GetTemplate("layouts/base.html")
        if err != nil {
            log.Printf("Failed to get embedded layout template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        pageData, err := assets.GetTemplate(tmpl)
        if err != nil {
            log.Printf("Failed to get embedded page template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        navbarData, err := assets.GetTemplate("partials/navbar.html")
        if err != nil {
            log.Printf("Failed to get embedded navbar template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        footerData, err := assets.GetTemplate("partials/footer.html")
        if err != nil {
            log.Printf("Failed to get embedded footer template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        uploadData, err := assets.GetTemplate("partials/upload.html")
        if err != nil {
            log.Printf("Failed to get embedded upload template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        themeToggleData, err := assets.GetTemplate("partials/theme-toggle.html")
        if err != nil {
            log.Printf("Failed to get embedded theme toggle template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        // Parse templates from embedded data
        t := template.New("base")
        t, err = t.Parse(string(layoutData))
        if err != nil {
            log.Printf("Failed to parse embedded layout template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        t, err = t.Parse(string(pageData))
        if err != nil {
            log.Printf("Failed to parse embedded page template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        t, err = t.Parse(string(navbarData))
        if err != nil {
            log.Printf("Failed to parse embedded navbar template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        t, err = t.Parse(string(footerData))
        if err != nil {
            log.Printf("Failed to parse embedded footer template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        t, err = t.Parse(string(uploadData))
        if err != nil {
            log.Printf("Failed to parse embedded upload template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        t, err = t.Parse(string(themeToggleData))
        if err != nil {
            log.Printf("Failed to parse embedded theme toggle template, falling back to filesystem: %v", err)
            s.renderTemplateFromFS(w, tmpl, data)
            return
        }
        
        // Execute the template
        if err := t.ExecuteTemplate(w, "base", data); err != nil {
            http.Error(w, fmt.Sprintf("Error executing embedded template: %v", err), http.StatusInternalServerError)
        }
    } else {
        s.renderTemplateFromFS(w, tmpl, data)
    }
}

// renderTemplateFromFS renders a template from filesystem (fallback)
func (s *Server) renderTemplateFromFS(w http.ResponseWriter, tmpl string, data map[string]interface{}) {
    // Define template paths
    layoutPath := filepath.Join(s.Config.TemplateDir, "layouts", "base.html")
    pageTemplatePath := filepath.Join(s.Config.TemplateDir, tmpl)
    navbarPath := filepath.Join(s.Config.TemplateDir, "partials", "navbar.html")
    footerPath := filepath.Join(s.Config.TemplateDir, "partials", "footer.html")
    uploadPath := filepath.Join(s.Config.TemplateDir, "partials", "upload.html")
    themeTogglePath := filepath.Join(s.Config.TemplateDir, "partials", "theme-toggle.html")
    
    // Parse the templates
    t, err := template.ParseFiles(layoutPath, pageTemplatePath, navbarPath, footerPath, uploadPath, themeTogglePath)
    if err != nil {
        http.Error(w, fmt.Sprintf("Error parsing template: %v", err), http.StatusInternalServerError)
        return
    }
    
    // Execute the template
    if err := t.ExecuteTemplate(w, "base", data); err != nil {
        http.Error(w, fmt.Sprintf("Error executing template: %v", err), http.StatusInternalServerError)
    }
}
// handleToolDataAPI returns the tool data as JSON
func (s *Server) handleToolDataAPI(w http.ResponseWriter, r *http.Request) {
	// Refresh the catalog to ensure latest data
	files, err := utils.FindAllFiles(s.Config.BaseDir)
	if err != nil {
		http.Error(w, "Failed to find files", http.StatusInternalServerError)
		return
	}
	
	s.FileCatalog.CategorizeFiles(files, s.Config.BaseDir)
	
	// Return as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"ServerIP":    s.Config.ServerIP,
		"ServerPort":  s.Config.Port,
		"LinuxFiles":  s.FileCatalog.Linux,
		"WindowsFiles": s.FileCatalog.Windows,
	})
}

// handleUploadedFilesAPI returns a list of uploaded files as JSON
func (s *Server) handleUploadedFilesAPI(w http.ResponseWriter, r *http.Request) {
	files, err := models.ListUploadedFiles(s.Config.UploadDir)
	if err != nil {
		http.Error(w, "Failed to list uploaded files", http.StatusInternalServerError)
		return
	}
	
	// Return as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"Files": files,
		"ServerIP": s.Config.ServerIP,
		"ServerPort": s.Config.Port,
	})
}

