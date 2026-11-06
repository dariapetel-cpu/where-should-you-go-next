"""Asset readiness gate, not a claim of visual quality or legal verification."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parent

def audit():
    m=json.loads((ROOT/'assets/quality-manifest.json').read_text());failures=[]
    def local(value):
        if not isinstance(value,str): return None
        p=(ROOT/value).resolve()
        return p if p.is_relative_to(ROOT) and value.startswith(('assets/','vendor/')) else None
    for dep in m['dependencies']:
        p=local(dep)
        if not p or not p.is_file(): failures.append('Missing runtime: '+dep)
    for name,scene in m['scenes'].items():
        if scene['status']!='reviewed': failures.append(name+': asset package not reviewed')
        total=0
        for asset in scene['assets']:
            p=local(asset.get('path'));license_path=local(asset.get('license_file'))
            if not all(asset.get(k) for k in ('author','source','license','sha256')) or not license_path or not license_path.is_file(): failures.append(name+': missing provenance/license for '+asset['id'])
            if not p or not p.is_file(): failures.append(name+': missing '+asset['path']);continue
            data=p.read_bytes()
            if asset.get('runtime',True): total+=len(data)
            if hashlib.sha256(data).hexdigest()!=asset.get('sha256'): failures.append(name+': checksum mismatch '+asset['id'])
            if p.suffix=='.glb' and data[:4]!=b'glTF': failures.append(name+': invalid GLB header')
        if total>scene['budgets']['download_mb']*1024*1024: failures.append(name+': download budget exceeded')
    return failures
if __name__=='__main__':
    issues=audit()
    print('\n'.join(issues) if issues else 'READY: local asset/provenance checks passed; browser visual review still required.')
    raise SystemExit(bool(issues))
