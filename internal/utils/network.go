package utils

import (
	"fmt"
	"net"
	"os"
	"path/filepath"
)

// GetIPAddress returns the IP address of the specified network interface
func GetIPAddress(ifname string) (string, error) {
	iface, err := net.InterfaceByName(ifname)
	if err != nil {
		return "127.0.0.1", err
	}

	addrs, err := iface.Addrs()
	if err != nil {
		return "127.0.0.1", err
	}

	for _, addr := range addrs {
		if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String(), nil
			}
		}
	}

	return "127.0.0.1", nil
}

// FindAllFiles recursively finds all files in a directory
func FindAllFiles(baseDir string) ([]string, error) {
	var files []string

	err := filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			files = append(files, path)
		}
		return nil
	})

	return files, err
}

// GetUniqueFilename generates a unique filename for uploads
func GetUniqueFilename(directory, filename, ip string) string {
	base := filepath.Base(filename)
	ext := filepath.Ext(filename)
	nameWithoutExt := base[:len(base)-len(ext)]
	
	uniqueFilename := ip + "_" + base
	counter := 1
	
	for {
		_, err := os.Stat(filepath.Join(directory, uniqueFilename))
		if os.IsNotExist(err) {
			break
		}
		uniqueFilename = ip + "_" + nameWithoutExt + "_" + fmt.Sprint(counter) + ext
		counter++
	}
	
	return uniqueFilename
}
