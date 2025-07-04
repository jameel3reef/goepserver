document.addEventListener('DOMContentLoaded', function() {
    const payloadTypeSelect = document.getElementById('payload-type');
    const fileTypeSelect = document.getElementById('file-type');
    const fileTypeGroup = document.getElementById('file-type-group');
    const filenameGroup = document.getElementById('filename-group');
    const fileDescription = document.getElementById('file-description');
    const payloadDescription = document.getElementById('payload-description');
    const reverseShellParams = document.getElementById('reverse-shell-params');
    const executeCommandParams = document.getElementById('execute-command-params');
    const expyForm = document.getElementById('expy-form');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    const downloadBtn = document.getElementById('download-btn');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    
    // Hide the buttons initially
    if (downloadBtn) downloadBtn.style.display = 'none';
    if (copyLinkBtn) copyLinkBtn.style.display = 'none';
    
    // Load previously generated files on page load
    loadExpyFiles();
    
    // Payload type descriptions
    const payloadDescriptions = {
        'reverse_shell': 'Creates a payload that establishes a reverse shell connection back to your listener. You\'ll need to set up a listener (e.g., Netcat) on your attack machine.',
        'execute_command': 'Creates a payload that executes a specified command on the target system when triggered.'
    };
    
    // File type options by payload type
    const fileTypeOptions = {
        'reverse_shell': [
            { value: 'dll_hijack', label: 'DLL Hijack' },
            { value: 'service_hijack', label: 'Service Hijack EXE' },
            { value: 'Library_ms', label: 'Library-ms' },
            { value: 'microsoft_macro', label: 'Microsoft Office Macro' },
            { value: 'lnk', label: 'LNK Shortcut' }
        ],
        'execute_command': [
            { value: 'dll_hijack', label: 'DLL Hijack' },
            { value: 'service_hijack', label: 'Service Hijack EXE' },
            { value: 'lnk', label: 'LNK Shortcut' }
        ]
    };
    
    // File type descriptions
    const fileTypeDescriptions = {
        'dll_hijack': 'Creates a malicious DLL file that executes the payload when loaded by an application. <strong>Note:</strong> Requires mingw-w64 on the server. If not available, will generate C source code only.',
        'service_hijack': 'Creates a malicious EXE file for service hijacking. <strong>Note:</strong> Requires mingw-w64 on the server. If not available, will generate C source code only.',
        'Library_ms': 'Creates a malicious .Library-ms file that triggers a connection to a remote SMB server when opened. Can be used for hash capturing and other attacks.',
        'microsoft_macro': 'Generates VBA macro code for Microsoft Office documents. These macros can execute the payload when the document is opened.',
        'lnk': 'Creates a malicious .lnk shortcut file that executes the payload when opened. <strong>Note:</strong> Requires pylnk3 on the server.'
    };
    
    // Update form based on payload type selection
    if (payloadTypeSelect) {
        payloadTypeSelect.addEventListener('change', function() {
            const selectedPayloadType = this.value;
            
            // Display payload description
            if (payloadDescriptions[selectedPayloadType]) {
                payloadDescription.innerHTML = `
                    <div class="description-card">
                        <h4>${selectedPayloadType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <p>${payloadDescriptions[selectedPayloadType]}</p>
                    </div>
                `;
            } else {
                payloadDescription.innerHTML = '<p class="description-text">Select a payload type to continue.</p>';
            }
            
            // Show file type selection
            fileTypeGroup.style.display = 'block';
            
            // Populate file type options based on payload type
            fileTypeSelect.innerHTML = '<option value="" selected disabled>Select file type</option>';
            
            if (fileTypeOptions[selectedPayloadType]) {
                fileTypeOptions[selectedPayloadType].forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    fileTypeSelect.appendChild(optionElement);
                });
            }
            
            // Clear file type selection
            fileTypeSelect.value = '';
            
            // Hide file type description and other fields
            fileDescription.style.display = 'none';
            filenameGroup.style.display = 'none';
            
            // Handle the reverse shell or execute command parameter fields
            const listenerIp = document.getElementById('listener-ip');
            const listenerPort = document.getElementById('listener-port');
            const commandField = document.getElementById('command');
            
            if (selectedPayloadType === 'reverse_shell') {
                // Enable reverse shell fields and disable command field
                reverseShellParams.style.display = 'block';
                if (listenerIp) {
                    listenerIp.disabled = false;
                    listenerIp.required = true;
                }
                if (listenerPort) {
                    listenerPort.disabled = false;
                    listenerPort.required = true;
                }
                
                executeCommandParams.style.display = 'none';
                if (commandField) {
                    commandField.disabled = true;
                    commandField.required = false;
                }
            } else if (selectedPayloadType === 'execute_command') {
                // Enable command field and disable reverse shell fields
                reverseShellParams.style.display = 'none';
                if (listenerIp) {
                    listenerIp.disabled = true;
                    listenerIp.required = false;
                }
                if (listenerPort) {
                    listenerPort.disabled = true;
                    listenerPort.required = false;
                }
                
                executeCommandParams.style.display = 'block';
                if (commandField) {
                    commandField.disabled = false;
                    commandField.required = true;
                }
            }
            // Hide dependency section
            const dependencySection = document.getElementById('dependency-section');
            if (dependencySection) {
                dependencySection.style.display = 'none';
            }
        });
    }
    
    // Update form based on file type selection
    if (fileTypeSelect) {
        fileTypeSelect.addEventListener('change', function() {
            const selectedFileType = this.value;
            const selectedPayloadType = payloadTypeSelect.value;
            
            // Display file type description
            if (fileTypeDescriptions[selectedFileType]) {
                fileDescription.innerHTML = `
                    <div class="description-card">
                        <h4>${selectedFileType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <p>${fileTypeDescriptions[selectedFileType]}</p>
                    </div>
                `;
                fileDescription.style.display = 'block';
            } else {
                fileDescription.style.display = 'none';
            }
            
            // Show filename field
            filenameGroup.style.display = 'block';
            
            // Show appropriate parameter fields
            if (selectedPayloadType === 'reverse_shell') {
                reverseShellParams.style.display = 'block';
                executeCommandParams.style.display = 'none';
                
                // For Library_ms, port is always 80
                if (selectedFileType === 'Library_ms') {
                    document.getElementById('port-group').style.display = 'none';
                    document.getElementById('listener-port').value = '80';
                } else {
                    document.getElementById('port-group').style.display = 'block';
                    document.getElementById('listener-port').value = '';
                }
            } else if (selectedPayloadType === 'execute_command') {
                reverseShellParams.style.display = 'none';
                executeCommandParams.style.display = 'block';
            }
            
        });
    }

    // Form submission handler
    if (expyForm) {
        expyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateExPyForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(expyForm);
            
            // Debug log to see what's being sent
            console.log('Sending form data:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            // Send request to server
            fetch('/api/expy/generate', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
                return response.json();
            })
            .then(data => {
                // Show result
                resultSection.style.display = 'block';
                
                if (data.type === 'microsoft_macro' || 
                    data.type === 'dll_hijack_source' || 
                    data.type === 'service_hijack_source') {
                    // For macros and source code, show the content
                    resultContent.innerHTML = `
                        <div class="code-block">
                            <pre><code>${escapeHtml(data.content)}</code></pre>
                            <button class="copy-code" onclick="copyCodeContent()">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    `;
                    
                    // Setup copy function
                    window.copyCodeContent = function() {
                        navigator.clipboard.writeText(data.content)
                            .then(() => {
                                showToast('Code copied to clipboard!');
                            })
                            .catch(err => {
                                // Fallback for browsers that don't support clipboard API
                                const tempInput = document.createElement('textarea');
                                tempInput.value = data.content;
                                document.body.appendChild(tempInput);
                                tempInput.select();
                                document.execCommand('copy');
                                document.body.removeChild(tempInput);
                                showToast('Code copied to clipboard!');
                            });
                    };
                    
                    // Update download button
                    const filename = data.filename.endsWith('.txt') ? data.filename : data.filename + '.txt';
                    if (downloadBtn) {
                        downloadBtn.style.display = 'flex';
                        downloadBtn.onclick = function() {
                            const blob = new Blob([data.content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        };
                    }
                    
                    // Hide the copy link button for content that has no server file
                    if (copyLinkBtn) {
                        copyLinkBtn.style.display = 'none';
                    }
                } else {
                    // For other types, show file details
                    resultContent.innerHTML = `
                        <div class="result-info">
                            <p><strong>File Type:</strong> ${data.type}</p>
                            <p><strong>File Name:</strong> ${data.filename}</p>
                            <p><strong>Status:</strong> <span class="success">Generated successfully</span></p>
                        </div>
                    `;
                    
                    // Create the download URL
                    const downloadUrl = `/expy/download/${data.filename}`;
                    
                    // Update download button
                    if (downloadBtn) {
                        downloadBtn.style.display = 'flex';
                        downloadBtn.onclick = function() {
                            window.location.href = downloadUrl;
                        };
                    }
                    
                    // Update copy link button
                    if (copyLinkBtn) {
                        copyLinkBtn.style.display = 'flex';
                        copyLinkBtn.onclick = function() {
                            const fullUrl = window.location.origin + downloadUrl;
                            navigator.clipboard.writeText(fullUrl)
                                .then(() => {
                                    showToast('Download link copied to clipboard!');
                                })
                                .catch(err => {
                                    // Fallback for browsers that don't support clipboard API
                                    const tempInput = document.createElement('textarea');
                                    tempInput.value = fullUrl;
                                    document.body.appendChild(tempInput);
                                    tempInput.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(tempInput);
                                    showToast('Download link copied to clipboard!');
                                });
                            return false; // Prevent default
                        };
                    }
                }
                
                // Refresh the file list
                loadExpyFiles();
                
                // Scroll to result
                resultSection.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                showToast('Error: ' + error.message, 'error');
                console.error('Submission error:', error);
            });
        });
    }
    
    // Validate ExPy form
    function validateExPyForm() {
        const payloadType = payloadTypeSelect.value;
        const fileType = fileTypeSelect.value;
        const filename = document.getElementById('filename').value;
        
        if (!payloadType) {
            showToast('Please select a payload type', 'error');
            return false;
        }
        
        if (!fileType) {
            showToast('Please select a file type', 'error');
            return false;
        }
        
        if (!filename) {
            showToast('Please enter a file name', 'error');
            return false;
        }
        
        if (payloadType === 'reverse_shell') {
            const listenerIP = document.getElementById('listener-ip').value;
            let listenerPort = document.getElementById('listener-port').value;
            
            if (!listenerIP) {
                showToast('Please enter a listener IP', 'error');
                return false;
            }
            
            if (fileType !== 'Library_ms' && !listenerPort) {
                showToast('Please enter a listener port', 'error');
                return false;
            }
        } else if (payloadType === 'execute_command') {
            const command = document.getElementById('command').value;
            
            if (!command) {
                showToast('Please enter a command to execute', 'error');
                return false;
            }
        }
        
        return true;
    }
    
    // Function to load previously generated ExPy files
    function loadExpyFiles() {
        fetch('/api/expy/files')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load files');
                }
                return response.json();
            })
            .then(data => {
                const container = document.getElementById('expy-files-container');
                if (!container) return;
                
                if (data.Files && data.Files.length > 0) {
                    // Files available
                    let html = `
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table uploads-table">
                                    <thead>
                                        <tr>
                                            <th>Filename</th>
                                            <th class="actions-column">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                    `;
                    
                    data.Files.forEach(file => {
                        html += `
                            <tr>
                                <td>${file}</td>
                                <td class="actions">
                                    <a href="/expy/download/${file}" class="btn download" download>
                                        <i class="fas fa-download"></i> Download
                                    </a>
                                    <button class="btn delete" onclick="confirmExpyFileDelete('${file}')">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                    
                    html += `
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;
                    
                    container.innerHTML = html;
                } else {
                    // No files
                    container.innerHTML = `
                        <div class="card-body empty-state">
                            <i class="fas fa-folder-open empty-icon"></i>
                            <h3>No files generated yet</h3>
                            <p>Use the form above to generate attack files</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error loading files:', error);
                const container = document.getElementById('expy-files-container');
                if (container) {
                    container.innerHTML = `
                        <div class="card-body empty-state">
                            <i class="fas fa-exclamation-circle empty-icon"></i>
                            <h3>Error loading files</h3>
                            <p>Failed to load generated files: ${error.message}</p>
                        </div>
                    `;
                }
            });
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});

// Expose functions to global scope for HTML event handlers
// Confirm delete for ExPy files
function confirmExpyFileDelete(filename) {
    const modal = document.getElementById('expy-file-delete-modal');
    const filenameElement = document.getElementById('expy-file-delete-name');
    const confirmBtn = document.getElementById('confirm-expy-file-delete-btn');
    
    if (!modal || !filenameElement || !confirmBtn) return;
    
    filenameElement.textContent = filename;
    modal.classList.add('open');
    
    // Set up delete handler
    confirmBtn.onclick = function() {
        fetch(`/api/expy/delete/${filename}`, {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete file');
            }
            return response.text();
        })
        .then(data => {
            showToast('File deleted successfully');
            // Refresh the file list
            fetch('/api/expy/files')
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById('expy-files-container');
                    if (!container) return;
                    
                    if (data.Files && data.Files.length > 0) {
                        // Files available
                        let html = `
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table uploads-table">
                                        <thead>
                                            <tr>
                                                <th>Filename</th>
                                                <th class="actions-column">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                        `;
                        
                        data.Files.forEach(file => {
                            html += `
                                <tr>
                                    <td>${file}</td>
                                    <td class="actions">
                                        <a href="/expy/download/${file}" class="btn download" download>
                                            <i class="fas fa-download"></i> Download
                                        </a>
                                        <button class="btn delete" onclick="confirmExpyFileDelete('${file}')">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            `;
                        });
                        
                        html += `
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `;
                        
                        container.innerHTML = html;
                    } else {
                        // No files
                        container.innerHTML = `
                            <div class="card-body empty-state">
                                <i class="fas fa-folder-open empty-icon"></i>
                                <h3>No files generated yet</h3>
                                <p>Use the form above to generate attack files</p>
                            </div>
                        `;
                    }
                });
            closeExpyFileDeleteModal();
        })
        .catch(error => {
            showToast('Failed to delete file: ' + error.message, 'error');
            closeExpyFileDeleteModal();
        });
    };
}

// Close ExPy file delete modal
function closeExpyFileDeleteModal() {
    const modal = document.getElementById('expy-file-delete-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastContent = toast.querySelector('span');
    const toastIcon = toast.querySelector('i');
    
    // Update toast content
    if (toastContent) toastContent.textContent = message;
    
    // Update toast style based on type
    if (toastIcon) {
        if (type === 'error') {
            toast.style.backgroundColor = 'var(--danger-color)';
            toastIcon.className = 'fas fa-exclamation-circle';
        } else {
            toast.style.backgroundColor = 'var(--secondary-color)';
            toastIcon.className = 'fas fa-check-circle';
        }
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}