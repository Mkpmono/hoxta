<?php
session_start();
require_once __DIR__ . '/../partials/head.php';

if (!isset($_SESSION['demo_user'])) {
    header('Location: ' . $BASE_URL . '/panel/login.php');
    exit;
}
$user = $_SESSION['demo_user'];
$serviceId = $_GET['id'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php echo getHeadContent('Upgrade Service - Control Panel', 'Upgrade or downgrade your service'); ?>
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
                        <span><strong>Demo Mode</strong> - Upgrade actions are simulated.</span>
                    </div>

                    <div class="page-header">
                        <a href="<?php echo $BASE_URL; ?>/panel/service.php?id=<?php echo htmlspecialchars($serviceId); ?>" class="back-link">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Back to Service
                        </a>
                        <h1 class="panel-title">Upgrade / Downgrade</h1>
                    </div>
                    
                    <div class="upgrade-container" id="upgrade-container">
                        <div class="loading-state">
                            <div class="spinner"></div>
                            <p>Loading upgrade options...</p>
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
        const serviceId = '<?php echo htmlspecialchars($serviceId); ?>';

        document.addEventListener('DOMContentLoaded', async function() {
            try {
                const service = await PanelAPI.getServiceDetails(serviceId);
                const options = await PanelAPI.getUpgradeOptions(serviceId);
                renderUpgradeOptions(service, options);
            } catch (error) {
                console.error('Failed to load upgrade options:', error);
                document.getElementById('upgrade-container').innerHTML = `
                    <div class="error-state glass-card">
                        <svg class="w-12 h-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <h3>Failed to Load Options</h3>
                        <p class="text-muted">Unable to fetch upgrade options. Please try again.</p>
                        <a href="${BASE_URL}/panel/services.php" class="btn-glow">Back to Services</a>
                    </div>
                `;
            }
        });

        function renderUpgradeOptions(service, options) {
            const container = document.getElementById('upgrade-container');
            
            if (!options || options.length === 0) {
                container.innerHTML = `
                    <div class="empty-state glass-card">
                        <svg class="w-12 h-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <h3>No Upgrade Options Available</h3>
                        <p class="text-muted">Your current plan is already at the highest tier, or no alternatives are available.</p>
                        <a href="${BASE_URL}/panel/service.php?id=${serviceId}" class="btn-outline">Back to Service</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="current-plan glass-card">
                    <div class="plan-badge">Current Plan</div>
                    <h3>${service.name}</h3>
                    <p class="plan-price">$${service.price}<span>/mo</span></p>
                    <ul class="plan-features">
                        ${service.specs ? service.specs.map(spec => `<li><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${spec}</li>`).join('') : ''}
                    </ul>
                </div>

                <div class="upgrade-arrow">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>

                <div class="upgrade-options">
                    ${options.map((opt, idx) => `
                        <div class="upgrade-option glass-card ${opt.recommended ? 'recommended' : ''}" data-option-id="${opt.id}">
                            ${opt.recommended ? '<div class="recommended-badge">Recommended</div>' : ''}
                            <h3>${opt.name}</h3>
                            <p class="plan-price">$${opt.price}<span>/mo</span></p>
                            <p class="price-diff ${opt.priceDiff > 0 ? 'upgrade' : 'downgrade'}">
                                ${opt.priceDiff > 0 ? '+' : ''}$${opt.priceDiff}/mo
                            </p>
                            <ul class="plan-features">
                                ${opt.features ? opt.features.map(f => `<li><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>${f}</li>`).join('') : ''}
                            </ul>
                            <button class="btn-glow w-full" onclick="selectUpgrade('${opt.id}', '${opt.name}', ${opt.priceDiff})">
                                ${opt.priceDiff > 0 ? 'Upgrade' : 'Downgrade'} to ${opt.name}
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function selectUpgrade(optionId, optionName, priceDiff) {
            const action = priceDiff > 0 ? 'upgrade' : 'downgrade';
            const confirmed = confirm(`Are you sure you want to ${action} to ${optionName}? ${priceDiff > 0 ? 'You will be charged the prorated difference.' : 'Changes will take effect at the next billing cycle.'}`);
            
            if (confirmed) {
                // Simulate upgrade
                showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} request submitted successfully!`, 'success');
                setTimeout(() => {
                    window.location.href = `${BASE_URL}/panel/service.php?id=${serviceId}`;
                }, 1500);
            }
        }

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
