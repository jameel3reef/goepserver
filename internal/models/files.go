package models

import (
	"os"
	"path/filepath"
	"strings"
)

// ToolItem represents a single tool with metadata
type ToolItem struct {
	Name     string
	FilePath string
	Order    int
}

// FileCatalog represents the categorized files with ordered tools
type FileCatalog struct {
	Linux struct {
		Enumeration []*ToolItem
		Attacking   []*ToolItem
	}
	Windows struct {
		Enumeration []*ToolItem
		Attacking   []*ToolItem
	}
}

// NewFileCatalog creates a new, empty FileCatalog
func NewFileCatalog() *FileCatalog {
	catalog := &FileCatalog{}
	return catalog
}

// CategorizeFiles categorizes files into Linux/Windows and Enumeration/Attacking
func (fc *FileCatalog) CategorizeFiles(files []string, baseDir string) {
	// Initialize empty slices
	fc.Linux.Enumeration = []*ToolItem{}
	fc.Linux.Attacking = []*ToolItem{}
	fc.Windows.Enumeration = []*ToolItem{}
	fc.Windows.Attacking = []*ToolItem{}
	
	// Track counters for ordering
	linuxEnumCount := 0
	linuxAttackCount := 0
	windowsEnumCount := 0
	windowsAttackCount := 0
	
	for _, file := range files {
		// Get relative path to the base directory
		relPath, err := filepath.Rel(baseDir, file)
		if err != nil {
			continue
		}
		
		// Extract just the filename
		fileName := filepath.Base(file)
		
		// Skip if filename starts with "." (hidden files)
		if strings.HasPrefix(fileName, ".") || fileName == "order.json" {
			continue
		}
		
		// Categorize based on path
		if strings.Contains(relPath, "linux") {
			if strings.Contains(relPath, "enumeration") {
				fc.Linux.Enumeration = append(fc.Linux.Enumeration, &ToolItem{
					Name:     fileName,
					FilePath: file,
					Order:    linuxEnumCount,
				})
				linuxEnumCount++
			} else if strings.Contains(relPath, "attacking") {
				fc.Linux.Attacking = append(fc.Linux.Attacking, &ToolItem{
					Name:     fileName,
					FilePath: file,
					Order:    linuxAttackCount,
				})
				linuxAttackCount++
			}
		} else if strings.Contains(relPath, "windows") {
			if strings.Contains(relPath, "enumeration") {
				fc.Windows.Enumeration = append(fc.Windows.Enumeration, &ToolItem{
					Name:     fileName,
					FilePath: file,
					Order:    windowsEnumCount,
				})
				windowsEnumCount++
			} else if strings.Contains(relPath, "attacking") {
				fc.Windows.Attacking = append(fc.Windows.Attacking, &ToolItem{
					Name:     fileName,
					FilePath: file,
					Order:    windowsAttackCount,
				})
				windowsAttackCount++
			}
		}
	}
}

// DeleteTool deletes a tool from the filesystem and updates the catalog
func (fc *FileCatalog) DeleteTool(category, platform, toolName string, baseDir string) error {
	var toolPath string
	
	switch {
	case platform == "linux" && category == "enumeration":
		for i, tool := range fc.Linux.Enumeration {
			if tool.Name == toolName {
				toolPath = tool.FilePath
				// Remove from slice
				fc.Linux.Enumeration = append(fc.Linux.Enumeration[:i], fc.Linux.Enumeration[i+1:]...)
				break
			}
		}
	case platform == "linux" && category == "attacking":
		for i, tool := range fc.Linux.Attacking {
			if tool.Name == toolName {
				toolPath = tool.FilePath
				// Remove from slice
				fc.Linux.Attacking = append(fc.Linux.Attacking[:i], fc.Linux.Attacking[i+1:]...)
				break
			}
		}
	case platform == "windows" && category == "enumeration":
		for i, tool := range fc.Windows.Enumeration {
			if tool.Name == toolName {
				toolPath = tool.FilePath
				// Remove from slice
				fc.Windows.Enumeration = append(fc.Windows.Enumeration[:i], fc.Windows.Enumeration[i+1:]...)
				break
			}
		}
	case platform == "windows" && category == "attacking":
		for i, tool := range fc.Windows.Attacking {
			if tool.Name == toolName {
				toolPath = tool.FilePath
				// Remove from slice
				fc.Windows.Attacking = append(fc.Windows.Attacking[:i], fc.Windows.Attacking[i+1:]...)
				break
			}
		}
	}
	
	if toolPath == "" {
		return os.ErrNotExist
	}
	
	// Delete the actual file
	return os.Remove(toolPath)
}

// ReorderTools reorders tools in a category
func (fc *FileCatalog) ReorderTools(category, platform string, newOrder []string) error {
	switch {
	case platform == "linux" && category == "enumeration":
		for i, toolName := range newOrder {
			for j, tool := range fc.Linux.Enumeration {
				if tool.Name == toolName {
					fc.Linux.Enumeration[j].Order = i
					break
				}
			}
		}
	case platform == "linux" && category == "attacking":
		for i, toolName := range newOrder {
			for j, tool := range fc.Linux.Attacking {
				if tool.Name == toolName {
					fc.Linux.Attacking[j].Order = i
					break
				}
			}
		}
	case platform == "windows" && category == "enumeration":
		for i, toolName := range newOrder {
			for j, tool := range fc.Windows.Enumeration {
				if tool.Name == toolName {
					fc.Windows.Enumeration[j].Order = i
					break
				}
			}
		}
	case platform == "windows" && category == "attacking":
		for i, toolName := range newOrder {
			for j, tool := range fc.Windows.Attacking {
				if tool.Name == toolName {
					fc.Windows.Attacking[j].Order = i
					break
				}
			}
		}
	}
	
	return nil
}

// ListUploadedFiles returns a list of all files in the upload directory
func ListUploadedFiles(uploadDir string) ([]string, error) {
	files, err := os.ReadDir(uploadDir)
	if err != nil {
		return nil, err
	}
	
	var fileNames []string
	for _, file := range files {
		if !file.IsDir() {
			fileNames = append(fileNames, file.Name())
		}
	}
	
	return fileNames, nil
}
