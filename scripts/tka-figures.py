#!/usr/bin/env python3
"""Generate exam-style SVG figures for TKA questions."""

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "tka"
NAVY = "#002147"
YELLOW = "#fdc800"
INK = "#444444"
LINE = "#c5ced8"
MUTED = "#6b7c8d"
WHITE = "#ffffff"
SHADE = "#e8f0f8"


def write(name: str, svg: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(svg.strip() + "\n", encoding="utf-8")


def svg(w: int, h: int, body: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">
  <rect width="{w}" height="{h}" fill="{WHITE}"/>
{body}
</svg>'''


def bar_chart() -> str:
    months = [("Jan", 20), ("Feb", 28), ("Mar", 25), ("Apr", 40)]
    ox, oy, cw, ch = 70, 250, 70, 200
    bars = []
    for i, (label, val) in enumerate(months):
        bh = val / 40 * ch
        x = ox + i * cw + 18
        y = oy - bh
        bars.append(
            f'  <rect x="{x}" y="{y}" width="36" height="{bh}" fill="{YELLOW}" stroke="{NAVY}" stroke-width="1.5"/>\n'
            f'  <text x="{x + 18}" y="{y - 8}" text-anchor="middle" font-size="13" font-weight="700" fill="{NAVY}">{val}</text>\n'
            f'  <text x="{x + 18}" y="{oy + 22}" text-anchor="middle" font-size="13" fill="{INK}">{label}</text>'
        )
    ticks = []
    for v in (0, 10, 20, 30, 40):
        y = oy - v / 40 * ch
        ticks.append(
            f'  <line x1="{ox - 6}" y1="{y}" x2="{ox + 4 * cw}" y2="{y}" stroke="{LINE}" stroke-width="1"/>\n'
            f'  <text x="{ox - 12}" y="{y + 4}" text-anchor="end" font-size="11" fill="{MUTED}">{v}</text>'
        )
    body = f'''  <text x="280" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}">Produksi (unit)</text>
{chr(10).join(ticks)}
  <line x1="{ox}" y1="{oy}" x2="{ox + 4 * cw}" y2="{oy}" stroke="{NAVY}" stroke-width="2"/>
  <line x1="{ox}" y1="{oy - ch}" x2="{ox}" y2="{oy}" stroke="{NAVY}" stroke-width="2"/>
{chr(10).join(bars)}
  <text x="280" y="300" text-anchor="middle" font-size="12" fill="{MUTED}">Bulan</text>'''
    return svg(560, 320, body)


def parabola() -> str:
    # f(x)=x^2-4x+3; map x in [-0.4,4.4] to [70,500], y in [-2,4] to [250,40]
    def px(x: float) -> float:
        return 70 + (x + 0.4) / 4.8 * 430

    def py(y: float) -> float:
        return 250 - (y + 2) / 6 * 210

    xs = [i / 20 for i in range(-8, 89)]
    pts = " ".join(f"{px(x):.1f},{py(x * x - 4 * x + 3):.1f}" for x in xs)
    ox, oy = px(0), py(0)
    body = f'''  <text x="280" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}">f(x) = x² − 4x + 3</text>
  <line x1="50" y1="{oy:.1f}" x2="530" y2="{oy:.1f}" stroke="{NAVY}" stroke-width="1.5"/>
  <line x1="{ox:.1f}" y1="40" x2="{ox:.1f}" y2="270" stroke="{NAVY}" stroke-width="1.5"/>
  <polygon points="530,{oy - 5:.1f} 542,{oy:.1f} 530,{oy + 5:.1f}" fill="{NAVY}"/>
  <polygon points="{ox - 5:.1f},40 {ox:.1f},28 {ox + 5:.1f},40" fill="{NAVY}"/>
  <text x="536" y="{oy + 18:.1f}" font-size="13" fill="{INK}">x</text>
  <text x="{ox + 10:.1f}" y="42" font-size="13" fill="{INK}">y</text>
  <polyline points="{pts}" fill="none" stroke="{YELLOW}" stroke-width="3"/>
  <circle cx="{px(1):.1f}" cy="{py(0):.1f}" r="5" fill="{NAVY}"/>
  <circle cx="{px(3):.1f}" cy="{py(0):.1f}" r="5" fill="{NAVY}"/>
  <circle cx="{px(0):.1f}" cy="{py(3):.1f}" r="4" fill="{NAVY}"/>
  <text x="{px(1):.1f}" y="{oy + 20:.1f}" text-anchor="middle" font-size="13" font-weight="700" fill="{NAVY}">1</text>
  <text x="{px(3):.1f}" y="{oy + 20:.1f}" text-anchor="middle" font-size="13" font-weight="700" fill="{NAVY}">3</text>
  <text x="{ox - 12:.1f}" y="{py(3) + 4:.1f}" text-anchor="end" font-size="12" fill="{INK}">3</text>'''
    return svg(560, 300, body)


def ladder() -> str:
    # floor, wall, ladder 60°, length 6 m
    body = f'''  <text x="280" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}">Tangga 6 m, sudut 60°</text>
  <line x1="70" y1="250" x2="430" y2="250" stroke="{NAVY}" stroke-width="3"/>
  <line x1="70" y1="40" x2="70" y2="250" stroke="{NAVY}" stroke-width="3"/>
  <line x1="70" y1="70" x2="280" y2="250" stroke="{YELLOW}" stroke-width="6" stroke-linecap="round"/>
  <path d="M 120 250 A 50 50 0 0 0 95 207" fill="none" stroke="{NAVY}" stroke-width="1.5"/>
  <text x="138" y="238" font-size="14" font-weight="700" fill="{NAVY}">60°</text>
  <text x="200" y="140" font-size="14" font-weight="700" fill="{NAVY}">6 m</text>
  <line x1="40" y1="70" x2="40" y2="250" stroke="{INK}" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="28" y="165" text-anchor="middle" font-size="13" fill="{INK}" transform="rotate(-90 28 165)">h = ?</text>
  <text x="250" y="272" font-size="12" fill="{MUTED}">lantai</text>
  <text x="82" y="56" font-size="12" fill="{MUTED}">dinding</text>'''
    return svg(480, 300, body)


def cuboid() -> str:
    # isometric 8 × 5 × 4
    body = f'''  <text x="280" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}">Balok 8 cm × 5 cm × 4 cm</text>
  <polygon points="120,120 280,120 340,80 180,80" fill="{SHADE}" stroke="{NAVY}" stroke-width="2"/>
  <polygon points="280,120 340,80 340,180 280,220" fill="#dce6f0" stroke="{NAVY}" stroke-width="2"/>
  <polygon points="120,120 280,120 280,220 120,220" fill="{YELLOW}" stroke="{NAVY}" stroke-width="2"/>
  <text x="200" y="238" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}">8 cm</text>
  <text x="80" y="175" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}" transform="rotate(-90 80 175)">4 cm</text>
  <text x="330" y="240" font-size="14" font-weight="700" fill="{NAVY}">5 cm</text>'''
    return svg(460, 280, body)


def trapezoid() -> str:
    # right trapezoid: bottom 10, top 6, height 4, left vertical
    body = f'''  <text x="280" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}">Trapesium siku-siku</text>
  <polygon points="80,200 380,200 260,80 80,80" fill="{YELLOW}" stroke="{NAVY}" stroke-width="2.5"/>
  <text x="230" y="222" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}">10 cm</text>
  <text x="170" y="68" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}">6 cm</text>
  <line x1="60" y1="80" x2="60" y2="200" stroke="{INK}" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="42" y="145" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}" transform="rotate(-90 42 145)">4 cm</text>
  <path d="M 80 200 L 96 200 L 96 184" fill="none" stroke="{NAVY}" stroke-width="1.5"/>'''
    return svg(460, 250, body)


def parallel_lines() -> str:
    body = f'''  <text x="280" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}">Dua garis sejajar + transversal</text>
  <line x1="60" y1="90" x2="500" y2="90" stroke="{NAVY}" stroke-width="3"/>
  <line x1="60" y1="200" x2="500" y2="200" stroke="{NAVY}" stroke-width="3"/>
  <line x1="140" y1="40" x2="380" y2="250" stroke="{YELLOW}" stroke-width="3"/>
  <text x="188" y="128" font-size="14" font-weight="700" fill="{NAVY}">70°</text>
  <text x="268" y="188" font-size="14" font-weight="700" fill="{NAVY}">?</text>
  <text x="510" y="94" font-size="13" fill="{INK}">l₁</text>
  <text x="510" y="204" font-size="13" fill="{INK}">l₂</text>
  <text x="80" y="270" font-size="12" fill="{MUTED}">sudut dalam sepihak</text>'''
    return svg(560, 290, body)


def screen_scale() -> str:
    body = f'''  <text x="300" y="28" text-anchor="middle" font-size="15" font-weight="700" fill="{NAVY}">Desain 60 cm × 60 cm → layar 2,4 m × 1,8 m</text>
  <rect x="40" y="70" width="120" height="120" fill="{YELLOW}" stroke="{NAVY}" stroke-width="2"/>
  <text x="100" y="132" text-anchor="middle" font-size="12" font-weight="700" fill="{NAVY}">60 cm</text>
  <text x="100" y="210" text-anchor="middle" font-size="12" fill="{MUTED}">desain (1 : 1)</text>
  <polygon points="180,130 210,130 198,122 198,138" fill="{NAVY}"/>
  <rect x="230" y="50" width="320" height="240" fill="{SHADE}" stroke="{NAVY}" stroke-width="2"/>
  <text x="390" y="42" text-anchor="middle" font-size="12" fill="{INK}">layar 2,4 m × 1,8 m</text>
  <rect x="270" y="90" width="180" height="180" fill="{YELLOW}" stroke="{NAVY}" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="360" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="{NAVY}">citra persegi</text>
  <text x="390" y="308" text-anchor="middle" font-size="12" fill="{MUTED}">pembesaran proporsional, orientasi horizontal</text>'''
    return svg(600, 330, body)


def linear_program() -> str:
    def px(x: float) -> float:
        return 70 + x / 560 * 430

    def py(y: float) -> float:
        return 300 - y / 560 * 240

    # region: (0,0)-(500,0)-(400,100)-(0,400)
    region = f"{px(0):.1f},{py(0):.1f} {px(500):.1f},{py(0):.1f} {px(400):.1f},{py(100):.1f} {px(0):.1f},{py(400):.1f}"
    body = f'''  <text x="280" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}">Daerah feasible: x + y ≤ 500 dan 3x + 4y ≤ 1600</text>
  <polygon points="{region}" fill="{YELLOW}" fill-opacity="0.45" stroke="{NAVY}" stroke-width="2"/>
  <line x1="{px(0):.1f}" y1="{py(0):.1f}" x2="{px(520):.1f}" y2="{py(0):.1f}" stroke="{NAVY}" stroke-width="1.5"/>
  <line x1="{px(0):.1f}" y1="{py(0):.1f}" x2="{px(0):.1f}" y2="{py(480):.1f}" stroke="{NAVY}" stroke-width="1.5"/>
  <line x1="{px(500):.1f}" y1="{py(0):.1f}" x2="{px(0):.1f}" y2="{py(500):.1f}" stroke="{NAVY}" stroke-width="2"/>
  <line x1="{px(533):.1f}" y1="{py(0):.1f}" x2="{px(0):.1f}" y2="{py(400):.1f}" stroke="{INK}" stroke-width="2" stroke-dasharray="6 4"/>
  <circle cx="{px(400):.1f}" cy="{py(100):.1f}" r="5" fill="{NAVY}"/>
  <text x="{px(420):.1f}" y="{py(130):.1f}" font-size="12" font-weight="700" fill="{NAVY}">(400, 100)</text>
  <text x="{px(510):.1f}" y="{py(-20):.1f}" font-size="12" fill="{INK}">x bolu</text>
  <text x="{px(-10):.1f}" y="{py(490):.1f}" font-size="12" fill="{INK}">y brownies</text>
  <text x="{px(310):.1f}" y="{py(260):.1f}" font-size="11" fill="{INK}">x + y = 500</text>
  <text x="{px(200):.1f}" y="{py(380):.1f}" font-size="11" fill="{MUTED}">3x + 4y = 1600</text>'''
    return svg(560, 340, body)


def table_svg(title: str, headers: list[str], rows: list[list[str]], note: str = "") -> str:
    cols = len(headers)
    col_w = 140 if cols <= 3 else 120
    row_h = 32
    left = 40
    top = 56
    width = left * 2 + col_w * cols
    height = top + row_h * (1 + len(rows)) + (36 if note else 20)
    parts = [
        f'  <text x="{width / 2:.0f}" y="28" text-anchor="middle" font-size="15" font-weight="700" fill="{NAVY}">{title}</text>'
    ]
    for r, row in enumerate([headers, *rows]):
        y = top + r * row_h
        bg = NAVY if r == 0 else (SHADE if r % 2 == 0 else WHITE)
        fg = WHITE if r == 0 else INK
        weight = "700" if r == 0 else "400"
        for c, cell in enumerate(row):
            x = left + c * col_w
            parts.append(
                f'  <rect x="{x}" y="{y}" width="{col_w}" height="{row_h}" fill="{bg}" stroke="{NAVY}" stroke-width="1"/>'
            )
            parts.append(
                f'  <text x="{x + col_w / 2:.0f}" y="{y + 21}" text-anchor="middle" font-size="12" font-weight="{weight}" fill="{fg}">{cell}</text>'
            )
    if note:
        parts.append(
            f'  <text x="{width / 2:.0f}" y="{height - 12}" text-anchor="middle" font-size="12" fill="{MUTED}">{note}</text>'
        )
    return svg(width, height, "\n".join(parts))


def vsepr() -> str:
    def molecule(cx: float, cy: float, kind: str, label: str) -> str:
        if kind == "tet":
            bonds = [
                (cx, cy - 42),
                (cx - 40, cy + 28),
                (cx + 40, cy + 28),
                (cx + 8, cy + 8),
            ]
        elif kind == "sq":
            bonds = [
                (cx, cy - 40),
                (cx, cy + 40),
                (cx - 40, cy),
                (cx + 40, cy),
            ]
        else:
            bonds = [(cx - 48, cy), (cx + 48, cy)]
        lines = []
        for x, y in bonds:
            lines.append(
                f'  <line x1="{cx}" y1="{cy}" x2="{x}" y2="{y}" stroke="{NAVY}" stroke-width="2.5"/>'
            )
            lines.append(f'  <circle cx="{x}" cy="{y}" r="10" fill="{YELLOW}" stroke="{NAVY}" stroke-width="1.5"/>')
        if kind == "sq":
            lines.append(
                f'  <text x="{cx - 18}" y="{cy - 10}" font-size="11" fill="{INK}">E</text>'
            )
            lines.append(
                f'  <text x="{cx + 10}" y="{cy + 22}" font-size="11" fill="{INK}">E</text>'
            )
        if kind == "lin":
            lines.append(f'  <text x="{cx}" y="{cy - 18}" text-anchor="middle" font-size="11" fill="{INK}">E</text>')
            lines.append(f'  <text x="{cx - 16}" y="{cy + 28}" font-size="11" fill="{INK}">E</text>')
            lines.append(f'  <text x="{cx + 8}" y="{cy + 28}" font-size="11" fill="{INK}">E</text>')
        lines.append(f'  <circle cx="{cx}" cy="{cy}" r="14" fill="{NAVY}"/>')
        lines.append(
            f'  <text x="{cx}" y="{cy + 5}" text-anchor="middle" font-size="12" font-weight="700" fill="{WHITE}">A</text>'
        )
        lines.append(
            f'  <text x="{cx}" y="{cy + 78}" text-anchor="middle" font-size="13" font-weight="700" fill="{NAVY}">{label}</text>'
        )
        return "\n".join(lines)

    body = f'''  <text x="300" y="28" text-anchor="middle" font-size="15" font-weight="700" fill="{NAVY}">Bentuk VSEPR (ligan X sama)</text>
{molecule(100, 120, "tet", "AX₄ tetrahedral")}
{molecule(300, 120, "sq", "AX₄E₂ segiempat datar")}
{molecule(500, 120, "lin", "AX₂E₃ linier")}'''
    return svg(600, 230, body)


def rect(w_cm: int, h_cm: int, kind: str) -> str:
    # scale so longest side ~ 280
    longest = max(w_cm, h_cm)
    scale = 280 / longest
    rw, rh = w_cm * scale, h_cm * scale
    x, y = (460 - rw) / 2, 70
    title = "Persegi" if w_cm == h_cm else "Persegi panjang"
    body = f'''  <text x="230" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}">{title} {w_cm} cm × {h_cm} cm</text>
  <rect x="{x:.1f}" y="{y:.1f}" width="{rw:.1f}" height="{rh:.1f}" fill="{YELLOW}" stroke="{NAVY}" stroke-width="2.5"/>
  <text x="230" y="{y + rh + 24:.1f}" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}">{w_cm} cm</text>
  <text x="{x - 18:.1f}" y="{y + rh / 2:.1f}" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}" transform="rotate(-90 {x - 18:.1f} {y + rh / 2:.1f})">{h_cm} cm</text>'''
    return svg(460, int(y + rh + 50), body)


def triangle(base: int, height: int, extra: str = "") -> str:
    title = extra or f"Segitiga alas {base} cm, tinggi {height} cm"
    body = f'''  <text x="230" y="28" text-anchor="middle" font-size="15" font-weight="700" fill="{NAVY}">{title}</text>
  <polygon points="80,220 380,220 230,70" fill="{YELLOW}" stroke="{NAVY}" stroke-width="2.5"/>
  <line x1="230" y1="70" x2="230" y2="220" stroke="{INK}" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="230" y="242" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}">{base} cm</text>
  <text x="246" y="155" font-size="14" font-weight="700" fill="{NAVY}">{height} cm</text>'''
    return svg(460, 270, body)


def main() -> None:
    write("m12-data-01.svg", bar_chart())
    write("m12-fungsi-01.svg", parabola())
    write("m12-trig-01.svg", ladder())
    write("m12-volume-01.svg", cuboid())
    write("m12-luas-01.svg", trapezoid())
    write("m12-geo-01.svg", parallel_lines())
    write("m12-trans-01.svg", screen_scale())
    write("m12-pl-01.svg", linear_program())
    write("k12-l-03.svg", vsepr())
    write(
        "m9-o-04.svg",
        table_svg(
            "Data massa dan volume air buah",
            ["Buah", "Massa (g)", "Volume air (mL)"],
            [
                ["A", "118,4", "96,3"],
                ["B", "130,7", "150"],
                ["C", "130,55", "140"],
                ["D", "96,255", "118,15"],
            ],
        ),
    )
    write(
        "m9-o-29.svg",
        table_svg(
            "Usia telur di mesin tetas",
            ["Usia (hari)", "Banyak telur"],
            [["2", "20"], ["4", "35"], ["6", "30"], ["8", "15"]],
            "Telur menetas setelah 18 hari · total 100 telur",
        ),
    )
    write(
        "en-o-20.svg",
        table_svg(
            "Student money habits (survey)",
            ["Finding", "Share / note"],
            [
                ["Save money regularly", "45%"],
                ["Track expenses (notebook or app)", "62%"],
                ["Save about 10% of allowance", "good practice"],
                ["Spend more than planned", "29%"],
            ],
            "Table from the sample text · tracking helps spending habits",
        ),
    )
    write("m6-b-02.svg", rect(12, 8, "rect"))
    write("m6-l-03.svg", rect(9, 9, "sq"))
    write("m6-l-04.svg", rect(15, 4, "rect"))
    write("m6-l-08.svg", rect(20, 5, "rect"))
    write("m9-b-02.svg", triangle(12, 10))
    write("m9-l-08.svg", triangle(8, 7))
    write("m9-l-09.svg", triangle(12, 8, "Segitiga luas 48 cm², alas 12 cm"))


if __name__ == "__main__":
    main()
