# MedMicro Implementation Roadmap

## ✅ COMPLETED

### UI/UX Improvements
- [x] Dual theme (light/dark) with system preference detection
- [x] Condition-based color coding (depression=blue, bipolar=purple, anxiety=green)
- [x] Bottom navigation bar (mobile) + Sidebar (desktop)
- [x] Collapsible sections in navigation
- [x] Enhanced medication cards with quick flags
- [x] Skeleton loading screens
- [x] Keyboard shortcuts (/ for search, ESC, 1-5 for tabs)

### Content Display
- [x] Detail pages instead of modals
- [x] Tabbed medication detail (Overview, Dosing, Safety, Interactions, Monitoring, Pearls)
- [x] Quick filter chips (First-line, Pregnancy Safe, QT Safe, etc.)
- [x] Favorites/Bookmarking system
- [x] Recently viewed history
- [x] Personal notes per medication

### Interactive Features
- [x] Quick Actions: "Start This Med" → generates dosing schedule
- [x] Advanced Search with Fuse.js
- [x] Visual treatment algorithms (Depression, GAD)
- [x] Drug Comparison (side-by-side)
- [x] Guideline comparison table (APA vs CANMAT vs NICE)

### Technical
- [x] Docker setup
- [x] Build-time Tailwind (not CDN)
- [x] TypeScript
- [x] Zustand state management
- [x] Dexie.js for local storage

---

## 🚧 REMAINING WORK

### Phase 1: Clinical Tools (High Priority)

#### 1. Switching Calculator ⭐ HIGH
**What**: SSRI → SSRI, SSRI → SNRI, Antipsychotic switching
**Features**:
- Cross-taper schedules
- Washout period calculator
- Drug interaction warnings during switch
- Visual timeline of the switch process

**Example**:
```
Fluoxetine 20mg → Sertraline 50mg
Week 1-2: Fluoxetine 10mg + Sertraline 25mg
Week 3-4: Stop fluoxetine, Sertraline 50mg
```

#### 2. Antipsychotic Converter ⭐ HIGH
**What**: Dose equivalency calculator
**Features**:
- Chlorpromazine equivalents
- Olanzapine equivalents
- Risperidone equivalents
- Visual comparison table

**Example**:
```
Risperidone 2mg = Olanzapine 5mg = Quetiapine 100mg = Aripiprazole 10mg
```

#### 3. QTc Calculator with Drug Interactions ⭐ HIGH
**What**: Calculate QTc and assess risk with drug combinations
**Features**:
- Bazett's formula (QTc = QT/√RR)
- Fridericia's formula
- Risk stratification (low/moderate/high)
- Warning when combining QT-prolonging drugs
- Visual risk meter

#### 4. Metabolic Monitoring Checklist ⭐ MEDIUM
**What**: Track metabolic monitoring for antipsychotics
**Features**:
- Baseline checks (weight, BMI, glucose, lipids)
- Follow-up schedule (3mo, 6mo, annually)
- Due date reminders
- Export to PDF

### Phase 2: Enhanced Content

#### 5. Printable Quick Reference Cards ⭐ MEDIUM
**What**: One-page printable summaries
**Features**:
- Medication class summaries
- Dosing tables
- Side effect comparison
- PDF export

#### 6. Enhanced DSM-5 Criteria
**What**: More detailed criteria pages
**Features**:
- Differential diagnosis sections
- Screening questions (PHQ-9, GAD-7, MDQ, etc.)
- Severity specifiers with guidance
- Comorbidity notes
- Decision trees for diagnosis

#### 7. Content Update System
**What**: Notify users when guidelines/meds change
**Features**:
- Version tracking
- "What's New" section
- Update notifications
- Changelog

### Phase 3: Advanced Features (Lower Priority)

#### 8. "My Patients" (Anonymized Case Tracking) ⭐ LOW
**What**: Track patients without storing PHI
**Features**:
- Anonymous patient IDs
- Current medications per patient
- Notes and follow-ups
- Due date reminders

#### 9. CME Tracking ⭐ LOW
**What**: Track continuing medical education
**Features**:
- Time spent in app
- Topics reviewed
- CME credit estimation
- Export activity log

#### 10. Expanded Medication Database
**What**: More medications and details
**Features**:
- Expand to 100+ medications
- Add cost information (Canada)
- Pharmacokinetics data (half-life, Tmax, etc.)
- Renal dosing adjustments
- Hepatic dosing adjustments

---

## 📊 Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Switching Calculator | High | Medium | ⭐⭐⭐⭐⭐ |
| Antipsychotic Converter | High | Low | ⭐⭐⭐⭐⭐ |
| QTc Calculator | High | Medium | ⭐⭐⭐⭐⭐ |
| Metabolic Monitoring | Medium | Low | ⭐⭐⭐⭐ |
| Printable Reference Cards | Medium | Medium | ⭐⭐⭐⭐ |
| Enhanced DSM-5 | Medium | High | ⭐⭐⭐ |
| Content Update System | Low | Medium | ⭐⭐⭐ |
| My Patients | Low | High | ⭐⭐ |
| CME Tracking | Low | High | ⭐ |

---

## 🎯 Next Sprint Recommendation

**Focus on the 3 HIGH priority clinical tools:**

1. **Switching Calculator** - Most requested feature for psychiatrists
2. **Antipsychotic Converter** - Quick win, high utility
3. **QTc Calculator** - Patient safety feature

These three would make MedMicro significantly more useful for daily clinical practice!

---

## 💡 Implementation Notes

### Switching Calculator Data Structure
```typescript
interface SwitchingProtocol {
  fromDrug: string;
  toDrug: string;
  method: 'direct' | 'cross-taper' | 'washout';
  steps: {
    week: number;
    fromDose: string;
    toDose: string;
    notes?: string;
  }[];
  warnings: string[];
}
```

### QTc Calculator Formula
```typescript
// Bazett's Formula
const qtcBazett = (qt: number, rr: number) => qt / Math.sqrt(rr);

// Fridericia's Formula  
const qtcFridericia = (qt: number, rr: number) => qt / Math.cbrt(rr);
```

### Metabolic Monitoring Schedule
```typescript
const metabolicSchedule = {
  baseline: ['Weight', 'BMI', 'Waist circumference', 'BP', 'Fasting glucose', 'Lipid panel'],
  week12: ['Weight', 'BMI'],
  month3: ['Weight', 'BMI', 'Fasting glucose', 'Lipid panel'],
  month6: ['Weight', 'BMI', 'Fasting glucose', 'Lipid panel'],
  annually: ['Weight', 'BMI', 'Fasting glucose', 'HbA1c', 'Lipid panel']
};
```
