/**
 * HOXTA Panel JavaScript
 * Core functionality for the client panel
 */

(function() {
    'use strict';

    // ============================================
    // Mobile Sidebar Toggle
    // ============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.panel-sidebar');
    let overlay = null;

    if (mobileMenuBtn && sidebar) {
        // Create overlay
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // ============================================
    // Active Navigation State
    // ============================================
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href.split('/').pop().replace('.php', ''))) {
            item.classList.add('active');
        }
    });

    // ============================================
    // Search Functionality
    // ============================================
    const searchInput = document.querySelector('.topbar-search input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    // In a real implementation, this would search
                    console.log('Searching for:', query);
                    alert('Search functionality would search for: ' + query);
                }
            }
        });
    }

    // ============================================
    // Notification Dropdown (placeholder)
    // ============================================
    const notificationBtn = document.querySelector('.topbar-btn[title="Notifications"]');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('Notifications panel would open here');
        });
    }

    // ============================================
    // Page Animations
    // ============================================
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // ============================================
    // Form Validation Helper
    // ============================================
    window.validateForm = function(formElement) {
        const inputs = formElement.querySelectorAll('[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    };

    // ============================================
    // Global Toast Function
    // ============================================
    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ============================================
    // Confirm Dialog Helper
    // ============================================
    window.confirmAction = function(message, callback) {
        if (confirm(message)) {
            callback();
        }
    };

    // ============================================
    // Format Currency
    // ============================================
    window.formatCurrency = function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    // ============================================
    // Format Date
    // ============================================
    window.formatDate = function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // ============================================
    // Copy to Clipboard
    // ============================================
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy', 'error');
        });
    };

    // ============================================
    // Keyboard Shortcuts
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K = Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const search = document.querySelector('.topbar-search input');
            if (search) search.focus();
        }
        
        // Escape = Close sidebar on mobile
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // Initialize Tooltips (basic)
    // ============================================
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(el => {
        const title = el.getAttribute('title');
        if (title) {
            el.setAttribute('data-tooltip', title);
            // Keep native tooltip for simplicity
        }
    });

    // ============================================
    // Table Row Click Handler
    // ============================================
    const tableRows = document.querySelectorAll('.data-table tbody tr[data-href]');
    
    tableRows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function(e) {
            // Don't navigate if clicking a button or link
            if (e.target.closest('button, a')) return;
            
            const href = this.getAttribute('data-href');
            if (href) window.location.href = href;
        });
    });

    // ============================================
    // Auto-resize Textareas
    // ============================================
    const textareas = document.querySelectorAll('textarea.auto-resize');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    // ============================================
    // Logout Handler
    // ============================================
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Clear session via AJAX or redirect
                window.location.href = this.href;
            }
        });
    }

    console.log('Hoxta Panel JS initialized');
})();
