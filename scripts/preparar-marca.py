"""Converte a marca de referência em contornos SVG escaláveis."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".tools"))
import cv2

SOURCE = ROOT / "docs/logo-fonte.jpg"
MEDIA = ROOT / "public/media"
image = cv2.imread(str(SOURCE))


def trace(box, lightness, minimum_area, precision):
    left, top, right, bottom = box
    segment = image[top:bottom, left:right]
    mask = cv2.inRange(segment, (lightness, lightness, lightness), (255, 255, 255))
    contours, _ = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    paths = []
    for contour in contours:
        if cv2.contourArea(contour) < minimum_area:
            continue
        points = cv2.approxPolyDP(contour, precision, True).reshape(-1, 2)
        coordinates = "L".join(f"{x + left} {y + top}" for x, y in points)
        paths.append(f"M{coordinates}Z")
    return "".join(paths)


symbol = """
<defs><linearGradient id="gold" x2="1" y2="1" gradientUnits="objectBoundingBox">
<stop stop-color="#f3d9a4"/><stop offset=".43" stop-color="#a97937"/>
<stop offset=".68" stop-color="#dfbf7c"/><stop offset="1" stop-color="#8c612a"/>
</linearGradient></defs>
<g fill="url(#gold)">
<path d="M263 511C276 465 225 356 121 356C176 406 92 465 135 510L141 507C101 463 179 411 128 360C220 360 271 467 263 511Z"/>
<path d="M260 515C230 541 220 557 173 536C157 529 146 520 136 509L132 512C148 532 196 555 225 546C239 542 251 532 260 521Z"/>
<path d="M255 536C223 500 174 492 134 507C93 522 74 547 94 580C104 596 100 603 104 621C111 648 143 648 184 630C221 614 270 579 265 519L260 518C257 568 194 625 152 635C122 643 112 635 109 617C106 600 109 595 99 578C82 548 98 526 139 511C179 497 226 507 251 539Z"/>
<path d="M262 517C248 556 215 591 177 614C221 595 259 555 265 521ZM269 509C291 481 294 442 272 408C287 446 284 477 269 509ZM272 510C296 490 309 455 312 424C303 455 290 487 272 510Z"/>
</g>
"""

clinic = trace((431, 428, 835, 493), 230, 5, 0.85)
name = trace((277, 516, 993, 635), 230, 20, 0.9)
signature = trace((268, 655, 994, 688), 231, 4, 0.75)


def svg(viewbox, content):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">{content}</svg>\n'


def type_paths(fill):
    return f'<path fill="{fill}" fill-rule="evenodd" d="{clinic}{name}{signature}"/>'


(MEDIA / "revela.svg").write_text(svg("77 349 924 345", symbol + type_paths("#fffaf0")), encoding="utf-8")
(MEDIA / "revela-escura.svg").write_text(svg("77 349 924 345", symbol + type_paths("#3b2228")), encoding="utf-8")
(MEDIA / "revela-simbolo.svg").write_text(svg("60 335 276 325", symbol), encoding="utf-8")
