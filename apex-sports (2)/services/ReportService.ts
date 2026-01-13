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
    peakForceAsymmetry?: number;
}

export interface QuarterlyData extends AthleteData {
    executiveSummary?: string;
    // New fields for Coach Write Back
    performanceScore?: number;
    coachNotes?: string;

    physical?: {
        imtp?: string;
        agility?: string;
        broadJump?: string;
        strengths?: string[];
        weaknesses?: string[];
    };
    mentorship?: {
        goals?: string[];
        psychSkills?: string[];
        spatScores?: number[]; // [Physical, Technical, Tactical, Mental, Lifestyle]
    };
    coaching?: {
        blockFocus?: string;
        skillsLearnt?: string[];
        technicalFeedback?: { skill: string; grade: string; note: string }[];
    };
}



// Helper: Load Image to Base64
const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } else {
                reject(new Error("Canvas context failed"));
            }
        };
        img.onerror = (e) => reject(e);
    });
};

// Helper: Clean Header (Solid Black - Mentorship Style)
const addCleanHeader = async (doc: jsPDF, title: string, subTitle: string, athlete: AthleteData) => {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Solid Black Header
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo
    try {
        const logoData = await loadImage('/images/logo.png');
        doc.addImage(logoData, 'PNG', 10, 5, 20, 20); // x, y, w, h
    } catch (e) {
        console.warn("Logo failed to load", e);
    } // Fail gracefully if logo missing

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("APEX PERFORMANCE", 40, 20); // Moved Right due to Logo

    // Subtitle / Report Type
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text(title.toUpperCase(), pageWidth - 20, 25, { align: 'right' });

    // Athlete Info Bar (Gray Strip)
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 40, pageWidth, 12, 'F');

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Athlete: ${athlete.name}`, 20, 48);

    doc.setFont("helvetica", "normal");
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Date: ${today}`, pageWidth - 20, 48, { align: 'right' });

    doc.text(`Tier: ${athlete.productTier || 'Standard'}`, pageWidth / 2, 48, { align: 'center' });
};

// 1. TECHNICAL LAB REPORT
export const generateTechnicalReport = async (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Clean Header
    await addCleanHeader(doc, "Technical Lab Report", "", athlete);

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


    doc.save(`${athlete.name}_Technical_Report.pdf`);
};

// 2. ATHLETE DEVELOPMENT SUMMARY (Parent)
export const generateDevelopmentReport = async (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    await addCleanHeader(doc, "Development Summary", "Progress Journey", athlete);


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




    doc.save(`${athlete.name}_Development_Summary.pdf`);
};

// 3. EXECUTIVE QUARTERLY REPORT
export const generateExecutiveReport = async (athlete: AthleteData, analysis: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    await addCleanHeader(doc, "Executive Summary", "Strategic Review", athlete);
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




    doc.save(`${athlete.name}_Executive_Report.pdf`);
};

// Helper: Draw Radar Chart (Pentagon)
const drawRadarChart = (doc: jsPDF, centerX: number, centerY: number, radius: number, data: number[], labels: string[]) => {
    const numPoints = 5;
    const angleStep = (Math.PI * 2) / numPoints;
    const startAngle = -Math.PI / 2; // Start at top

    // Draw Grid (Concentric Pentagons)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    for (let level = 1; level <= 5; level++) {
        const r = (radius / 5) * level;
        for (let i = 0; i < numPoints; i++) {
            const angle = startAngle + (i * angleStep);
            const nextAngle = startAngle + ((i + 1) * angleStep);
            const x1 = centerX + r * Math.cos(angle);
            const y1 = centerY + r * Math.sin(angle);
            const x2 = centerX + r * Math.cos(nextAngle);
            const y2 = centerY + r * Math.sin(nextAngle);
            doc.line(x1, y1, x2, y2);
        }
    }

    // Draw Axes & Labels
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 0; i < numPoints; i++) {
        const angle = startAngle + (i * angleStep);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        doc.line(centerX, centerY, x, y);

        // Label Position (slightly outside)
        const labelR = radius + 10;
        const lx = centerX + labelR * Math.cos(angle);
        const ly = centerY + labelR * Math.sin(angle);
        doc.text(labels[i], lx, ly, { align: 'center' });
    }

    // Draw Data Polygon
    doc.setDrawColor(59, 130, 246); // Blue
    doc.setLineWidth(1.5);
    doc.setFillColor(59, 130, 246);

    // Draw lines
    const getCoords = (value: number, index: number) => {
        const r = (radius / 100) * (value || 0);
        const a = startAngle + (index * angleStep);
        return [centerX + r * Math.cos(a), centerY + r * Math.sin(a)];
    };

    // Fill area
    doc.setFillColor(59, 130, 246);

    const lines: any[] = [];
    const [startPx, startPy] = getCoords(data[0], 0);

    for (let i = 1; i < numPoints; i++) {
        const [px, py] = getCoords(data[i], i);
        // doc.lines expects vectors relative to the start point (x,y) 
        // OR subsequent points are relative to the previous one
        // Documentation says: lines(lines, x, y, scale, style, closed)
        // lines is array of vectors [x, y].
        // For absolute coords, we can use triangle or just build vectors.
        // Simplified approach: Calculate vectors relative to *previous point*

        const [prevX, prevY] = i === 1 ? [startPx, startPy] : getCoords(data[i - 1], i - 1);
        lines.push([px - prevX, py - prevY]);
    }

    // Close shape
    const [lastX, lastY] = getCoords(data[numPoints - 1], numPoints - 1);
    lines.push([startPx - lastX, startPy - lastY]);

    doc.lines(lines, startPx, startPy, [1, 1], 'F', true);

    // Stroke lines
    for (let i = 0; i < numPoints; i++) {
        const [x1, y1] = getCoords(data[i], i);
        const [x2, y2] = getCoords(data[(i + 1) % numPoints], (i + 1) % numPoints);
        doc.line(x1, y1, x2, y2);
        // Draw point
        doc.circle(x1, y1, 2, 'F');
    }
};

// 4. QUARTERLY REPORT (All-in-One)
export const generateQuarterlyReport = async (athlete: QuarterlyData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // --- PAGE 1: GENERAL SUMMARY ---
    await addCleanHeader(doc, "Quarterly Report", "General Summary", athlete);
    let yPos = 70;

    // Executive Summary Box
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 150, 'F');

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("EXECUTIVE SUMMARY", margin + 10, yPos + 15);

    // Coach Score Badge (Right Aligned)
    if (athlete.performanceScore) {
        doc.setFillColor(0, 0, 0);
        doc.roundedRect(pageWidth - margin - 50, yPos + 8, 40, 12, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(`SCORE: ${athlete.performanceScore}/100`, pageWidth - margin - 30, yPos + 15, { align: 'center' });
    }

    // Auto-Generated Summary Logic or Manual Notes
    const summaryText = athlete.coachNotes || athlete.executiveSummary || "No summary provided.";

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(summaryText, pageWidth - (margin * 2) - 20);
    doc.text(summaryLines, margin + 10, yPos + 30);

    // --- PAGE 2: PHYSICAL ---
    doc.addPage();
    await addCleanHeader(doc, "Quarterly Report", "Physical Performance", athlete);
    yPos = 70;

    // Top Metrics
    const metrics = [
        { label: "IMTP Peak Force", val: athlete.physical?.imtp || "-" },
        { label: "5-0-5 Agility", val: athlete.physical?.agility || "-" },
        { label: "Broad Jump", val: athlete.physical?.broadJump || "-" }
    ];

    metrics.forEach((m, i) => {
        const x = margin + (i * ((pageWidth - margin * 2) / 3));
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(x, yPos, 50, 40, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(m.label, x + 25, yPos + 15, { align: 'center' });
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(m.val, x + 25, yPos + 30, { align: 'center' });
    });

    yPos += 60;

    // Strengths & Weaknesses
    const colWidth = (pageWidth - (margin * 3)) / 2;

    // Strengths
    doc.setFillColor(220, 255, 220); // Light Green
    doc.rect(margin, yPos, colWidth, 100, 'F');
    doc.setTextColor(0, 100, 0);
    doc.setFontSize(14);
    doc.text("BIGGEST STRENGTHS", margin + 10, yPos + 15);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    (athlete.physical?.strengths || []).forEach((s, i) => {
        doc.text(`• ${s}`, margin + 10, yPos + 35 + (i * 15));
    });

    // Weaknesses
    doc.setFillColor(255, 220, 220); // Light Red
    doc.rect(margin + colWidth + margin, yPos, colWidth, 100, 'F');
    doc.setTextColor(150, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("AREAS FOR GROWTH", margin + colWidth + margin + 10, yPos + 15);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    (athlete.physical?.weaknesses || []).forEach((w, i) => {
        doc.text(`• ${w}`, margin + colWidth + margin + 10, yPos + 35 + (i * 15));
    });

    // --- PAGE 3: MENTORSHIP ---
    doc.addPage();
    await addCleanHeader(doc, "Quarterly Report", "Mentorship & Psychology", athlete);
    yPos = 70;

    // Goals (Top Left)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("QUARTERLY GOALS", margin, yPos);
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    (athlete.mentorship?.goals || []).forEach(g => {
        doc.text(`• ${g}`, margin, yPos);
        yPos += 10;
    });

    // Psych Skills (Bottom Left)
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PSYCHOLOGICAL SKILLS LEARNT", margin, yPos);
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    (athlete.mentorship?.psychSkills || []).forEach(s => {
        doc.text(`• ${s}`, margin, yPos);
        yPos += 10;
    });

    // Radar Chart (Right Side)
    // SPAT Scores: [Physical, Technical, Tactical, Mental, Lifestyle]
    const spatData = athlete.mentorship?.spatScores || [0, 0, 0, 0, 0];
    const spatLabels = ["Physical", "Technical", "Tactical", "Mental", "Lifestyle"];

    // Draw it roughly center-right
    drawRadarChart(doc, 140, 130, 40, spatData, spatLabels);


    // --- PAGE 4: COACHING ---
    doc.addPage();
    await addCleanHeader(doc, "Quarterly Report", "Coaching & Technical", athlete);
    yPos = 70;

    // Block Focus
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 30, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("FOCUS OF THE BLOCK", margin + 10, yPos + 10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(athlete.coaching?.blockFocus || "-", margin + 10, yPos + 22);

    yPos += 40;

    // Skills Learnt
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLS LEARNT", margin, yPos);
    yPos += 10;
    (athlete.coaching?.skillsLearnt || []).forEach(s => {
        doc.text(`• ${s}`, margin, yPos);
        yPos += 8;
    });

    yPos += 20;

    // School Report Style Feedback
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TECHNICAL FEEDBACK", margin, yPos);
    yPos += 10;

    // Table Header
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("SKILL / AREA", margin + 5, yPos + 7);
    doc.text("GRADE", margin + 70, yPos + 7);
    doc.text("TUTOR COMMENT", margin + 100, yPos + 7);

    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    (athlete.coaching?.technicalFeedback || []).forEach((row, i) => {
        if (i % 2 === 0) doc.setFillColor(245, 245, 245);
        else doc.setFillColor(255, 255, 255);

        doc.rect(margin, yPos, pageWidth - (margin * 2), 15, 'F'); // Row bg

        doc.setFont("helvetica", "bold");
        doc.text(row.skill, margin + 5, yPos + 10);

        // Grade Color
        const grade = row.grade.toUpperCase();
        if (grade.startsWith('A') || grade === 'EXCELLENT') doc.setTextColor(0, 150, 0);
        else if (grade.startsWith('C') || grade === 'SATISFACTORY') doc.setTextColor(200, 150, 0);
        else doc.setTextColor(0, 0, 0);

        doc.text(row.grade, margin + 70, yPos + 10);

        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text(row.note, margin + 100, yPos + 10, { maxWidth: 80 });

        doc.setFontSize(10); // Reset
        doc.setTextColor(0, 0, 0); // Reset

        yPos += 15;
    });

    doc.save(`${athlete.name}_Quarterly_Report.pdf`);
};
