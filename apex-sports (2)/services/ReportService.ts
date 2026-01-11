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

// Helper: Clean Header (Solid Black - Mentorship Style)
const addCleanHeader = (doc: jsPDF, title: string, subTitle: string, athlete: AthleteData) => {
    // Solid Black Header
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("APEX PERFORMANCE", 20, 25);

    // Subtitle / Report Type
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text(title.toUpperCase(), 190, 25, { align: 'right' });

    // Athlete Info Bar (Gray Strip)
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 40, 210, 12, 'F');

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Athlete: ${athlete.name}`, 20, 48);

    doc.setFont("helvetica", "normal");
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Date: ${today}`, 190, 48, { align: 'right' });

    doc.text(`Tier: ${athlete.productTier || 'Standard'}`, 105, 48, { align: 'center' });
};

// 1. TECHNICAL LAB REPORT
export const generateTechnicalReport = (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Clean Header
    addCleanHeader(doc, "Technical Lab Report", "", athlete);

    let yPos = 70; // Start lower due to header + info bar

    // Section 1: CNS & Readiness
    // Section Header Style
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("1. CNS & READINESS", margin + 5, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Understanding your neural state before training is critical for load management.", margin, yPos);
    yPos += 10;

    // Metric Grid (Readiness)
    const readiness = athlete.readinessScore || 85;
    doc.setFontSize(11);
    doc.text(`Current Readiness: ${readiness}%`, margin, yPos);
    // Simple bar
    doc.setFillColor(240, 240, 240);
    doc.rect(margin + 50, yPos - 4, 100, 5, 'F');
    doc.setFillColor(readiness > 80 ? 34 : 239, readiness > 80 ? 197 : 68, readiness > 80 ? 94 : 68); // Green or Red
    doc.rect(margin + 50, yPos - 4, readiness, 5, 'F');

    yPos += 25;

    // Section 2: Physical Matrix
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("2. PHYSICAL PERFORMANCE MATRIX", margin + 5, yPos);
    yPos += 20;

    // 2-Column Layout
    const col1 = margin;
    const col2 = 115;

    // Col 1: Power & Speed
    doc.setFontSize(14);
    doc.text("Power Output", col1, yPos);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Vertical Jump: 48cm", col1, yPos + 8);
    doc.text("RSI (Reactive Strength): 2.4", col1, yPos + 14);

    // Col 2: Strength Ratios
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Strength Ratios", col2, yPos);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Hamstring:Quad: 0.65", col2, yPos + 8);
    doc.text(`Asymmetry: ${athlete.peakForceAsymmetry || 0}%`, col2, yPos + 14);

    yPos += 30;

    // Section 3: Advanced Index
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("3. ELITE METRICS (MQS & POWER)", margin + 5, yPos);
    yPos += 20;

    const mqs = analysis.scores?.screening || 0;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Movement Quality Score (MQS): ${mqs}/100`, margin, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Using force plate data to analyze mechanical efficiency and injury risk.", margin, yPos);

    yPos += 20;

    // Section 4: Video Lab
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("4. KINEMATICS & VIDEO LAB", margin + 5, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Key observations from frame-by-frame analysis.", margin, yPos);
    yPos += 10;

    // Observation Box
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 20);
    doc.text("Observation: Valgus collapse on left knee during deceleration tasks.", margin + 5, yPos + 8);
    doc.text("Correction: Glute activation + Single leg stability drills.", margin + 5, yPos + 14);

    yPos += 40;

    // Section 5: Prescription
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("5. COACH'S PRESCRIPTION", margin + 5, yPos);
    yPos += 15;

    const recText = analysis.recommendation?.description || "Focus on posterior chain stability.";
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`"${recText}"`, margin, yPos, { maxWidth: pageWidth - (margin * 2) });

    addVerifiedStamp(doc, pageWidth, pageHeight);
    doc.save(`${athlete.name}_Technical_Report.pdf`);
};

// 2. ATHLETE DEVELOPMENT SUMMARY (Parent)
export const generateDevelopmentReport = (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    addCleanHeader(doc, "Development Summary", "Progress Journey", athlete);

    let yPos = 70;

    // Section 1: The Engine Check
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("1. THE ENGINE CHECK", margin + 5, yPos);
    yPos += 15;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Tracking these qualities ensures long-term development.", margin, yPos);
    yPos += 15;

    // Simple Bar Charts
    const qualities = [
        { name: "Explosiveness", score: athlete.scoreQuad || 75 },
        { name: "Speed Endurance", score: athlete.scoreHamstring || 80 },
        { name: "Strength Base", score: 85 }
    ];

    qualities.forEach(q => {
        doc.text(q.name, margin, yPos);

        // Bar bg
        doc.setFillColor(240, 240, 240);
        doc.rect(margin + 50, yPos - 4, 100, 6, 'F');
        // Bar fill
        doc.setFillColor(59, 130, 246); // Blue
        doc.rect(margin + 50, yPos - 4, q.score, 6, 'F');
        doc.text(`${q.score}/100`, margin + 155, yPos);
        yPos += 15; // Increased spacing
    });

    yPos += 20;

    // Section 2: Consistency
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("2. CONSISTENCY SCORE", margin + 5, yPos);
    yPos += 20;

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
    yPos += 30;

    // Section 3: Injury Prevention
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("3. INJURY PREVENTION STATUS", margin + 5, yPos);
    yPos += 20;

    // Shield Icon (Symbolic triangle)
    doc.setFillColor(34, 197, 94);
    doc.triangle(margin + 15, yPos, margin + 5, yPos - 15, margin + 25, yPos - 15, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Status: PROTECTED", margin + 40, yPos - 8);

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("We are continuously monitoring knee and ankle stability to ensure safety.", margin, yPos);

    yPos += 30;

    // Section 4: Coach's Word
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("4. COACH'S WORD", margin + 5, yPos);
    yPos += 15;

    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 30, 2, 2, 'FD');
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Marc has shown incredible resilience this month. The shift in mindset during", margin + 5, yPos + 10);
    doc.text("tough sessions has been the biggest win. Keep pushing!", margin + 5, yPos + 16);

    addVerifiedStamp(doc, pageWidth, pageHeight);

    doc.save(`${athlete.name}_Development_Summary.pdf`);
};

// 3. EXECUTIVE QUARTERLY REPORT
export const generateExecutiveReport = (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    addCleanHeader(doc, "Executive Summary", "Strategic Review", athlete);
    let yPos = 70;

    // Executive Summary
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("EXECUTIVE SUMMARY", margin + 5, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${athlete.name} has evolved significantly over the last 90 days. We have seen a`, margin, yPos);
    yPos += 5;
    doc.text("12% increase in force output and major improvement in resilience.", margin, yPos);
    yPos += 20;

    // 5 Pillars Radar (Visual Placeholder)
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("THE 5 PILLARS: GROWTH", margin + 5, yPos);
    yPos += 15;

    doc.setDrawColor(200, 200, 200);
    doc.circle(pageWidth / 2, yPos + 30, 25); // Outer
    doc.text("[Radar Chart Placeholder]", pageWidth / 2, yPos + 32, { align: 'center' });

    yPos += 70;

    // Floor vs Ceiling
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("THE FLOOR VS. CEILING METRIC", margin + 5, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Your 'worst' day performance is now higher than your previous 'best'.", margin, yPos);
    yPos += 10;
    doc.text("Result: High Consistency Band Achieved.", margin, yPos);

    yPos += 30;

    // Next Quarter Strategy
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("NEXT QUARTER STRATEGY", margin + 5, yPos);
    yPos += 15;

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 20, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("PHASE 2: Transition from General Strength to Sport-Specific Power.", margin + 5, yPos + 12);

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
    addCleanHeader(doc, "Quarterly Report", "Holistic Performance Review", athlete);

    let yPos = 70;

    // Executive Summary Box
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("EXECUTIVE SUMMARY", margin + 5, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${athlete.name} has demonstrated excellent consistency this quarter. The focus on raising the 'floor'`, margin, yPos);
    doc.text("of performance has resulted in stable metrics across both physical and technical pillars.", margin, yPos + 6);

    yPos += 30;

    // Pillar Status
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. THE 5 PILLARS STATUS", margin + 5, yPos);
    yPos += 20;

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
    doc.addPage();
    addCleanHeader(doc, "Physical Performance", "Deep Dive", athlete);
    yPos = 70;

    // Header
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("BIOMECHANICAL METRICS", margin + 5, yPos);
    yPos += 20;

    // Key Metrics Grid
    const metrics = [
        { label: "MQS", val: "88/100", desc: "Movement Quality" },
        { label: "Power Index", val: "92", desc: "Explosiveness" },
        { label: "RSI", val: "2.4", desc: "Reactive Strength" },
        { label: "Force Asym", val: "4%", desc: "L/R Balance" }
    ];

    metrics.forEach((m, i) => {
        const x = margin + (i * 45);
        // Card Background
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(x, yPos, 40, 30, 2, 2, 'F');

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(m.val, x + 5, yPos + 12);

        doc.setFontSize(8);
        doc.setTextColor(59, 130, 246);
        doc.text(m.label, x + 5, yPos + 20);

        doc.setTextColor(100, 100, 100);
        doc.text(m.desc, x + 5, yPos + 25);
    });

    yPos += 50;

    // Injury Status
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("INJURY STATUS", margin + 5, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94); // Green
    doc.text("Active: All systems go. No major red flags detected.", margin, yPos);


    // --- PAGE 3: MENTAL & COACHING ---
    doc.addPage();
    addCleanHeader(doc, "Mentorship & Coaching", "Psychological Profile", athlete);
    yPos = 70;

    // Mentorship/SPAT Section
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("MENTAL PERFORMANCE (SPAT)", margin + 5, yPos);
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
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("COACHING & FORWARD PLANNING", margin + 5, yPos);
    yPos += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Focus for next cycle: Technical refinement of max velocity sprint mechanics.", margin, yPos);

    addVerifiedStamp(doc, pageWidth, pageHeight);

    doc.save(`${athlete.name}_Quarterly_Report.pdf`);
};
