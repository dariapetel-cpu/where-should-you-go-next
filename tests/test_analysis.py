import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'analysis'))
from analyze_responses import aggregate, export, validate, publish, ROOT

class AnalysisTests(unittest.TestCase):
    def setUp(self):
        self.answers = json.loads((ROOT/'prototype/catalog-audit.json').read_text())['witnesses']['paris']
    def test_demo(self):
        s = aggregate(ROOT/'analysis/sample_responses', 'synthetic')
        self.assertEqual(s['accepted'], 30)
        self.assertEqual(set(s['counts'].values()), {2})
        self.assertFalse(s['errors'])
    def test_reject_tampering_and_wrong_origin(self):
        good = export(self.answers, 'synthetic-attempt-123')
        for key, value in [('revision', True), ('data_origin', 'participant'), ('primary_destination_id', 'bali'), ('schema_version', True), ('extra', 'bad')]:
            with self.assertRaises(ValueError):
                validate({**good, key:value}, 'synthetic')
    def test_dedup_revision_conflict_and_preserve_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            old = export(self.answers, 'synthetic-attempt-123')
            new = export({**self.answers, 'dream':'a'}, 'synthetic-attempt-123', 9)
            for name, item in [('old',old), ('new',new), ('duplicate',new)]:
                (folder/(name+'.json')).write_text(json.dumps(item))
            s = aggregate(folder, 'synthetic')
            self.assertEqual(s['accepted'], 1)
            self.assertEqual(s['counts'][new['primary_destination_id']], 1)
            conflict = export({**self.answers, 'dream':'c'}, 'synthetic-attempt-123', 9)
            (folder/'conflict.json').write_text(json.dumps(conflict))
            s = aggregate(folder, 'synthetic')
            self.assertEqual(s['conflicts'], 1)
            (folder/'chart.svg').write_text('preserve me')
            with self.assertRaises(ValueError):
                publish(s, folder)
            self.assertEqual((folder/'chart.svg').read_text(), 'preserve me')
    def test_artifacts(self):
        with tempfile.TemporaryDirectory() as tmp:
            publish(aggregate(ROOT/'analysis/sample_responses','synthetic'), tmp)
            self.assertIn('SYNTHETIC', (Path(tmp)/'chart.svg').read_text())
            self.assertEqual(len((Path(tmp)/'counts.csv').read_text().splitlines()),16)
if __name__ == '__main__':
    unittest.main()
