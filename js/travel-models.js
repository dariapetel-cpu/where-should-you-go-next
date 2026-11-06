/* Procedural, genuine 3D travel models. Units are arbitrary studio units. */
(function(root){
  'use strict';
  const G=root.Travel3D;
  const {I,T,S,RX,RY,RZ,chain,roundedBox,sphere,cylinder,torus,material}=G;
  const palette={
    shell:material('#ECA8C2',.4),rib:material('#E8A0BC',.48),trim:material('#B59ACD',.48),
    lining:material('#E4D9EC',.85),cream:material('#FFF0D9',.62),ink:material('#43384F',.72),
    metal:material('#B6AFC2',.28,.75),gold:material('#D5B780',.32,.55),blue:material('#A9CBDF',.38),
    lavender:material('#B9A2DA',.4),pink:material('#E7A6BF',.42),coffee:material('#65412F',.25),
    green:material('#A9C4B3',.6),white:material('#FFF8EE',.5)
  };
  function builder(parent=I()){
    const objects=[];
    const mesh=(geo,mat,m=I())=>objects.push({geometry:geo,material:mat,matrix:chain(parent,m)});
    const box=(size,pos,mat=palette.cream,r=.06,rotation=I())=>mesh(roundedBox(...size,r),mat,chain(T(...pos),rotation));
    const ball=(radius,pos,mat=palette.cream,scale=[1,1,1])=>mesh(sphere(radius),mat,chain(T(...pos),S(...scale)));
    const disk=(radius,height,pos,mat=palette.cream,rotation=I())=>mesh(cylinder(radius,height),mat,chain(T(...pos),rotation));
    const ring=(radius,tube,pos,mat=palette.gold,rotation=I())=>mesh(torus(radius,tube),mat,chain(T(...pos),rotation));
    const rod=(a,b,r,mat=palette.gold)=>{
      const delta=b.map((v,i)=>v-a[i]),y=G.norm(delta),up=Math.abs(y[2])>.95?[1,0,0]:[0,0,1],x=G.norm(G.cross(up,y)),z=G.cross(x,y),mid=a.map((v,i)=>(v+b[i])/2);
      const orientation=new Float32Array([x[0],x[1],x[2],0,y[0],y[1],y[2],0,z[0],z[1],z[2],0,...mid,1]);mesh(cylinder(r,Math.hypot(...delta),20),mat,orientation);
    };
    return {objects,mesh,box,ball,disk,ring,rod};
  }
  function passport(parent=I()){
    const b=builder(parent);
    b.box([.65,.9,.095],[0,0,0],palette.cream,.04);
    b.box([.7,.96,.045],[0,0,.07],palette.lavender,.04);
    b.box([.7,.96,.045],[0,0,-.07],palette.lavender,.04);
    b.ring(.17,.012,[0,.06,.102],palette.gold);
    b.ring(.17,.009,[0,.06,.102],palette.gold,RY(1.1));
    b.box([.29,.018,.012],[0,-.24,.105],palette.gold,.006);
    return b.objects;
  }
  function suitcase({open=0,yaw=0,pitch=0,time=0}={}){
    const rootMatrix=chain(T(.15,0,0),RY(-.13+yaw),RX(pitch),RZ(-.055));
    const b=builder(rootMatrix);
    // A hollow back tray: opening the lid exposes the lining and packed objects.
    b.box([1.92,2.5,.17],[0,0,-.43],palette.shell,.16);
    b.box([1.67,2.24,.10],[0,0,-.30],palette.lining,.12);
    for(const x of [-.89,.89])b.box([.16,2.4,.79],[x,0,-.01],palette.shell,.07);
    for(const y of [-1.17,1.17])b.box([1.8,.16,.79],[0,y,-.01],palette.shell,.07);
    for(const x of [-.91,.91])b.box([.045,2.3,.05],[x,0,.405],palette.trim,.02);
    for(const y of [-1.18,1.18])b.box([1.76,.045,.05],[0,y,.405],palette.trim,.02);
    // Four rubber wheels with satin axles.
    for(const x of [-.66,.66])for(const z of [-.29,.29]){
      b.box([.19,.2,.19],[x,-1.31,z],palette.trim,.04);
      b.disk(.17,.14,[x,-1.46,z],palette.ink,RZ(Math.PI/2));
      b.disk(.075,.15,[x,-1.46,z],palette.metal,RZ(Math.PI/2));
    }
    for(const x of [-.44,.44]){b.rod([x,1.1,-.27],[x,1.93,-.27],.04,palette.metal);b.box([.14,.19,.15],[x,1.18,-.27],palette.trim,.04);}
    b.box([1.04,.16,.18],[0,1.93,-.27],palette.cream,.07);
    b.box([.16,.57,.2],[1.02,.2,-.08],palette.trim,.07);
    b.box([.12,.33,.13],[1.1,.2,-.08],palette.cream,.05);
    b.ring(.12,.025,[.47,1.56,-.24],palette.gold,RY(.2));
    b.box([.29,.43,.06],[.57,1.29,-.15],palette.cream,.055,RZ(.24));
    b.box([.17,.035,.02],[.57,1.3,-.11],palette.trim,.012,RZ(.24));
    // Rolled clothing and a passport are physical meshes inside the case.
    for(const x of [-.43,.02,.47])b.disk(.17,.65,[x,.52,-.04],x===.02?palette.blue:palette.cream,RX(Math.PI/2));
    b.box([1.37,.045,.09],[0,.5,.28],palette.trim,.02);
    b.objects.push(...passport(chain(rootMatrix,T(-.34,-.46,-.04),RZ(-.12),S(.83))));
    b.box([.53,.63,.26],[.39,-.48,-.02],palette.blue,.12,RZ(.15));
    // Left-hand hinge: every front detail inherits the lid rotation.
    const hinge=chain(rootMatrix,T(-.94,0,.43),RY(-open*1.94));
    const lid=builder(hinge);
    lid.box([1.9,2.5,.16],[.94,0,0],palette.shell,.14);
    lid.box([1.66,2.24,.035],[.94,0,-.105],palette.lining,.1);
    lid.box([1.48,.045,.05],[.94,.26,-.14],palette.trim,.02);
    for(let i=0;i<6;i++)lid.box([.055,1.95,.045],[.29+i*.26,0,.105],palette.rib,.025);
    lid.box([.55,.31,.045],[.57,.69,.13],palette.cream,.07,RZ(-.18));
    lid.box([.32,.035,.02],[.57,.7,.16],palette.trim,.012,RZ(-.18));
    lid.disk(.28,.035,[1.32,-.65,.13],palette.lavender,RX(Math.PI/2));
    lid.ball(.095,[1.32,-.65,.17],palette.cream,[1,1,.2]);
    for(const y of [-.78,.78])b.box([.1,.23,.16],[-.96,y,.4],palette.metal,.04);
    b.objects.push(...lid.objects);
    // A small spherical luggage charm reinforces the material contrast.
    b.ball(.11,[.8,1.09,.51],palette.gold);
    return b.objects;
  }
  function compass(parent=I()){
    const b=builder(parent);
    b.disk(.79,.24,[0,0,0],palette.lavender,RX(Math.PI/2));
    b.disk(.68,.04,[0,0,.15],palette.cream,RX(Math.PI/2));
    b.ring(.72,.045,[0,0,.17],palette.gold);
    b.ring(.12,.025,[0,.92,0],palette.gold);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;b.box([.025,.09,.02],[Math.sin(a)*.56,Math.cos(a)*.56,.18],palette.trim,.007,RZ(-a));}
    const needle=chain(parent,T(0,0,.22),RZ(-.45));const n=builder(needle);
    n.mesh(sphere(.18),palette.pink,chain(T(0,.22,0),S(.45,2.0,.19)));
    n.mesh(sphere(.18),palette.blue,chain(T(0,-.22,0),S(.45,2.0,.19)));
    n.ball(.07,[0,0,.035],palette.gold,[1,1,.5]);b.objects.push(...n.objects);return b.objects;
  }
  function map(parent=I()){
    const b=builder(parent);
    for(let i=0;i<3;i++){
      const p=chain(parent,T((i-1)*.56,0,i===1?-.1:0),RY(i===0?.32:i===2?-.32:0));const s=builder(p);
      s.box([.59,1.35,.055],[0,0,0],i===1?palette.green:palette.cream,.02);
      s.box([.36,.07,.018],[0,.22,.04],palette.blue,.02,RZ(.45));
      s.box([.06,.95,.018],[.1,-.05,.04],palette.white,.02,RZ(-.2));
      s.box([.4,.07,.018],[0,-.26,.04],palette.white,.02,RZ(-.15));
      b.objects.push(...s.objects);
    }
    b.rod([.35,.18,.15],[.35,.43,.15],.035,palette.gold);b.ball(.13,[.35,.5,.15],palette.pink);return b.objects;
  }
  function chair(parent=I()){
    const b=builder(parent);
    for(const x of [-.65,.65]){
      b.rod([x,-.75,-.56],[x,.96,-.47],.045,palette.gold);
      b.rod([x,-.75,.65],[x,-.08,-.5],.045,palette.gold);
      b.rod([x,-.16,-.5],[x,-.16,.55],.045,palette.gold);
    }
    b.rod([-.65,.96,-.47],[.65,.96,-.47],.045,palette.gold);
    b.rod([-.65,-.16,.55],[.65,-.16,.55],.045,palette.gold);
    for(let i=0;i<7;i++){
      const x=-.55+i*.183,mat=i%2?palette.cream:palette.pink;
      b.box([.185,1.11,.055],[x,.39,-.48],mat,.02);
      b.box([.185,.055,.99],[x,-.16,.035],mat,.02);
    }
    return b.objects;
  }
  function cup(parent=I()){
    const b=builder(parent);
    b.disk(.93,.06,[0,-.63,0],palette.cream);
    b.disk(.79,.025,[0,-.586,0],palette.pink);
    b.disk(.57,.82,[0,-.11,0],palette.pink);
    b.ring(.54,.06,[0,.3,0],palette.cream,RX(Math.PI/2));
    b.disk(.50,.015,[0,.29,0],palette.coffee);
    b.ring(.31,.09,[.66,-.03,0],palette.pink);
    b.disk(.48,.05,[0,-.54,0],palette.pink);
    // A cream swirl, built from geometry, sits just above the coffee surface.
    b.ring(.2,.016,[0,.307,0],palette.cream,RX(Math.PI/2));
    b.ring(.11,.012,[.04,.309,0],palette.cream,RX(Math.PI/2));
    return b.objects;
  }
  function land(points,parent,mat){
    const xyz=points.map(([lon,lat])=>{lon*=Math.PI/180;lat*=Math.PI/180;return [Math.cos(lat)*Math.sin(lon),Math.sin(lat),Math.cos(lat)*Math.cos(lon)];});
    const center=G.norm(xyz.reduce((s,p)=>s.map((v,i)=>v+p[i]),[0,0,0]));
    const normals=[],positions=[],indices=[];
    // Subdivide and project each patch onto the globe; flat triangle fans would
    // cut through the sphere and make continents look like disconnected shards.
    function subdivide(a,b,c,depth){
      if(depth){
        const ab=G.norm(a.map((v,i)=>v+b[i])),bc=G.norm(b.map((v,i)=>v+c[i])),ca=G.norm(c.map((v,i)=>v+a[i]));
        subdivide(a,ab,ca,depth-1);subdivide(ab,b,bc,depth-1);subdivide(ca,bc,c,depth-1);subdivide(ab,bc,ca,depth-1);return;
      }
      const offset=positions.length/3;
      for(const p of [a,b,c]){normals.push(...p);positions.push(...p.map(v=>v*1.018));}
      indices.push(offset,offset+1,offset+2);
    }
    for(let i=0;i<xyz.length;i++)subdivide(center,xyz[(i+1)%xyz.length],xyz[i],3);
    return {geometry:{positions:new Float32Array(positions),normals:new Float32Array(normals),indices:new Uint16Array(indices)},material:mat,matrix:parent};
  }
  // Prebuild continent meshes once; only their world matrices change during a spin.
  const landShapes=[
    [[-17,34],[8,37],[34,30],[43,12],[35,-4],[29,-25],[17,-35],[6,-20],[-5,4],[-17,17]],
    [[-9,36],[-8,51],[6,58],[17,70],[31,65],[39,48],[29,36]],
    [[32,41],[49,58],[84,71],[129,59],[146,43],[118,20],[103,6],[78,8],[57,28]],
    [[-80,9],[-60,10],[-37,-5],[-50,-27],[-69,-55],[-76,-31]],
    [[-129,52],[-106,71],[-74,63],[-53,48],[-82,25],[-98,16],[-116,31]],
    [[112,-12],[136,-10],[154,-27],[142,-39],[116,-31]]
  ].map(p=>land(p,I(),palette.cream));
  function globe({angle=0,mood=0,time=0}={}){
    const b=builder();
    b.disk(1.24,.18,[0,-1.38,0],palette.lavender);
    b.disk(1.08,.07,[0,-1.255,0],palette.cream);
    b.rod([0,-1.27,0],[0,-.8,0],.075,palette.gold);
    const tilted=chain(T(0,.1,0),RZ(-.2));
    const g=builder(tilted);
    g.ring(1.14,.035,[0,0,0],palette.gold,RY(.12));
    const world=chain(tilted,RY(angle));g.mesh(sphere(1,28,40),[palette.blue,palette.lavender,palette.pink,palette.green][mood],RY(angle));
    for(const landShape of landShapes)b.objects.push({...landShape,matrix:world});
    for(const lat of [-.5,0,.5])g.ring(Math.sqrt(1-lat*lat)+.006,.007,[0,lat,0],palette.white,RX(Math.PI/2));
    b.objects.push(...g.objects);
    const objectMatrix=chain(T(1.35,-.67,1.0),RY(-.3),S(.52));
    b.objects.push(...[compass,map,chair,cup][mood](objectMatrix));return b.objects;
  }
  const sampleMaterials={coral:material('#E9A18B',.48),mint:material('#9DCAB7',.65),butter:material('#E8CC82',.55),sky:material('#94BED5',.4),navy:material('#355469',.5),cream:material('#FFF2D9',.65)};
  function airplane(parent=I()){
    const b=builder(parent),m=sampleMaterials;
    // Sculpted fuselage, swept wings, engine nacelles, windows and tail: real volumes.
    b.ball(1,[0,.1,0],m.cream,[.36,.38,1.65]);
    b.box([3.5,.10,.69],[0,.02,.15],m.sky,.09,RX(-.06));
    for(const x of [-1,1]){
      b.box([.25,.32,.64],[x*1.62,.17,.23],m.coral,.08,RZ(x*-.22));
      b.disk(.24,.73,[x*.85,-.28,-.12],m.cream,RX(Math.PI/2));
      b.disk(.17,.02,[x*.85,-.28,.26],m.navy,RX(Math.PI/2));
      b.disk(.08,.03,[x*.85,-.28,.28],palette.metal,RX(Math.PI/2));
      for(let j=0;j<5;j++)b.ball(.06,[x*.335,.24,.73-j*.29],m.navy,[.25,.9,1]);
    }
    b.box([1.5,.08,.44],[0,.24,-1.12],m.coral,.07);
    b.box([.09,.7,.59],[0,.53,-1.17],m.sky,.06,RX(-.18));
    b.ball(.25,[0,.34,1.06],m.navy,[.92,.35,1]);
    b.ball(.21,[-1.3,-.7,-.85],palette.white,[1.7,.55,1]);
    b.ball(.3,[-1.1,-.66,-.9],palette.white,[1.3,.65,1]);
    return b.objects;
  }
  function cityDay(parent=I(),choice=-1){
    const b=builder(parent),m=sampleMaterials;
    b.box([2.85,.17,2.1],[0,-.91,0],m.cream,.12);
    b.box([2.65,.025,.32],[0,-.805,.25],m.sky,.015);
    b.box([.29,.025,1.85],[.12,-.805,0],m.sky,.015);
    // Four neighborhoods: streets, a food market, a clock tower and a pocket park.
    for(const [x,z,h,c] of [[-.9,-.5,.85,m.coral],[-.45,-.65,1.1,m.butter]]){
      b.box([.39,h,.42],[x,-.8+h/2,z],c,.035);
      for(const y of [-.49,-.16])b.box([.15,.14,.025],[x,y,z+.23],m.cream,.018);
    }
    b.box([.66,.48,.5],[.8,-.55,.58],m.coral,.04);
    for(let i=0;i<5;i++)b.box([.15,.08,.64],[.48+i*.16,-.28,.66],i%2?m.coral:m.cream,.015,RX(.1));
    b.box([.48,1.42,.49],[.77,-.1,-.5],m.butter,.04);
    b.disk(.17,.035,[.77,.34,-.235],m.cream,RX(Math.PI/2));
    b.rod([.77,.34,-.21],[.77,.44,-.21],.012,m.navy);b.rod([.77,.34,-.21],[.86,.34,-.21],.012,m.navy);
    b.box([.62,.13,.62],[-.8,-.76,.64],m.mint,.06);
    b.rod([-.8,-.7,.64],[-.8,-.28,.64],.055,m.butter);b.ball(.3,[-.8,-.15,.64],m.mint,[1,1.25,1]);
    if(choice>=0){const positions=[[-.7,.55,-.5],[.8,.04,.65],[.77,.95,-.5],[-.8,.45,.64]],p=positions[choice];b.rod([p[0],p[1]-.2,p[2]],p,.035,m.navy);b.ball(.13,p,m.coral);b.ring(.21,.022,p,m.cream,RY(.45));}
    return b.objects;
  }
  function backpack(parent=I(),choice=-1,packed=1){
    const b=builder(parent),m=sampleMaterials;
    for(const x of [-.47,.47])b.ring(.5,.075,[x,.05,-.41],m.navy,RY(.25));
    b.box([1.56,1.85,.7],[0,-.06,0],m.mint,.28);
    b.box([1.23,.67,.16],[0,-.52,.43],m.cream,.15);
    b.box([1.11,.035,.035],[0,-.28,.53],m.coral,.015);
    b.box([.13,.15,.06],[.46,-.34,.56],palette.gold,.025);
    b.ring(.27,.07,[0,1.02,-.12],m.navy);
    b.box([1.22,.12,.48],[0,.82,.03],m.navy,.055);
    b.box([1.45,.62,.15],[0,.67,-.29],m.mint,.15,RX(-.8));
    b.box([.25,.33,.04],[0,.36,.39],m.coral,.04);
    b.box([.13,.13,.06],[0,.34,.43],palette.gold,.02);
    if(choice>=0){
      const item=builder(chain(parent,T(0,1.6-packed*.62,.05),RZ(-.12),S(.72)));
      const color=[m.butter,m.sky,m.coral,m.cream][choice];
      item.box([.8,.8,.12],[0,0,0],color,.08);
      if(choice===0){item.ring(.23,.025,[0,0,.09],m.navy);item.rod([0,0,.1],[0,.16,.1],.018,m.navy);}
      else if(choice===1){for(let x=0;x<3;x++)for(let y=0;y<2;y++)item.box([.12,.12,.02],[-.21+x*.21,-.15+y*.23,.09],m.cream,.015);}
      else if(choice===2){item.disk(.23,.04,[0,0,.1],m.cream,RX(Math.PI/2));item.ring(.17,.02,[0,0,.13],m.navy);}
      else{item.box([.5,.35,.18],[0,0,.13],m.navy,.04);item.disk(.14,.1,[0,0,.26],m.sky,RX(Math.PI/2));}
      b.objects.push(...item.objects);
    }
    return b.objects;
  }
  function sampleScene({slide,angle=0,pitch=0,choice=-1,packed=1,lift=0}={}){
    const parent=chain(T(0,lift,0),RY(angle),RX(pitch));
    if(slide==='boarding')return airplane(chain(parent,RY(-.4),RZ(-.14)));
    if(slide==='q1')return cityDay(parent,choice);
    return backpack(chain(parent,RY(-.12)),choice,packed);
  }

  // One shared quiz canvas presents different real mesh compositions.
  function journey({slide='boarding',angle=0,mood=0,pitch=0,choice=-1,packed=1,lift=0}={}){
    if(['boarding','q1','q2'].includes(slide))return sampleScene({slide,angle,pitch,choice,packed,lift});
    const p=chain(RY(angle),RZ(-.035)),b=builder(p);
    const add=(objects,m)=>b.objects.push(...objects.map(o=>({...o,matrix:chain(p,m,o.matrix)})));
    if(slide==='q2'){
      add(suitcase({open:.9}),chain(T(.45,-.15,0),S(.65)));
    }else if(slide==='q1'){
      add(map(),chain(T(0,.1,0),S(1.15)));
      add(passport(),chain(T(.95,-.65,.45),RY(-.3),S(.7)));
    }else if(slide==='q3'){
      add(compass(),chain(T(0,.15,0),S(1.15)));
      for(let i=0;i<5;i++)b.ball(.045,[-1+i*.45,-.9,.65],palette.gold);
    }else if(slide==='q4'){
      add(cup(),chain(T(0,-.3,.15),S(1.12)));
      b.disk(.6,.12,[.45,.85,-.55],palette.gold,RX(Math.PI/2));
      b.ring(.75,.025,[.45,.85,-.55],palette.cream);
    }else if(slide==='q5'){
      add(passport(),chain(T(-.5,.05,.05),RY(.25),S(1.5)));
      add(compass(),chain(T(.6,-.4,.4),S(.65)));
    }else if(slide==='q6'){
      for(const [i,color] of [palette.pink,palette.lavender,palette.blue].entries()){
        const x=(i-1)*.75,y=i===1?.2:0;
        b.ball(.24,[x,.58+y,0],color);b.box([.5,.65,.4],[x,.02+y,0],color,.18);
        b.disk(.35,.09,[x,-.36+y,0],palette.cream);
      }
    }else if(slide==='q7'){
      add(passport(),chain(T(-.45,.15,.15),RY(.2),S(1.7)));
      add(map(),chain(T(.65,-.65,.3),S(.65)));
    }else if(slide==='match'){
      add(globe({angle:0,mood}),S(.85));
    }else{
      add(passport(),chain(T(-.3,.1,0),RY(.3),S(2.1)));
      add(compass(),chain(T(.7,-.65,.5),S(.65)));
    }
    return b.objects;
  }
  const models={sampleScene,journey,suitcase,compass,map,chair,cup,globe,passport,palette};root.TravelModels=models;if(typeof module!=='undefined')module.exports=models;
})(typeof window!=='undefined'?window:globalThis);
