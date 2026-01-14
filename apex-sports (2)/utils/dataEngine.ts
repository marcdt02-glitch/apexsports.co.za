import Papa from 'papaparse';

export interface AthleteData {
    id: string;
    name: string;
    email: string; // Added for Elite Portal
    date: string;
    lastUpdated?: string; // New Timestamp Field
    // Metrics mapped from request
    // v8.0 Administrative
    parentConsent: 'Yes' | 'No' | string;
    package: 'Camp' | 'Individual' | 'Elite' | 'Mentorship' | string;

    // v8.0 Neural & MQS
    readinessScore: number;     // % (0-100)
    groinTimeToMax: number;     // Seconds
    movementQualityScore: number; // MQS (0-100)

    // Performance Metrics
    imtpPeakForce: number;
    imtpRfd200: number;
    peakForceAsymmetry: number;
    broadJump?: number; // v8.0 New
    agilityTime?: number; // v8.0 New

    // v17.1 Access Control
    productTier: string; // 'Elite', 'Testing S&C', 'Basic', 'Camp'
    accountActive: string; // 'YES' or 'NO'

    // Clinical / MQS Metrics
    hamstringQuadLeft: number;
    hamstringQuadRight: number;
    kneeExtensionLeft: number; // v17.0
    kneeExtensionRight: number; // v17.0
    hipAbductionLeft: number; // v17.0
    hipAbductionRight: number; // v17.0
    shoulderInternalRotationLeft: number; // v17.0
    shoulderInternalRotationRight: number; // v17.0
    neckExtension: number;
    ankleRomLeft: number;
    ankleRomRight: number;
    shoulderRomLeft: number;
    shoulderRomRight: number;
    adductionStrengthLeft: number;
    adductionStrengthRight: number;

    // Axes Scores
    scoreHamstring: number;
    scoreQuad: number;
    scoreAdduction: number;
    scoreAnkle: number;
    scoreShoulder: number;
    scoreNeck: number;

    // v11.5 Wellness & CNS
    sleep: number; // 0-5
    stress: number; // 0-5
    soreness: number; // 0-5
    baselineJump: number; // cm

    // v12.5 Workload
    dailyLoad: number; // AU
    acwr: number; // Ratio
    s2Duration: number; // Minutes
    sRPE?: number; // Session RPE (1-10)

    // v15.1 Gates & DynaMo
    paymentStatus: string; // 'Active' | 'Inactive'
    waiverStatus: string; // 'Signed' | 'Pending'
    bodyWeight: number; // kg
    groinSqueeze: number; // N (Peak Force)

    // v16.1 Ecosystem
    valdProfileId: string; // GUID
    moveHealth: {
        lastExercises: Array<{
            name: string;
            sets: number;
            reps: number;
            weight: number;
            rpe: number; // Exercise RPE
        }>;
    };

    // v19.0 Access & History
    access?: {
        isFullAccess: boolean;
        isCampUser?: boolean; // v38.0 Protocol
        showMentorship: boolean;
        showReports: boolean;
        showStrengthDials: boolean;
        showWellnessHistory: boolean;
    };
    wellnessHistory?: Array<{
        date: string;
        readiness: number;
        soreness: number;
        sleep: number;
    }>;

    // v18.5 Coaching Links
    coaching?: {
        practiceFolder: string;
        gameFolder: string;
        trainingFolder: string;
    };

    // v20.1 Editable Goals
    goals?: {
        year: string;
        process: string;
        why: string;
    };

    // v38.0 Direct Score Mapping (Backend Calculated)
    performanceScore?: number;
    screeningScore?: number;
    asymmetries?: {
        kneeExtension?: number;
        hipAbduction?: number;
        [key: string]: number | undefined;
    };
}

export interface DashboardMetrics {
    athlete: AthleteData;
    flags: {
        isHighRisk: boolean; // PF ASM > 10%
        isNeuralFatigue: boolean; // Groin TMAX > 1.5s
        isInjuryRedZone: boolean; // ACWR > 1.5
        isRpeDiscrepancy: boolean; // Session RPE vs Exercise RPE > 2
        isLimbAsymmetry: boolean; // v17.0 > 15% diff
        isShoulderImbalance: boolean; // v17.0 ER < 80% IR
        notes: string[];
    };
    recommendation: {
        focusArea: string;
        description: string;
    };
    scores: {
        performance: number;
        screening: number;
        readiness: number;
        powerIndex: number; // v17.0
    };
    performance: {
        acuteLoad: number;
        chronicLoad: number;
        acwr: number;
        sessions: any[]; // mocked
    };
}

export interface TrainingSession {
    date: string;
    durationMinutes: number;
    rpe: number;
    load: number;
    maxHr?: number;
    painScore?: number;
}

const generateMockSessions = (): TrainingSession[] => {
    const sessions: TrainingSession[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        sessions.push({
            date: d.toISOString().split('T')[0],
            durationMinutes: 60,
            rpe: Math.floor(Math.random() * 5) + 5,
            load: 60 * (Math.floor(Math.random() * 5) + 5),
            maxHr: 160 + Math.floor(Math.random() * 30),
            painScore: Math.floor(Math.random() * 3)
        });
    }
    return sessions;
};

// Mock initial data to simulate Processed_Athlete_Data.csv
export const MOCK_CSV_DATA = `Athlete,Email,Date,H:Q L,H:Q R,IMTP Peak,PF ASM,Adduction Strength,Ankle ROM L,Ankle ROM R,Shoulder Balance,Neck Ext,Quad Strength
John Doe,john@example.com,2025-01-15,0.65,0.62,4500,12.5,350,38,42,0.95,250,550
Jane Smith,jane@example.com,2025-01-14,0.72,0.70,3800,4.2,310,45,45,0.98,210,480`;

export const parseAthleteData = (csvString: string): AthleteData[] => {
    const result = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    });

    if (result.errors.length > 0) {
        console.error("CSV Parse Errors:", result.errors);
    }

    return result.data.map((row: any, index: number) => {
        // robust fallback if columns missing
        const ankleL = row['Ankle ROM L'] || 40;
        const ankleR = row['Ankle ROM R'] || 40;

        // Normalize logic
        const normAnkle = Math.min(100, Math.max(0, ((ankleL + ankleR) / 2 - 25) * 5));

        return {
            id: `athlete-${index}`, // Generating ID
            name: (row['First Name'] || row['Surname']) ? `${row['First Name'] || ''} ${row['Surname'] || ''}`.trim() : (row['Athlete'] || 'Unknown Athlete'),
            email: row['Email'] || 'no-email@apexsports.co.za',
            date: row['Date'] || new Date().toISOString().split('T')[0],

            hamstringQuadLeft: row['H:Q L'] || 0,
            hamstringQuadRight: row['H:Q R'] || 0,

            // v17.1 Access Control
            productTier: row['Product Tier'] || 'Basic',
            accountActive: row['Account Active'] || 'YES', // v17.2 Permissive Default

            kneeExtensionLeft: 0,
            kneeExtensionRight: 0,
            hipAbductionLeft: 0,
            hipAbductionRight: 0,
            shoulderInternalRotationLeft: 0,
            shoulderInternalRotationRight: 0,

            imtpPeakForce: row['IMTP Peak'] || 0,
            imtpRfd200: row['RFD 200ms'] || 0,
            peakForceAsymmetry: row['PF ASM'] || 0,
            broadJump: row['Broad Jump'] || 0,
            agilityTime: row['Agility T'] || 0,
            neckExtension: row['Neck Ext'] || 0,
            ankleRomLeft: ankleL,
            ankleRomRight: ankleR,
            shoulderRomLeft: 0,
            shoulderRomRight: 0,
            adductionStrengthLeft: 0,
            adductionStrengthRight: 0,

            // v8.0 Defaults
            parentConsent: 'Yes',
            package: 'Individual',
            readinessScore: 85,
            groinTimeToMax: 1.2,
            movementQualityScore: 80,

            // v11.5 Mock (Randomized for realism in dev)
            sleep: Math.floor(Math.random() * 5) + 1, // 1-5
            stress: Math.floor(Math.random() * 5) + 1, // 1-5
            soreness: Math.floor(Math.random() * 5) + 1, // 1-5
            baselineJump: (row['Broad Jump'] || 250) + 15,

            // v12.5 Load Mock
            dailyLoad: (Math.floor(Math.random() * 300) + 300),
            acwr: 1.1 + (Math.random() * 0.4 - 0.2),
            s2Duration: Math.random() > 0.7 ? 45 : 0, // 30% chance of double session
            sRPE: Math.floor(Math.random() * 4) + 6, // Mock Session RPE (6-10)

            // v15.1 Gates & DynaMo Mock
            paymentStatus: 'Active',
            waiverStatus: 'Signed',
            bodyWeight: 75,
            groinSqueeze: 450,

            // v16.1 Ecosystem Mock
            valdProfileId: Math.random() > 0.3 ? 'VALD-123-456' : '', // 30% chance missing for testing button
            moveHealth: {
                lastExercises: [
                    { name: 'Back Squat', sets: 4, reps: 5, weight: 120, rpe: 8 },
                    { name: 'Nordic Hamstring Curl', sets: 3, reps: 8, weight: 0, rpe: 9 },
                    { name: 'DB Bench Press', sets: 3, reps: 10, weight: 35, rpe: 7 }
                ]
            },

            // Radar Scores
            scoreHamstring: Math.min(100, (row['H:Q L'] || 0) * 120),
            scoreQuad: Math.min(100, (row['Quad Strength'] || 400) / 6),
            scoreAdduction: Math.min(100, (row['Adduction Strength'] || 300) / 4),
            scoreAnkle: normAnkle,
            scoreShoulder: Math.min(100, (row['Shoulder Balance'] || 1) * 100),
            scoreNeck: Math.min(100, (row['Neck Ext'] || 200) / 3),
        };
    });
};

export const analyzeAthlete = (athlete: AthleteData): DashboardMetrics => {
    // RPE Logic
    const sessionRpe = athlete.sRPE || 5;
    const exerciseRpe = athlete.moveHealth?.lastExercises[0]?.rpe || 5;
    const rpeDiff = Math.abs(sessionRpe - exerciseRpe);
    const isRpeDiscrepancy = rpeDiff > 2;

    // v17.0 Limb Symmetry Logic
    const calcDiff = (l: number, r: number) => {
        if (!l || !r) return 0;
        return Math.abs((l - r) / Math.max(l, r) * 100);
    };
    const kneeDiff = calcDiff(athlete.kneeExtensionLeft, athlete.kneeExtensionRight);
    const hipAbdDiff = calcDiff(athlete.hipAbductionLeft, athlete.hipAbductionRight);
    const isLimbAsymmetry = kneeDiff > 15 || hipAbdDiff > 15;

    // v17.0 Shoulder Imbalance (ER < 80% IR)
    // Using shoulderRomLeft/Right if that's where we store Force? No, we mapped Score Shoulder from ER.
    // We added shoulderInternalRotationLeft/Right.
    // Assuming 'shoulderRom' currently holds ER force based on `googleIntegration.ts` comments ("Assuming ER is the main ROM metric...").
    // Let's rely on that for now, or clarify. In `googleIntegration`, we map `Shoulder ER L (N)` to `shoulderRomLeft`.
    // So ER force = shoulderRomLeft.
    const erAvg = (athlete.shoulderRomLeft + athlete.shoulderRomRight) / 2;
    const irAvg = (athlete.shoulderInternalRotationLeft + athlete.shoulderInternalRotationRight) / 2;
    const isShoulderImbalance = irAvg > 0 && erAvg < (irAvg * 0.8);

    const flags = {
        isHighRisk: athlete.peakForceAsymmetry > 10,
        isNeuralFatigue: athlete.groinTimeToMax > 1.5,
        isInjuryRedZone: athlete.acwr > 1.5,
        isRpeDiscrepancy,
        isLimbAsymmetry,
        isShoulderImbalance,
        notes: [] as string[],
    };

    if (flags.isHighRisk) {
        flags.notes.push(`High Asymmetry detected (${athlete.peakForceAsymmetry}%). Monitor load.`);
    }
    if (flags.isNeuralFatigue) {
        flags.notes.push(`Neural Fatigue Detected (DTmax ${athlete.groinTimeToMax}s).`);
    }
    if (flags.isInjuryRedZone) {
        flags.notes.push(`ACWR > 1.5 (High Injury Risk). Reduce Volume.`);
    }
    if (flags.isRpeDiscrepancy) {
        flags.notes.push(`Data Discrepancy: Subjective Fatigue exceeds Training Load.`);
    }
    if (flags.isLimbAsymmetry) {
        flags.notes.push(`Limb Symmetry Alert: >15% difference in Knee/Hip strength.`);
    }
    if (flags.isShoulderImbalance) {
        flags.notes.push(`Shoulder Imbalance: Stability Training Recommended.`);
    }

    // Determine lowest score for recommendation
    const scores = [
        { label: 'Hamstring Strength', score: athlete.scoreHamstring },
        { label: 'Quad Strength', score: athlete.scoreQuad },
        { label: 'Adduction', score: athlete.scoreAdduction },
        { label: 'Ankle Mobility', score: athlete.scoreAnkle },
        { label: 'Shoulder Balance', score: athlete.scoreShoulder },
        { label: 'Neck Strength', score: athlete.scoreNeck },
    ];
    scores.sort((a, b) => a.score - b.score);
    const lowest = scores[0];

    // ... (Recommendations Logic same as before) ...
    let recTitle = "General Maintenance";
    let recDesc = "Continue with your current balanced program.";
    switch (lowest.label) {
        case 'Ankle Mobility': recTitle = "Focus on Ankle Dorsiflexion"; recDesc = "Incorporate banded distractions and soleus stretches daily."; break;
        case 'Hamstring Strength': recTitle = "Posterior Chain focus"; recDesc = "Prioritize Nordic Hamstring curls and RDLs."; break;
        case 'Adduction': recTitle = "Groin Strength"; recDesc = "Add Copenhagen Planks to your warm-up routine."; break;
        case 'Neck Strength': recTitle = "Neck Stability"; recDesc = "Include Iron Neck or isometric hold protocols."; break;
        default: recTitle = `Improve ${lowest.label}`; recDesc = `Your ${lowest.label} is your lowest metric. Focus on specific accessory work.`;
    }

    return {
        athlete,
        flags,
        recommendation: {
            focusArea: recTitle,
            description: recDesc,
        },
        performance: {
            acuteLoad: 4500, // Mock fixed
            chronicLoad: 4000,
            acwr: 1.12,
            sessions: generateMockSessions()
        },
        scores: {
            performance: athlete.performanceScore ? athlete.performanceScore : Math.min(100, Math.round(athlete.imtpPeakForce / 50)),
            screening: athlete.screeningScore ? athlete.screeningScore : Math.max(0, 100 - (athlete.peakForceAsymmetry * 2)),
            readiness: Math.floor(Math.random() * 20) + 80,
            powerIndex: (() => {
                const imtpScore = Math.min(100, Math.round(athlete.imtpPeakForce / 50));
                const jumpScore = Math.min(100, Math.round((athlete.broadJump || 0) / 3)); // 300cm = 100
                return Math.round((imtpScore + jumpScore) / 2);
            })()
        }
    };
};
