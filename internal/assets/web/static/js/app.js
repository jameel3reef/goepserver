document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    
    // Upload modal functionality
    const uploadBtn = document.getElementById('upload-btn');
    const uploadModal = document.getElementById('upload-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            uploadModal.classList.add('open');
            
            // Generate command texts directly using window.location
            updateUploadCommands();
            
            // Initialize Prism.js syntax highlighting for code blocks
            setTimeout(() => {
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAll();
                }
            }, 100);
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            uploadModal.classList.remove('open');
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            uploadModal.classList.remove('open');
        }
    });
    
    // Initialize file upload dropzone
    initFileUploadDropzone();
    
    // Initialize upload form submission
    initUploadFormSubmission();
    
    // Initialize tool upload functionality
    initToolUpload();
    
    // File input display selected filename
    const fileInput = document.getElementById('file-upload');
    const selectedFile = document.getElementById('selected-file');
    
    if (fileInput && selectedFile) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                selectedFile.textContent = fileInput.files[0].name;
                selectedFile.classList.add('active');
            } else {
                selectedFile.textContent = '';
                selectedFile.classList.remove('active');
            }
        });
    }
    
    // Tabs functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const target = this.dataset.target;
            document.getElementById(target).classList.add('active');
        });
    });
    
    // Load data based on the current page
    if (window.location.pathname === '/') {
        loadToolData();
    } else if (window.location.pathname === '/uploaded_files') {
        loadUploadedFiles();
    }
});

// Initialize theme toggle
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Apply the user's theme preference or use system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
    
    // Add click event to toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            // Toggle dark mode class
            document.body.classList.toggle('dark-mode');
            
            // Determine if dark mode is now active
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            // Update localStorage with the new preference
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Update the icon
            updateThemeIcon(isDarkMode);
        });
    }
}

// Update the theme toggle icon
function updateThemeIcon(isDarkMode) {
    const themeIcon = document.querySelector('#theme-toggle-btn i');
    if (!themeIcon) return;
    
    if (isDarkMode) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Initialize file upload dropzone
function initFileUploadDropzone() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-upload');
    const selectedFile = document.getElementById('selected-file');
    
    if (!dropzone) return;
    
    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight dropzone on dragover
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });
    
    // Remove highlight on dragleave and drop
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropzone.classList.add('highlight');
    }
    
    function unhighlight() {
        dropzone.classList.remove('highlight');
    }
    
    // Handle dropped files
    dropzone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            // Update file input and display
            fileInput.files = files;
            selectedFile.textContent = files[0].name;
            selectedFile.classList.add('active');
        }
    }
}

// Handle drag-and-drop upload submission
function initUploadFormSubmission() {
    const uploadForm = document.getElementById('upload-form');
    const uploadModal = document.getElementById('upload-modal');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(uploadForm);
            const fileInput = document.getElementById('file-upload');
            
            if (fileInput.files.length === 0) {
                showToast('Please select a file to upload', 'error');
                return;
            }
            
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Upload failed');
                }
                return response.text();
            })
            .then(data => {
                showToast('File uploaded successfully');
                if (uploadModal) {
                    uploadModal.classList.remove('open');
                }
                uploadForm.reset();
                
                // Clear selected file display
                const selectedFile = document.getElementById('selected-file');
                if (selectedFile) {
                    selectedFile.textContent = '';
                    selectedFile.classList.remove('active');
                }
                
                // Refresh data if on uploads page
                if (window.location.pathname === '/uploaded_files') {
                    loadUploadedFiles();
                }
            })
            .catch(error => {
                showToast('Upload failed: ' + error.message, 'error');
            });
        });
    }
}

/**
 * Functions for handling tool uploads with confirmation
 */
function initToolUpload() {
    // Handle drag and drop for category sections
    document.querySelectorAll('.tool-dropzone').forEach(dropzone => {
        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                const platform = dropzone.dataset.platform;
                const category = dropzone.dataset.category;
                
                uploadTool(file, platform, category);
            }
        });
    });
}

// Handle tool upload with confirmation
function uploadTool(file, platform, category) {
    const formData = new FormData();
    formData.append('tool', file);
    
    // First check if the file exists
    fetch(`/tools/upload-check/${platform}/${category}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.exists) {
            showConfirmationModal(file, platform, category);
        } else {
            // File doesn't exist, proceed with upload
            proceedWithUpload(file, platform, category, false);
        }
    })
    .catch(error => {
        showToast(`Upload check failed: ${error.message}`, 'error');
    });
}

// Show confirmation modal for file overwrite
function showConfirmationModal(file, platform, category) {
    const modal = document.getElementById('tool-confirmation-modal');
    const filenameElement = document.getElementById('confirmation-filename');
    const confirmButton = document.getElementById('confirm-upload-btn');
    
    filenameElement.textContent = file.name;
    modal.classList.add('open');
    
    // Update the confirm button to handle this specific upload
    confirmButton.onclick = () => {
        modal.classList.remove('open');
        proceedWithUpload(file, platform, category, true);
    };
}

// Proceed with the actual upload
function proceedWithUpload(file, platform, category, confirmed) {
    const formData = new FormData();
    formData.append('tool', file);
    
    if (confirmed) {
        formData.append('confirmed', 'true');
    }
    
    fetch(`/tools/upload/${platform}/${category}`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.status === 409) {
            // Conflict - file exists and needs confirmation
            return response.json().then(data => {
                showConfirmationModal(file, platform, category);
                return Promise.reject('File exists, confirmation required');
            });
        }
        return response.json();
    })
    .then(data => {
        showToast(`Tool ${file.name} uploaded successfully`);
        // Refresh the tool list
        loadToolData();
    })
    .catch(error => {
        if (error !== 'File exists, confirmation required') {
            showToast(`Upload failed: ${error}`, 'error');
        }
    });
}

// Close the confirmation modal
function closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// Copy to clipboard function
function copyToClipboard(text) {
    // Create a temporary input
    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    
    // Set the value and select it
    input.value = window.location.origin + text;
    input.select();
    
    // Copy and clean up
    document.execCommand('copy');
    document.body.removeChild(input);
    
    // Show toast notification
    showToast('Link copied to clipboard!');
    
    // Add visual feedback to the clicked item
    const items = document.querySelectorAll('.tool-item');
    items.forEach(item => {
        if (item.dataset.file === text) {
            item.classList.add('copied');
            setTimeout(() => {
                item.classList.remove('copied');
            }, 1000);
        }
    });
}

// Update upload commands with current server info
function updateUploadCommands() {
    // Get current host and port from window location
    const currentHost = window.location.hostname || 'localhost';
    const currentPort = window.location.port || '80';
    const baseUrl = `http://${currentHost}:${currentPort}`;
    
    // Update Linux curl command
    const linuxCmd = document.getElementById('curl-command-linux');
    if (linuxCmd) {
        linuxCmd.textContent = `curl ${baseUrl}/upload -F 'f=@yourfile'`;
    }
    
    // Update Windows curl command
    const windowsCmd = document.getElementById('curl-command-windows');
    if (windowsCmd) {
        windowsCmd.textContent = `curl.exe ${baseUrl}/upload -F "f=@yourfile"`;
    }
    
    // Update PowerShell command
    const psCmd = document.getElementById('powershell-command');
    if (psCmd) {
        psCmd.textContent = `Invoke-RestMethod -Uri ${baseUrl}/upload -Method Post -Form @{f=Get-Item -Path "yourfile"}`;
    }
}

// Copy curl command
function copyCurlCommand(platform) {
    let selector = '#curl-command-linux';
    if (platform === 'windows') {
        selector = '#curl-command-windows';
    }
    const curlCommand = document.querySelector(selector);
    navigator.clipboard.writeText(curlCommand.textContent)
        .then(() => {
            showToast('Command copied to clipboard!');
        })
        .catch(err => {
            showToast('Failed to copy command', 'error');
        });
}

// Copy PowerShell command
function copyPowerShellCommand() {
    const psCommand = document.getElementById('powershell-command');
    navigator.clipboard.writeText(psCommand.textContent)
        .then(() => {
            showToast('Command copied to clipboard!');
        })
        .catch(err => {
            showToast('Failed to copy command', 'error');
        });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastContent = toast.querySelector('span');
    const toastIcon = toast.querySelector('i');
    
    // Update toast content
    toastContent.textContent = message;
    
    // Update toast style based on type
    if (type === 'error') {
        toast.style.backgroundColor = 'var(--danger-color)';
        toastIcon.className = 'fas fa-exclamation-circle';
    } else {
        toast.style.backgroundColor = 'var(--secondary-color)';
        toastIcon.className = 'fas fa-check-circle';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Function to load tool data
function loadToolData() {
    fetch('/api/tool-data')
        .then(response => response.json())
        .then(data => {
            // Update Linux tools
            updateToolList('linux-enumeration', data.LinuxFiles.Enumeration);
            updateToolList('linux-attacking', data.LinuxFiles.Attacking);
            
            // Update Windows tools
            updateToolList('windows-enumeration', data.WindowsFiles.Enumeration);
            updateToolList('windows-attacking', data.WindowsFiles.Attacking);
            
            // Initialize drag and drop sorting
            initSortable();
        })
        .catch(error => {
            console.error('Error loading tool data:', error);
        });
}

// Update tool list in the UI
function updateToolList(listId, tools) {
    const list = document.getElementById(listId);
    if (!list) return;
    
    // Get platform and category from the list
    const platform = list.dataset.platform;
    const category = list.dataset.category;
    
    // Clear the list
    list.innerHTML = '';
    
    // Add tools to the list
    if (tools && tools.length > 0) {
        tools.forEach(tool => {
            const li = document.createElement('li');
            li.className = 'tool-item';
            li.dataset.file = `/${tool.Name}`;
            li.dataset.name = tool.Name;
            
            // Use the correct inner HTML structure with drag handle
            li.innerHTML = `
                <div class="tool-drag-handle"><i class="fas fa-grip-lines"></i></div>
                <span class="tool-name" onclick="copyToClipboard('/${tool.Name}')">${tool.Name}</span>
                <div class="tool-actions">
                    <span class="copy-icon" onclick="copyToClipboard('/${tool.Name}')"><i class="fas fa-copy"></i></span>
                    <span class="delete-icon" onclick="confirmDeleteTool(event, '${platform}', '${category}', '${tool.Name}')"><i class="fas fa-trash"></i></span>
                </div>
            `;
            
            list.appendChild(li);
        });
    } else {
        // No tools available
        const li = document.createElement('li');
        li.className = 'tool-item empty';
        li.textContent = 'No tools available';
        list.appendChild(li);
    }
}

// Initialize sortable lists
function initSortable() {
    document.querySelectorAll('.tool-list').forEach(list => {
        if (list.classList.contains('empty')) return;
        
        new Sortable(list, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            handle: '.tool-drag-handle',
            onEnd: function(evt) {
                // Get the new order
                const items = evt.to.querySelectorAll('.tool-item:not(.empty)');
                const order = Array.from(items).map(item => item.dataset.name);
                
                // Send the new order to the server
                fetch('/tools/reorder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        platform: evt.to.dataset.platform,
                        category: evt.to.dataset.category,
                        order: order
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to reorder tools');
                    }
                    return response.text();
                })
                .then(data => {
                    // Update was successful
                    showToast('Tools reordered successfully');
                })
                .catch(error => {
                    showToast('Failed to reorder tools: ' + error.message, 'error');
                    // Reload the original order
                    loadToolData();
                });
            }
        });
    });
}

// Show confirmation dialog for deleting a tool
function confirmDeleteTool(event, platform, category, filename) {
    // Prevent event bubbling (to avoid triggering the copy action)
    if (event) {
        event.stopPropagation();
    }
    
    const modal = document.getElementById('confirmation-modal');
    const confirmationFilename = document.getElementById('confirmation-filename');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    confirmationFilename.textContent = filename;
    modal.classList.add('open');
    
    // Set up the delete button
    confirmDeleteBtn.onclick = function() {
        // Send delete request
        fetch(`/tools/delete/${platform}/${category}/${filename}`, {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete tool');
            }
            return response.text();
        })
        .then(data => {
            showToast('Tool deleted successfully');
            loadToolData();
            modal.classList.remove('open');
        })
        .catch(error => {
            showToast('Failed to delete tool: ' + error.message, 'error');
            modal.classList.remove('open');
        });
    };
}

// Function to load uploaded files
function loadUploadedFiles() {
    fetch('/api/uploaded-files')
        .then(response => response.json())
        .then(data => {
            // Update files container
            const container = document.getElementById('files-container');
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
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;
                
                data.Files.forEach(file => {
                    html += `
                        <tr>
                            <td>${file}</td>
                            <td class="actions">
                                <a href="/uploads/${file}" class="btn download" download>
                                    <i class="fas fa-download"></i> Download
                                </a>
                                <button class="btn delete" onclick="confirmFileDelete('${file}')">
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
                        <h3>No files uploaded yet</h3>
                        <p>Upload files using the button in the navigation bar or with curl</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading uploaded files:', error);
            const container = document.getElementById('files-container');
            if (container) {
                container.innerHTML = `
                    <div class="card-body empty-state">
                        <i class="fas fa-exclamation-circle empty-icon"></i>
                        <h3>Error loading files</h3>
                        <p>Failed to load uploaded files: ${error.message}</p>
                    </div>
                `;
            }
        });
}
// Show confirmation dialog for deleting a file
function confirmFileDelete(filename) {
    const modal = document.getElementById('file-delete-modal');
    const filenameElement = document.getElementById('file-delete-name');
    const confirmBtn = document.getElementById('confirm-file-delete-btn');
    
    filenameElement.textContent = filename;
    modal.classList.add('open');
    
    // Set up the confirm button
    confirmBtn.onclick = function() {
        // Send delete request
        fetch(`/delete_file/${filename}`, {
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
            loadUploadedFiles(); // Refresh the file list
            closeFileDeleteModal();
        })
        .catch(error => {
            showToast('Failed to delete file: ' + error.message, 'error');
            closeFileDeleteModal();
        });
    };
}

// Close the file delete confirmation modal
function closeFileDeleteModal() {
    const modal = document.getElementById('file-delete-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}