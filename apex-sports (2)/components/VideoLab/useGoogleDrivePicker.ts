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
// For now, we'll keep them effectively empty or placeholder
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

export const useGoogleDrivePicker = () => {
    const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
    const [oauthToken, setOauthToken] = useState<string | null>(null);

    useEffect(() => {
        const loadGapis = () => {
            const script = document.createElement("script");
            script.src = "https://apis.google.com/js/api.js";
            script.onload = () => {
                window.gapi.load('client:auth2:picker', initClient);
            };
            document.body.appendChild(script);
        };

        const initClient = () => {
            // We rely on the user providing a token or authentication flow in a real app.
            // For this UI demo, we will simulate or assume a token is available if configured.
            // Real implementation requires:
            // window.gapi.client.init({ apiKey: '...', clientId: '...', discoveryDocs: DISCOVERY_DOCS, scope: SCOPES }).then(...)
            console.log("GAPI Client Loaded (Placeholder Mode)");
            setPickerApiLoaded(true);
        };

        if (!window.gapi) {
            loadGapis();
        } else {
            window.gapi.load('client:auth2:picker', initClient);
        }
    }, []);

    // Function to trigger the picker - Requires Developer Key and Client ID
    const handleOpenPicker = (developerKey: string, clientId: string, onSelect: (file: DriveFile) => void) => {
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
            // Fallback for Demo: Prompt for a URL if API fails/missing
            const fallbackUrl = prompt("Valid Google API Credentials not found for this demo.\n\nEnter a direct Video URL (mp4) to test the player:", "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
            if (fallbackUrl) {
                onSelect({
                    id: 'demo-123',
                    name: 'Demo Video (Fallback)',
                    embedUrl: fallbackUrl,
                    mimeType: 'video/mp4',
                    url: fallbackUrl
                });
            }
        }
    };

    return { openPicker: handleOpenPicker, isApiLoaded: pickerApiLoaded };
};
