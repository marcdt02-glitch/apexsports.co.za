import { useState, useEffect, useRef } from 'react';

// Declarations to satisfy TS for the Google API global objects
declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

export interface DriveFile {
    id: string;
    name: string;
    embedUrl: string;
    mimeType: string;
    url?: string;
}

// Scope for Drive Per-File Access (Best for Picker, avoids full read-only safety checks)
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export const useGoogleDrivePicker = () => {
    const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
    const [gisLoaded, setGisLoaded] = useState(false);
    const [oauthToken, setOauthToken] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Ref to hold the token client to avoid recreation
    const tokenClient = useRef<any>(null);

    // Initial Load of Scripts (GAPI for Picker, GIS for Auth)
    useEffect(() => {
        const loadScripts = () => {
            // 1. Load GAPI (Legacy API for Picker)
            const scriptGapi = document.createElement("script");
            scriptGapi.src = "https://apis.google.com/js/api.js";
            scriptGapi.async = true;
            scriptGapi.defer = true;
            scriptGapi.onload = () => {
                window.gapi.load('picker', () => {
                    setPickerApiLoaded(true);
                    console.log("✅ GAPI Picker Loaded");
                });
            };
            document.body.appendChild(scriptGapi);

            // 2. Load GIS (New Identity Services for Auth)
            const scriptGis = document.createElement("script");
            scriptGis.src = "https://accounts.google.com/gsi/client";
            scriptGis.async = true;
            scriptGis.defer = true;
            scriptGis.onload = () => {
                setGisLoaded(true);
                console.log("✅ GIS Auth Loaded");
            };
            document.body.appendChild(scriptGis);
        };

        loadScripts();

        return () => {
            // Cleanup if needed
        }
    }, []);

    // Function to Authenticate User
    const handleAuthClick = (clientId: string) => {
        if (!gisLoaded) {
            console.error("Google Identity Services not loaded yet.");
            return;
        }

        // Initialize Token Client if not already done
        if (!tokenClient.current) {
            tokenClient.current = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: SCOPES,
                callback: async (response: any) => {
                    if (response.error !== undefined) {
                        console.error("Auth Error:", response);
                        alert(`Auth Error: ${response.error}`);
                        return;
                    }
                    console.log("🔓 OAuth Success:", response);
                    setOauthToken(response.access_token);
                    setIsAuthorized(true);
                },
            });
        }

        // Trigger the popup
        // Use prompt: '' to try silent, or 'consent' to force screen
        // For first time or explicitly clicking 'Sign In', we might want to ensure they see it if needed,
        // but typically requestAccessToken() handles it.
        tokenClient.current.requestAccessToken({ prompt: '' });
    };

    // Function to trigger the picker
    const handleOpenPicker = (developerKey: string, clientId: string, onSelect: (file: DriveFile) => void) => {
        if (!isAuthorized || !oauthToken) {
            alert("No Access Token. Please Sign In first.");
            return;
        }

        if (pickerApiLoaded && window.google && window.google.picker) {
            const picker = new window.google.picker.PickerBuilder()
                .addView(window.google.picker.ViewId.VIDEO_SEARCH)
                .addView(window.google.picker.ViewId.DOCS_VIDEOS)
                .setOAuthToken(oauthToken) // Pass the token explicitly
                .setOAuthToken(oauthToken) // Pass the token explicitly
                .setDeveloperKey(developerKey)
                .setAppId(clientId)
                .setOrigin(window.location.protocol + '//' + window.location.host)
                .setCallback((data: any) => {
                    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
                        const doc = data[window.google.picker.Response.DOCUMENTS][0];
                        const file: DriveFile = {
                            id: doc[window.google.picker.Document.ID],
                            name: doc[window.google.picker.Document.NAME],
                            embedUrl: doc[window.google.picker.Document.EMBEDDABLE_URL] || doc.url,
                            mimeType: doc[window.google.picker.Document.MIME_TYPE],
                            url: doc.url
                        };
                        console.log("📁 File Picked:", file);
                        onSelect(file);
                    }
                })
                .build();
            picker.setVisible(true);
        } else {
            console.warn("Google Picker API not loaded.");
        }
    };

    return {
        openPicker: handleOpenPicker,
        signIn: handleAuthClick,
        isApiLoaded: pickerApiLoaded && gisLoaded,
        isAuthorized
    };
};
