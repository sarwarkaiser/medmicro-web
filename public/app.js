// MedMicro PWA JavaScript

// State
let allMeds = [];
let allGuidelines = [];
let currentMedClass = 'all';
let currentGuidelineCategory = '';
let deferredPrompt = null;

// Calculator scales and definitions
const calcScales = {
    phq9: [
        { value: 0, label: 'Not at all (0)' },
        { value: 1, label: 'Several days (1)' },
        { value: 2, label: 'More than half the days (2)' },
        { value: 3, label: 'Nearly every day (3)' }
    ],
    gad7: [
        { value: 0, label: 'Not at all (0)' },
        { value: 1, label: 'Several days (1)' },
        { value: 2, label: 'More than half the days (2)' },
        { value: 3, label: 'Nearly every day (3)' }
    ],
    likert0to4: [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' }
    ],
    likert0to3: [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' }
    ],
    yesno: [
        { value: 0, label: 'No (0)' },
        { value: 1, label: 'Yes (1)' }
    ],
    oneToSeven: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' }
    ]
};

const calculators = [
    {
        id: 'phq9',
        title: 'PHQ-9 Depression',
        subtitle: '9 items | 0-3 each',
        type: 'items',
        scale: 'phq9',
        items: [
            { label: 'Little interest or pleasure in doing things' },
            { label: 'Feeling down, depressed, or hopeless' },
            { label: 'Trouble falling or staying asleep, or sleeping too much' },
            { label: 'Feeling tired or having little energy' },
            { label: 'Poor appetite or overeating' },
            { label: 'Feeling bad about yourself or that you are a failure or have let yourself or your family down' },
            { label: 'Trouble concentrating on things, such as reading or watching television' },
            { label: 'Moving or speaking so slowly that other people could have noticed, or the opposite, being fidgety or restless' },
            { label: 'Thoughts that you would be better off dead or of hurting yourself in some way' }
        ],
        interpretation: [
            { min: 0, max: 4, label: 'None-minimal' },
            { min: 5, max: 9, label: 'Mild' },
            { min: 10, max: 14, label: 'Moderate' },
            { min: 15, max: 19, label: 'Moderately severe' },
            { min: 20, max: 27, label: 'Severe' }
        ]
    },
    {
        id: 'gad7',
        title: 'GAD-7 Anxiety',
        subtitle: '7 items | 0-3 each',
        type: 'items',
        scale: 'gad7',
        items: [
            { label: 'Feeling nervous, anxious, or on edge' },
            { label: 'Not being able to stop or control worrying' },
            { label: 'Worrying too much about different things' },
            { label: 'Trouble relaxing' },
            { label: 'Being so restless that it is hard to sit still' },
            { label: 'Becoming easily annoyed or irritable' },
            { label: 'Feeling afraid as if something awful might happen' }
        ],
        interpretation: [
            { min: 0, max: 4, label: 'Minimal' },
            { min: 5, max: 9, label: 'Mild' },
            { min: 10, max: 14, label: 'Moderate' },
            { min: 15, max: 21, label: 'Severe' }
        ]
    },
    {
        id: 'audit',
        title: 'AUDIT (Alcohol Use)',
        subtitle: '10 items | 0-4 each (Q9-10 use 0/2/4)',
        type: 'items',
        scale: 'likert0to4',
        items: [
            { label: 'How often do you have a drink containing alcohol?' },
            { label: 'How many drinks containing alcohol do you have on a typical day when you are drinking?' },
            { label: 'How often do you have six or more drinks on one occasion?' },
            { label: 'How often during the last year have you found that you were not able to stop drinking once you had started?' },
            { label: 'How often during the last year have you failed to do what was normally expected from you because of drinking?' },
            { label: 'How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?' },
            { label: 'How often during the last year have you had a feeling of guilt or remorse after drinking?' },
            { label: 'How often during the last year have you been unable to remember what happened the night before because of drinking?' },
            {
                label: 'Have you or someone else been injured as a result of your drinking?',
                options: [
                    { value: 0, label: '0' },
                    { value: 2, label: '2' },
                    { value: 4, label: '4' }
                ]
            },
            {
                label: 'Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?',
                options: [
                    { value: 0, label: '0' },
                    { value: 2, label: '2' },
                    { value: 4, label: '4' }
                ]
            }
        ],
        interpretation: [
            { min: 0, max: 7, label: 'Low risk' },
            { min: 8, max: 14, label: 'Hazardous or harmful use' },
            { min: 15, max: 40, label: 'Possible dependence' }
        ],
        note: 'Cutoffs vary by setting.'
    },
    {
        id: 'pcptsd5',
        title: 'PC-PTSD-5',
        subtitle: '5 items | Yes/No',
        type: 'items',
        scale: 'yesno',
        items: [
            { label: 'In the past month, have you had nightmares about the event or thought about it when you did not want to?' },
            { label: 'Tried hard not to think about the event or went out of your way to avoid situations that reminded you of it?' },
            { label: 'Been constantly on guard, watchful, or easily startled?' },
            { label: 'Felt numb or detached from people, activities, or your surroundings?' },
            { label: 'Felt guilty or unable to stop blaming yourself or others for the event or its consequences?' }
        ],
        interpretation: [
            { min: 0, max: 2, label: 'Negative screen' },
            { min: 3, max: 5, label: 'Positive screen (3-4+ depending on setting)' }
        ],
        note: 'Cutpoint often 3 or 4 depending on setting.'
    },
    {
        id: 'pcl5',
        title: 'PCL-5 PTSD Checklist',
        subtitle: '20 items | 0-4 each',
        type: 'items',
        scale: 'likert0to4',
        items: Array.from({ length: 20 }, (_, i) => ({ label: `PCL-5 Item ${i + 1}` })),
        interpretation: [
            { min: 0, max: 30, label: 'Below common cutpoint' },
            { min: 31, max: 80, label: 'At/above common cutpoint' }
        ],
        restrictedText: true,
        note: 'Common cutpoint is 31-33; use official PCL-5 item text.'
    },
    {
        id: 'bprs',
        title: 'BPRS (Schizophrenia)',
        subtitle: '18 items | 1-7 each',
        type: 'items',
        scale: 'oneToSeven',
        items: [
            { label: 'Somatic concern' },
            { label: 'Anxiety' },
            { label: 'Emotional withdrawal' },
            { label: 'Conceptual disorganization' },
            { label: 'Guilt feelings' },
            { label: 'Tension' },
            { label: 'Mannerisms and posturing' },
            { label: 'Grandiosity' },
            { label: 'Depressive mood' },
            { label: 'Hostility' },
            { label: 'Suspiciousness' },
            { label: 'Hallucinatory behavior' },
            { label: 'Motor retardation' },
            { label: 'Uncooperativeness' },
            { label: 'Unusual thought content' },
            { label: 'Blunted affect' },
            { label: 'Excitement' },
            { label: 'Disorientation' }
        ],
        note: 'Scores 1-7 per item.'
    },
    {
        id: 'ymrs',
        title: 'Young Mania Rating Scale',
        subtitle: '11 items | mixed scoring',
        type: 'items',
        items: [
            { label: 'YMRS Item 1', max: 4 },
            { label: 'YMRS Item 2', max: 4 },
            { label: 'YMRS Item 3', max: 8 },
            { label: 'YMRS Item 4', max: 8 },
            { label: 'YMRS Item 5', max: 4 },
            { label: 'YMRS Item 6', max: 4 },
            { label: 'YMRS Item 7', max: 4 },
            { label: 'YMRS Item 8', max: 8 },
            { label: 'YMRS Item 9', max: 4 },
            { label: 'YMRS Item 10', max: 4 },
            { label: 'YMRS Item 11', max: 8 }
        ],
        restrictedText: true,
        note: 'Use official YMRS item text.'
    },
    {
        id: 'ybocs',
        title: 'Y-BOCS (OCD Severity)',
        subtitle: '10 items | 0-4 each',
        type: 'items',
        scale: 'likert0to4',
        items: Array.from({ length: 10 }, (_, i) => ({ label: `Y-BOCS Item ${i + 1}` })),
        interpretation: [
            { min: 0, max: 7, label: 'Subclinical' },
            { min: 8, max: 15, label: 'Mild' },
            { min: 16, max: 23, label: 'Moderate' },
            { min: 24, max: 31, label: 'Severe' },
            { min: 32, max: 40, label: 'Extreme' }
        ],
        restrictedText: true,
        note: 'Use licensed Y-BOCS item text.'
    },
    {
        id: 'ciwa',
        title: 'CIWA-Ar (Alcohol Withdrawal)',
        subtitle: '10 items | mixed scoring',
        type: 'items',
        items: [
            { label: 'CIWA-Ar Item 1', max: 7 },
            { label: 'CIWA-Ar Item 2', max: 7 },
            { label: 'CIWA-Ar Item 3', max: 7 },
            { label: 'CIWA-Ar Item 4', max: 7 },
            { label: 'CIWA-Ar Item 5', max: 7 },
            { label: 'CIWA-Ar Item 6', max: 7 },
            { label: 'CIWA-Ar Item 7', max: 7 },
            { label: 'CIWA-Ar Item 8', max: 7 },
            { label: 'CIWA-Ar Item 9', max: 7 },
            { label: 'CIWA-Ar Item 10', max: 4 }
        ],
        interpretation: [
            { min: 0, max: 8, label: 'Mild withdrawal' },
            { min: 9, max: 15, label: 'Moderate withdrawal' },
            { min: 16, max: 67, label: 'Severe withdrawal' }
        ],
        restrictedText: true,
        note: 'Use official CIWA-Ar item text.'
    },
    {
        id: 'bfcrs',
        title: 'BFCRS (Catatonia)',
        subtitle: '23 items | 0-3 each',
        type: 'items',
        scale: 'likert0to3',
        items: Array.from({ length: 23 }, (_, i) => ({ label: `BFCRS Item ${i + 1}` })),
        restrictedText: true,
        note: 'Use official BFCRS item text.'
    },
    {
        id: 'panss',
        title: 'PANSS (Schizophrenia)',
        subtitle: '30 items | 1-7 each',
        type: 'items',
        scale: 'oneToSeven',
        items: Array.from({ length: 30 }, (_, i) => ({ label: `PANSS Item ${i + 1}` })),
        restrictedText: true,
        note: 'PANSS is licensed; use authorized item text.'
    },
    {
        id: 'bmi',
        title: 'BMI Calculator',
        subtitle: 'Weight (kg) and Height (cm)',
        type: 'bmi'
    },
    {
        id: 'cssrs',
        title: 'C-SSRS Screener',
        subtitle: '6 items | Yes/No',
        type: 'items',
        scale: 'yesno',
        items: [
            { label: 'Wish to be dead' },
            { label: 'Non-specific active suicidal thoughts' },
            { label: 'Active suicidal ideation with any methods (not plan) without intent to act' },
            { label: 'Active suicidal ideation with some intent to act, without specific plan' },
            { label: 'Active suicidal ideation with specific plan and intent' },
            { label: 'Suicidal behavior (actual, interrupted, or aborted attempt, or preparatory behavior)' }
        ],
        restrictedText: false,
        note: 'Use official wording if required by your institution.'
    },
    {
        id: 'moca',
        title: 'MoCA',
        subtitle: 'External tool (license required)',
        type: 'external',
        url: 'https://mocacognition.com/'
    }
];

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
    renderCalculators();
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

// Calculator rendering
function renderCalculators() {
    const container = document.getElementById('calc-tools');
    if (!container) return;

    container.innerHTML = calculators.map(buildCalcCard).join('');

    calculators.forEach(calc => {
        const card = container.querySelector(`[data-calc="${calc.id}"]`);
        if (!card) return;

        const resetBtn = card.querySelector('[data-reset]');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => resetCalc(calc.id));
        }

        if (calc.type === 'items') {
            card.querySelectorAll('select[data-score]').forEach(select => {
                select.addEventListener('change', () => updateCalc(calc.id));
            });
            updateCalc(calc.id);
        }

        if (calc.type === 'bmi') {
            const button = card.querySelector('[data-action="bmi"]');
            if (button) {
                button.addEventListener('click', () => calculateBMI(calc.id));
            }
        }

        const toggleBtn = card.querySelector('[data-toggle]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => toggleCalc(calc.id));
        }
    });
}

function toggleCalc(calcId) {
    const container = document.getElementById('calc-tools');
    const card = document.querySelector(`[data-calc="${calcId}"]`);
    if (!card) return;

    const isOpen = card.classList.contains('open');
    container.querySelectorAll('.calc-card.open').forEach(openCard => {
        openCard.classList.remove('open');
        const btn = openCard.querySelector('[data-toggle]');
        if (btn) btn.textContent = 'Open';
    });

    if (!isOpen) {
        card.classList.add('open');
        const btn = card.querySelector('[data-toggle]');
        if (btn) btn.textContent = 'Close';
    }
}

function buildCalcCard(calc) {
    if (calc.type === 'external') {
        return `
            <div class="calc-card" data-calc="${calc.id}">
                <div class="calc-summary">
                    <div class="calc-summary-text">
                        <h3>${calc.title}</h3>
                        <p class="card-meta">${calc.subtitle}</p>
                    </div>
                    <a class="btn-primary" href="${calc.url}" target="_blank" rel="noopener">Open</a>
                </div>
                <div class="calc-result show">Use the licensed external tool for item text and scoring.</div>
            </div>
        `;
    }

    if (calc.type === 'bmi') {
        return `
            <div class="calc-card" data-calc="${calc.id}">
                <div class="calc-summary">
                    <div class="calc-summary-text">
                        <h3>${calc.title}</h3>
                        <p class="card-meta">${calc.subtitle}</p>
                    </div>
                    <button class="calc-toggle" data-toggle>Open</button>
                </div>
                <div class="calc-body">
                    <input type="number" class="calc-input" data-field="weight" placeholder="Weight (kg)" step="0.1">
                    <input type="number" class="calc-input" data-field="height" placeholder="Height (cm)">
                    <div class="calc-actions">
                        <button class="btn-primary" data-action="bmi">Calculate</button>
                        <button class="btn-secondary" data-reset>Reset</button>
                    </div>
                    <div class="calc-result"></div>
                </div>
            </div>
        `;
    }

    const badges = [];
    if (calc.restrictedText) {
        badges.push('<span class="badge warn">Licensed text</span>');
        badges.push('<span class="badge warn">Placeholder items</span>');
    }
    if (calc.note) badges.push('<span class="badge lock">Note</span>');

    return `
        <div class="calc-card" data-calc="${calc.id}">
            <div class="calc-summary">
                <div class="calc-summary-text">
                    <h3>${calc.title}</h3>
                    <p class="card-meta">${calc.subtitle}</p>
                    ${badges.length ? `<div class="calc-badges">${badges.join('')}</div>` : ''}
                </div>
                <button class="calc-toggle" data-toggle>Open</button>
            </div>
            <div class="calc-body">
                <div class="calc-items">
                    ${buildCalcItems(calc)}
                </div>
                <div class="calc-actions">
                    <button class="btn-secondary" data-reset>Reset</button>
                </div>
                <div class="calc-result"></div>
            </div>
        </div>
    `;
}

function buildCalcItems(calc) {
    return calc.items.map((item, index) => {
        const options = buildCalcOptions(calc, item);
        return `
            <div class="calc-row">
                <div class="calc-label">${index + 1}. ${item.label}</div>
                <select class="calc-select" data-score>
                    ${options}
                </select>
            </div>
        `;
    }).join('');
}

function buildCalcOptions(calc, item) {
    const customOptions = item.options || (calc.scale ? calcScales[calc.scale] : null);
    if (customOptions) {
        return customOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    }

    const min = Number.isFinite(item.min) ? item.min : 0;
    const max = Number.isFinite(item.max) ? item.max : 4;
    const options = [];
    for (let i = min; i <= max; i += 1) {
        options.push(`<option value="${i}">${i}</option>`);
    }
    return options.join('');
}

function updateCalc(calcId) {
    const calc = calculators.find(c => c.id === calcId);
    const card = document.querySelector(`[data-calc="${calcId}"]`);
    if (!calc || !card || calc.type !== 'items') return;

    let total = 0;
    card.querySelectorAll('select[data-score]').forEach(select => {
        total += parseInt(select.value || '0', 10);
    });

    const result = card.querySelector('.calc-result');
    if (!result) return;

    let interpretationText = '';
    if (calc.interpretation) {
        const match = calc.interpretation.find(range => total >= range.min && total <= range.max);
        if (match) interpretationText = match.label;
    }

    result.innerHTML = `
        <strong>Total:</strong> ${total}${interpretationText ? `<br><strong>Severity:</strong> ${interpretationText}` : ''}
        ${calc.note ? `<div style="margin-top: 0.5rem; color: var(--muted); font-size: 0.75rem;">${calc.note}</div>` : ''}
    `;
    result.classList.add('show');
}

function resetCalc(calcId) {
    const card = document.querySelector(`[data-calc="${calcId}"]`);
    if (!card) return;

    card.querySelectorAll('select[data-score]').forEach(select => {
        select.selectedIndex = 0;
    });
    card.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    const result = card.querySelector('.calc-result');
    if (result) result.classList.remove('show');
    updateCalc(calcId);
}

function calculateBMI(calcId) {
    const card = document.querySelector(`[data-calc="${calcId}"]`);
    if (!card) return;

    const weight = parseFloat(card.querySelector('[data-field="weight"]').value);
    const height = parseFloat(card.querySelector('[data-field="height"]').value);
    const resultDiv = card.querySelector('.calc-result');

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        resultDiv.innerHTML = '<span style="color: #ef4444;">Please enter valid weight and height</span>';
        resultDiv.classList.add('show');
        return;
    }

    const bmi = (weight / Math.pow(height / 100, 2));
    let interpretation = '';
    if (bmi < 18.5) interpretation = 'Underweight';
    else if (bmi < 25) interpretation = 'Normal weight';
    else if (bmi < 30) interpretation = 'Overweight';
    else interpretation = 'Obese';

    resultDiv.innerHTML = `
        <strong>Weight:</strong> ${weight} kg<br>
        <strong>Height:</strong> ${height} cm<br>
        <strong>BMI:</strong> ${bmi.toFixed(1)}<br>
        <strong>Category:</strong> ${interpretation}
    `;
    resultDiv.classList.add('show');
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
