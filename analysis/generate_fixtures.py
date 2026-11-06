"""Generate openly labeled synthetic exports, never real participant data."""
import json
from pathlib import Path
from analyze_responses import export, ROOT

witnesses = json.loads((ROOT/'prototype/catalog-audit.json').read_text())['witnesses']
output = ROOT/'analysis/sample_responses'
output.mkdir(parents=True, exist_ok=True)
for destination, answers in witnesses.items():
    for n in (1, 2):
        record = export(answers, f'synthetic-{destination}-{n:02d}')
        (output/f'synthetic-{destination}-{n:02d}.json').write_text(json.dumps(record, indent=2)+'\n')
print('Generated 30 explicitly synthetic attempts across 15 destinations.')
