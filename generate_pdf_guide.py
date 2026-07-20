import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf():
    pdf_path = os.path.expanduser("~/Desktop/TwinFusion_API_Guide.pdf")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Styles for Dark/Tech Premium Look
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=colors.HexColor('#06b6d4'),
        alignment=1, # Center
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=16,
        leading=22,
        textColor=colors.HexColor('#8a99ad'),
        alignment=1, # Center
        spaceAfter=40
    )

    h1_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=26,
        textColor=colors.HexColor('#6366f1'),
        spaceBefore=20,
        spaceAfter=12
    )

    h2_style = ParagraphStyle(
        'SubSectionHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#06b6d4'),
        spaceBefore=12,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=10
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#27ae60'),
        backColor=colors.HexColor('#f8f9fa'),
        borderColor=colors.HexColor('#e2e8f0'),
        borderWidth=1,
        borderPadding=8,
        spaceAfter=12
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        backColor=colors.HexColor('#eff6ff'),
        borderColor=colors.HexColor('#bfdbfe'),
        borderWidth=1,
        borderPadding=10,
        spaceAfter=12
    )

    story = []

    # ================= PAGE 1: COVER PAGE =================
    story.append(Spacer(1, 150))
    story.append(Paragraph("TwinFusion AI", title_style))
    story.append(Paragraph("Backend Integration & API Guide", subtitle_style))
    story.append(Spacer(1, 50))
    
    # Metadata Table
    meta_data = [
        [Paragraph("<b>Project:</b>", body_style), Paragraph("TwinFusion AI Freshers Portal", body_style)],
        [Paragraph("<b>Track:</b>", body_style), Paragraph("Google Student Ambassador Hackathon", body_style)],
        [Paragraph("<b>Tech Stack:</b>", body_style), Paragraph("FastAPI, SQLite, React, Google Gemini API", body_style)],
        [Paragraph("<b>Document:</b>", body_style), Paragraph("Step-by-step Authentication & Setup Walkthrough", body_style)]
    ]
    t = Table(meta_data, colWidths=[1.5*inch, 4.5*inch])
    t.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8f9fa')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t)
    story.append(PageBreak())

    # ================= PAGE 2: THE RESTAURANT ANALOGY =================
    story.append(Paragraph("1. Understanding the Architecture", h1_style))
    story.append(Paragraph(
        "To understand how the application handles requests, let's use the simple <b>Restaurant Analogy</b>:",
        body_style
    ))
    
    analogy_data = [
        [Paragraph("<b>Component</b>", h2_style), Paragraph("<b>The Restaurant Equivalence</b>", h2_style)],
        [
            Paragraph("<b>Frontend (React)</b>", body_style),
            Paragraph("<b>The Dining Room:</b> Where customers sit, browse the visually designed menu, and place orders. In demo mode, orders are mocked for speed.", body_style)
        ],
        [
            Paragraph("<b>Backend (FastAPI)</b>", body_style),
            Paragraph("<b>The Kitchen:</b> The busy backroom where chefs receive slips, cook logic, secure keys, and process operations.", body_style)
        ],
        [
            Paragraph("<b>Database (SQLite)</b>", body_style),
            Paragraph("<b>The Pantry / Fridge:</b> Where accounts, profiles, and scheduled calendars are stored. If the fridge is empty, the kitchen cannot serve the customer.", body_style)
        ],
        [
            Paragraph("<b>Google Gemini</b>", body_style),
            Paragraph("<b>The Secret Recipe Book:</b> The cognitive advisor used by chefs to compose highly smart and customized recommendations.", body_style)
        ]
    ]
    t_analogy = Table(analogy_data, colWidths=[2.2*inch, 4.3*inch])
    t_analogy.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,0), 1.5, colors.HexColor('#6366f1')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f8f9fa')),
        ('GRID', (0,1), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_analogy)
    story.append(Spacer(1, 15))
    story.append(Paragraph(
        "<b>Why did 'Unauthorized' happen?</b> Since you booted the backend database for the first time, your database (the pantry) was completely empty. There were no user accounts inside it. When you typed credentials into the Swagger auth page, the kitchen searched the pantry, found nothing, and rejected the entry.",
        callout_style
    ))
    story.append(PageBreak())

    # ================= PAGE 3: SWAGGER SCREENSHOT & FIX =================
    story.append(Paragraph("2. Resolving Swagger Authentication", h1_style))
    story.append(Paragraph(
        "Here is the screenshot of the authorization modal where the error occurred:",
        body_style
    ))

    # Embed User screenshot
    img_path = r"C:\Users\MAGESH VARMA A S\.gemini\antigravity\brain\b48887b1-7404-4162-ac0e-7ce46ac1c4d9\media__1784430732951.png"
    if os.path.exists(img_path):
        img = Image(img_path, width=6.2*inch, height=3.4875*inch)
        story.append(img)
        story.append(Spacer(1, 15))
    else:
        story.append(Paragraph("[Screenshot media__1784430732951.png not found]", callout_style))

    story.append(Paragraph("Step-by-Step Fix to Authenticate Successfully:", h2_style))
    story.append(Paragraph(
        "<b>Step 1: Write an Account to the Database first</b><br/>"
        "Scroll down to the <b>auth</b> section in the Swagger documentation page. Expand the <b>POST /api/v1/auth/register</b> endpoint, click 'Try it out', and execute it with a request body like this:",
        body_style
    ))
    story.append(Paragraph(
        "{\n"
        "  \"email\": \"student.tarun@college.edu\",\n"
        "  \"username\": \"starun\",\n"
        "  \"password\": \"Tarun@28\",\n"
        "  \"full_name\": \"S Tarun\"\n"
        "}",
        code_style
    ))
    story.append(Paragraph(
        "<b>Step 2: Log in with the Authorize lock button</b><br/>"
        "Once the account is registered (returning 200 OK), click the green <b>Authorize</b> lock button on the top right. Enter your username (<code>starun</code>) and password (<code>Tarun@28</code>) and click Authorize. It will lock successfully!",
        body_style
    ))

    doc.build(story)
    print("PDF generated successfully.")

if __name__ == '__main__':
    build_pdf()
