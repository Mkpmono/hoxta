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
    <?php echo getHeadContent('Profile - Control Panel', 'Manage your account profile'); ?>
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
                        <span><strong>Demo Mode</strong> - Profile changes are simulated.</span>
                    </div>

                    <h1 class="panel-title">My Profile</h1>
                    
                    <div class="profile-grid">
                        <!-- Account Info -->
                        <div class="glass-card">
                            <div class="card-header">
                                <h2 class="card-title">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                    Account Information
                                </h2>
                            </div>
                            <div class="card-body">
                                <form id="profile-form" class="form-grid">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">First Name</label>
                                            <input type="text" class="form-input" id="firstName" value="<?php echo htmlspecialchars($user['name'] ?? 'Demo'); ?>">
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Last Name</label>
                                            <input type="text" class="form-input" id="lastName" value="User">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Email Address</label>
                                        <input type="email" class="form-input" id="email" value="<?php echo htmlspecialchars($user['email'] ?? 'demo@example.com'); ?>">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Company (Optional)</label>
                                        <input type="text" class="form-input" id="company" value="">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Phone Number</label>
                                        <input type="tel" class="form-input" id="phone" value="+1 (555) 123-4567">
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn-glow">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Address -->
                        <div class="glass-card">
                            <div class="card-header">
                                <h2 class="card-title">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    Billing Address
                                </h2>
                            </div>
                            <div class="card-body">
                                <form id="address-form" class="form-grid">
                                    <div class="form-group">
                                        <label class="form-label">Street Address</label>
                                        <input type="text" class="form-input" id="address1" value="123 Demo Street">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Address Line 2</label>
                                        <input type="text" class="form-input" id="address2" value="">
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">City</label>
                                            <input type="text" class="form-input" id="city" value="New York">
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">State/Region</label>
                                            <input type="text" class="form-input" id="state" value="NY">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">Postal Code</label>
                                            <input type="text" class="form-input" id="postcode" value="10001">
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Country</label>
                                            <select class="form-select" id="country">
                                                <option value="US" selected>United States</option>
                                                <option value="GB">United Kingdom</option>
                                                <option value="CA">Canada</option>
                                                <option value="AU">Australia</option>
                                                <option value="DE">Germany</option>
                                                <option value="FR">France</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn-glow">Update Address</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Security -->
                        <div class="glass-card">
                            <div class="card-header">
                                <h2 class="card-title">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                    Security
                                </h2>
                            </div>
                            <div class="card-body">
                                <form id="password-form" class="form-grid">
                                    <div class="form-group">
                                        <label class="form-label">Current Password</label>
                                        <input type="password" class="form-input" id="currentPassword" placeholder="Enter current password">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">New Password</label>
                                        <input type="password" class="form-input" id="newPassword" placeholder="Enter new password">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Confirm New Password</label>
                                        <input type="password" class="form-input" id="confirmPassword" placeholder="Confirm new password">
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn-glow">Change Password</button>
                                    </div>
                                </form>

                                <div class="security-options">
                                    <div class="security-option">
                                        <div class="security-info">
                                            <h4>Two-Factor Authentication</h4>
                                            <p class="text-muted">Add an extra layer of security to your account</p>
                                        </div>
                                        <button class="btn-outline btn-sm" onclick="alert('2FA setup would open here')">Enable</button>
                                    </div>
                                    <div class="security-option">
                                        <div class="security-info">
                                            <h4>Login History</h4>
                                            <p class="text-muted">View recent login activity</p>
                                        </div>
                                        <button class="btn-outline btn-sm" onclick="alert('Login history would show here')">View</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Preferences -->
                        <div class="glass-card">
                            <div class="card-header">
                                <h2 class="card-title">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    Preferences
                                </h2>
                            </div>
                            <div class="card-body">
                                <div class="preference-list">
                                    <label class="preference-item">
                                        <div class="preference-info">
                                            <h4>Email Notifications</h4>
                                            <p class="text-muted">Receive updates about your services</p>
                                        </div>
                                        <input type="checkbox" class="toggle-switch" checked>
                                    </label>
                                    <label class="preference-item">
                                        <div class="preference-info">
                                            <h4>Invoice Reminders</h4>
                                            <p class="text-muted">Get notified before invoices are due</p>
                                        </div>
                                        <input type="checkbox" class="toggle-switch" checked>
                                    </label>
                                    <label class="preference-item">
                                        <div class="preference-info">
                                            <h4>Marketing Emails</h4>
                                            <p class="text-muted">Receive promotions and offers</p>
                                        </div>
                                        <input type="checkbox" class="toggle-switch">
                                    </label>
                                </div>
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
        document.getElementById('profile-form').addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Profile updated successfully!', 'success');
        });

        document.getElementById('address-form').addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Address updated successfully!', 'success');
        });

        document.getElementById('password-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;
            
            if (newPass !== confirmPass) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            showToast('Password changed successfully!', 'success');
            e.target.reset();
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
