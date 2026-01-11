import { useState, useEffect } from 'react';

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
    embedUrl: string; // We'll try to construct a usable URL
    mimeType: string;
    url?: string;
}

// NOTE: These should be replaced by your actual keys or environment variables
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
// const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']; // Not strictly needed for Picker alone but good for Drive API

export const useGoogleDrivePicker = () => {
    const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
    const [oauthToken, setOauthToken] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Initial Load of GAPI Scripts
    useEffect(() => {
        const loadGapis = () => {
            const script = document.createElement("script");
            script.src = "https://apis.google.com/js/api.js";
            script.onload = () => {
                window.gapi.load('client:auth2:picker', () => {
                    setPickerApiLoaded(true);
                });
            };
            document.body.appendChild(script);
        };

        if (!window.gapi) {
            loadGapis();
        } else {
            window.gapi.load('client:auth2:picker', () => setPickerApiLoaded(true));
        }
    }, []);

    // Function to Authenticate User
    const handleAuthClick = (clientId: string) => {
        if (!window.gapi || !window.gapi.auth2) {
            console.error("GAPI not loaded");
            return;
        }

        // Initialize Auth2 if not already
        if (!window.gapi.auth2.getAuthInstance()) {
            window.gapi.client.init({
                clientId: clientId,
                scope: SCOPES,
            }).then(() => {
                const auth = window.gapi.auth2.getAuthInstance();
                auth.signIn().then(() => {
                    const user = auth.currentUser.get();
                    const token = user.getAuthResponse().access_token;
                    setOauthToken(token);
                    setIsAuthorized(true);
                });
            }).catch((err: any) => {
                console.error("Auth Init Error:", err);
                alert(`Google Auth Error: ${JSON.stringify(err)}. Check Console.`);
            });
        } else {
            // Already initialized, just sign in
            const auth = window.gapi.auth2.getAuthInstance();
            auth.signIn().then(() => {
                const user = auth.currentUser.get();
                const token = user.getAuthResponse().access_token;
                setOauthToken(token);
                setIsAuthorized(true);
            });
        }
    };

    // Function to trigger the picker - Requires Developer Key and Client ID
    const handleOpenPicker = (developerKey: string, clientId: string, onSelect: (file: DriveFile) => void) => {
        if (!isAuthorized) {
            // Auto-trigger auth if not signed in? Better to force user action.
            alert("Please Sign In with Google first.");
            return;
        }

        if (pickerApiLoaded && window.google && window.google.picker) {
            const picker = new window.google.picker.PickerBuilder()
                .addView(window.google.picker.ViewId.VIDEO_SEARCH)
                .addView(window.google.picker.ViewId.DOCS_VIDEOS)
                .setOAuthToken(oauthToken || '')
                .setDeveloperKey(developerKey)
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
                        onSelect(file);
                    }
                })
                .build();
            picker.setVisible(true);
        } else {
            console.warn("Google Picker API not loaded or configured.");
        }
    };

    return { openPicker: handleOpenPicker, signIn: handleAuthClick, isApiLoaded: pickerApiLoaded, isAuthorized };
};
