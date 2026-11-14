"""Build the public letters feed from Pages CMS JSON entries."""
import json
from pathlib import Path
from datetime import datetime

root = Path(__file__).resolve().parents[1]
items = []

def parse_date(value):
    value = str(value or '').strip()
    for fmt in ('%Y-%m-%d %H:%M', '%Y-%m-%dT%H:%M', '%Y-%m-%d', '%B %d, %Y %I:%M %p', '%B %d, %Y %I:%M%p', '%B %d, %Y'):
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            pass
    return datetime.min

for path in (root / 'content' / 'letters').glob('*.json'):
    try:
        entry = json.loads(path.read_text(encoding='utf-8'))
        if not isinstance(entry, dict):
            continue
        date = str(entry.get('date') or '').strip()
        dt = parse_date(date)
        display = dt.strftime('%B %d, %Y %I:%M %p').replace(' 0', ' ') if dt != datetime.min else date
        body = entry.get('body', '')
        if isinstance(body, list):
            body = '\n\n'.join(str(p) for p in body)
        items.append({'slug': path.stem, 'title': str(entry.get('title') or path.stem), 'date': date, 'displayDate': display or str(entry.get('title') or path.stem), 'text': str(body), '_sort': dt.isoformat()})
    except (ValueError, OSError) as exc:
        print(f'Skipping {path.name}: {exc}')
items.sort(key=lambda item: item['_sort'], reverse=True)
for item in items:
    del item['_sort']
(root / 'letters.json').write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Built {len(items)} letters, newest first')
