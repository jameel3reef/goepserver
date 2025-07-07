package server

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"goepserver/internal/config"
	"goepserver/internal/models"
	"goepserver/internal/utils"

	"github.com/fatih/color"
)

// StartCLIServer starts the CLI version of the server
func StartCLIServer(conf *config.Config) {
	// Get IP address
	ip, err := utils.GetIPAddress(conf.Interface)
	if err != nil {
		log.Printf("Failed to get IP for interface %s: %v, using 127.0.0.1", conf.Interface, err)
		ip = "127.0.0.1"
	}
	conf.ServerIP = ip
	
	// Find and categorize files
	files, err := utils.FindAllFiles(conf.BaseDir)
	if err != nil {
		log.Fatalf("Failed to find files: %v", err)
	}
	
	fileCatalog := models.NewFileCatalog()
	fileCatalog.CategorizeFiles(files, conf.BaseDir)
	
	// Create a filename to filepath mapping for serving files
	fileMap := createFileMap(fileCatalog)
	
	// Display available files
	printCLIHeader(fileCatalog, conf.ServerIP, conf.Port)
	
	// Start a basic HTTP server
	addr := fmt.Sprintf("%s:%d", conf.ServerIP, conf.Port)
	log.Printf("Serving HTTP on %s port %d (http://%s/)", conf.ServerIP, conf.Port, addr)
	
	// Setup custom file handler that serves files by filename
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Remove leading slash from URL path
		filename := strings.TrimPrefix(r.URL.Path, "/")
		
		// If no filename specified, serve directory listing
		if filename == "" {
			http.FileServer(http.Dir(conf.BaseDir)).ServeHTTP(w, r)
			return
		}
		
		// Look up the actual file path
		if actualPath, exists := fileMap[filename]; exists {
			http.ServeFile(w, r, actualPath)
			return
		}
		
		// If file not found in our catalog, try serving normally
		http.FileServer(http.Dir(conf.BaseDir)).ServeHTTP(w, r)
	})
	
	log.Fatal(http.ListenAndServe(addr, nil))
}

// createFileMap creates a mapping from filename to full file path
func createFileMap(fileCatalog *models.FileCatalog) map[string]string {
	fileMap := make(map[string]string)
	
	// Add Linux enumeration files
	for _, file := range fileCatalog.Linux.Enumeration {
		fileMap[file.Name] = file.FilePath
	}
	
	// Add Linux attacking files
	for _, file := range fileCatalog.Linux.Attacking {
		fileMap[file.Name] = file.FilePath
	}
	
	// Add Windows enumeration files
	for _, file := range fileCatalog.Windows.Enumeration {
		fileMap[file.Name] = file.FilePath
	}
	
	// Add Windows attacking files
	for _, file := range fileCatalog.Windows.Attacking {
		fileMap[file.Name] = file.FilePath
	}
	
	return fileMap
}

// printCLIHeader prints the categorized files in CLI mode
func printCLIHeader(fileCatalog *models.FileCatalog, serverIP string, serverPort int) {
	// Setup colors
	bold := color.New(color.Bold).SprintFunc()
	green := color.New(color.FgGreen).SprintFunc()
	blue := color.New(color.FgBlue).SprintFunc()
	yellow := color.New(color.FgYellow, color.Bold).SprintFunc()
	red := color.New(color.FgRed, color.Bold).SprintFunc()
	
	// Build URL template
	urlTemplate := fmt.Sprintf("http://%s:%d/%%s", serverIP, serverPort)
	if serverPort == 80 {
		urlTemplate = fmt.Sprintf("http://%s/%%s", serverIP)
	}
	
	// Linux files
	fmt.Printf("%s\n", bold(green("Linux Files:")))
	fmt.Printf("%s\n", yellow("├───Enumeration:"))
	
	for i, file := range fileCatalog.Linux.Enumeration {
		// Use just the filename for clean URLs
		if i == len(fileCatalog.Linux.Enumeration)-1 {
			fmt.Printf("%s %s\n", yellow("│   └───"), yellow(fmt.Sprintf(urlTemplate, file.Name)))
		} else {
			fmt.Printf("%s %s\n", yellow("│   ├───"), yellow(fmt.Sprintf(urlTemplate, file.Name)))
		}
	}
	
	fmt.Printf("%s\n", red("└───Attacking:"))
	
	for i, file := range fileCatalog.Linux.Attacking {
		if i == len(fileCatalog.Linux.Attacking)-1 {
			fmt.Printf("%s %s\n", red("    └───"), red(fmt.Sprintf(urlTemplate, file.Name)))
		} else {
			fmt.Printf("%s %s\n", red("    ├───"), red(fmt.Sprintf(urlTemplate, file.Name)))
		}
	}
	
	// Windows files
	fmt.Printf("%s\n", bold(blue("Windows Files:")))
	fmt.Printf("%s\n", yellow("├───Enumeration:"))
	
	for i, file := range fileCatalog.Windows.Enumeration {
		if i == len(fileCatalog.Windows.Enumeration)-1 {
			fmt.Printf("%s %s\n", yellow("│   └───"), yellow(fmt.Sprintf(urlTemplate, file.Name)))
		} else {
			fmt.Printf("%s %s\n", yellow("│   ├───"), yellow(fmt.Sprintf(urlTemplate, file.Name)))
		}
	}
	
	fmt.Printf("%s\n", red("└───Attacking:"))
	
	for i, file := range fileCatalog.Windows.Attacking {
		if i == len(fileCatalog.Windows.Attacking)-1 {
			fmt.Printf("%s %s\n", red("    └───"), red(fmt.Sprintf(urlTemplate, file.Name)))
		} else {
			fmt.Printf("%s %s\n", red("    ├───"), red(fmt.Sprintf(urlTemplate, file.Name)))
		}
	}
}