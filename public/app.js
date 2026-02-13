// MedMicro PWA JavaScript

// State
let allMeds = [];
let allGuidelines = [];
let currentMedClass = 'all';
let currentGuidelineCategory = '';
let deferredPrompt = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('MedMicro PWA initializing...');

    // Register service worker
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    // Install prompt handler
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Med class filters
    document.querySelectorAll('#meds-tab .pill').forEach(pill => {
        pill.addEventListener('click', () => filterMeds(pill.dataset.class));
    });

    // Guideline category filters
    document.querySelectorAll('#guidelines-tab .pill').forEach(pill => {
        pill.addEventListener('click', () => filterGuidelines(pill.dataset.category));
    });

    // Criteria cards
    document.querySelectorAll('.criteria-card').forEach(card => {
        card.addEventListener('click', () => showCriteria(card.dataset.disorder));
    });

    // Load data
    await loadMeds();
    await loadGuidelines();
});

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Search
function handleSearch(e) {
    const query = e.target.value.toLowerCase();

    // Search meds
    const medCards = document.querySelectorAll('#meds-list .card');
    medCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });

    // Search guidelines
    const guidelineCards = document.querySelectorAll('#guidelines-list .card');
    guidelineCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });
}

// Load medications
async function loadMeds() {
    try {
        const response = await fetch('/api/meds');
        const data = await response.json();

        if (data.success) {
            allMeds = data.data;
            renderMeds(allMeds);
        }
    } catch (error) {
        console.error('Failed to load meds:', error);
        document.getElementById('meds-list').innerHTML = '<div class="loading">Failed to load medications</div>';
    }
}

// Render medications
function renderMeds(meds) {
    const container = document.getElementById('meds-list');

    if (meds.length === 0) {
        container.innerHTML = '<div class="loading">No medications found</div>';
        return;
    }

    container.innerHTML = meds.map(med => `
        <div class="card" onclick="showMed('${med.name.toLowerCase()}')">
            <h3>${med.name}</h3>
            <p class="card-meta">${med.genericName}</p>
            <div class="card-tags">
                ${med.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-dose">
                <strong>Maintenance:</strong> ${med.dosing.adult_maintenance}
            </div>
        </div>
    `).join('');
}

// Filter medications by class
function filterMeds(className) {
    // Update active pill
    document.querySelectorAll('#meds-tab .pill').forEach(p => p.classList.remove('active'));
    document.querySelector(`#meds-tab .pill[data-class="${className}"]`).classList.add('active');

    currentMedClass = className;

    if (className === 'all') {
        renderMeds(allMeds);
    } else {
        const filtered = allMeds.filter(med =>
            med.tags.some(tag => tag.toLowerCase().includes(className.toLowerCase()))
        );
        renderMeds(filtered);
    }
}

// Show medication details
async function showMed(medName) {
    try {
        const response = await fetch(`/api/meds/search?q=${medName}`);
        const data = await response.json();

        if (data.success && data.data) {
            const med = data.data;
            let html = `
                <h2>${med.name}</h2>
                <p style="color: #6b7280; margin-bottom: 1rem;">${med.genericName}</p>

                <h3>Class</h3>
                <p>${med.tags.join(', ')}</p>

                <h3>Dosing</h3>
                <ul>
                    <li><strong>Acute:</strong> ${med.dosing.adult_acute}</li>
                    <li><strong>Maintenance:</strong> ${med.dosing.adult_maintenance}</li>
                    ${med.dosing.notes ? `<li><strong>Notes:</strong> ${med.dosing.notes}</li>` : ''}
                </ul>
            `;

            if (med.dosing.canadian_clinical) {
                const can = med.dosing.canadian_clinical;
                html += `
                    <h3>🇨🇦 Canadian Clinical Guidelines</h3>
                    <ul>
                        <li><strong>Starting dose:</strong> ${can.starting_dose}</li>
                        <li><strong>Titration:</strong> ${can.titration_schedule}</li>
                        <li><strong>Max (Evidence):</strong> ${can.max_dose_evidence}</li>
                        <li><strong>Max (Practice):</strong> ${can.max_dose_practice}</li>
                        <li><strong>Inpatient:</strong> ${can.inpatient_strategy}</li>
                        <li><strong>Outpatient:</strong> ${can.outpatient_strategy}</li>
                    </ul>
                `;
            }

            html += `
                <h3>Warnings</h3>
                <ul>
                    ${med.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>

                <h3>Cautions</h3>
                <ul>
                    <li><strong>Renal:</strong> ${med.cautions.renal}</li>
                    <li><strong>Hepatic:</strong> ${med.cautions.hepatic}</li>
                    <li><strong>Pregnancy:</strong> ${med.cautions.pregnancy}</li>
                </ul>

                <h3>References</h3>
                <p style="font-size: 0.875rem; color: #6b7280;">${med.citations.join('; ')}</p>
            `;

            showModal(html);
        }
    } catch (error) {
        console.error('Failed to load medication:', error);
    }
}

// Load guidelines
async function loadGuidelines() {
    try {
        const response = await fetch('/api/guidelines');
        const data = await response.json();

        if (data.success) {
            allGuidelines = data.data;
            renderGuidelines(allGuidelines);
        }
    } catch (error) {
        console.error('Failed to load guidelines:', error);
        document.getElementById('guidelines-list').innerHTML = '<div class="loading">Failed to load guidelines</div>';
    }
}

// Render guidelines
function renderGuidelines(guidelines) {
    const container = document.getElementById('guidelines-list');

    if (guidelines.length === 0) {
        container.innerHTML = '<div class="loading">No guidelines found</div>';
        return;
    }

    container.innerHTML = guidelines.map(guideline => `
        <div class="card" onclick="showGuideline('${guideline.id}')">
            <h3>${guideline.title}</h3>
            <p class="card-meta">${guideline.organization} • ${guideline.year}</p>
            <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">
                ${guideline.content.substring(0, 150)}...
            </p>
        </div>
    `).join('');
}

// Filter guidelines by category
function filterGuidelines(category) {
    // Update active pill
    document.querySelectorAll('#guidelines-tab .pill').forEach(p => p.classList.remove('active'));
    document.querySelector(`#guidelines-tab .pill[data-category="${category}"]`).classList.add('active');

    currentGuidelineCategory = category;

    if (!category) {
        renderGuidelines(allGuidelines);
    } else {
        const filtered = allGuidelines.filter(guideline =>
            guideline.title.toLowerCase().includes(category) ||
            guideline.content.toLowerCase().includes(category)
        );
        renderGuidelines(filtered);
    }
}

// Show guideline details
function showGuideline(guidelineId) {
    const guideline = allGuidelines.find(g => g.id === guidelineId);

    if (guideline) {
        const html = `
            <h2>${guideline.title}</h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">${guideline.organization} • ${guideline.year}</p>
            <div style="white-space: pre-wrap; line-height: 1.8;">${guideline.content}</div>
        `;
        showModal(html);
    }
}

// Show diagnostic criteria
async function showCriteria(disorder) {
    try {
        const response = await fetch(`/api/criteria/${disorder}`);
        const data = await response.json();

        if (data.success && data.data) {
            const criteria = data.data;
            const html = `
                <h2>${criteria.disorder}</h2>
                <p style="color: #6b7280; margin-bottom: 1rem;">Code: ${criteria.code}</p>

                <h3>Diagnostic Criteria</h3>
                <ol>
                    ${criteria.criteria.map(c => `<li>${c}</li>`).join('')}
                </ol>

                ${criteria.specifiers.length > 0 ? `
                    <h3>Specifiers</h3>
                    <ul>
                        ${criteria.specifiers.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                ` : ''}

                <p style="margin-top: 1.5rem; font-size: 0.875rem; color: #6b7280; font-style: italic;">
                    DSM-5 criteria for reference only. Not for diagnosis without clinical assessment.
                </p>
            `;
            showModal(html);
        }
    } catch (error) {
        console.error('Failed to load criteria:', error);
    }
}

// Calculator functions
async function calculatePHQ9() {
    const score = parseInt(document.getElementById('phq9-input').value);
    const resultDiv = document.getElementById('phq9-result');

    if (isNaN(score) || score < 0 || score > 27) {
        resultDiv.innerHTML = '<span style="color: #ef4444;">Please enter a valid score (0-27)</span>';
        resultDiv.classList.add('show');
        return;
    }

    try {
        const response = await fetch('/api/calc/phq9', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score })
        });
        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Score:</strong> ${data.data.score}/27<br>
                <strong>Severity:</strong> ${data.data.interpretation}<br><br>
                <div style="font-size: 0.75rem; color: #6b7280;">
                    <strong>Ranges:</strong><br>
                    0-4: None-minimal • 5-9: Mild<br>
                    10-14: Moderate • 15-19: Moderately severe<br>
                    20-27: Severe
                </div>
            `;
            resultDiv.classList.add('show');
        }
    } catch (error) {
        console.error('PHQ-9 calculation failed:', error);
    }
}

async function calculateGAD7() {
    const score = parseInt(document.getElementById('gad7-input').value);
    const resultDiv = document.getElementById('gad7-result');

    if (isNaN(score) || score < 0 || score > 21) {
        resultDiv.innerHTML = '<span style="color: #ef4444;">Please enter a valid score (0-21)</span>';
        resultDiv.classList.add('show');
        return;
    }

    try {
        const response = await fetch('/api/calc/gad7', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score })
        });
        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Score:</strong> ${data.data.score}/21<br>
                <strong>Severity:</strong> ${data.data.interpretation}<br><br>
                <div style="font-size: 0.75rem; color: #6b7280;">
                    <strong>Ranges:</strong><br>
                    0-4: Minimal • 5-9: Mild<br>
                    10-14: Moderate • 15-21: Severe
                </div>
            `;
            resultDiv.classList.add('show');
        }
    } catch (error) {
        console.error('GAD-7 calculation failed:', error);
    }
}

async function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);
    const resultDiv = document.getElementById('bmi-result');

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        resultDiv.innerHTML = '<span style="color: #ef4444;">Please enter valid weight and height</span>';
        resultDiv.classList.add('show');
        return;
    }

    try {
        const response = await fetch('/api/calc/bmi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ weight, height })
        });
        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Weight:</strong> ${weight} kg<br>
                <strong>Height:</strong> ${height} cm<br>
                <strong>BMI:</strong> ${data.data.bmi}<br>
                <strong>Category:</strong> ${data.data.interpretation}<br><br>
                <div style="font-size: 0.75rem; color: #6b7280;">
                    <strong>Categories:</strong><br>
                    &lt;18.5: Underweight • 18.5-24.9: Normal<br>
                    25-29.9: Overweight • ≥30: Obese
                </div>
            `;
            resultDiv.classList.add('show');
        }
    } catch (error) {
        console.error('BMI calculation failed:', error);
    }
}

// Modal functions
function showModal(html) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = html;
    modal.classList.add('show');

    // Close on backdrop click
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Install prompt functions
function showInstallPrompt() {
    document.getElementById('install-prompt').classList.remove('hidden');

    document.getElementById('install-button').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Install prompt outcome: ${outcome}`);
            deferredPrompt = null;
            dismissInstall();
        }
    });
}

function dismissInstall() {
    document.getElementById('install-prompt').classList.add('hidden');
}
