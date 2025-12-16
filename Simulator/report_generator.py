# report_generator.py
# Report export utilities for H-SAFE Firewall Simulator

import json
import csv
import textwrap
from datetime import datetime
from typing import Dict

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors

# =========================
# JSON EXPORT
# =========================

def export_json(report: Dict, output_path: str) -> None:
    """
    Export analysis report as JSON.
    """
    final_report = report.copy()
    final_report["exported_at"] = datetime.now().isoformat()
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_report, f, indent=4)


# =========================
# CSV EXPORT
# =========================

def export_csv(report: Dict, output_path: str) -> None:
    """
    Export key report sections as CSV.
    """
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        
        # Metadata
        writer.writerow(["METADATA", "Exported At", datetime.now().isoformat()])
        writer.writerow([])

        # Overview
        writer.writerow(["SECTION", "KEY", "VALUE"])
        for key, value in report["overview"].items():
            writer.writerow(["OVERVIEW", key, value])

        # Traffic profile
        for proto, count in report["traffic_profile"]["by_protocol"].items():
            writer.writerow(["PROTOCOL", proto, count])

        for lane, count in report["traffic_profile"]["by_lane"].items():
            writer.writerow(["LANE", lane, count])

        # Rule hits
        for rule_id, hits in report["security_findings"]["rule_hit_count"].items():
            writer.writerow(["RULE_HITS", rule_id, hits])

        # Severity distribution
        for sev, count in report["security_findings"]["severity_distribution"].items():
            writer.writerow(["SEVERITY", sev, count])

        # Top targets
        for asset in report["security_findings"]["top_targeted_assets"]:
            writer.writerow(
                ["TOP_TARGET", asset["ip"], asset["hits"]]
            )


# =========================
# PDF EXPORT
# =========================

def export_pdf(report: Dict, output_path: str) -> None:
    """
    Export analysis report as a human-readable PDF with professional styling.
    """
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    
    # Colors
    c_blue = colors.Color(0.1, 0.2, 0.4)      # H-Safe Blue
    c_header_bg = colors.Color(0.95, 0.95, 0.97)
    c_red = colors.Color(0.8, 0.2, 0.2)
    c_green = colors.Color(0.2, 0.6, 0.2)
    c_grey = colors.Color(0.4, 0.4, 0.4)

    y = height - 50

    def check_page_break(required_space=20):
        nonlocal y
        if y < 50 + required_space:
            c.showPage()
            y = height - 50
            draw_header(False)

    def draw_header(first_page=True):
        nonlocal y
        # Banner Background
        c.setFillColor(c_blue)
        c.rect(0, height - 80, width, 80, fill=1, stroke=0)
        
        # Title
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 24)
        c.drawString(40, height - 50, "H-SAFE ANALYSIS REPORT")
        
        # Date
        c.setFont("Helvetica", 10)
        c.drawString(width - 150, height - 50, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        
        if first_page:
            y = height - 120
        else:
            y = height - 100

    draw_header()

    # --- Section: Executive Summary ---
    c.setFillColor(c_blue)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, y, "Executive Summary")
    y -= 30

    c.setFillColor(colors.black)
    c.setFont("Helvetica", 12)
    
    overview = report["overview"]
    c.drawString(40, y, f"Total Packets Processed: {overview['total_packets']}")
    c.drawString(300, y, f"Duration: {overview['duration_seconds']}s")
    y -= 20
    
    c.setFillColor(c_red)
    c.drawString(40, y, f"Threats Blocked: {overview['blocked_packets']}")
    c.setFillColor(colors.orange)
    c.drawString(300, y, f"Alerts Triggered: {overview['total_alerts']}")
    y -= 40 # Gap

    # --- Section: Traffic Profile ---
    check_page_break(100)
    c.setFillColor(c_blue)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y, "Traffic Profile")
    y -= 25

    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, y, "By Protocol")
    c.drawString(300, y, "By Direction")
    y -= 15
    
    c.setFont("Helvetica", 10)
    
    # Side by side lists
    start_y = y
    for proto, count in report["traffic_profile"]["by_protocol"].items():
        c.drawString(50, y, f"• {proto}: {count}")
        y -= 15
    
    y = start_y  # Reset Y for second column
    for lane, count in report["traffic_profile"]["by_lane"].items():
        c.drawString(310, y, f"• {lane}: {count}")
        y -= 15

    y -= 30 # Gap after table

    # --- Section: Security Findings ---
    check_page_break(100)
    c.setFillColor(c_blue)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y, "Security Findings & Rule Hits")
    y -= 10
    
    c.setStrokeColor(c_grey)
    c.line(40, y, width - 40, y)
    y -= 25

    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)

    if not report["security_findings"]["rule_hit_count"]:
        c.setFillColor(c_green)
        c.drawString(40, y, "No rule violations detected.")
        y -= 20
    else:
        for rule_id, hits in report["security_findings"]["rule_hit_count"].items():
            check_page_break()
            c.setFillColor(c_red)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(40, y, f"[HIT] {rule_id}")
            c.setFillColor(colors.black)
            c.setFont("Helvetica", 10)
            c.drawString(400, y, f"Count: {hits}")
            y -= 20

    y -= 20

    # --- Section: Assessment (Text Wrap) ---
    check_page_break(150)
    c.setFillColor(c_blue)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y, "Engine Assessment")
    y -= 25

    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    
    assessment_text = report["assessment"]
    text_obj = c.beginText(40, y)
    
    # Wrap text to ~80 chars width
    wrapped_lines = textwrap.wrap(assessment_text, width=90)
    
    for line in wrapped_lines:
        check_page_break()
        c.drawString(40, y, line)
        y -= 14

    # Footer
    c.save()
