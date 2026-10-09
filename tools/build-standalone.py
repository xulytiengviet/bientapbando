"""Build one HTML file with all runtime assets and embedded boundary data."""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
s = (root / 'index.html').read_text()
s = re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: '<style>' + (root / m[1]).read_text() + '</style>', s)
s = re.sub(r'<script src="([^"]+)"></script>', lambda m: '<script>' + (root / m[1]).read_text().replace('</script', '<\\/script') + '</script>', s)
(root / 'bien-tap-ban-do.htm').write_text(s)
print('Built bien-tap-ban-do.htm:', len(s.encode()), 'bytes')
