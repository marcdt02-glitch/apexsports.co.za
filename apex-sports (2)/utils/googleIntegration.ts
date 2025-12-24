import { AthleteData, parseAthleteData, MOCK_CSV_DATA } from './dataEngine';

// Configuration
// In a real app, this would be an environment variable.
// For this static site, we'll use a public Google Apps Script URL or a published CSV URL.
// The user will need to Deploy their Apps Script as a Web App and paste the URL here.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKu1CBVS_C1VAQqbaTwe--4JBiS5RqvyxWOHXc9rHaVTiNLdJGEy-tT5EB3grmy1Meiw/exec'; // v7.0 Fix Crash

// Temporary fallback to Mock until user provides their Script URL
const USE_MOCK_FALLBACK = false;

export const fetchAthleteFromGoogle = async (email: string, pin: string): Promise<AthleteData | null> => {
    if (USE_MOCK_FALLBACK) {
        console.log("Google Integration: Using Mock Fallback");
        return null; // Mock doesn't support pin yet conceptually, but valid for now
    }

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?email=${encodeURIComponent(email)}&pin=${encodeURIComponent(pin)}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Google Sheet API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // 1. Check for "Flat JSON" response (Direct Athlete Object)
        if (data && (data.email || data.firstName || data.name)) {
            return mapGoogleRowToAthlete(data);
        }

        // 2. Check for "Wrapped JSON" response ({ status: 'success', athlete: ... })
        if (data.status === 'success' && data.athlete) {
            return mapGoogleRowToAthlete(data.athlete);
        }

        // 3. Handle Errors
        if (data.status === 'error' || !data.athlete) {
            const specificError = data.message || JSON.stringify(data);
            console.warn("Google Sheet Error:", specificError);
            throw new Error(specificError);
        }

        return mapGoogleRowToAthlete(data.athlete);

    } catch (error) {
        console.error("Failed to fetch from Google Sheet:", error);
        throw error;
    }
};

const mapGoogleRowToAthlete = (row: any): AthleteData => {
    const num = (val: any) => {
        if (val === 'N/A' || val === undefined || val === null) return 0;
        return Number(val) || 0;
    };

    return {
        id: row._id || row.id || `google-${Date.now()}`,
        name: row._name || row.name || `${row.firstName || ''} ${row.surname || ''}`.trim() || 'Unknown Athlete',
        email: row._email || row.email || '',
        date: new Date().toISOString().split('T')[0],
        lastUpdated: row['Last Updated'] || row.timestamp || '',

        // V8.0 Administrative
        parentConsent: row['Parent Consent'] || row['Parental Consent'] || row['Consent'] || row.parentConsent || row.consent || 'Yes',
        package: row['Package'] || row['package'] || row.package || row.packageType || row['Package Type'] || row.tier || row.Level || 'Camp',

        // v17.1 Access Control
        productTier: row['Product Tier'] || 'Basic',
        accountActive: row['Account Active'] || 'YES', // v17.2 Permissive Default

        // v8.0 Neural
        readinessScore: num(row['Readiness Score (%)'] || row['Readiness Score'] || row['Ready %'] || row.readinessScore || 85),
        groinTimeToMax: num(row['Groin Time'] || row['Groin Time to Max (s)'] || row['Groin Time to Max'] || row.groinTimeToMax),
        movementQualityScore: num(row['Movement Quality Score'] || row['MQS'] || row['Movement Quality'] || row.screeningScore),

        // Performance
        imtpPeakForce: num(row['IMTP Peak (N)'] || row['IMTP Peak'] || row.imtpPeak),
        imtpRfd200: num(row['RFD @ 200ms (N/s)'] || row['RFD 200ms'] || row.imtpRfd200),
        peakForceAsymmetry: num(row['PF ASM'] || row.asymmetry), // Not in provided headers, keeping fallback
        broadJump: num(row['Broad Jump (cm)'] || row['Broad Jump'] || row['BJ'] || row['Distance'] || row.distance),
        agilityTime: num(row['Agility T-Time (s)'] || row['Agility T'] || row['Agility (s)'] || row['Agility'] || row['T-Test'] || row['T Test']),

        // Clinical (Calculated from Raw or mapped directly)
        hamstringQuadLeft: (() => {
            const flexL = num(row['Knee Flex L (N)']);
            const extL = num(row['Knee Ext L (N)']);
            if (flexL && extL) return Number((flexL / extL).toFixed(2));
            return num(row['H:Q L']);
        })(),
        hamstringQuadRight: (() => {
            const flexR = num(row['Knee Flex R (N)']);
            const extR = num(row['Knee Ext R (N)']);
            if (flexR && extR) return Number((flexR / extR).toFixed(2));
            return num(row['H:Q R']);
        })(),
        kneeExtensionLeft: num(row['Knee Ext L (N)'] || row['Knee Ext L']),
        kneeExtensionRight: num(row['Knee Ext R (N)'] || row['Knee Ext R']),
        hipAbductionLeft: num(row['Hip Abd L (N)'] || row['Hip Abd L']),
        hipAbductionRight: num(row['Hip Abd R (N)'] || row['Hip Abd R']),
        shoulderInternalRotationLeft: num(row['Shoulder IR L (N)'] || row['Shoulder IR L']),
        shoulderInternalRotationRight: num(row['Shoulder IR R (N)'] || row['Shoulder IR R']),
        neckExtension: num(row['Neck Ext (N)'] || row['Neck Ext']),
        ankleRomLeft: num(row['Ankle ROM L (deg)'] || row['Ankle ROM L']),
        ankleRomRight: num(row['Ankle ROM R (deg)'] || row['Ankle ROM R']),
        shoulderRomLeft: num(row['Shoulder ER L (N)'] || row['Shoulder ROM L']), // Assuming ER is the main ROM metric or just mapping force for now? User said "Shoulder ER L (N)".
        shoulderRomRight: num(row['Shoulder ER R (N)'] || row['Shoulder ROM R']),
        adductionStrengthLeft: num(row['Hip Add L (N)'] || row['Adduction L']),
        adductionStrengthRight: num(row['Hip Add R (N)'] || row['Adduction R']),

        // Scores (Map from flat keys OR Calculate from Raw vs BW)
        scoreHamstring: (() => {
            const raw = num(row['Score Hamstring']);
            if (raw) return raw;
            // Fallback: Knee Flex / BW * 2 (approx conversion to arbitrary score for viz)
            const bw = num(row['Body Weight (kg)']) || 70;
            const flex = (num(row['Knee Flex L (N)']) + num(row['Knee Flex R (N)'])) / 2;
            return flex ? Math.min(100, Math.round((flex / bw) * 10)) : 0;
        })(),
        scoreQuad: (() => {
            const raw = num(row['Score Quad']);
            if (raw) return raw;
            const bw = num(row['Body Weight (kg)']) || 70;
            const ext = (num(row['Knee Ext L (N)']) + num(row['Knee Ext R (N)'])) / 2;
            return ext ? Math.min(100, Math.round((ext / bw) * 5)) : 0; // Quads are stronger, lower multiplier
        })(),
        scoreAdduction: (() => {
            const raw = num(row['Score Adduction']);
            if (raw) return raw;
            const bw = num(row['Body Weight (kg)']) || 70;
            // Use Groin Force (Squeeze) if available, common fallback to L+R
            const squeeze = num(row['Groin Force'] || row['Groin Squeeze (N)'] || row['Groin Squeeze'] || row['Adduction Peak']);
            if (squeeze) return Math.min(100, Math.round((squeeze / bw) * 4)); // Force / BW * 4 (approx)

            const add = (num(row['Hip Add L (N)']) + num(row['Hip Add R (N)'])) / 2;
            return add ? Math.min(100, Math.round((add / bw) * 8)) : 0;
        })(),
        scoreAnkle: num(row['Score Ankle'] || 0), // No force data in headers for ankle strength, only ROM
        scoreShoulder: (() => {
            const raw = num(row['Score Shoulder']);
            if (raw) return raw;
            const bw = num(row['Body Weight (kg)']) || 70;
            // Using External Rotation strength
            const er = (num(row['Shoulder ER L (N)']) + num(row['Shoulder ER R (N)'])) / 2;
            return er ? Math.min(100, Math.round((er / bw) * 15)) : 0;
        })(),
        scoreNeck: (() => {
            const raw = num(row['Score Neck']);
            if (raw) return raw;
            const bw = num(row['Body Weight (kg)']) || 70;
            const neck = num(row['Neck Ext (N)']);
            return neck ? Math.min(100, Math.round((neck / bw) * 10)) : 0;
        })(),

        // v11.5 Wellness & CNS
        sleep: num(row['Sleep Score'] || row['Sleep'] || row.sleep),
        stress: num(row['Stress Score'] || row['Stress'] || row.stress),
        soreness: num(row['Soreness Score'] || row['Soreness'] || row.soreness),
        baselineJump: num(row['Baseline Jump (cm)'] || row['Baseline Jump'] || row.baselineJump || 0),

        // v12.5 Workload
        dailyLoad: num(row['Daily Load'] || row['Total Daily Load'] || row['Load'] || row.dailyLoad),
        acwr: num(row['ACWR'] || row['Acute:Chronic'] || row.acwr),
        s2Duration: num(row['S2 Duration'] || row['Session 2'] || row.s2Duration),

        // v15.1 Hardware Integration Matches
        paymentStatus: row['Payment Status'] || row['Subscription'] || row.paymentStatus || 'Active', // Default Active for legacy
        waiverStatus: row['Waiver Status'] || row['Legal'] || row.waiverStatus || 'Signed', // Default Signed for legacy
        bodyWeight: num(row['Body Weight (kg)'] || row['Weight'] || row.bodyWeight || 70),
        groinSqueeze: num(row['Groin Force'] || row['Groin Squeeze (N)'] || row['Groin Squeeze'] || row['Adduction Peak'] || (num(row['Hip Add L (N)']) + num(row['Hip Add R (N)']))),
        // Note: Groin Squeeze is often sum of L+R Adduction or a specific test. 
        // Fallback to sum of mapped L+R if specific column missing.

        // v16.1 Ecosystem
        valdProfileId: row['VALD ID'] || row['Profile ID'] || row.valdProfileId || '',
        moveHealth: {
            lastExercises: [] // Google Sheet doesn't have live feed, defaulting to empty until enriched
        }
    };
};
