"""Offline, dependency-free validation and aggregation of explicitly exported responses."""
import argparse
import collections
import html
import json
from pathlib import Path
import re
import os

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / 'prototype/catalog.json').read_text())
VERSION = 'getaway-16-v1'


def rank(answers):
    if set(answers) != {q['id'] for q in CATALOG['questions']} or any(v not in ('a', 'b', 'c', 'd') for v in answers.values()):
        raise ValueError('Seven canonical answers required')
    ranks = []
    for d in CATALOG['destinations']:
        affinities = {}
        for i, q in enumerate(CATALOG['questions']):
            letter = answers[q['id']].upper()
            pair = d['affinities'][i]
            affinities[q['id']] = 2 if q['id'] == 'budget' and letter == 'D' else 3 if pair[0] == letter else 1 if pair[2] == letter else 0
        score = sum(affinities[q['id']] * q['weight'] for q in CATALOG['questions'])
        ranks.append((d['id'], score, affinities))
    ranks.sort(key=lambda r: (-r[1], *(-r[2][q] for q in CATALOG['tie_priority']), r[0]))
    return [{'destination_id': r[0], 'score': r[1]} for r in ranks]


def export(answers, response_id, revision=8, origin='synthetic'):
    ranking = rank(answers)
    return dict(schema_version=2, quiz_version=VERSION, catalog_version=CATALOG['catalog_version'], matcher_version=CATALOG['matcher_version'], response_id=response_id, revision=revision, data_origin=origin,
                answers=[dict(question_id=q['id'], option_id=q['id']+'.'+answers[q['id']]) for q in CATALOG['questions']], ranking=ranking, primary_destination_id=ranking[0]['destination_id'], alternative_destination_ids=[r['destination_id'] for r in ranking[1:3]])


def validate(record, origin):
    if not isinstance(record, dict) or not re.fullmatch(r'[a-zA-Z0-9-]{8,80}', str(record.get('response_id', ''))):
        raise ValueError('Invalid response ID')
    if type(record.get('revision')) is not int or record['revision'] < 8 or record['revision'] > 9007199254740991:
        raise ValueError('Invalid revision')
    if record.get('data_origin') != origin:
        raise ValueError('Data origin mismatch')
    rows = record.get('answers')
    if not isinstance(rows, list) or len(rows) != 7:
        raise ValueError('Seven answer rows required')
    answers = {}
    for row, q in zip(rows, CATALOG['questions']):
        if not isinstance(row, dict) or set(row) != {'question_id', 'option_id'} or row['question_id'] != q['id'] or row['option_id'] not in [q['id']+'.'+v for v in 'abcd']:
            raise ValueError('Noncanonical answer')
        answers[q['id']] = row['option_id'][-1]
    expected = export(answers, record['response_id'], record['revision'], origin)
    # JSON serialization also distinguishes boolean from integer values.
    if json.dumps(expected, sort_keys=True) != json.dumps(record, sort_keys=True):
        raise ValueError('Schema or recomputed ranking differs')
    return record


def aggregate(folder, origin):
    grouped = collections.defaultdict(list)
    errors = []
    for path in sorted(Path(folder).glob('*.json')):
        try:
            item = validate(json.loads(path.read_text()), origin)
            grouped[item['response_id']].append(item)
        except (ValueError, TypeError, KeyError) as exc:
            errors.append({'file': path.name, 'error': str(exc)})
    counts = {d['id']: 0 for d in CATALOG['destinations']}
    conflicts = 0
    for records in grouped.values():
        highest = max(r['revision'] for r in records)
        latest = [r for r in records if r['revision'] == highest]
        if len({json.dumps(r, sort_keys=True) for r in latest}) != 1:
            conflicts += 1
            continue
        counts[latest[0]['primary_destination_id']] += 1
    return dict(data_origin=origin, accepted=sum(counts.values()), conflicts=conflicts, errors=errors, counts=counts, catalog_version=CATALOG['catalog_version'], matcher_version=CATALOG['matcher_version'])


def publish(summary, output):
    if not summary['accepted']:
        raise ValueError('No valid attempts; existing output preserved')
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    top = max(summary['counts'].values())
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="900" height="760" viewBox="0 0 900 760" role="img" aria-labelledby="title desc"><title id="title">Destination matches</title><desc id="desc">'+html.escape(summary['data_origin'])+' exported responses, deduplicated by attempt and revision.</desc><rect width="900" height="760" fill="#f6f0e5"/><g font-family="sans-serif" fill="#193b46"><text x="30" y="45" font-size="26">Where would we go next?</text><text x="30" y="76" font-size="16">'+html.escape(summary['data_origin'].upper())+' · '+str(summary['accepted'])+' valid attempts</text>']
    csv = ['destination,count']
    for i, d in enumerate(CATALOG['destinations']):
        count = summary['counts'][d['id']]
        y = 110+i*40
        svg.append(f'<text x="30" y="{y+20}" font-size="17">{html.escape(d["name"])}</text><rect x="210" y="{y}" width="{550*count/top:.1f}" height="28" rx="6" fill="{["#286960", "#bc6b50", "#225f70"][i%3]}"/><text x="790" y="{y+20}" font-size="17">{count}</text>')
        csv.append(f'{d["id"]},{count}')
    svg.append('</g></svg>')
    files = {'chart.svg': ''.join(svg), 'summary.json': json.dumps(summary, indent=2)+'\n', 'counts.csv': '\n'.join(csv)+'\n'}
    for name, text in files.items():
        temporary = output / (name+'.tmp')
        temporary.write_text(text)
        os.replace(temporary, output/name)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--origin', choices=['participant', 'synthetic'], default='participant')
    args = parser.parse_args()
    if not args.input.is_dir():
        parser.error('Input directory does not exist')
    summary = aggregate(args.input, args.origin)
    try:
        publish(summary, args.output)
    except ValueError as exc:
        parser.error(str(exc))
    print(json.dumps(summary, indent=2))

if __name__ == '__main__':
    main()
