/* Optional local glTF/PBR backend. Only activated after reviewed assets pass the readiness gate. */
(function(root){'use strict';
function disposeScene(scene){const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value);}});geometries.forEach(g=>g.dispose());textures.forEach(t=>{t.source?.data?.close?.();t.dispose();});materials.forEach(m=>m.dispose());}
async function prepare(report){
 if(!report.ready)throw Error('Destination assets are incomplete');
 const THREE=await import('./vendor/three/build/three.module.js'),{GLTFLoader}=await import('./vendor/three/examples/jsm/loaders/GLTFLoader.js');
 const config=report.scene,manager=new THREE.LoadingManager();manager.setURLModifier(url=>{const u=new URL(url,location.href);if(u.protocol==='blob:'||u.protocol==='data:')return url;if(u.origin!==location.origin)throw Error('Remote scene assets are disabled');return url;});
 const loader=new GLTFLoader(manager),environment=config.assets.find(a=>a.id==='environment');let gltf,backdrop,art;
 try{
  gltf=await loader.loadAsync(environment.path);
  if(config.mode==='paris-landmark'){const [{composeParis},{mergeGeometries}]=await Promise.all([import('./paris-art.mjs'),import('./vendor/three/examples/jsm/utils/BufferGeometryUtils.js')]);art=composeParis(THREE,mergeGeometries,gltf.scene);gltf.scene=art.group;}
  const scene=gltf.scene;scene.updateMatrixWorld(true);
  const anchors=art?.anchors||config.anchors.map(name=>{const node=scene.getObjectByName(name);if(!node)throw Error(`Missing attraction anchor: ${name}`);return node.getWorldPosition(new THREE.Vector3()).toArray();});
  const clips=config.animation_clips.map(name=>{const clip=gltf.animations.find(c=>c.name===name);if(!clip)throw Error(`Missing environmental animation: ${name}`);return clip;});
  let triangles=0;const textures=new Set();scene.traverse(o=>{if(o.isMesh){triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3*(o.count||1);o.castShadow=true;o.receiveShadow=true;for(const m of (Array.isArray(o.material)?o.material:[o.material]))for(const value of Object.values(m))if(value?.isTexture)textures.add(value);}});
  if(triangles>config.budgets.triangles)throw Error('Scene triangle budget exceeded');
  for(const t of textures)if(Math.max(t.image?.width||0,t.image?.height||0)>config.budgets.texture_edge)throw Error('Texture exceeds size budget');
  const background=config.assets.find(a=>a.id==='backdrop');if(background){backdrop=await new THREE.TextureLoader(manager).loadAsync(background.path);backdrop.colorSpace=THREE.SRGBColorSpace;backdrop.mapping=THREE.EquirectangularReflectionMapping;}
  return {THREE,config,gltf,anchors,clips,backdrop,art,dispose(){disposeScene(scene);backdrop?.dispose();art?.disposeAux();}};
 }catch(e){if(gltf)disposeScene(gltf.scene);backdrop?.dispose();art?.disposeAux();throw e;}
}
function attach(canvas,prepared){
 const {THREE:T,config,gltf,anchors,clips,backdrop,art}=prepared;const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});renderer.resetState();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=config.lighting.exposure;renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene();scene.background=backdrop||new T.Color(config.lighting.sky);if(backdrop){scene.environment=backdrop;scene.environmentIntensity=.35;}let reflection=null;if(art){const pmrem=new T.PMREMGenerator(renderer);reflection=pmrem.fromScene(art.environment,.12,.1,100);scene.environment=reflection.texture;scene.environmentIntensity=.8;pmrem.dispose();}
 scene.fog=new T.Fog(config.lighting.sky,18,48);scene.add(gltf.scene);scene.add(new T.HemisphereLight(config.lighting.key,'#37404B',config.lighting.ambient));const key=new T.DirectionalLight(config.lighting.key,config.lighting.intensity);key.position.set(-5,10,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-12;key.shadow.camera.right=12;key.shadow.camera.top=12;key.shadow.camera.bottom=-12;key.shadow.bias=-.0003;scene.add(key);
 const camera=new T.PerspectiveCamera(180/5.3,1,.1,60),mixer=new T.AnimationMixer(gltf.scene);clips.forEach(clip=>mixer.clipAction(clip).play());
 const pins=anchors.map(point=>{const marker=new T.Mesh(new T.SphereGeometry(.09,12,8),new T.MeshStandardMaterial({color:'#FFF1C9',emissive:'#D7A65F',emissiveIntensity:.5,roughness:.3}));marker.position.fromArray(point);scene.add(marker);return marker;});
 let disposed=false;const api={eye:[...config.camera.eye],target:[...config.camera.target],stats:{frames:0,triangles:0},quality:true,anchors,config,
 setTime(ms,motion=true){mixer.setTime(ms/1000);art?.update(ms,motion);},render(){if(disposed)return;const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();camera.position.fromArray(api.eye);camera.lookAt(...api.target);renderer.render(scene,camera);api.stats={frames:api.stats.frames+1,triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls};},
 inspectFrame(){api.render();const gl=renderer.getContext(),pixels=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let hash=2166136261,nonBackgroundPixels=0;for(let i=0;i<pixels.length;i+=4){hash=Math.imul(hash^pixels[i],16777619);hash=Math.imul(hash^pixels[i+1],16777619);hash=Math.imul(hash^pixels[i+2],16777619);if(pixels[i]+pixels[i+1]+pixels[i+2]>30)nonBackgroundPixels++;}return {hash:hash>>>0,nonBackgroundPixels,error:gl.getError(),triangles:api.stats.triangles};},
 dispose(){if(disposed)return;disposed=true;mixer.stopAllAction();mixer.uncacheRoot(gltf.scene);pins.forEach(p=>{p.geometry.dispose();p.material.dispose();});reflection?.dispose();prepared.dispose();renderer.dispose();}};return api;
}
root.DestinationQuality={prepare,attach};
})(window);
