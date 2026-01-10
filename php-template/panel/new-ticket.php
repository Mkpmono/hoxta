<?php
session_start();
require_once __DIR__ . '/../partials/head.php';

if (!isset($_SESSION['demo_user'])) {
    header('Location: ' . $BASE_URL . '/panel/login.php');
    exit;
}
$user = $_SESSION['demo_user'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php echo getHeadContent('New Ticket - Control Panel', 'Open a new support ticket'); ?>
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>/assets/css/panel.css">
</head>
<body>
    <div class="panel-layout">
        <?php include __DIR__ . '/partials/sidebar.php'; ?>
        
        <div class="panel-main">
            <?php include __DIR__ . '/partials/topbar.php'; ?>
            
            <main class="panel-content">
                <div class="panel-page" data-animate="fadeIn">
                    <div class="mock-banner">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span><strong>Demo Mode</strong> - Tickets are simulated.</span>
                    </div>

                    <div class="page-header">
                        <a href="<?php echo $BASE_URL; ?>/panel/tickets.php" class="back-link">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Back to Tickets
                        </a>
                        <h1 class="panel-title">Open New Ticket</h1>
                    </div>
                    
                    <div class="glass-card">
                        <form id="new-ticket-form" class="ticket-form">
                            <div class="form-group">
                                <label class="form-label">Subject <span class="required">*</span></label>
                                <input type="text" class="form-input" id="subject" placeholder="Brief description of your issue" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Department <span class="required">*</span></label>
                                    <select class="form-select" id="department" required>
                                        <option value="">Select Department</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing</option>
                                        <option value="sales">Sales</option>
                                        <option value="abuse">Abuse</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Priority <span class="required">*</span></label>
                                    <select class="form-select" id="priority" required>
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Related Service (Optional)</label>
                                <select class="form-select" id="relatedService">
                                    <option value="">None</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Message <span class="required">*</span></label>
                                <textarea class="form-textarea" id="message" rows="8" placeholder="Please describe your issue in detail. Include any relevant information such as error messages, steps to reproduce, etc." required></textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Attachments (Optional)</label>
                                <div class="file-upload" id="file-upload">
                                    <input type="file" id="attachments" multiple accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.log" class="file-input">
                                    <div class="file-upload-content">
                                        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                                        <p>Drag and drop files here, or <span class="text-primary">browse</span></p>
                                        <p class="text-muted text-sm">Max 5MB per file. Allowed: JPG, PNG, GIF, PDF, TXT, LOG</p>
                                    </div>
                                </div>
                                <div id="file-list" class="file-list"></div>
                            </div>

                            <div class="form-actions">
                                <a href="<?php echo $BASE_URL; ?>/panel/tickets.php" class="btn-outline">Cancel</a>
                                <button type="submit" class="btn-glow" id="submit-btn">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Help Section -->
                    <div class="help-section">
                        <div class="glass-card help-card">
                            <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <div>
                                <h4>Before You Submit</h4>
                                <p class="text-muted">Check our <a href="<?php echo $BASE_URL; ?>/knowledge-base.php" class="text-primary">Knowledge Base</a> for quick answers to common questions.</p>
                            </div>
                        </div>
                        <div class="glass-card help-card">
                            <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <div>
                                <h4>Response Times</h4>
                                <p class="text-muted">High priority: &lt;1 hour • Medium: &lt;4 hours • Low: &lt;24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="<?php echo $BASE_URL; ?>/assets/js/panel-api.js"></script>
    <script src="<?php echo $BASE_URL; ?>/assets/js/panel.js"></script>
    <script>
        const BASE_URL = '<?php echo $BASE_URL; ?>';
        let selectedFiles = [];

        document.addEventListener('DOMContentLoaded', async function() {
            // Load services for dropdown
            try {
                const services = await PanelAPI.getServices();
                const select = document.getElementById('relatedService');
                services.forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.id;
                    option.textContent = service.name;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Failed to load services:', error);
            }

            // File upload handling
            const fileInput = document.getElementById('attachments');
            const fileUpload = document.getElementById('file-upload');

            fileUpload.addEventListener('click', () => fileInput.click());
            
            fileUpload.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUpload.classList.add('dragover');
            });
            
            fileUpload.addEventListener('dragleave', () => {
                fileUpload.classList.remove('dragover');
            });
            
            fileUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUpload.classList.remove('dragover');
                handleFiles(e.dataTransfer.files);
            });

            fileInput.addEventListener('change', (e) => {
                handleFiles(e.target.files);
            });
        });

        function handleFiles(files) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowed = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt', 'log'];
            
            Array.from(files).forEach(file => {
                const ext = file.name.split('.').pop().toLowerCase();
                
                if (!allowed.includes(ext)) {
                    showToast(`File type .${ext} not allowed`, 'error');
                    return;
                }
                
                if (file.size > maxSize) {
                    showToast(`${file.name} exceeds 5MB limit`, 'error');
                    return;
                }
                
                selectedFiles.push(file);
            });
            
            renderFileList();
        }

        function renderFileList() {
            const container = document.getElementById('file-list');
            
            if (selectedFiles.length === 0) {
                container.innerHTML = '';
                return;
            }
            
            container.innerHTML = selectedFiles.map((file, idx) => `
                <div class="file-item">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                    <button type="button" class="file-remove" onclick="removeFile(${idx})">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            `).join('');
        }

        function removeFile(index) {
            selectedFiles.splice(index, 1);
            renderFileList();
        }

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }

        document.getElementById('new-ticket-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('subject').value;
            const department = document.getElementById('department').value;
            const priority = document.getElementById('priority').value;
            const message = document.getElementById('message').value;
            const relatedService = document.getElementById('relatedService').value;
            
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-sm"></span> Submitting...';
            
            try {
                const result = await PanelAPI.createTicket({
                    subject,
                    department,
                    priority,
                    message,
                    relatedService
                });
                
                showToast('Ticket created successfully!', 'success');
                
                setTimeout(() => {
                    window.location.href = `${BASE_URL}/panel/ticket.php?id=${result.id}`;
                }, 1000);
            } catch (error) {
                showToast('Failed to create ticket', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Submit Ticket';
            }
        });

        function showToast(message, type) {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    </script>
</body>
</html>
