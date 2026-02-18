import type { Guideline } from '../types';

export const defaultGuidelines: Guideline[] = [
  {
    id: 'canmat-mdd-2016',
    title: 'Major Depressive Disorder - CANMAT 2016',
    organization: 'CANMAT',
    year: 2016,
    conditions: ['Major Depressive Disorder'],
    content: [
      {
        heading: 'First-line Pharmacotherapy',
        content: 'SSRIs and SNRIs are recommended as first-line treatments for major depressive disorder.',
        recommendations: [
          { grade: 'A', text: 'Escitalopram, sertraline, fluoxetine as first-line SSRIs', evidence: 'Multiple RCTs' },
          { grade: 'A', text: 'Venlafaxine XR, duloxetine as first-line SNRIs', evidence: 'Multiple RCTs' },
          { grade: 'A', text: 'Bupropion XL as first-line option', evidence: 'Comparable efficacy to SSRIs' },
        ],
      },
      {
        heading: 'Second-line Options',
        content: 'Consider when first-line treatments fail or are not tolerated.',
        recommendations: [
          { grade: 'B', text: 'Mirtazapine - particularly with insomnia/poor appetite', evidence: 'RCTs' },
          { grade: 'B', text: 'Vortioxetine', evidence: 'RCTs' },
          { grade: 'B', text: 'Desvenlafaxine', evidence: 'RCTs' },
          { grade: 'C', text: 'TCAs - amitriptyline, nortriptyline', evidence: 'Effective but poor tolerability' },
        ],
      },
      {
        heading: 'Augmentation Strategies',
        content: 'For partial response to first-line treatment.',
        recommendations: [
          { grade: 'A', text: 'Aripiprazole augmentation', evidence: 'Strong evidence for response/remission' },
          { grade: 'A', text: 'Quetiapine XR augmentation', evidence: 'FDA approved for adjunctive therapy' },
          { grade: 'B', text: 'Lithium augmentation', evidence: 'Long history of use' },
          { grade: 'B', text: 'Bupropion combination', evidence: 'Commonly used in practice' },
        ],
      },
      {
        heading: 'Treatment Duration',
        content: 'Continue treatment to prevent relapse.',
        recommendations: [
          { grade: 'A', text: 'Continue at least 6-9 months after remission for first episode', evidence: 'Relapse prevention studies' },
          { grade: 'A', text: 'Consider long-term maintenance for recurrent depression (≥3 episodes)', evidence: 'Relapse prevention studies' },
        ],
      },
    ],
    algorithms: [
      {
        id: 'mdd-treatment',
        name: 'MDD Treatment Algorithm',
        steps: [
          { id: '1', text: 'First-line SSRI/SNRI', action: 'Start medication', medications: ['Sertraline', 'Escitalopram', 'Venlafaxine XR'] },
          { id: '2', text: 'Adequate trial (4-6 weeks at therapeutic dose)?', yesStep: '3', noStep: '4' },
          { id: '3', text: 'Response achieved?', yesStep: '5', noStep: '6' },
          { id: '4', text: 'Optimize dose - increase to maximum tolerated', action: 'Continue to 2' },
          { id: '5', text: 'Continue treatment 6-9 months minimum', action: 'Maintenance' },
          { id: '6', text: 'Switch or augment', action: 'Consider second-line options or augmentation', medications: ['Bupropion', 'Mirtazapine', 'Aripiprazole'] },
        ],
      },
    ],
    citation: 'Lam RW et al. Canadian Network for Mood and Anxiety Treatments (CANMAT) 2016 Clinical Guidelines for the Management of Adults with Major Depressive Disorder. Can J Psychiatry. 2016;61(9):510-523.',
    url: 'https://www.canmat.org',
    updatedAt: '2024-01-15',
  },
  {
    id: 'canmat-bipolar-2018',
    title: 'Bipolar Disorder - CANMAT/ISBD 2018',
    organization: 'CANMAT/ISBD',
    year: 2018,
    conditions: ['Bipolar Disorder', 'Bipolar Mania', 'Bipolar Depression'],
    content: [
      {
        heading: 'Acute Mania - First Line',
        content: 'Rapid control of manic symptoms is essential.',
        recommendations: [
          { grade: 'A', text: 'Lithium', evidence: 'Gold standard, requires monitoring' },
          { grade: 'A', text: 'Valproate', evidence: 'Effective, especially for mixed features' },
          { grade: 'A', text: 'Atypical antipsychotics: risperidone, olanzapine, quetiapine, aripiprazole', evidence: 'Rapid onset' },
        ],
      },
      {
        heading: 'Acute Mania - Second Line',
        content: 'Options when first-line fails or not tolerated.',
        recommendations: [
          { grade: 'B', text: 'Carbamazepine', evidence: 'Effective, many drug interactions' },
          { grade: 'B', text: 'Asenapine', evidence: 'Sublingual formulation' },
          { grade: 'C', text: 'Haloperidol', evidence: 'Effective but more EPS' },
        ],
      },
      {
        heading: 'Bipolar Depression - First Line',
        content: 'Bipolar depression requires different approach than unipolar depression.',
        recommendations: [
          { grade: 'A', text: 'Quetiapine (300mg)', evidence: 'Only monotherapy FDA approved' },
          { grade: 'A', text: 'Lamotrigine (maintenance/prevention)', evidence: 'Best for maintenance, not acute' },
          { grade: 'A', text: 'Lithium', evidence: 'May help prevent depressive relapse' },
          { grade: 'B', text: 'Lurasidone', evidence: 'FDA approved adjunctive or monotherapy' },
        ],
      },
      {
        heading: 'Maintenance Treatment',
        content: 'Prevent mood episodes and reduce suicide risk.',
        recommendations: [
          { grade: 'A', text: 'Lithium - gold standard for maintenance and suicide prevention', evidence: 'Strongest evidence' },
          { grade: 'A', text: 'Lamotrigine - best for preventing depressive episodes', evidence: 'Lamictal studies' },
          { grade: 'A', text: 'Valproate', evidence: 'Effective, especially for rapid cycling' },
          { grade: 'A', text: 'Atypical antipsychotics: olanzapine, aripiprazole, quetiapine', evidence: 'Maintenance studies' },
        ],
      },
      {
        heading: 'Antidepressants in Bipolar Disorder',
        content: 'Use with caution - may induce mania.',
        recommendations: [
          { grade: 'D', text: 'Avoid antidepressants in mania or rapid cycling', evidence: 'Risk of mood switch' },
          { grade: 'C', text: 'May use short-term with mood stabilizer in bipolar depression', evidence: 'Controversial, monitor for switch' },
        ],
      },
    ],
    algorithms: [
      {
        id: 'mania-treatment',
        name: 'Acute Mania Treatment Algorithm',
        steps: [
          { id: '1', text: 'Assess severity and safety', action: 'Hospitalize if severe/psychotic' },
          { id: '2', text: 'First-line: Lithium OR Valproate OR Atypical Antipsychotic', action: 'Start monotherapy', medications: ['Lithium', 'Valproate', 'Risperidone', 'Olanzapine'] },
          { id: '3', text: 'Partial response at 1-2 weeks?', yesStep: '4', noStep: '5' },
          { id: '4', text: 'Combination therapy (MS + AP)', action: 'Add second agent' },
          { id: '5', text: 'Adequate response?', yesStep: '6', noStep: '7' },
          { id: '6', text: 'Continue, plan maintenance', action: 'Transition to maintenance' },
          { id: '7', text: 'Consider ECT or clozapine for refractory cases', action: 'Specialist referral' },
        ],
      },
      {
        id: 'bipolar-depression',
        name: 'Bipolar Depression Algorithm',
        steps: [
          { id: '1', text: 'Assess for mania/hypomania', action: 'Rule out mixed features' },
          { id: '2', text: 'Already on mood stabilizer?', yesStep: '3', noStep: '4' },
          { id: '3', text: 'Optimize mood stabilizer, consider adding quetiapine or lurasidone', action: 'Augment' },
          { id: '4', text: 'Start quetiapine OR lamotrigine OR lithium', action: 'Monotherapy', medications: ['Quetiapine 300mg', 'Lamotrigine', 'Lithium'] },
        ],
      },
    ],
    citation: 'Yatham LN et al. CANMAT/ISBD Guidelines for the Management of Patients with Bipolar Disorder. Bipolar Disord. 2018;20(2):97-170.',
    url: 'https://www.canmat.org',
    updatedAt: '2024-01-15',
  },
  {
    id: 'canmat-anxiety-2014',
    title: 'Anxiety Disorders - CANMAT 2014',
    organization: 'CANMAT',
    year: 2014,
    conditions: ['Generalized Anxiety Disorder', 'Panic Disorder', 'Social Anxiety Disorder'],
    content: [
      {
        heading: 'Generalized Anxiety Disorder - First Line',
        content: 'SSRIs and SNRIs are first-line for GAD.',
        recommendations: [
          { grade: 'A', text: 'Escitalopram, sertraline, paroxetine', evidence: 'Multiple RCTs' },
          { grade: 'A', text: 'Venlafaxine XR, duloxetine', evidence: 'Multiple RCTs' },
          { grade: 'A', text: 'Pregabalin', evidence: 'Fast onset' },
        ],
      },
      {
        heading: 'Generalized Anxiety Disorder - Second Line',
        content: 'When first-line fails or not tolerated.',
        recommendations: [
          { grade: 'B', text: 'Buspirone', evidence: 'Effective but delayed onset' },
          { grade: 'B', text: 'Imipramine', evidence: 'TCA - effective but side effects' },
          { grade: 'C', text: 'Benzodiazepines - short-term only', evidence: 'Rapid onset, dependence risk' },
        ],
      },
      {
        heading: 'Panic Disorder - First Line',
        content: 'SSRIs are first-line for panic disorder.',
        recommendations: [
          { grade: 'A', text: 'Sertraline, escitalopram, fluoxetine, paroxetine', evidence: 'Multiple RCTs' },
          { grade: 'A', text: 'Venlafaxine XR', evidence: 'Effective for panic' },
        ],
      },
      {
        heading: 'Panic Disorder - Important Considerations',
        content: 'SSRIs may initially worsen anxiety - start low.',
        recommendations: [
          { grade: 'A', text: 'Start at half the usual starting dose for 1 week', evidence: 'Reduces initial activation' },
          { grade: 'B', text: 'Benzodiazepines may be used short-term during SSRI initiation', evidence: 'Bridge therapy' },
        ],
      },
      {
        heading: 'Social Anxiety Disorder',
        content: 'SSRIs and SNRIs are first-line.',
        recommendations: [
          { grade: 'A', text: 'Sertraline, paroxetine, escitalopram', evidence: 'Multiple RCTs' },
          { grade: 'A', text: 'Venlafaxine XR', evidence: 'Effective' },
          { grade: 'A', text: 'Phenelzine (MAOI) - reserved for refractory cases', evidence: 'Highly effective but dietary restrictions' },
        ],
      },
    ],
    algorithms: [
      {
        id: 'gad-treatment',
        name: 'GAD Treatment Algorithm',
        steps: [
          { id: '1', text: 'First-line SSRI/SNRI', action: 'Start medication', medications: ['Escitalopram', 'Sertraline', 'Venlafaxine XR'] },
          { id: '2', text: 'Adequate trial (6-8 weeks)?', yesStep: '3', noStep: '4' },
          { id: '3', text: 'Response achieved?', yesStep: '5', noStep: '6' },
          { id: '4', text: 'Optimize dose', action: 'Increase to therapeutic dose' },
          { id: '5', text: 'Continue 6-12 months minimum', action: 'Maintenance' },
          { id: '6', text: 'Switch to alternative first-line OR add pregabalin', action: 'Second-line strategies' },
        ],
      },
    ],
    citation: 'Katzman MA et al. CANMAT Clinical Guidelines for the Management of Anxiety Disorders. Can J Psychiatry. 2014;59(12):618-626.',
    url: 'https://www.canmat.org',
    updatedAt: '2024-01-15',
  },
  {
    id: 'nice-depression-2022',
    title: 'Depression in Adults - NICE 2022',
    organization: 'NICE',
    year: 2022,
    conditions: ['Major Depressive Disorder'],
    content: [
      {
        heading: 'Treatment Choice',
        content: 'Consider patient preference, severity, and previous response.',
        recommendations: [
          { grade: 'A', text: 'Offer choice of evidence-based treatments: individual CBT, IPT, behavioral activation, or antidepressants', evidence: 'Shared decision making' },
          { grade: 'A', text: 'SSRIs are first-line pharmacological option', evidence: 'Evidence base' },
          { grade: 'B', text: 'Consider sertraline as first choice SSRI', evidence: 'Favorable risk-benefit' },
        ],
      },
      {
        heading: 'Starting Antidepressants',
        content: 'Counsel on side effects and time to effect.',
        recommendations: [
          { grade: 'A', text: 'Counsel that side effects often precede benefits', evidence: 'Adherence studies' },
          { grade: 'A', text: 'Review at 2 weeks for side effects', evidence: 'Early detection' },
          { grade: 'A', text: 'Assess response at 4 weeks', evidence: 'Early non-response predicts outcome' },
        ],
      },
      {
        heading: 'Treatment-Resistant Depression',
        content: 'Define as inadequate response to 2 adequate trials.',
        recommendations: [
          { grade: 'A', text: 'Consider augmentation with aripiprazole, lithium, or quetiapine', evidence: 'Augmentation trials' },
          { grade: 'B', text: 'Consider combination antidepressants', evidence: 'Practice-based evidence' },
          { grade: 'B', text: 'Consider ECT for severe, life-threatening depression', evidence: 'Gold standard for severe depression' },
        ],
      },
    ],
    citation: 'NICE Guideline [NG222]. Depression in adults: treatment and management. 2022.',
    url: 'https://www.nice.org.uk',
    updatedAt: '2024-01-15',
  },
  {
    id: 'apa-schizophrenia-2020',
    title: 'Schizophrenia - APA 2020',
    organization: 'APA',
    year: 2020,
    conditions: ['Schizophrenia'],
    content: [
      {
        heading: 'Antipsychotic Selection',
        content: 'Choice based on efficacy, side effect profile, and patient factors.',
        recommendations: [
          { grade: 'A', text: 'Second-generation antipsychotics generally preferred due to lower EPS risk', evidence: 'CATIE study, meta-analyses' },
          { grade: 'A', text: 'Consider metabolic profile when selecting agent', evidence: 'Metabolic monitoring guidelines' },
          { grade: 'B', text: 'Clozapine for treatment-resistant schizophrenia', evidence: 'Superior efficacy in TRS' },
        ],
      },
      {
        heading: 'Treatment-Resistant Schizophrenia',
        content: 'Inadequate response to 2 adequate trials of different antipsychotics.',
        recommendations: [
          { grade: 'A', text: 'Clozapine is treatment of choice for TRS', evidence: 'Suicidal behavior and efficacy studies' },
          { grade: 'A', text: 'Trial of clozapine for 3-6 months', evidence: 'Delayed onset in some patients' },
          { grade: 'B', text: 'Consider ECT for clozapine non-responders', evidence: 'Augmentation studies' },
        ],
      },
      {
        heading: 'Maintenance Treatment',
        content: 'Long-term treatment prevents relapse.',
        recommendations: [
          { grade: 'A', text: 'Continue antipsychotic for at least 1 year after first episode', evidence: 'Relapse prevention' },
          { grade: 'A', text: 'Consider long-acting injectables for adherence issues', evidence: 'Relapse reduction' },
          { grade: 'B', text: 'Gradual discontinuation may be considered after 1-2 years for single episode', evidence: 'Risk of relapse remains' },
        ],
      },
    ],
    citation: 'American Psychiatric Association. Practice Guideline for the Treatment of Patients With Schizophrenia. 2020.',
    url: 'https://www.psychiatry.org',
    updatedAt: '2024-01-15',
  },
];
