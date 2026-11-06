/* Explicit local asset readiness. Missing artwork is never substituted with a new fake landmark. */
(function(root){'use strict';
const local=path=>typeof path==='string'&&/^(assets|vendor)\/[A-Za-z0-9_./-]+$/.test(path)&&!path.split('/').includes('..');
function validate(manifest,id){
 const scene=manifest?.scenes?.[id];if(!scene)return {ready:false,missing:['No quality scene configured'],scene:null};
 const missing=[];if(manifest.version!==1)missing.push('Unsupported asset manifest');
 for(const path of manifest.dependencies||[])if(!local(path))missing.push('Invalid local dependency path');
 for(const asset of scene.assets||[]){if(!local(asset.path))missing.push(`${asset.id}: invalid local path`);if(asset.required&&(!asset.author||!asset.source||!asset.license||!local(asset.license_file)||!/^([a-f0-9]{64})$/.test(asset.sha256||'')))missing.push(`${asset.id}: local asset, attribution, license and checksum required`);}
 if(!scene.assets?.some(a=>a.id==='environment'&&a.required))missing.push('Environment GLB required');
 const partial=scene.status==='partial-preview'&&id==='paris'&&scene.mode==='paris-landmark';
 if(scene.status!=='reviewed'&&!partial)missing.push('Asset package has not passed visual/license review');
 return {ready:missing.length===0,partial,missing,scene};
}
async function assess(id,fetcher=root.fetch.bind(root)){
 const response=await fetcher('assets/quality-manifest.json');if(!response.ok)throw Error('Local asset manifest unavailable');const manifest=await response.json(),report=validate(manifest,id);if(!report.ready)return {...report,manifest};
 const paths=[...manifest.dependencies,...report.scene.assets.filter(a=>a.required).flatMap(a=>[a.path,a.license_file])];
 for(const path of paths){const result=await fetcher(path,{method:'HEAD'});if(!result.ok)report.missing.push(path);}
 report.ready=report.missing.length===0;return {...report,manifest};
}
root.DestinationAssets={local,validate,assess};if(typeof module!=='undefined')module.exports=root.DestinationAssets;
})(typeof window!=='undefined'?window:globalThis);
