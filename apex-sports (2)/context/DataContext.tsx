import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AthleteData, parseAthleteData, MOCK_CSV_DATA } from '../utils/dataEngine';
import { fetchAthleteFromGoogle } from '../utils/googleIntegration';

// Enhanced Athlete Interface for Google Integration
export interface Athlete {
    id: string; // Internal ID or generated
    name: string;
    email: string;
    packageType: 'Camp' | 'Elite' | 'Pro'; // Navigation Guard

    // Scores
    scorePerformance: number;
    scoreScreening: number;
    scoreReadiness: number;

    // Radar Data (Nullable)
    hamstringQuadLeft?: number;
    hamstringQuadRight?: number;
    scoreAdduction?: number;
    scoreAnkle?: number;
    scoreShoulder?: number;
    scoreNeck?: number;

    // VALD Specific
    imtpPeakForce?: number;
    peakForceAsymmetry?: number;

    // Daily
    sRPE?: number;
    sleep?: number;

    // Meta
    focusArea?: string;
}

interface DataContextType {
    data: AthleteData[];
    refreshData: (csvContent: string) => void;
    getAthlete: (id: string) => AthleteData | undefined;
    fetchAndAddAthlete: (emailOrId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AthleteData[]>([]);
    const [loading, setLoading] = useState(false);

    // Load initial data (Mock or Local)
    useEffect(() => {
        const stored = localStorage.getItem('apex_athlete_data');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            const parsed = parseAthleteData(MOCK_CSV_DATA);
            setData(parsed);
        }
    }, []);

    const refreshData = (csvContent: string) => {
        const parsed = parseAthleteData(csvContent);
        setData(parsed);
        localStorage.setItem('apex_athlete_data', JSON.stringify(parsed));
    };

    const getAthlete = (idOrEmail: string): AthleteData | undefined => {
        // Search by ID or Email
        const searchTerm = idOrEmail.toLowerCase().trim();
        return data.find(a =>
            a.id.toLowerCase() === searchTerm ||
            (a.email && a.email.toLowerCase() === searchTerm)
        );
    };

    const fetchAndAddAthlete = async (email: string, pin: string): Promise<AthleteData | null> => {
        try {
            console.log("Fetching athlete:", email);
            const athlete = await fetchAthleteFromGoogle(email, pin);

            if (athlete) {
                // Determine ID based on email to ensure consistent URL
                const safeId = email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                athlete.id = safeId;

                setData(prev => {
                    // Check if exists
                    const exists = prev.find(a => a.id === safeId);
                    let updatedData;
                    if (exists) {
                        updatedData = prev.map(a => a.id === safeId ? athlete : a);
                    } else {
                        updatedData = [...prev, athlete];
                    }
                    localStorage.setItem('apex_athlete_data', JSON.stringify(updatedData));
                    return updatedData;
                });
                return athlete;
            }
            return null;
        } catch (error) {
            console.error("Context Fetch Error:", error);
            throw error;
        }
    };

    return (
        <DataContext.Provider value={{ data, refreshData, getAthlete, fetchAndAddAthlete }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
