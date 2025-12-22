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
        return null; // Returning null triggers the local/mock fallback in DataContext
    }

    try {
        // We append the email as a query parameter
        const response = await fetch(`${APPS_SCRIPT_URL}?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Google Sheet API Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === 'error' || !data.athlete) {
            // Propagate the specific error message from Apps Script
            const specificError = data.message || "Unknown API Error";
            console.warn("Google Sheet Error:", specificError);
            throw new Error(specificError);
        }

        // Map JSON response to AthleteData interface
        // Assumes Apps Script returns a matching JSON structure or we map it here
        return mapGoogleRowToAthlete(data.athlete);

    } catch (error) {
        console.error("Failed to fetch from Google Sheet:", error);
        return null;
    }
};

const mapGoogleRowToAthlete = (row: any): AthleteData => {
    // Helper to safely parse numbers
    const num = (val: any) => Number(val) || 0;

    return {
        id: row._id || `google-${Date.now()}`,
        name: row._name || 'Unknown Athlete',
        email: row._email || '',
        date: new Date().toISOString().split('T')[0],
        lastUpdated: row['Last Updated'] || '',

        // V8.0 Administrative
        parentConsent: row['Parent Consent'] || 'No', // Safety Gate
        package: row['Package'] || 'Camp',

        // V8.0 Neural
        readinessScore: num(row['Readiness Score'] || row['Ready %']),
        groinTimeToMax: num(row['Groin Time to Max'] || row['Groin TMAX']),
        movementQualityScore: num(row['MQS'] || row['Movement Quality']),

        // Performance
        imtpPeakForce: num(row['IMTP Peak']),
        imtpRfd200: num(row['RFD 200ms']),
        peakForceAsymmetry: num(row['PF ASM']),

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

        // Scores
        scoreHamstring: num(row['Score Hamstring']),
        scoreQuad: num(row['Score Quad']),
        scoreAdduction: num(row['Score Adduction']),
        scoreAnkle: num(row['Score Ankle']),
        scoreShoulder: num(row['Score Shoulder']),
        scoreNeck: num(row['Score Neck']),
    };
};
