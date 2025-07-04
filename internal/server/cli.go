package server

import (
	"fmt"
	"log"
	"net/http"

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
	
	// Display available files
	printCLIHeader(fileCatalog, conf.ServerIP, conf.Port)
	
	// Start a basic HTTP server
	addr := fmt.Sprintf("%s:%d", conf.ServerIP, conf.Port)
	log.Printf("Serving HTTP on %s port %d (http://%s/)", conf.ServerIP, conf.Port, addr)
	
	// Setup file server
	http.Handle("/", http.FileServer(http.Dir(conf.BaseDir)))
	log.Fatal(http.ListenAndServe(addr, nil))
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
		if i == len(fileCatalog.Linux.Enumeration)-1 {
			fmt.Printf("%s %s\n", yellow("│   └───"), yellow(fmt.Sprintf(urlTemplate, file)))
		} else {
			fmt.Printf("%s %s\n", yellow("│   ├───"), yellow(fmt.Sprintf(urlTemplate, file)))
		}
	}
	
	fmt.Printf("%s\n", red("└───Attacking:"))
	
	for i, file := range fileCatalog.Linux.Attacking {
		if i == len(fileCatalog.Linux.Attacking)-1 {
			fmt.Printf("%s %s\n", red("    └───"), red(fmt.Sprintf(urlTemplate, file)))
		} else {
			fmt.Printf("%s %s\n", red("    ├───"), red(fmt.Sprintf(urlTemplate, file)))
		}
	}
	
	// Windows files
	fmt.Printf("%s\n", bold(blue("Windows Files:")))
	fmt.Printf("%s\n", yellow("├───Enumeration:"))
	
	for i, file := range fileCatalog.Windows.Enumeration {
		if i == len(fileCatalog.Windows.Enumeration)-1 {
			fmt.Printf("%s %s\n", yellow("│   └───"), yellow(fmt.Sprintf(urlTemplate, file)))
		} else {
			fmt.Printf("%s %s\n", yellow("│   ├───"), yellow(fmt.Sprintf(urlTemplate, file)))
		}
	}
	
	fmt.Printf("%s\n", red("└───Attacking:"))
	
	for i, file := range fileCatalog.Windows.Attacking {
		if i == len(fileCatalog.Windows.Attacking)-1 {
			fmt.Printf("%s %s\n", red("    └───"), red(fmt.Sprintf(urlTemplate, file)))
		} else {
			fmt.Printf("%s %s\n", red("    ├───"), red(fmt.Sprintf(urlTemplate, file)))
		}
	}
}
