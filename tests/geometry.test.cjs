const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('../js/scene-core.js');
const M=require('../js/travel-models.js');
const transform=(m,p)=>[0,1,2,3].map(i=>m[i]*p[0]+m[4+i]*p[1]+m[8+i]*p[2]+m[12+i]*(p[3]??1));
function validate(g){
  assert.equal(g.positions.length,g.normals.length);
  assert.equal(g.indices.length%3,0);
  assert.ok(g.positions.every(Number.isFinite));assert.ok(g.normals.every(Number.isFinite));
  for(const i of g.indices)assert.ok(i<g.positions.length/3);
  for(let i=0;i<g.normals.length;i+=3)assert.ok(Math.abs(Math.hypot(...g.normals.slice(i,i+3))-1)<.001);
}
test('all procedural primitives have finite geometry, unit normals and valid indices',()=>{
  [G.roundedBox(2,3,.4,.15),G.sphere(),G.cylinder(),G.torus(),G.plane()].forEach(validate);
});
test('sphere and rounded box triangles face outward',()=>{
  for(const g of [G.sphere(),G.roundedBox(2,3,.4,.15)]){
    for(let i=0;i<g.indices.length;i+=3){
      const ps=[0,1,2].map(j=>Array.from(g.positions.slice(g.indices[i+j]*3,g.indices[i+j]*3+3)));
      const normal=G.cross(ps[1].map((v,k)=>v-ps[0][k]),ps[2].map((v,k)=>v-ps[0][k]));
      if(Math.hypot(...normal)<1e-8)continue;
      const center=ps[0].map((v,k)=>(v+ps[1][k]+ps[2][k])/3);
      assert.ok(G.dot(normal,center)>0);
    }
  }
});
test('matrix composition and non-uniform normal transform preserve perpendicularity',()=>{
  const m=G.chain(G.T(2,3,4),G.RY(.7),G.S(2,3,4));
  assert.deepEqual(transform(m,[0,0,0]).map(v=>Math.round(v)),[2,3,4,1]);
  const n=G.normalMatrix(m),normal=[n[0],n[1],n[2]],tangent=transform(m,[0,1,0,0]);
  assert.ok(Math.abs(G.dot(normal,tangent.slice(0,3)))<.00001);
  assert.throws(()=>G.normalMatrix(G.S(0)),/Singular/);
});
test('camera targets project to screen center and depth lies inside the clip volume',()=>{
  const vp=G.mul(G.perspective(Math.PI/5,1.4),G.lookAt([4,3,6],[0,0,0]));
  const p=transform(vp,[0,0,0]);assert.ok(Math.abs(p[0]/p[3])<1e-6);assert.ok(Math.abs(p[1]/p[3])<1e-6);assert.ok(Math.abs(p[2]/p[3])<1);
});
test('suitcase opening changes real lid transforms while preserving the wheel base',()=>{
  const closed=M.suitcase({open:0}),open=M.suitcase({open:1});
  assert.equal(closed.length,open.length);
  const moved=closed.filter((o,i)=>Array.from(o.matrix).some((v,j)=>Math.abs(v-open[i].matrix[j])>.001));
  assert.ok(moved.length>=10,'Lid and all molded details must move together');
  assert.ok(moved.length<closed.length/2,'Back tray and wheel base must stay still');
  assert.deepEqual(closed[0].matrix,open[0].matrix);
});
test('all six scenes contain actual volumetric geometry within the triangle budget',()=>{
  for(const name of ['suitcase','map','compass','chair','cup','globe']){
    const objects=M[name]();assert.ok(objects.length>5);
    let triangles=0;for(const o of objects){validate(o.geometry);assert.ok(o.matrix.every(Number.isFinite));triangles+=o.geometry.indices.length/3;}
    assert.ok(triangles<50000,`${name}: ${triangles}`);
    console.log(`${name}: ${objects.length} mesh instances, ${triangles} triangles`);
  }
});
test('globe spin rotates continent geometry; each mood swaps the companion object',()=>{
  const a=M.globe({angle:0,mood:0}),b=M.globe({angle:1,mood:0}),c=M.globe({angle:0,mood:2});
  assert.notDeepEqual(a[3].matrix,b[3].matrix);assert.notEqual(a.length,c.length);
});
test('closed and open suitcase stay in frame at mobile aspect and rotation bounds',()=>{
  for(const open of [0,.5,1])for(const yaw of [-.66,0,.66])for(const pitch of [-.09,.09]){
    const eye=[3.6+.4*open,2.3+.3*open,6.8+1.5*open],target=[-.1-.65*open,.13,.25*open];
    const vp=G.mul(G.perspective(Math.PI/5.3,.98),G.lookAt(eye,target));
    for(const object of M.suitcase({open,yaw,pitch})){
      const matrix=G.mul(vp,object.matrix);
      for(let i=0;i<object.geometry.positions.length;i+=3){
        const p=transform(matrix,Array.from(object.geometry.positions.slice(i,i+3)));
        assert.ok(Math.abs(p[0]/p[3])<1&&Math.abs(p[1]/p[3])<1,`Clipped at open=${open}, yaw=${yaw}`);
      }
    }
  }
});

test('every new scene has volumetric meshes and stays below the existing triangle budget',()=>{
  for(const slide of ['boarding','q1','q2','q3','q4','q5','q6','q7','match']){
    const objects=M.journey({slide,angle:.4,mood:3});
    assert.ok(objects.length>5,slide);
    const triangles=objects.reduce((sum,o)=>sum+o.geometry.indices.length/3,0);
    assert.ok(triangles<50000,`${slide}: ${triangles}`);
    for(const o of objects){assert.ok([...o.matrix].every(Number.isFinite));assert.ok(o.geometry.positions.length>0);}
  }
});

test('new 3D compositions stay framed through a full turn on narrow canvases',()=>{
  const vp=G.mul(G.perspective(Math.PI/5.3,.9),G.lookAt([3,2.1,6.5],[0,0,0]));
  for(const slide of ['boarding','q1','q2','q3','q4','q5','q6','q7','match'])for(let turn=0;turn<6;turn++){
    for(const object of M.journey({slide,angle:turn*Math.PI/3,mood:3})){
      const matrix=G.mul(vp,object.matrix),points=object.geometry.positions;
      for(let i=0;i<points.length;i+=3){const p=transform(matrix,[points[i],points[i+1],points[i+2]]);assert.ok(Math.abs(p[0]/p[3])<1&&Math.abs(p[1]/p[3])<1,`${slide} clips at turn ${turn}`);}
    }
  }
});

test('sample hero geometry stays in frame at pointer extremes and throughout packing',()=>{
 const vp=G.mul(G.perspective(Math.PI/5.3,.9),G.lookAt([3,2.1,6.5],[0,0,0]));
 for(const slide of ['boarding','q1','q2'])for(const angle of [-.24,.24])for(const pitch of [-.14,.14])for(const choice of [0,1,2,3])for(const packed of [0,1]){
  const objects=M.sampleScene({slide,angle,pitch,choice,packed,lift:-pitch*.3});
  assert.ok(objects.reduce((n,o)=>n+o.geometry.indices.length/3,0)<50000,slide);
  for(const o of objects){const matrix=G.mul(vp,o.matrix),vertices=o.geometry.positions;
   for(let i=0;i<vertices.length;i+=3){const p=transform(matrix,[vertices[i],vertices[i+1],vertices[i+2]]);assert.ok(Math.abs(p[0]/p[3])<1&&Math.abs(p[1]/p[3])<1,`${slide} clips with choice ${choice} packed ${packed}`);}
  }
 }
});
