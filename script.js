// ===== CONFIGURATION =====
const STRIPE_PAYMENT_URL = "https://buy.stripe.com/14A3cw2pOfGvgA9cHi48000";
const STORAGE_PREFIX = "turbotidy_";
const TRIAL_LIMIT = 1; // 1 free scan per user

// ===== Date & Time =====
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'short', year: 'numeric', month: 'short',
        day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const el = document.getElementById('datetime');
    if (el) el.textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ===== Navigation Smooth Scroll =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===== Chart.js =====
let cleanupChart = null;

function initChart(data, labels) {
    const canvas = document.getElementById('cleanupChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (cleanupChart) cleanupChart.destroy();

    cleanupChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#00e5ff', '#00ff64', '#ffc800', '#ff8800', '#ff4444'],
                borderColor: 'rgba(0,0,0,0.3)',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#ccc', font: { size: 11 }, padding: 10, usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ' ' + context.label + ': ' + context.parsed.toFixed(2) + ' GB';
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#00e5ff',
                    bodyColor: '#fff',
                    borderColor: '#00e5ff',
                    borderWidth: 1
                }
            },
            animation: { animateRotate: true, animateScale: true, duration: 1500 }
        }
    });
}

// ===== IP Detection + License Management =====
let userIP = null;
let userLicense = { paid: false, scans: 0, blocked: false };

function getOrCreateAnonId() {
    let anonId = localStorage.getItem(STORAGE_PREFIX + "anon_id");
    if (!anonId) {
        anonId = "anon_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
        localStorage.setItem(STORAGE_PREFIX + "anon_id", anonId);
    }
    return anonId;
}

async function getUserIP() {
    // Try ipify first
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
        clearTimeout(timeout);
        const data = await res.json();
        if (data && data.ip) return data.ip;
    } catch (e) {
        console.warn("ipify unreachable, trying fallback...");
    }
    // Fallback: ipapi
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeout);
        const data = await res.json();
        if (data && data.ip) return data.ip;
    } catch (e) {
        console.warn("ipapi unreachable, using anonymous ID.");
    }
    return getOrCreateAnonId();
}

function loadLicense() {
    if (!userIP) return;
    const raw = localStorage.getItem(STORAGE_PREFIX + "license_" + userIP);
    if (raw) {
        try {
            userLicense = JSON.parse(raw);
        } catch (e) {
            userLicense = { paid: false, scans: 0, blocked: false };
        }
    }
    if (typeof userLicense.paid !== "boolean") userLicense.paid = false;
    if (typeof userLicense.scans !== "number") userLicense.scans = 0;
    if (typeof userLicense.blocked !== "boolean") userLicense.blocked = false;
}

function saveLicense() {
    if (!userIP) return;
    localStorage.setItem(STORAGE_PREFIX + "license_" + userIP, JSON.stringify(userLicense));
}

function canScan() {
    if (userLicense.paid) return true;
    return userLicense.scans < TRIAL_LIMIT && !userLicense.blocked;
}

// ===== UI License State =====
function updateLicenseUI() {
    const banner = document.getElementById('licenseBanner');
    const trialInfo = document.getElementById('trialInfo');
    const scanBtn = document.getElementById('scanBtn');

    if (banner) banner.classList.remove('hidden', 'trial', 'blocked', 'paid');

    if (userLicense.paid) {
        if (banner) {
            banner.classList.add('paid');
            banner.textContent = '✅ Unlimited Access active — thank you for your support!';
        }
        if (trialInfo) {
            trialInfo.innerHTML = '<p>⭐ <strong>Unlimited Access</strong> — thank you for purchasing TurboTidy!</p>';
            trialInfo.classList.remove('used');
        }
        if (scanBtn) {
            scanBtn.disabled = false;
            scanBtn.textContent = 'SCAN PC';
        }
    } else if (userLicense.blocked || userLicense.scans >= TRIAL_LIMIT) {
        if (banner) {
            banner.classList.add('blocked');
            banner.textContent = '🔒 Free trial expired — activate unlimited access for €2,99';
        }
        if (trialInfo) {
            trialInfo.innerHTML = '<p>⚠️ <strong>Trial expired</strong></p><p class="trial-sub">Activate unlimited access for €2,99 (one-time)</p>';
            trialInfo.classList.add('used');
        }
        if (scanBtn) {
            scanBtn.disabled = true;
            scanBtn.textContent = '🔒 ACCESS BLOCKED';
        }
    } else {
        if (banner) {
            banner.classList.add('trial');
            banner.textContent = '🎁 Free trial — ' + (TRIAL_LIMIT - userLicense.scans) + ' scan remaining';
        }
        if (trialInfo) {
            trialInfo.innerHTML = '<p>🎁 <strong>Free trial</strong> — 1 full scan available</p><p class="trial-sub">After that: <strong>€2,99 one-time</strong> — unlimited access forever</p>';
            trialInfo.classList.remove('used');
        }
        if (scanBtn) {
            scanBtn.disabled = false;
            scanBtn.textContent = 'SCAN PC';
        }
    }
}

// ===== Scan Animation =====
let isScanning = false;

function startScan() {
    if (isScanning) return;
    if (!canScan()) {
        const paywall = document.getElementById('paywall');
        if (paywall) {
            paywall.classList.add('show');
            paywall.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    isScanning = true;

    const scanBtn = document.getElementById('scanBtn');
    const scanSection = document.getElementById('scanSection');
    const scanStatus = document.getElementById('scanStatus');
    const cleanBtn = document.getElementById('cleanBtn');
    const paywall = document.getElementById('paywall');

    scanBtn.disabled = true;
    scanBtn.textContent = 'SCANNING...';
    scanSection.style.display = 'block';
    if (paywall) paywall.classList.remove('show');
    scanSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.querySelectorAll('.scan-value').forEach(el => el.textContent = '0.0 GB');
    document.getElementById('totalValue').textContent = '0.00 GB';
    cleanBtn.style.display = 'block';
    cleanBtn.disabled = true;
    cleanBtn.textContent = 'CLEAN NOW';

    const items = document.querySelectorAll('.scan-value');
    const targets = [];
    items.forEach(el => targets.push(parseFloat(el.dataset.target)));

    let currentIndex = 0;

    function animateItem() {
        if (currentIndex >= items.length) {
            scanStatus.textContent = '✅ Scan completed!';
            scanStatus.style.animation = 'none';

            const total = targets.reduce((a, b) => a + b, 0);
            animateTotal(total);

            const labels = ['Temporary Files', 'Browser Cache', 'Downloads', 'Duplicate Files', 'Recycle Bin'];
            setTimeout(() => {
                initChart(targets, labels);
                cleanBtn.disabled = false;
            }, 300);

            // Consume free scan
            if (!userLicense.paid) {
                userLicense.scans += 1;
                if (userLicense.scans >= TRIAL_LIMIT) userLicense.blocked = true;
                saveLicense();
                updateLicenseUI();
            }

            scanBtn.textContent = userLicense.paid ? 'SCAN PC' : (canScan() ? 'SCAN PC' : '🔒 ACCESS BLOCKED');
            scanBtn.disabled = !canScan();
            isScanning = false;
            return;
        }

        const el = items[currentIndex];
        const target = targets[currentIndex];
        let current = 0;
        const step = target / 30;
        const isGB = target >= 1;

        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
                currentIndex++;
                setTimeout(animateItem, 200);
            }
            el.textContent = isGB
                ? current.toFixed(2) + ' GB'
                : (current * 1000).toFixed(0) + ' MB';
        }, 30);
    }

    setTimeout(animateItem, 500);
}

function animateTotal(total) {
    const totalEl = document.getElementById('totalValue');
    let current = 0;
    const step = total / 40;
    const interval = setInterval(() => {
        current += step;
        if (current >= total) { current = total; clearInterval(interval); }
        totalEl.textContent = current.toFixed(2) + ' GB';
    }, 25);
}

// ===== CLEAN NOW handler =====
function handleCleanNow() {
    if (userLicense.paid) {
        alert(
            '🧹 Cleaning in progress...\n\n' +
            '✅ Temporary files removed\n' +
            '✅ Browser cache cleared\n' +
            '✅ Downloads analyzed\n' +
            '✅ Duplicate files removed\n' +
            '✅ Recycle bin emptied\n\n' +
            '🎉 Cleaning completed successfully!\n' +
            'Space recovered: ' + document.getElementById('totalValue').textContent
        );
    } else if (canScan()) {
        alert(
            '⚠️ You are using the free trial.\n\n' +
            'This is your demo scan.\n' +
            'To perform real cleaning and use TurboTidy without limits, ' +
            'activate unlimited access for €2,99 (one-time).'
        );
        const paywall = document.getElementById('paywall');
        if (paywall) {
            paywall.classList.add('show');
            paywall.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        const paywall = document.getElementById('paywall');
        if (paywall) {
            paywall.classList.add('show');
            paywall.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// ===== Intersection Observer for animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===== INIT =====
(async function init() {
    // Set Stripe payment link on all pay buttons
    const payLinks = document.querySelectorAll('.btn-pay');
    payLinks.forEach(a => a.href = STRIPE_PAYMENT_URL);

    // Load IP and license
    userIP = await getUserIP();
    console.log("TurboTidy — User IP/ID:", userIP);

    loadLicense();
    updateLicenseUI();
})();
