import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AthleteData, parseAthleteData, MOCK_CSV_DATA } from '../utils/dataEngine';

interface DataContextType {
    data: AthleteData[];
    refreshData: (csvContent: string) => void;
    getAthlete: (id: string) => AthleteData | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AthleteData[]>([]);

    // Load initial data (Mock)
    useEffect(() => {
        // Check if we have data in localStorage
        const stored = localStorage.getItem('apex_athlete_data');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            // Load mock
            const parsed = parseAthleteData(MOCK_CSV_DATA);
            setData(parsed);
        }
    }, []);

    const refreshData = (csvContent: string) => {
        const parsed = parseAthleteData(csvContent);
        setData(parsed);
        localStorage.setItem('apex_athlete_data', JSON.stringify(parsed));
    };

    const getAthlete = (id: string) => {
        // fuzzy match for demo if ID is "athlete-0" etc.
        // Real app would match exact ID
        return data.find(a => a.id === id || a.name.toLowerCase().replace(' ', '-') === id);
    };

    return (
        <DataContext.Provider value={{ data, refreshData, getAthlete }}>
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
