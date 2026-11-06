/* Local indexed WebGL meshes. Scene coordinates are artistic compositions, not maps. */
(function(root){
'use strict';
const G=root.Travel3D,{T,S,RX,RY,RZ,chain,mul,material}=G;
const box=(()=>{const positions=[],normals=[],indices=[];for(const [axis,sign] of [[0,1],[0,-1],[1,1],[1,-1],[2,1],[2,-1]]){const u=(axis+1)%3,v=(axis+2)%3,start=positions.length/3;for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const p=[0,0,0],n=[0,0,0];p[axis]=sign/2;p[u]=a/2;p[v]=b/2;n[axis]=sign;positions.push(...p);normals.push(...n);}indices.push(...(sign>0?[0,1,2,0,2,3]:[0,2,1,0,3,2]).map(i=>i+start));}return {positions:new Float32Array(positions),normals:new Float32Array(normals),indices:new Uint16Array(indices)};})();
const pyramid=(()=>{const p=[[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5],[.12,1,0]],positions=[],normals=[],indices=[];for(const f of [[0,4,1],[1,4,2],[2,4,3],[3,4,0],[0,1,2],[0,2,3]]){const a=p[f[0]],b=p[f[1]],c=p[f[2]],n=G.norm(G.cross(b.map((x,i)=>x-a[i]),c.map((x,i)=>x-a[i]))),s=positions.length/3;for(const v of [a,b,c]){positions.push(...v);normals.push(...n);}indices.push(s,s+1,s+2);}return {positions:new Float32Array(positions),normals:new Float32Array(normals),indices:new Uint16Array(indices)};})();
function merge(objects){const groups=new Map();for(const o of objects){const k=JSON.stringify(o.material);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(o);}return [...groups.values()].map(group=>{const positions=[],normals=[],indices=[];for(const o of group){const m=o.matrix,n=G.normalMatrix(m),offset=positions.length/3,g=o.geometry;for(let i=0;i<g.positions.length;i+=3){const [x,y,z]=g.positions.slice(i,i+3);positions.push(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14]);const [a,b,c]=g.normals.slice(i,i+3);normals.push(...G.norm([n[0]*a+n[3]*b+n[6]*c,n[1]*a+n[4]*b+n[7]*c,n[2]*a+n[5]*b+n[8]*c]));}indices.push(...Array.from(g.indices,i=>i+offset));}if(positions.length/3>65535)throw Error('Scene batch exceeds index budget');return {geometry:{positions:new Float32Array(positions),normals:new Float32Array(normals),indices:new Uint16Array(indices)},material:group[0].material,matrix:G.I()};});}
const definitions={
 paris:{sky:'#E8B99C',light:'#FFD9AC',ambient:'#ADABC9',sun:[-5,9,6],ground:'#AF9584',eye:[7,4.4,12],target:[0,1.6,0],accent:'#E7B58B',mood:'Golden hour on the Seine',markers:[{name:'Eiffel Tower',point:[0,4.5,0]},{name:'Seine riverbanks',point:[-3,.4,3]},{name:'Montmartre café',point:[3.6,1,0]}]},
 tokyo:{sky:'#151E3B',light:'#B6CBFF',ambient:'#776FAD',sun:[-3,8,4],ground:'#242E4B',eye:[7,4,12],target:[0,1.6,0],accent:'#FBA38E',mood:'The city after blue hour',markers:[{name:'Asakusa',point:[-2.6,2.6,0]},{name:'Shibuya',point:[2.8,3.7,-1]},{name:'Sumida riverfront',point:[-5,.5,3]}]},
 bali:{sky:'#8BCAD1',light:'#FFF0CB',ambient:'#7AB9B5',sun:[-5,10,4],ground:'#E5C8A2',eye:[7,3.5,12],target:[0,1,0],accent:'#F7D69A',mood:'A slow morning by the ocean',markers:[{name:'Sanur coast',point:[-2,.4,2]},{name:'Ubud',point:[2,1.8,-1]},{name:'Tegalalang terraces',point:[-3.8,1.2,-3]}]},
 'swiss-alps':{sky:'#9DBACB',light:'#E8F6FF',ambient:'#9CAFC0',sun:[-5,10,4],ground:'#668278',eye:[7,4,13],target:[0,1.6,0],accent:'#C5E9E8',mood:'Still water. A wider horizon.',markers:[{name:'Zermatt village',point:[3,1.3,0]},{name:'Matterhorn viewpoints',point:[-1,5,-4]},{name:'Stellisee',point:[-2,.4,2]}]}
};
function build(id){if(!definitions[id])return null;const fixed=[],moving=[],d=definitions[id],mats=new Map();
 const mat=(hex,shine=false,emission=0)=>{const key=hex+shine+emission;if(!mats.has(key))mats.set(key,{...material(hex,shine?.22:.8,shine?.25:0),emission});return mats.get(key);};
 const add=(g,m,c,shine=false,e=0,list=fixed)=>{const o={geometry:g,matrix:m,material:mat(c,shine,e)};list.push(o);return o;};
 const cube=(x,y,z,w,h,l,c,r=0)=>add(box,chain(T(x,y,z),RY(r),S(w,h,l)),c);
 const ball=(x,y,z,w,h,l,c,list=fixed)=>add(G.sphere(1,8,12),chain(T(x,y,z),S(w,h,l)),c,false,0,list);
 const roof=(x,y,z,w,h,l,c)=>add(pyramid,chain(T(x,y,z),S(w,h,l)),c);
 const rod=(a,b,width,c)=>{const mid=a.map((x,i)=>(x+b[i])/2),delta=b.map((x,i)=>x-a[i]),len=Math.hypot(...delta);add(box,chain(T(...mid),RY(Math.atan2(delta[0],delta[2])),RX(-Math.acos(delta[1]/len)),S(width,len,width)),c);};
 cube(0,-.2,0,70,.3,70,d.ground);
 function water(color){add(box,chain(T(-2,-.025,3),S(11,.08,7)),color,true);for(let i=0;i<9;i++){const o=add(box,chain(T(-6+i*.9,.04,2+(i%3)),S(.65,.012,.055)),id==='tokyo'?'#A97DAD':'#BDE0DD',true,.1,moving);o.motion='water';o.phase=i;}}
 function house(x,z,h,c,roofColor='#505B67'){cube(x,h/2,z,1.25,h,1.5,c);roof(x,h,z,1.55,.65,1.8,roofColor);for(let y=.55;y<h-.1;y+=.65)for(const dx of [-.3,.3])cube(x+dx,y,z+.758,.19,.32,.025,id==='tokyo'?'#F0C88B':'#405B62');}
 if(id==='paris'){
  water('#5F9EAB');cube(-2,.12,1.1,11,.18,.65,'#D2B79D');cube(-2,.12,5.8,11,.18,.65,'#D2B79D');cube(0,.2,0,3,.2,3,'#C3AF96');
  for(const sx of [-1,1])for(const sz of [-1,1]){let last=[sx*1.1,.1,sz*1.1];for(const [h,w] of [[1.7,.6],[3,.32],[4.4,.08]]){const next=[sx*w,h,sz*w];rod(last,next,.09,'#66594F');last=next;}for(let k=0;k<4;k++){const y=.4+k*.55,w=1.05-k*.16;rod([sx*w,y,sz*w],[-sx*(w-.18),y+.5,sz*(w-.18)],.035,'#66594F');}}
  for(const [y,w] of [[1.65,1.5],[3,.85],[4.3,.3]])cube(0,y,0,w,.12,w,'#66594F');rod([0,4.3,0],[0,5.1,0],.055,'#66594F');
  for(let i=0;i<6;i++)house(-5+i*1.6,-2.5,2.4+(i%2)*.5,i%2?'#D7BFA7':'#E6CEAF');
  house(3.6,0,1.8,'#DFC4A3');cube(3.6,1.35,.95,1.5,.13,.8,'#A34F47');for(let i=0;i<3;i++)cube(3.1+i*.45,1.36,.95,.2,.15,.81,'#F5DFC2');
  for(const x of [2.8,4.1]){add(G.cylinder(.28,.07,16),T(x,.55,1.7),'#C7A081');rod([x,.1,1.7],[x,.55,1.7],.06,'#60544B');for(const z of [1.3,2.1])cube(x,.3,z,.28,.08,.28,'#786651');}
 }else if(id==='tokyo'){
  water('#344C6A');
  cube(0,0,1.6,7,.08,10,'#303F59');for(let i=0;i<9;i++)cube(-1.5+i*.38,.06,2.4,.2,.025,1.5,'#AAB7C5');
  for(let i=0;i<8;i++){const x=i<4?-4:3.7,z=-4+(i%4)*2,h=3+(i%3)*1.1;cube(x,h/2,z,1.8,h,1.6,i%2?'#354263':'#263451');for(let y=.6;y<h;y+=.65)for(let n=0;n<3;n++)add(box,chain(T(x-.5+n*.5,y,z+.81),S(.2,.3,.035)),n%2?'#F4BC87':'#84BDD0',false,.5);const sign=add(box,chain(T(x+(x>0?-.95:.95),h*.7,z+.2),S(.1,1.4,.55)),i%2?'#E7859E':'#6AC9D0',false,.6,moving);sign.motion='sign';sign.phase=i;}
  cube(-2.6,.7,0,1.5,1.4,1.2,'#943E39');for(const y of [1.3,1.9,2.5])roof(-2.6,y,0,2.4,.5,1.8,'#374753');for(const x of [-3.3,-1.9]){rod([x,0,.7],[x,1.8,.7],.14,'#D77554');ball(x,1.45,.9,.18,.25,.18,'#E5B077');}
 }else if(id==='bali'){
  water('#278F9A');for(let i=0;i<3;i++)cube(-4,.1+i*.25,-3+i*.3,4-i*.4,.25,1.2,'#729A58');
  for(const [x,z,h] of [[3,2,3.7],[-4,0,3.3],[1,-2,3.4],[5,-1,3.8]]){rod([x,0,z],[x+.35,h,z],.17,'#A07C53');const leaves=[];for(let i=0;i<7;i++){const angle=i*Math.PI*2/7;const o=add(G.sphere(1,6,10),chain(T(x+.35,h,z),RY(angle),RZ(-.22),T(.7,0,0),S(1,.09,.23)),i%2?'#3F7959':'#548C5B',false,0,leaves);o.motion='palm';o.phase=i;}moving.push(...leaves);}
  cube(2,.55,-1,1.6,1.1,1.4,'#A99575');for(const [y,w] of [[1.1,2.1],[1.6,1.55],[2.05,1]])roof(2,y,-1,w,.55,w,'#544E46');
  for(const x of [-.5,1]){cube(x,.18,1.6,.6,.15,1.2,'#DFBB89',-.2);rod([x,.1,1.6],[x,1.7,1.6],.05,'#A17D57');roof(x,1.6,1.6,1.7,.35,1.7,'#EAD2A4');}
 }else{
  water('#4A98A3');for(const [x,z,w,h] of [[-2,-6,8,7],[5,-7,9,5.7],[-8,-7,8,5]]){roof(x,0,z,w,h,w*.65,'#6D7D8B');roof(x+.12*w*.65,h*.58,z,w*.42,h*.42,w*.65*.42,'#E6EEEB');}
  for(let i=0;i<4;i++)house(2+i*1.3,-.7-(i%2),1+i%2*.35,'#96775C','#4E5C5B');
  for(let i=0;i<7;i++){const x=-6+i*1.8,z=-2-(i%2);add(G.cylinder(.07,1.3,8),T(x,.65,z),'#74644F');roof(x,.4,z,.8,1.6,.8,'#315D53');}
  for(let i=0;i<4;i++){const o=ball(-6+i*3,5+(i%2)*.6,-5,1.8,.22,.6,'#D9E5E5',moving);o.motion='cloud';o.phase=i;}
 }
 const statics=merge(fixed);for(const o of moving)o.base=o.matrix;
 const pins=d.markers.map((p,i)=>({geometry:G.sphere(.11,8,12),material:{...material(d.accent,.25,.2),emission:.4},matrix:T(...p.point),index:i}));
 return {definition:d,statics,moving,pins,objects(time=0,motion=true){return [...statics,...moving.map(o=>{let m=o.base;if(motion){const t=time*.001;if(o.motion==='water')m=mul(T(Math.sin(t*.5+o.phase)*.18,Math.sin(t+o.phase)*.015,0),m);if(o.motion==='cloud')m=mul(T(Math.sin(t*.08+o.phase)*1.1,0,0),m);if(o.motion==='palm')m=mul(RZ(Math.sin(t*.6+o.phase)*.012),m);}return {...o,matrix:m,material:o.motion==='sign'?{...o.material,emission:motion?.4+.15*Math.sin(time*.0007+o.phase):.5}:o.material};}),...pins];}};
}
const planned={
 rome:['#D7B18E','Roman arches and stone lanes','Golden afternoon','Fountain ripples'],
 barcelona:['#C9DDE0','Architectural spires and coastal promenade','Coral daylight','Sea movement'],
 london:['#91AABD','Clock tower and Thames','Blue-grey dusk','River and clouds'],
 amsterdam:['#ACCDD0','Canal houses and bridges','Soft morning','Canal ripples'],
 lisbon:['#E2B397','Tiled façades and sloping streets','Terracotta afternoon','Clouds'],
 kyoto:['#A5C4B3','Temple roofs and gardens','Jade dawn','Drifting leaves'],
 'new-york':['#6C86A6','Layered skyline and park','Cobalt evening','Distant traffic'],
 bangkok:['#C5A18B','Temple roofs and riverfront','Warm evening','River lights'],
 'greek-islands':['#80BDCF','Naxos lanes and coast','Aegean daylight','Water'],
 iceland:['#99A8B2','Volcanic terrain and waterfall motifs','Slate sky','Mist'],
 queenstown:['#8AB7B8','Lake, mountains and town','Teal daylight','Clouds']};
const registry=Object.fromEntries([...Object.entries(definitions).map(([id,d])=>[id,{status:'immersive',palette:d.sky,atmosphere:d.mood,camera:d.eye,markers:d.markers}]),...Object.entries(planned).map(([id,p])=>[id,{status:'fallback',palette:p[0],environment:p[1],atmosphere:p[2],animation:p[3],camera:null,markers:[]}])]);
const api={definitions,registry,build,merge};root.DestinationModels=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
