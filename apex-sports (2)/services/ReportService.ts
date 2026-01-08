import jsPDF from 'jspdf';

// Local definition since global type file location varies
interface AthleteData {
    name: string;
    productTier?: string;
    scoreQuad?: number;
    scoreHamstring?: number;
    scoreAdduction?: number;
    scoreShoulder?: number;
    scoreAnkle?: number;
    readinessScore?: number;
    groinTimeToMax?: number;
    acwr?: number;
    email?: string;
    access?: any;
    // Add other fields as needed
}

// Helper: Add Validated Stamp
const addVerifiedStamp = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
    const x = pageWidth - 40;
    const y = pageHeight - 30;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.circle(x, y, 12, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(0, 0, 0);
    doc.text("VERIFIED", x - 4.5, y - 2);
    doc.text("SCIENTIST", x - 4.5, y + 4);

    doc.setFontSize(5);
    doc.text("APEX SPORTS", x - 5, y + 8);
};

// Helper: Ballistic Header (High Impact)
const addBallisticHeader = (doc: jsPDF, title: string, subTitle: string, athlete: AthleteData) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryColor = [59, 130, 246]; // Blue-500
    const secondaryColor = [168, 85, 247]; // Purple-500
    const accentColor = [34, 197, 94]; // Green-500

    // 1. Top Bar Gradient Simulation
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // 2. Main Header Background (Rich Black)
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 4, pageWidth, 50, 'F');

    // 3. Logo Placeholder (Text for now due to image complexity, or loaded image if available)
    // Assuming logo handling needs base64, we'll stick to heavy typographical logo
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("APEX", 20, 24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); // Blue Apex
    doc.text("SPORTS", 95, 24); // Adjust X based on "APEX" width

    // Slogan
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("WHERE SCIENCE MEETS EXECUTION", 20, 32);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 120, 35); // Underline slogan

    // Report Titles
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 20, 48);

    // Subtitle / Date
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`${subTitle.toUpperCase()} | ${today}`, 20 + doc.getStringUnitWidth(title.toUpperCase()) * 16 / 2 + 5, 48); // Simple offset approximation

    // 4. Athlete Metadata Card (Right aligned)
    const cardWidth = 80;
    const cardHeight = 36;
    const cardX = pageWidth - 20 - cardWidth;
    const cardY = 10;

    // Glassmorphism Card Effect
    doc.setDrawColor(40, 40, 40);
    doc.setFillColor(20, 20, 20);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2, 'FD');

    // Avatar Circle (Placeholder)
    doc.setFillColor(30, 30, 30);
    doc.circle(cardX + 10, cardY + 18, 14, 'F');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(athlete.name.charAt(0), cardX + 7, cardY + 22);

    // Info
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(athlete.name, cardX + 28, cardY + 12);

    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${athlete.productTier || 'Athlete'} Tier`.toUpperCase(), cardX + 28, cardY + 20);

    doc.setTextColor(150, 150, 150);
    doc.text(`ID: #${Math.floor(Math.random() * 10000)}`, cardX + 28, cardY + 28);

    // Reset
    doc.setTextColor(255, 255, 255);
};

// 1. TECHNICAL LAB REPORT
export const generateTechnicalReport = (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 50;
    const margin = 20;

    // Set Dark Mode Background for whole page
    doc.setFillColor(15, 15, 15); // Deep Charcoal
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setTextColor(255, 255, 255);

    // Add Watermark
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(150);
    doc.setFont("helvetica", "bold");
    doc.text("APEX", 40, pageHeight / 2, { angle: 45 });

    addBallisticHeader(doc, "Technical Lab Report", "Biomechanical & Physiological Profile", athlete);

    // Section 1: CNS & Readiness
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246); // Apex Blue
    doc.text("1. CNS & READINESS (WELLNESS)", margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "normal");
    doc.text("Metrics: Heart Rate Variability (HRV) Trends vs. Load", margin, yPos);
    yPos += 10;

    // Simulate Heatmap
    doc.setFillColor(40, 40, 40);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 30, 'F');
    doc.text("[ Heatmap Visualization Placeholder ]", pageWidth / 2, yPos + 18, { align: 'center' });
    yPos += 40;

    // Section 2: The Physical Matrix
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246);
    doc.text("2. THE PHYSICAL MATRIX", margin, yPos);
    yPos += 10;

    // Grid for Power/Speed
    const colWidth = (pageWidth - (margin * 2)) / 2;

    // Power
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("POWER: Peak Vertical Jump", margin, yPos);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("48cm", margin, yPos + 10);
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94); // Green
    doc.text("+5% vs Previous", margin + 30, yPos + 10);

    // Speed
    const col2X = margin + colWidth;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("SPEED: 10m/40m Splits", col2X, yPos);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("1.65s / 4.88s", col2X, yPos + 10);

    yPos += 25;

    // Ratios
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("THE RATIOS:", margin, yPos);
    yPos += 8;

    // H:Q
    doc.setFontSize(10);
    doc.text("Hamstring-to-Quad:", margin, yPos);
    doc.setFont("helvetica", "bold");
    doc.text("0.65 (Target: 0.60+)", margin + 40, yPos);

    // Asymmetry
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.text("L/R Asymmetry:", margin, yPos);
    const asymmetry = Math.abs(athlete.scoreQuad - athlete.scoreHamstring); // Mock calc
    const isHighAsym = asymmetry > 10;

    doc.setFont("helvetica", "bold");
    if (isHighAsym) doc.setTextColor(239, 68, 68); // Red
    else doc.setTextColor(34, 197, 94); // Green
    doc.text(`${asymmetry}% ${isHighAsym ? '(FLAGGED)' : '(Optimal)'}`, margin + 40, yPos);
    doc.setTextColor(255, 255, 255);

    yPos += 25;

    // --- NEW: MQS & Power Index ---
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246); // Blue header
    doc.setFont("helvetica", "bold");
    doc.text("ELITE METRICS EXPLAINED", margin, yPos);
    yPos += 12;

    const mqs = analysis.scores?.screening || 0;
    const powerIndex = analysis.scores?.powerIndex || 0;

    // MQS
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Performance MQS: ${mqs}/100`, margin, yPos);
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "normal");
    const mqsDesc = "Explanation: The Movement Quality Score evaluates mechanical efficiency and injury risk. A score >85 indicates that your force is being directed efficiently into the ground, rather than being wasted through poor mechanics.";
    doc.text(mqsDesc, margin, yPos + 5, { maxWidth: pageWidth - (margin * 2) });

    yPos += 20;

    // Power Index
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`Power Index: ${powerIndex}`, margin, yPos);
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "normal");
    const piDesc = "Explanation: This index combines your absolute force output with your velocity profile. It represents your 'Engine Size' - your total raw capacity for explosive sporting actions.";
    doc.text(piDesc, margin, yPos + 5, { maxWidth: pageWidth - (margin * 2) });

    yPos += 25;

    // Section 3: Video Lab Analysis
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246);
    doc.text("3. KINEMATICS (VIDEO LAB)", margin, yPos);
    yPos += 10;

    doc.setFillColor(40, 40, 40);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 60, 'F');
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text("Landing Mechanics Analysis", margin + 5, yPos + 8);
    // Draw "screenshots" placeholders
    doc.setLineWidth(1);
    doc.setDrawColor(100, 100, 100);
    doc.rect(margin + 10, yPos + 15, 60, 35); // Frame 1
    doc.rect(margin + 80, yPos + 15, 60, 35); // Frame 2
    doc.text("[Frame A: Initial Contact]", margin + 15, yPos + 30);
    doc.text("[Frame B: Max Flexion]", margin + 85, yPos + 30);
    // Annotations text
    yPos += 65;
    doc.setFontSize(10);
    doc.setTextColor(239, 68, 68);
    doc.text("Observation: Slight valgus collapse noted on left knee landing.", margin, yPos);

    yPos += 15;

    // Section 4: Scientist's Prescription
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246);
    doc.text("4. SCIENTIST'S PRESCRIPTION", margin, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    const recText = analysis.recommendation?.description || "Focus on posterior chain stability to correct mechanical inefficiency.";
    doc.text(`Adjustment: ${recText}`, margin, yPos, { maxWidth: pageWidth - (margin * 2) });

    // verified
    addVerifiedStamp(doc, pageWidth, pageHeight);

    doc.save(`${athlete.name}_Technical_Report.pdf`);
};

// 2. ATHLETE DEVELOPMENT SUMMARY (Parent)
export const generateDevelopmentReport = (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = 50;

    addBallisticHeader(doc, "Athlete Progress Journey", "Development Summary", athlete);

    // Section 1: The Engine Check (Physical)
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("1. THE ENGINE CHECK", margin, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("We track these qualities to ensure long-term athletic development.", margin, yPos);
    yPos += 10;

    // Simple Bar Charts
    const qualities = [
        { name: "Explosiveness", score: athlete.scoreQuad || 75 },
        { name: "Speed Endurance", score: athlete.scoreHamstring || 80 },
        { name: "Strength Base", score: 85 }
    ];

    qualities.forEach(q => {
        doc.text(q.name, margin, yPos);
        // Bar bg
        doc.setFillColor(230, 230, 230);
        doc.rect(margin + 50, yPos - 4, 100, 6, 'F');
        // Bar fill
        doc.setFillColor(59, 130, 246); // Blue
        doc.rect(margin + 50, yPos - 4, q.score, 6, 'F'); // 1mm = 1 score point (approx)
        doc.text(`${q.score}/100`, margin + 155, yPos);
        yPos += 12;
    });

    yPos += 10;

    // Section 2: Consistency Score
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("2. CONSISTENCY SCORE", margin, yPos);
    yPos += 15;

    // Big Number
    doc.setFontSize(36);
    doc.setTextColor(34, 197, 94);
    doc.text("9.2", margin + 10, yPos);
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("/ 10", margin + 35, yPos);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "italic");
    doc.text(" \"Discipline is the foundation of excellence.\"", margin + 60, yPos - 5);
    yPos += 20;

    // Section 3: Injury Prevention
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("3. INJURY PREVENTION STATUS", margin, yPos);
    yPos += 15;

    // Shield Icon (Symbolic triangle)
    doc.setFillColor(34, 197, 94);
    doc.triangle(margin + 15, yPos, margin + 5, yPos - 15, margin + 25, yPos - 15, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Status: PROTECTED", margin + 40, yPos - 8);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("We are continuously monitoring knee and ankle stability to ensure your child", margin, yPos);
    yPos += 5;
    doc.text("stays on the field and out of the physio's office.", margin, yPos);

    yPos += 20;

    // Section 4: Coach's Word
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("4. COACH'S WORD", margin, yPos);
    yPos += 10;

    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 30, 'F');
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Marc has shown incredible resilience this month. The shift in mindset during", margin + 5, yPos + 10);
    doc.text("tough sessions has been the biggest win. Keep pushing!", margin + 5, yPos + 16);

    // verified
    addVerifiedStamp(doc, pageWidth, pageHeight);

    doc.save(`${athlete.name}_Development_Summary.pdf`);
};

// 3. EXECUTIVE QUARTERLY REPORT
export const generateExecutiveReport = (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = 50;

    addBallisticHeader(doc, "Quarterly Executive Summary", "Strategic Review", athlete);

    // Executive Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("EXECUTIVE SUMMARY", margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${athlete.name} has evolved significantly over the last 90 days. We have seen a`, margin, yPos);
    yPos += 5;
    doc.text("12% increase in force output and a major improvement in psychological resilience.", margin, yPos);
    yPos += 15;

    // 5 Pillars Radar (Mock visual)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("THE 5 PILLARS: GROWTH", margin, yPos);
    yPos += 15;

    doc.setDrawColor(200, 200, 200);
    doc.circle(pageWidth / 2, yPos + 20, 30); // Outer
    doc.circle(pageWidth / 2, yPos + 20, 15); // Inner
    doc.text("[Radar Chart Placeholder]", pageWidth / 2, yPos + 22, { align: 'center' });

    // Legend
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Grey: Day 1 Baseline", pageWidth / 2 + 40, yPos + 10);
    doc.setTextColor(255, 0, 0);
    doc.text("Red: Current Status", pageWidth / 2 + 40, yPos + 15);
    doc.setTextColor(0, 0, 0);

    yPos += 60;

    // Floor vs Ceiling
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("THE FLOOR VS. CEILING METRIC", margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Your 'worst' day performance is now higher than your previous 'best'.", margin, yPos);
    yPos += 15;

    // Simple Visual
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, yPos, margin + 40, yPos); // Base
    doc.line(margin, yPos - 10, margin + 40, yPos - 10); // Top
    doc.text("High Consistency Band Achieved", margin + 50, yPos - 5);

    yPos += 20;

    // Next Quarter Strategy
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("NEXT QUARTER STRATEGY", margin, yPos);
    yPos += 10;

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 20, 3, 3, 'F');
    doc.setFontSize(11);
    doc.text("PHASE 2: Transition from General Strength to Sport-Specific Power.", margin + 5, yPos + 12);

    // verified
    addVerifiedStamp(doc, pageWidth, pageHeight);

    doc.save(`${athlete.name}_Executive_Report.pdf`);
};

// 4. QUARTERLY REPORT (All-in-One)
export const generateQuarterlyReport = (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // --- PAGE 1: EXECUTIVE & PILLARS ---
    addBallisticHeader(doc, "Quarterly Report", "Holistic Performance Review", athlete);

    let yPos = 50;

    // Executive Summary Box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 35, 3, 3, 'F');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("EXECUTIVE SUMMARY", margin + 10, yPos + 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${athlete.name} has demonstrated excellent consistency this quarter. The focus on raising the 'floor'`, margin + 10, yPos + 20);
    doc.text("of performance has resulted in stable metrics across both physical and technical pillars.", margin + 10, yPos + 26);

    yPos += 50;

    // Pillar Status
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246);
    doc.text("1. THE 5 PILLARS STATUS", margin, yPos);
    yPos += 15;

    const pillars = [
        { name: "PHYSICAL", score: 85, status: "Peak", color: [34, 197, 94] },
        { name: "TECHNICAL", score: 70, status: "Developing", color: [234, 179, 8] },
        { name: "TACTICAL", score: 75, status: "Good", color: [59, 130, 246] },
        { name: "MENTAL", score: 90, status: "Elite", color: [168, 85, 247] },
        { name: "LIFESTYLE", score: 80, status: "Stable", color: [34, 197, 94] }
    ];

    pillars.forEach((p, i) => {
        const x = margin + (i * 35);
        // Circle BG
        doc.setFillColor(250, 250, 250);
        doc.circle(x + 10, yPos + 10, 14, 'F');
        // Ring
        doc.setDrawColor(p.color[0], p.color[1], p.color[2]);
        doc.setLineWidth(1.5);
        doc.circle(x + 10, yPos + 10, 14, 'S');
        // Score
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${p.score}`, x + 6, yPos + 13);

        // Label
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(p.name, x, yPos + 30);
    });

    yPos += 50;

    // --- PAGE 2: PHYSICAL DEEP DIVE ---
    // doc.addPage(); // Keeping it compact for now or add page if needed
    // Let's add page for clarity as requested "All-in-one" often implies detailed
    doc.addPage();

    // Set Dark Mode Background for Physical Page
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setTextColor(255, 255, 255);

    // Header
    doc.setFontSize(24);
    doc.text("PHYSICAL PERFORMANCE", margin, 30);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("BIOMECHANICAL LOAD & RESPONSE", margin, 38);

    yPos = 60;

    // Key Metrics Grid
    const metrics = [
        { label: "MQS", val: "88/100", desc: "Movement Quality" },
        { label: "Power Index", val: "92", desc: "Explosiveness" },
        { label: "RSI", val: "2.4", desc: "Reactive Strength" },
        { label: "Force Asym", val: "4%", desc: "L/R Balance" } // using mock 4% from dash
    ];

    metrics.forEach((m, i) => {
        const x = margin + (i * 45);
        // Card
        doc.setDrawColor(50, 50, 50);
        doc.setFillColor(30, 30, 30);
        doc.roundedRect(x, yPos, 40, 30, 2, 2, 'FD');

        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text(m.val, x + 5, yPos + 12);

        doc.setFontSize(8);
        doc.setTextColor(59, 130, 246);
        doc.text(m.label, x + 5, yPos + 20);

        doc.setTextColor(100, 100, 100);
        doc.text(m.desc, x + 5, yPos + 25);
    });

    yPos += 50;

    // Injury Status
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("INJURY STATUS: ACTIVE", margin, yPos);
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94); // Green
    doc.text("All systems go. No major red flags detected.", margin, yPos + 8);

    // --- PAGE 3: MENTAL & COACHING ---
    doc.addPage();
    doc.setFillColor(255, 255, 255); // White bg again
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setTextColor(0, 0, 0);

    addBallisticHeader(doc, "Mentorship & Coaching", "Psychological Profile", athlete);
    yPos = 60;

    // Mentorship/SPAT Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(168, 85, 247); // Purple
    doc.text("MENTAL PERFORMANCE (SPAT)", margin, yPos);
    yPos += 15;

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text("Routines Implemented:", margin, yPos);

    const routines = ["Pre-Game Synchronization", "Mistake Recovery (0.2s Rule)", "Visualisation"];
    routines.forEach((r, i) => {
        yPos += 8;
        doc.text(`• ${r}`, margin + 5, yPos);
    });

    yPos += 20;

    // Coaching Plan
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("COACHING & FORWARD PLANNING", margin, yPos);
    yPos += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Focus for next cycle: Technical refinement of max velocity sprint mechanics.", margin, yPos);

    addVerifiedStamp(doc, pageWidth, pageHeight);

    doc.save(`${athlete.name}_Quarterly_Report.pdf`);
};

// Alias addHeader to addBallisticHeader to fix existing compilation errors
const addHeader = addBallisticHeader;
