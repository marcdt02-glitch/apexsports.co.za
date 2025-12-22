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
        const term = idOrEmail.toLowerCase().trim();
        return data.find(a =>
            a.id.toLowerCase() === term ||
            a.email.toLowerCase() === term ||
            a.name.toLowerCase().replace(/\s+/g, '-').includes(term)
        );
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
