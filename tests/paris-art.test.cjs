const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {loadThree,landmark,canvasStub,root}=require('./helpers/three-local.cjs');
test('real Eiffel GLB composes with silver ironwork, preserved stone and finite bounded street geometry',async()=>{
 const {T,utils}=await loadThree(),gltf=await landmark();const before=new T.Box3().setFromObject(gltf.scene).getSize(new T.Vector3());assert.ok(before.y>299&&before.y<301);
 const old=global.document;global.document={createElement:()=>canvasStub()};try{
  const {composeParis}=await import(pathToFileURL(path.join(root,'prototype/paris-art.mjs')).href),art=composeParis(T,utils.mergeGeometries,gltf.scene);art.group.updateMatrixWorld(true);let triangles=0,meshes=0,silver=0,stone=0;
  art.group.traverse(o=>{if(!o.isMesh)return;meshes++;const p=o.geometry.attributes.position;triangles+=(o.geometry.index?.count||p.count)/3*(o.count||1);for(let i=0;i<p.array.length;i++)assert.ok(Number.isFinite(p.array[i]));for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.name.includes('artistic silver')){silver++;assert.equal(m.metalness,.92);assert.ok(m.roughness>=.25);}if(m.name==='basestone'){stone++;assert.notEqual(m.metalness,.92);}}});
  assert.ok(silver>0&&stone>0);assert.ok(triangles<180000);assert.ok(meshes<120);assert.equal(art.anchors.length,3);const tower=new T.Box3().setFromObject(gltf.scene).getSize(new T.Vector3());assert.ok(Math.abs(tower.y-7.8)<.001);
  art.update(1000,false);const sparkle=art.group.children.find(o=>o.isPoints);assert.equal(sparkle.material.uniforms.motion.value,0);assert.ok(sparkle.geometry.attributes.position.count<=36);art.disposeAux();
  console.log(`Paris CPU geometry: ${triangles} triangles, ${meshes} mesh objects; GPU draw calls unmeasured`);
 }finally{global.document=old;}
});
