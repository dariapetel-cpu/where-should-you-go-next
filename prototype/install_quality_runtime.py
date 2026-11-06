"""Install pinned local MIT runtime when networking is available; never fetch artwork."""
from pathlib import Path
from urllib.request import urlopen
ROOT=Path(__file__).resolve().parent
BASE='https://raw.githubusercontent.com/mrdoob/three.js/r170/'
FILES=['build/three.module.js','examples/jsm/loaders/GLTFLoader.js','examples/jsm/utils/BufferGeometryUtils.js','LICENSE']
def main():
    downloaded={}
    for name in FILES:
        target=ROOT/'vendor/three'/name
        if target.exists(): continue
        print('Downloading', name)
        with urlopen(BASE+name,timeout=20) as response: downloaded[target]=response.read()
    # Write only after every download succeeds, preserving existing work.
    for target,data in downloaded.items():
        target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
    print('Runtime installed. Artwork and license review are still required.')
if __name__=='__main__':
    try: main()
    except Exception as error: raise SystemExit(f'Runtime download failed; no partial downloads written: {error}')
