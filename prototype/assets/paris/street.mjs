/* Original Paris-inspired supporting street art. The landmark itself is the licensed GLB. */
export function buildParisStreet(T, mergeGeometries) {
 const group=new T.Group();group.name='Paris supporting street';const batches=new Map(),materials=new Map(),owned=[];
 const material=(name,color,roughness=.75,metalness=0)=>{if(!materials.has(name))materials.set(name,new T.MeshStandardMaterial({name,color,roughness,metalness}));return materials.get(name);};
 const stone=material('warm limestone','#CBBFA8'),trim=material('carved pale stone','#E8DDC6'),roof=material('zinc mansard','#536170',.38,.55),iron=material('painted iron','#25343B',.4,.65),glass=material('blue window glass','#3D6474',.22,.4),wood=material('cafe wood','#8A5B3F'),canvas=material('awning cream','#F1DEC0'),red=material('awning burgundy','#853F3E'),paving=material('pale paving','#C9BDA8'),road=material('warm asphalt','#77746D'),gold=material('lamp brass','#BDA06E',.3,.7);
 const cube=new T.BoxGeometry(1,1,1),cylinder=new T.CylinderGeometry(1,1,1,10),sphere=new T.SphereGeometry(1,10,8);owned.push(cube,cylinder,sphere);
 function add(g,m,pos,scale=[1,1,1],rotation=[0,0,0]){const matrix=new T.Matrix4().compose(new T.Vector3(...pos),new T.Quaternion().setFromEuler(new T.Euler(...rotation)),new T.Vector3(...scale));const geometry=g.clone().applyMatrix4(matrix);if(!batches.has(m))batches.set(m,[]);batches.get(m).push(geometry);}
 const box=(m,x,y,z,w,h,d,r=0)=>add(cube,m,[x,y,z],[w,h,d],[0,r,0]);
 const pole=(m,a,b,r=.025)=>{const start=new T.Vector3(...a),end=new T.Vector3(...b),direction=end.clone().sub(start),matrix=new T.Matrix4().compose(start.add(end).multiplyScalar(.5),new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),direction.clone().normalize()),new T.Vector3(r,direction.length(),r));const g=cylinder.clone().applyMatrix4(matrix);if(!batches.has(m))batches.set(m,[]);batches.get(m).push(g);};
 function archGeometry(w,h,depth){const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h-w/2);s.absarc(0,h-w/2,w/2,0,Math.PI,false);s.lineTo(-w/2,0);const g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:12});owned.push(g);return g;}
 // Street material uses locally generated stone joints, not a photographic city backdrop.
 const textureCanvas=document.createElement('canvas');textureCanvas.width=textureCanvas.height=512;const ctx=textureCanvas.getContext('2d');ctx.fillStyle='#C5B9A5';ctx.fillRect(0,0,512,512);let seed=71;for(let y=0;y<16;y++)for(let x=0;x<9;x++){seed=(seed*16807)%2147483647;const light=61+seed%10;ctx.fillStyle=`hsl(36 17% ${light}%)`;ctx.fillRect(x*64-(y%2)*32+2,y*32+2,60,28);}const pavingMap=new T.CanvasTexture(textureCanvas);pavingMap.colorSpace=T.SRGBColorSpace;pavingMap.wrapS=pavingMap.wrapT=T.RepeatWrapping;pavingMap.repeat.set(6,12);paving.map=pavingMap;
 box(road,0,-.12,0,60,.18,60);box(paving,-5.5,-.03,-3,5,.15,26);box(paving,5.5,-.03,-3,5,.15,26);box(paving,0,-.02,-5,8,.12,8);
 const river=material('Seine study','#527F88',.22,.15);box(river,0,.015,-9.6,6.2,.04,2.3);for(const z of [-8.3,-10.9])box(trim,0,.14,z,6.2,.2,.18);box(stone,0,.22,-9.6,1.4,.18,2.8);for(const x of [-.65,.65]){pole(iron,[x,.65,-8.3],[x,.65,-10.9],.025);for(let z=-10.8;z<-8.3;z+=.4)pole(iron,[x,.3,z],[x,.65,z],.018);}
 for(const x of [-3.1,3.1])box(trim,x,.04,-3,.12,.17,26);
 for(let z=-12;z<9;z+=1.2)box(trim,0,-.018,z,.07,.02,.6);
 function building(x,z,w,h,d,variant){
  const facade=material('limestone '+variant,variant?'#D6C4A8':'#C6BBA8');box(facade,x,h/2,z,w,h,d);
  const front=z+d/2;for(const y of [.18,1.38,2.65,3.86,h])box(trim,x,y,front+.06,w+.15,.12,.18);
  const profile=new T.Shape();profile.moveTo(-w/2,0);profile.lineTo(-w/2+.18,.65);profile.lineTo(-w/2+.62,1);profile.lineTo(w/2-.62,1);profile.lineTo(w/2-.18,.65);profile.lineTo(w/2,0);profile.closePath();const g=new T.ExtrudeGeometry(profile,{depth:d,bevelEnabled:false});owned.push(g);add(g,roof,[x,h,z-d/2]);
  for(const dx of [-w*.28,w*.28]){
   box(glass,x+dx,h+.35,front-.03,.45,.52,.2);box(trim,x+dx,h+.62,front-.03,.6,.1,.34);box(trim,x+dx,h+.35,front+.06,.04,.55,.08);
   for(const y of [1.68,2.96,4.15].filter(v=>v+.8<h)){
    box(trim,x+dx,y+.38,front+.045,.91,.98,.09);box(glass,x+dx,y+.4,front+.10,.72,.83,.08);
    for(const sx of [-.22,0,.22])box(trim,x+dx+sx,y+.4,front+.15,.035,.8,.04);box(trim,x+dx,y+.4,front+.16,.74,.035,.04);
    box(stone,x+dx,y-.08,front+.27,1.03,.09,.61);
    for(const yy of [y+.11,y+.40])pole(iron,[x+dx-.49,yy,front+.54],[x+dx+.49,yy,front+.54],.018);
    for(let xx=-.45;xx<=.46;xx+=.15)pole(iron,[x+dx+xx,y,front+.54],[x+dx+xx,y+.42,front+.54],.014);
    pole(iron,[x+dx-.49,y+.4,front+.07],[x+dx-.49,y+.4,front+.54],.018);pole(iron,[x+dx+.49,y+.4,front+.07],[x+dx+.49,y+.4,front+.54],.018);
   }
  }
  for(const dx of [-w*.28,w*.28]){add(archGeometry(.95,1.3,.08),trim,[x+dx,.08,front+.05]);add(archGeometry(.8,1.2,.09),glass,[x+dx,.08,front+.10]);box(iron,x+dx,.7,front+.21,.04,1.15,.04);}
  box(roof,x-.65,h+1,z,.25,.65,.35);box(trim,x-.65,h+1.35,z,.38,.08,.45);
 }
 // Architecture frames a clear central view of the imported tower.
 building(-5.3,-3,3.1,4.7,2.8,0);building(-5.4,-7.3,3.3,5.2,3,1);building(5.4,-4.4,3.3,4.8,3,1);building(6,-9,3.3,5.3,3.1,0);
 // Café terrace: sloping striped awning, readable original sign and genuine furniture.
 for(let i=0;i<12;i++)add(cube,i%2?red:canvas,[-6.65+i*.25,1.65,-.95],[.25,.08,1.35],[.16,0,0]);box(red,-5.25,1.49,-.3,3,.23,.07);
 const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=256;const sc=signCanvas.getContext('2d');sc.fillStyle='#43342D';sc.fillRect(0,0,1024,256);sc.strokeStyle='#CBAF76';sc.lineWidth=8;sc.strokeRect(18,18,988,220);sc.fillStyle='#EADAC0';sc.textAlign='center';sc.font='80px Georgia';sc.fillText('CAFÉ DES VOYAGES',512,150);const signTexture=new T.CanvasTexture(signCanvas);signTexture.colorSpace=T.SRGBColorSpace;const signMaterial=new T.MeshStandardMaterial({map:signTexture,roughness:.7});materials.set('cafe sign',signMaterial);add(new T.PlaneGeometry(2.7,.65),signMaterial,[-5.25,1.12,-1.53]);
 function chair(x,z,angle){const transform=(xx,yy,zz)=>[x+xx*Math.cos(angle)+zz*Math.sin(angle),yy,z-xx*Math.sin(angle)+zz*Math.cos(angle)];add(cylinder,wood,[x,.36,z],[.18,.055,.18]);for(const dx of [-.12,.12])for(const dz of [-.12,.12])pole(iron,transform(dx,0,dz),transform(dx,.34,dz),.016);for(const dx of [-.14,.14])pole(iron,transform(dx,.3,-.13),transform(dx,.76,-.13),.016);for(const y of [.5,.61,.72])pole(wood,transform(-.15,y,-.13),transform(.15,y,-.13),.025);}
 for(const [x,z] of [[-4.7,.25],[-5.7,.85],[-4.4,1.5]]){add(cylinder,trim,[x,.58,z],[.3,.045,.3]);pole(iron,[x,.07,z],[x,.56,z],.035);add(cylinder,iron,[x,.06,z],[.16,.04,.16]);chair(x-.5,z,-Math.PI/2);chair(x+.5,z,Math.PI/2);add(cylinder,canvas,[x+.12,.64,z],[.04,.07,.04]);}
 // Boulevard lamps: modeled glass lanterns with warm emissive bulbs, no extra shadow lights.
 const bulb=material('warm lamp glass','#FFE8AF',.3);bulb.emissive=new T.Color('#FFBA65');bulb.emissiveIntensity=.65;
 for(const [x,z] of [[-3.35,3.3],[3.35,2],[-3.35,-2],[3.35,-4]]){add(cylinder,iron,[x,.15,z],[.13,.3,.13]);pole(iron,[x,0,z],[x,2.4,z],.045);add(sphere,gold,[x,2.35,z],[.09,.09,.09]);box(bulb,x,2.58,z,.22,.35,.22);box(iron,x,2.8,z,.32,.08,.32);for(const dx of [-.13,.13])for(const dz of [-.13,.13])pole(iron,[x+dx,2.37,z+dz],[x+dx,2.79,z+dz],.015);}
 // An original bicycle with curved rims and a triangulated frame.
 const rim=new T.TorusGeometry(.28,.012,6,24);owned.push(rim);for(const x of [3.5,4.3])add(rim,iron,[x,.31,2.7]);for(const [a,b] of [[[3.5,.31,2.7],[3.8,.72,2.7]],[[3.8,.72,2.7],[4,.31,2.7]],[[4,.31,2.7],[3.5,.31,2.7]],[[3.8,.72,2.7],[4.15,.72,2.7]],[[4.15,.72,2.7],[4,.31,2.7]],[[4.15,.72,2.7],[4.3,.31,2.7]]])pole(red,a,b,.022);pole(iron,[4.15,.72,2.7],[4.16,.93,2.7],.018);pole(iron,[4.16,.93,2.58],[4.16,.93,2.82],.018);box(wood,3.8,.76,2.7,.18,.04,.12);
 for(const [m,geometries] of batches){const compatible=geometries.map(g=>g.index?g.toNonIndexed():g);const geometry=mergeGeometries(compatible,false);new Set([...geometries,...compatible]).forEach(g=>g.dispose());const mesh=new T.Mesh(geometry,m);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}owned.forEach(g=>g.dispose());
 // Foliage uses instanced crossed alpha cards in actual 3D volumes around branching trunks.
 const leaves=document.createElement('canvas');leaves.width=leaves.height=128;const lc=leaves.getContext('2d');lc.fillStyle='#77914D';lc.beginPath();lc.ellipse(64,64,19,53,-.3,0,Math.PI*2);lc.fill();lc.strokeStyle='#A5B074';lc.lineWidth=3;lc.beginPath();lc.moveTo(51,110);lc.lineTo(77,18);lc.stroke();const leafMap=new T.CanvasTexture(leaves);leafMap.colorSpace=T.SRGBColorSpace;const leafMat=new T.MeshStandardMaterial({map:leafMap,alphaTest:.5,side:T.DoubleSide,roughness:.9});
 const leafGeometry=new T.PlaneGeometry(.35,.52),count=420,foliage=new T.InstancedMesh(leafGeometry,leafMat,count),dummy=new T.Object3D();const treePositions=[[-3.8,0,4.4],[4,0,-.5],[-3.8,0,-10]];
 for(let i=0;i<count;i++){const [x,,z]=treePositions[i%3],a=i*2.399963,r=.85*Math.sqrt(((i*37)%137)/137);dummy.position.set(x+Math.cos(a)*r,2.15+Math.sin(i*1.7)*.65,z+Math.sin(a)*r);dummy.rotation.set(Math.sin(i)*.7,a,Math.cos(i)*.3);dummy.updateMatrix();foliage.setMatrixAt(i,dummy.matrix);}foliage.castShadow=true;group.add(foliage);
 for(const [x,,z] of treePositions){const trunk=new T.Mesh(new T.CylinderGeometry(.055,.09,1.9,10),wood);trunk.position.set(x,.95,z);trunk.castShadow=true;group.add(trunk);}
 return {group,update(time,motion){foliage.rotation.z=motion?Math.sin(time*.00035)*.002:0;}};
}
