#!/usr/bin/env python3
"""
Genera icone PNG in varie dimensioni per la PWA
Richiede: pip install cairosvg
"""

import subprocess
import sys
import os

def check_cairosvg():
    """Verifica se cairosvg è installato"""
    try:
        import cairosvg
        return True
    except ImportError:
        return False

def install_cairosvg():
    """Installa cairosvg"""
    print("📦 Installazione cairosvg...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "cairosvg"])

def generate_icons():
    """Genera le icone PNG da SVG"""
    try:
        import cairosvg
    except ImportError:
        print("❌ Errore: impossibile importare cairosvg")
        return False
    
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    svg_path = "icon.svg"
    
    if not os.path.exists(svg_path):
        print(f"❌ File {svg_path} non trovato!")
        return False
    
    print("🎨 Generazione icone PNG...")
    
    for size in sizes:
        output_path = f"icon-{size}.png"
        try:
            cairosvg.svg2png(
                url=svg_path,
                write_to=output_path,
                output_width=size,
                output_height=size
            )
            print(f"   ✅ {output_path}")
        except Exception as e:
            print(f"   ❌ Errore {output_path}: {e}")
    
    # Genera anche favicon.ico (copia 192.png)
    try:
        cairosvg.svg2png(
            url=svg_path,
            write_to="favicon.png",
            output_width=32,
            output_height=32
        )
        print(f"   ✅ favicon.png")
    except Exception as e:
        print(f"   ❌ Errore favicon: {e}")
    
    print("\n✅ Icone generate con successo!")
    return True

def main():
    print("🚀 Generatore icone - Radio Prezzismart\n")
    
    if not check_cairosvg():
        install_cairosvg()
    
    generate_icons()

if __name__ == "__main__":
    main()
