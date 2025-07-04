package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"goepserver/internal/config"
	"goepserver/internal/server"
)

func main() {
	// Parse command line flags
	port := flag.Int("p", 80, "Port number for the server")
	iface := flag.String("i", "lo", "Network interface to use")
	cliMode := flag.Bool("cli", false, "Run the server in CLI mode")
	flag.Parse()

	// Setup config
	conf := config.New(*port, *iface)
	
	// Create base directory structure if it doesn't exist
	homeDir, err := os.UserHomeDir()
	if err != nil {
		log.Fatalf("Failed to get home directory: %v", err)
	}
	
	baseDir := filepath.Join(homeDir, "goepserver")
	conf.BaseDir = baseDir
	
	// Create necessary directories
	dirs := []string{
		baseDir,
		filepath.Join(baseDir, "linux", "enumeration"),
		filepath.Join(baseDir, "linux", "attacking"),
		filepath.Join(baseDir, "windows", "enumeration"),
		filepath.Join(baseDir, "windows", "attacking"),
		filepath.Join(baseDir, "uploads"),
	}
	
	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			log.Fatalf("Failed to create directory %s: %v", dir, err)
		}
	}

	// Print info message
	fmt.Printf("If you want to add your own tools, add them to the %s linux or windows folders\n", baseDir)

	// Start server
	if *cliMode {
		server.StartCLIServer(conf)
	} else {
		server.StartWebServer(conf)
	}
}
