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

    // v18.0: Ghost Admin Backdoor (Bypass Sheet for Dev/Admin Access)
    // Allows access to Team Dashboard even if not in Sheet
    if (email.toLowerCase().trim() === 'admin@apexsports.co.za') {
        console.log("🔐 Admin Access Granted via Ghost Protocol");
        return {
            id: 'admin-user',
            name: 'Apex Admin',
            email: 'admin@apexsports.co.za',
            date: new Date().toISOString(),
            package: 'Elite',
            productTier: 'Apex Membership',
            accountActive: 'YES',
            parentConsent: 'Yes',
            readinessScore: 100,
            soreness: 0,
            imtpPeakForce: 0,
            groinSqueeze: 0,
            // ... minimal required props
            kneeExtensionLeft: 0, kneeExtensionRight: 0,
            hipAbductionLeft: 0, hipAbductionRight: 0,
            shoulderInternalRotationLeft: 0, shoulderInternalRotationRight: 0,
            moveHealth: { lastExercises: [] },
            valdProfileId: '', paymentStatus: 'Active', waiverStatus: 'Signed'
        } as AthleteData;
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

        // DEBUG: Log the full raw response to identify correct keys/values
        console.log('🔍 RAW GOOGLE SHEET RESPONSE:', JSON.stringify(data, null, 2));

        // 1. Check for "Flat JSON" response (Direct Athlete Object)
        if (data && (data.email || data.firstName || data.name)) {
            return mapGoogleRowToAthlete(data);
        }

        if (data.status === 'success' && data.athlete) {
            const athlete = mapGoogleRowToAthlete(data.athlete);

            // v19.0: Enrich with Access & History if provided by backend
            if (data.access) athlete.access = data.access;
            if (data.history) athlete.wellnessHistory = data.history;

            return athlete;
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
    // Helper to find key case-insensitively if needed, though GAS usually preserves case.
    const findKey = (search: string) => Object.keys(row).find(k => k.toLowerCase().trim() === search.toLowerCase().trim());

    // Debug specific tier keys
    console.log('🔍 Row Keys for Tier Debug:', {
        'Product Tier': row['Product Tier'],
        'Package': row['Package'],
        'foundProductTier': row[findKey('product tier') || ''],
        'foundPackage': row[findKey('package') || '']
    });

    const num = (val: any) => {
        if (val === 'N/A' || val === undefined || val === null || val === '') return 0;
        if (typeof val === 'number') return val;
        // String cleaning: Remove commas, 'kg', 'sec', 's', 'cm', 'N', etc. (keep dots and negative signs)
        const cleanStr = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
        return parseFloat(cleanStr) || 0;
    };

    return {
        id: row._id || row.id || `google-${Date.now()}`,
        // Administrative: User uses "Name" and "Surname"
        name: row._name || row.name || row['Name'] ? `${row['Name']} ${row['Surname'] || ''}`.trim() : `${row.firstName || ''} ${row.surname || ''}`.trim() || 'Unknown Athlete',
        email: row._email || row.email || row['Email'] || '',
        date: new Date().toISOString().split('T')[0],
        lastUpdated: row['Last Updated'] || row.timestamp || '',

        // V8.0 Administrative
        parentConsent: row['Parent Consent'] || row['Parental Consent'] || row['Consent'] || row.parentConsent || 'Yes',
        package: row['Package'] || row['Product Tier'] || row['package'] || 'Camp',

        // v17.1 Access Control
        productTier: row['Product Tier'] || row['Package'] || 'Basic',
        accountActive: row['Account Active'] || 'YES',

        // v8.0 Neural
        readinessScore: num(row['Readiness %'] || row['Readiness Score (%)'] || row['Readiness Score'] || row.readinessScore || 85),
        groinTimeToMax: num(row['Groin Time'] || row['Groin Time to Max (s)'] || row.groinTimeToMax),
        movementQualityScore: num(row['MQS'] || row['Movement Quality Score'] || row.screeningScore),

        // v38.0 Backend Scores (Direct override)
        performanceScore: num(row['Performance Score'] || row.performanceScore),
        screeningScore: num(row['Screening Score'] || row.screeningScore),
        asymmetries: row.asymmetries || {},

        // Performance
        imtpPeakForce: num(row['Lower Body Peak Force'] || row['IMTP Peak (N)'] || row.imtpPeak),
        imtpRfd200: num(row['RFD @ 200ms (N/s)'] || row['RFD 200ms'] || row.imtpRfd200),
        peakForceAsymmetry: num(row['PF ASM'] || row.asymmetry),
        broadJump: num(row['Broad Jump(Cm)'] || row['Broad Jump (cm)'] || row['Broad Jump'] || row.distance),
        agilityTime: num(row['Agility T(s)'] || row['Agility T-Time (s)'] || row['Agility T'] || row['Agility']),

        // Clinical (Calculated from Raw or mapped directly)
        hamstringQuadLeft: (() => {
            const flexL = num(row['Knee Flex L'] || row['Knee Flex L (N)']);
            const extL = num(row['Knee Ext L'] || row['Knee Ext L (N)']);
            if (flexL && extL) return Number((flexL / extL).toFixed(2));
            return num(row['H:Q L']);
        })(),
        hamstringQuadRight: (() => {
            const flexR = num(row['Knee Flex R'] || row['Knee Flex R (N)']);
            const extR = num(row['Knee Ext R'] || row['Knee Ext R (N)']);
            if (flexR && extR) return Number((flexR / extR).toFixed(2));
            return num(row['H:Q R']);
        })(),
        kneeExtensionLeft: num(row['Knee Ext L'] || row['Knee Ext L (N)']),
        kneeExtensionRight: num(row['Knee Ext R'] || row['Knee Ext R (N)']),
        hipAbductionLeft: num(row['Hip Abd L'] || row['Hip Abd L (N)']),
        hipAbductionRight: num(row['Hip Abd R'] || row['Hip Abd R (N)']),
        shoulderInternalRotationLeft: num(row['Shoulder IR L'] || row['Shoulder IR L (N)']),
        shoulderInternalRotationRight: num(row['Shoulder IR R'] || row['Shoulder IR R (N)']),
        neckExtension: num(row['Neck Ext'] || row['Neck Ext (N)']),
        ankleRomLeft: num(row['Ankle ROM L'] || row['Ankle ROM L (deg)']),
        ankleRomRight: num(row['Ankle ROM R'] || row['Ankle ROM R (deg)']),
        shoulderRomLeft: num(row['Shoulder ER L'] || row['Shoulder ER L (N)']),
        shoulderRomRight: num(row['Shoulder ER R'] || row['Shoulder ER R (N)']),
        adductionStrengthLeft: num(row['Hip Add L'] || row['Hip Add L (N)']),
        adductionStrengthRight: num(row['Hip Add R'] || row['Hip Add R (N)']),

        // Scores (Map from flat keys OR Calculate from Raw vs BW)
        scoreHamstring: (() => {
            const raw = num(row['Score Hamstring']);
            if (raw) return raw;
            // Fallback: Knee Flex / BW * 2 (approx conversion)
            const bw = num(row['Body Weight (kg)']) || 70;
            const flex = (num(row['Knee Flex L']) + num(row['Knee Flex R'])) / 2;
            return flex ? Math.min(100, Math.round((flex / bw) * 10)) : 0;
        })(),
        scoreQuad: (() => {
            const raw = num(row['Score Quad']);
            if (raw) return raw;
            const bw = num(row['Body Weight (kg)']) || 70;
            const ext = (num(row['Knee Ext L']) + num(row['Knee Ext R'])) / 2;
            return ext ? Math.min(100, Math.round((ext / bw) * 5)) : 0;
        })(),
        scoreAdduction: (() => {
            const raw = num(row['Score Adduction']);
            if (raw) return raw;
            const bw = num(row['Body Weight (kg)']) || 70;
            const squeeze = num(row['Groin Force'] || row['Groin Squeeze (N)']);
            if (squeeze) return Math.min(100, Math.round((squeeze / bw) * 4));

            const add = (num(row['Hip Add L']) + num(row['Hip Add R'])) / 2;
            return add ? Math.min(100, Math.round((add / bw) * 8)) : 0;
        })(),
        scoreAnkle: num(row['Score Ankle'] || 0),
        scoreShoulder: (() => {
            const raw = num(row['Score Shoulder']);
            if (raw) return raw;
            const bw = num(row['Body Weight (kg)']) || 70;
            const er = (num(row['Shoulder ER L']) + num(row['Shoulder ER R'])) / 2;
            return er ? Math.min(100, Math.round((er / bw) * 15)) : 0;
        })(),
        scoreNeck: (() => {
            const raw = num(row['Score Neck']);
            if (raw) return raw;
            const bw = num(row['Body Weight (kg)']) || 70;
            const neck = num(row['Neck Ext']);
            return neck ? Math.min(100, Math.round((neck / bw) * 10)) : 0;
        })(),

        // v11.5 Wellness & CNS
        sleep: num(row['Sleep Quality'] || row['Sleep Score'] || row['Sleep']),
        stress: num(row['Stress'] || row['Stress Score']),
        soreness: num(row['Soreness'] || row['Soreness Score']),
        baselineJump: num(row['Baseline Jump (cm)'] || row['Baseline Jump'] || 0),

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
        },

        // v18.5 Coaching Links
        coaching: {
            practiceFolder: row['Practice Folder'] || row['Practice Footage'] || '',
            gameFolder: row['Game Folder'] || row['Game Footage'] || '',
            trainingFolder: row['Training Folder'] || row['Training Footage'] || '',
        }
    };
};
