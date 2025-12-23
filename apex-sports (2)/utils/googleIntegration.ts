import { AthleteData, parseAthleteData, MOCK_CSV_DATA } from './dataEngine';

// Configuration
// In a real app, this would be an environment variable.
// For this static site, we'll use a public Google Apps Script URL or a published CSV URL.
// The user will need to Deploy their Apps Script as a Web App and paste the URL here.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyctSXieX83wSaagWh3Qq3yOiz5KAD6Ux9ucjlhTUbAkcY8JIdBHTRGQL_-NF58BBQo4Q/exec'; // v4.0

// Temporary fallback to Mock until user provides their Script URL
const USE_MOCK_FALLBACK = false;

export const fetchAthleteFromGoogle = async (email: string): Promise<AthleteData | null> => {
    if (USE_MOCK_FALLBACK) {
        console.log("Google Integration: Using Mock Fallback");
        return null;
    }

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?email=${encodeURIComponent(email)}`, {
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

        // V8.0 Neural
        readinessScore: num(row['Readiness Score'] || row['Ready %'] || row.readinessScore || 85),
        groinTimeToMax: num(row['Groin Time to Max'] || row['Groin TMAX'] || row.groinTimeToMax),
        movementQualityScore: num(row['MQS'] || row['Movement Quality'] || row.screeningScore),

        // Performance
        imtpPeakForce: num(row['IMTP Peak'] || row.imtpPeak),
        imtpRfd200: num(row['RFD 200ms'] || row.imtpRfd200),
        peakForceAsymmetry: num(row['PF ASM'] || row.asymmetry),
        broadJump: num(row['Broad Jump'] || row.broadJump || row['BJ'] || row['Broad Jump (cm)'] || row['Distance'] || row.distance),
        agilityTime: num(row['Agility T'] || row['Agility (s)'] || row['Agility'] || row['505 Agility'] || row['Agility 505'] || row['505'] || row['T-Test'] || row['T Test'] || row.agilityTime || row.agility || row.tTest),

        // Clinical
        hamstringQuadLeft: num(row['H:Q L']),
        hamstringQuadRight: num(row['H:Q R']),
        neckExtension: num(row['Neck Ext']),
        ankleRomLeft: num(row['Ankle ROM L']),
        ankleRomRight: num(row['Ankle ROM R']),
        shoulderRomLeft: num(row['Shoulder ROM L']),
        shoulderRomRight: num(row['Shoulder ROM R']),
        adductionStrengthLeft: num(row['Adduction L']),
        adductionStrengthRight: num(row['Adduction R']),

        // Scores (Map from flat keys or raw sheet)
        // Scores (Map from flat keys or raw sheet)
        scoreHamstring: num(row['Score Hamstring'] || row['Hamstring Score'] || row['Hamstring %'] || row['Dynamo Hamstring'] || row.scoreHamstring || row.hamstringScore),
        scoreQuad: num(row['Score Quad'] || row['Quad Score'] || row['Quad %'] || row['Dynamo Quad'] || row.scoreQuad || row.quadScore),
        scoreAdduction: num(row['Score Adduction'] || row['Adduction Score'] || row['Adduction %'] || row['Dynamo Adduction'] || row['Groin Score'] || row.scoreAdduction),
        scoreAnkle: num(row['Score Ankle'] || row['Ankle Score'] || row['Ankle %'] || row['Dynamo Ankle'] || row.scoreAnkle),
        scoreShoulder: num(row['Score Shoulder'] || row['Shoulder Score'] || row['Shoulder %'] || row['Dynamo Shoulder'] || row.scoreShoulder),
        scoreNeck: num(row['Score Neck'] || row['Neck Score'] || row['Neck %'] || row['Dynamo Neck'] || row.scoreNeck),

        // Legacy/Flat Support
        // If the flat JSON has 'screeningScore', map it to MQS
    };
};
