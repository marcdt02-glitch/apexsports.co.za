import { AthleteData, parseAthleteData, MOCK_CSV_DATA } from './dataEngine';

// Configuration
// In a real app, this would be an environment variable.
// For this static site, we'll use a public Google Apps Script URL or a published CSV URL.
// The user will need to Deploy their Apps Script as a Web App and paste the URL here.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_placeholder_your_script_id_here/exec';

// Temporary fallback to Mock until user provides their Script URL
const USE_MOCK_FALLBACK = true;

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
            console.warn("Google Sheet: Athlete not found", data.message);
            return null;
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
        id: row.id || `google-${Date.now()}`,
        name: row.name || 'Unknown Athlete',
        email: row.email || '',
        date: new Date().toISOString().split('T')[0], // Always fresh

        hamstringQuadLeft: num(row.hq_left),
        hamstringQuadRight: num(row.hq_right),
        imtpPeakForce: num(row.imtp_peak),
        peakForceAsymmetry: num(row.pf_asym),
        neckExtension: num(row.neck),
        ankleRomLeft: num(row.ankle_l),
        ankleRomRight: num(row.ankle_r),

        // Calculated scores (or fetched if computed in Sheet)
        scoreHamstring: num(row.score_hamstring) || Math.min(100, num(row.hq_left) * 120),
        scoreQuad: num(row.score_quad) || 50,
        scoreAdduction: num(row.score_adduction) || 50,
        scoreAnkle: num(row.score_ankle) || 50,
        scoreShoulder: num(row.score_shoulder) || 50,
        scoreNeck: num(row.score_neck) || 50,
    };
};
