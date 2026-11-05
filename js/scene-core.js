/* Original, dependency-free WebGL 2 mesh renderer. No CSS/SVG stand-ins for 3D.
   Column-major transforms, rounded geometry, GGX material lighting, depth shadows. */
(function (root) {
  'use strict';
  const I = () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  function mul(a,b) { const c=new Float32Array(16); for(let j=0;j<4;j++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)c[j*4+i]+=a[k*4+i]*b[j*4+k]; return c; }
  function T(x=0,y=0,z=0) { const a=I(); a[12]=x;a[13]=y;a[14]=z;return a; }
  function S(x=1,y=x,z=x) { const a=I();a[0]=x;a[5]=y;a[10]=z;return a; }
  function RX(a) {const m=I(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m;}
  function RY(a) {const m=I(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m;}
  function RZ(a) {const m=I(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m;}
  const chain = (...m) => m.reduce(mul,I());
  const norm = a => { const l=Math.hypot(...a)||1; return a.map(v=>v/l); };
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const dot = (a,b) => a.reduce((v,x,i)=>v+x*b[i],0);
  function lookAt(eye,at,up=[0,1,0]) {
    const z=norm(eye.map((v,i)=>v-at[i])),x=norm(cross(up,z)),y=cross(z,x);
    return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);
  }
  function perspective(fov,aspect,near=.1,far=50) { const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]); }
  function ortho(l,r,b,t,n,f) {return new Float32Array([2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1]);}
  // Correct for non-uniform scale as well as rotation.
  function normalMatrix(m) {
    const a=[m[0],m[1],m[2]],b=[m[4],m[5],m[6]],c=[m[8],m[9],m[10]];
    const x=cross(b,c),y=cross(c,a),z=cross(a,b),d=dot(a,x);
    if(Math.abs(d)<1e-9)throw new Error('Singular model matrix');
    return new Float32Array([...x,...y,...z].map(v=>v/d));
  }
  const cache=new Map();
  function geometry(key,build) {if(!cache.has(key)){const g=build();g.positions=new Float32Array(g.positions);g.normals=new Float32Array(g.normals);g.indices=new Uint16Array(g.indices);cache.set(key,g);}return cache.get(key);}
  function roundedBox(w,h,d,r=.1) {
    r=Math.max(.001,Math.min(r,w/2-.001,h/2-.001,d/2-.001));
    return geometry(`box:${w}:${h}:${d}:${r}`,()=>{
      const positions=[],normals=[],indices=[],half=[w/2,h/2,d/2],inner=half.map(v=>v-r);
      const axes=[[0,1,2,-1],[0,-1,2,1],[1,1,0,1],[1,-1,0,1],[2,1,0,1],[2,-1,0,-1]];
      for(const [axis,sign,uAxis,uSign] of axes){
        const vAxis=[0,1,2].find(v=>v!==axis&&v!==uAxis);
        const u=[0,0,0],v=[0,0,0];u[uAxis]=uSign;v[vAxis]=1;
        if(cross(u,v)[axis]!==sign)v[vAxis]=-1;
        const samples=q=>[-q,-q+r*.25,-q+r*.65,-q+r,q-r,q-r*.65,q-r*.25,q];
        const us=samples(half[uAxis]),vs=samples(half[vAxis]),start=positions.length/3;
        for(const vy of vs)for(const ux of us){
          const p=[0,0,0];p[axis]=half[axis]*sign;p[uAxis]=ux*u[uAxis];p[vAxis]=vy*v[vAxis];
          const base=p.map((c,i)=>Math.max(-inner[i],Math.min(inner[i],c))),n=norm(p.map((c,i)=>c-base[i]));
          positions.push(...base.map((c,i)=>c+n[i]*r));normals.push(...n);
        }
        for(let y=0;y<7;y++)for(let x=0;x<7;x++){const a=start+y*8+x;indices.push(a,a+1,a+9,a,a+9,a+8);}
      }
      return {positions,normals,indices};
    });
  }
  function sphere(r=1,rows=16,cols=24) {return geometry(`sphere:${r}:${rows}:${cols}`,()=>{
    const positions=[],normals=[],indices=[];
    for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){const a=y/rows*Math.PI,b=x/cols*Math.PI*2,n=[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];positions.push(...n.map(v=>v*r));normals.push(...n);}
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x;indices.push(a,a+1,a+cols+2,a,a+cols+2,a+cols+1);}
    return {positions,normals,indices};
  });}
  function cylinder(r=1,h=1,segments=40) {return geometry(`cylinder:${r}:${h}:${segments}`,()=>{
    const positions=[],normals=[],indices=[];
    for(let x=0;x<=segments;x++){const a=x/segments*Math.PI*2,c=Math.cos(a),s=Math.sin(a);positions.push(r*c,-h/2,r*s,r*c,h/2,r*s);normals.push(c,0,s,c,0,s);if(x<segments){const i=x*2;indices.push(i,i+1,i+3,i,i+3,i+2);}}
    for(const sign of [-1,1]){const base=positions.length/3;positions.push(0,sign*h/2,0);normals.push(0,sign,0);for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;positions.push(r*Math.cos(a),sign*h/2,r*Math.sin(a));normals.push(0,sign,0);if(i<segments){const n=base+1+i;indices.push(...(sign===1?[base,n+1,n]:[base,n,n+1]));}}}
    return {positions,normals,indices};
  });}
  // Torus lies in XY, with its opening facing +Z.
  function torus(radius=.6,tube=.06,segments=48,sides=12) {return geometry(`torus:${radius}:${tube}:${segments}:${sides}`,()=>{
    const positions=[],normals=[],indices=[];
    for(let i=0;i<=segments;i++)for(let j=0;j<=sides;j++){const a=i/segments*2*Math.PI,b=j/sides*2*Math.PI;const n=[Math.cos(a)*Math.cos(b),Math.sin(a)*Math.cos(b),Math.sin(b)];positions.push((radius+tube*Math.cos(b))*Math.cos(a),(radius+tube*Math.cos(b))*Math.sin(a),tube*Math.sin(b));normals.push(...n);}
    for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j;indices.push(a,a+sides+1,a+sides+2,a,a+sides+2,a+1);}return {positions,normals,indices};
  });}
  function plane(size=20) {return geometry(`plane:${size}`,()=>({positions:[-size,0,-size,-size,0,size,size,0,size,size,0,-size],normals:[0,1,0,0,1,0,0,1,0,0,1,0],indices:[0,1,2,0,2,3]}));}
  const color = hex => [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  function material(hex,roughness=.55,metalness=0) {return {color:color(hex),roughness,metalness};}
  const vertex=`#version 300 es
  precision highp float;
  layout(location=0) in vec3 position; layout(location=1) in vec3 normal;
  uniform mat4 model, viewProjection, lightMatrix; uniform mat3 normalTransform;
  out vec3 worldPosition; out vec3 worldNormal; out vec4 shadowPosition;
  void main(){vec4 w=model*vec4(position,1.);worldPosition=w.xyz;worldNormal=normalTransform*normal;shadowPosition=lightMatrix*w;gl_Position=viewProjection*w;}`;
  const fragment=`#version 300 es
  precision highp float;
  in vec3 worldPosition; in vec3 worldNormal; in vec4 shadowPosition;
  uniform vec3 baseColor, eye; uniform float roughness, metalness, floorMaterial;
  uniform sampler2D shadowMap; uniform float shadowTexel;
  out vec4 outColor;
  const float PI=3.14159265;
  float visibility(vec3 n,vec3 l){
    vec3 p=shadowPosition.xyz/shadowPosition.w*.5+.5;
    if(p.x<0.||p.x>1.||p.y<0.||p.y>1.||p.z>1.)return 1.;
    float bias=max(.0012*(1.-dot(n,l)),.0004),sum=0.;
    for(int x=-2;x<=2;x++)for(int y=-2;y<=2;y++){
      float depth=texture(shadowMap,p.xy+vec2(float(x),float(y))*shadowTexel*1.7).r;
      sum+=p.z-bias<=depth?1.:0.;
    }
    return sum/25.;
  }
  vec3 lamp(vec3 n,vec3 v,vec3 l,vec3 radiance,vec3 albedo){
    vec3 h=normalize(v+l),f0=mix(vec3(.04),albedo,metalness);
    float nl=max(dot(n,l),0.),nv=max(dot(n,v),.001),nh=max(dot(n,h),0.),vh=max(dot(v,h),0.);
    float a=max(.06,roughness*roughness),a2=a*a,denom=nh*nh*(a2-1.)+1.;
    float d=a2/(PI*denom*denom),k=(roughness+1.)*(roughness+1.)/8.;
    float g=(nl/(nl*(1.-k)+k))*(nv/(nv*(1.-k)+k));
    vec3 f=f0+(1.-f0)*pow(1.-vh,5.);
    vec3 spec=d*g*f/max(4.*nl*nv,.001);
    vec3 diffuse=(1.-f)*(1.-metalness)*albedo/PI;
    return (diffuse+spec)*radiance*nl;
  }
  void main(){
    vec3 n=normalize(worldNormal);if(!gl_FrontFacing)n=-n;
    vec3 v=normalize(eye-worldPosition),l=normalize(vec3(-4.,7.,5.)-worldPosition);
    float shade=visibility(n,l);
    if(floorMaterial>.5){
      vec3 tint=mix(baseColor,vec3(.56,.48,.65),(1.-shade)*.20);
      outColor=vec4(tint,1.);return;
    }
    vec3 albedo=pow(baseColor,vec3(2.2));
    vec3 ambient=mix(vec3(.30,.25,.34),vec3(.84,.87,1.),n.y*.5+.5);
    vec3 result=albedo*ambient*.64*(1.-metalness*.6);
    result+=lamp(n,v,l,vec3(3.1,2.85,2.65)*mix(.35,1.,shade),albedo);
    result+=lamp(n,v,normalize(vec3(4.,3.,1.)-worldPosition),vec3(.82,.93,1.25),albedo);
    result+=lamp(n,v,normalize(vec3(1.,4.,-5.)-worldPosition),vec3(1.3,.9,1.05),albedo);
    // A soft studio reflection makes satin metal legible without external HDR maps.
    result+=mix(vec3(.04),albedo,metalness)*pow(1.-max(dot(n,v),0.),3.)*.25;
    result=result/(result+vec3(.55));
    outColor=vec4(pow(result,vec3(1./2.2)),1.);
  }`;
  const depthVertex=`#version 300 es
  layout(location=0) in vec3 position; uniform mat4 model, lightMatrix;
  void main(){gl_Position=lightMatrix*model*vec4(position,1.);}`;
  const depthFragment=`#version 300 es
  precision highp float; void main(){}`;
  function program(gl,vs,fs){
    const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(message);}return s;};
    const v=compile(gl.VERTEX_SHADER,vs),f=compile(gl.FRAGMENT_SHADER,fs),p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;
  }
  class Studio {
    constructor(canvas,{background='#FFF8EE',eye=[4,2.6,6],target=[0,0,0],ground=-1.85,shadowSize=1024}={}){
      this.canvas=canvas;const gl=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:false});
      if(!gl)throw new Error('WebGL 2 is unavailable');this.gl=gl;this.buffers=new Map();this.eye=eye;this.target=target;this.ground=ground;this.background=color(background);this.shadowSize=shadowSize;
      this.main=program(gl,vertex,fragment);this.depth=program(gl,depthVertex,depthFragment);
      const uniforms=(p,names)=>Object.fromEntries(names.split(' ').map(n=>[n,gl.getUniformLocation(p,n)]));
      this.u=uniforms(this.main,'model viewProjection lightMatrix normalTransform baseColor eye roughness metalness floorMaterial shadowMap shadowTexel');
      this.d=uniforms(this.depth,'model lightMatrix');
      this.lightMatrix=mul(ortho(-5,5,-5,5,.1,25),lookAt([-4,7,5],[0,0,0]));
      this.shadow=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.shadow);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,shadowSize,shadowSize,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      this.framebuffer=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,this.shadow,0);
      gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Shadow framebuffer unavailable');
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.enable(gl.DEPTH_TEST);
      this.stats={frames:0,triangles:0};
    }
    upload(g){
      if(this.buffers.has(g))return this.buffers.get(g);
      const gl=this.gl,vao=gl.createVertexArray(),buffers=[];gl.bindVertexArray(vao);
      [g.positions,g.normals].forEach((data,i)=>{const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,3,gl.FLOAT,false,0,0);});
      const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,g.indices,gl.STATIC_DRAW);
      const record={vao,buffers,count:g.indices.length};this.buffers.set(g,record);return record;
    }
    draw(g,m,mat,depth=false,floor=false){
      const gl=this.gl,u=depth?this.d:this.u,b=this.upload(g);gl.bindVertexArray(b.vao);gl.uniformMatrix4fv(u.model,false,m);
      if(!depth){gl.uniformMatrix3fv(u.normalTransform,false,normalMatrix(m));gl.uniform3fv(u.baseColor,mat.color);gl.uniform1f(u.roughness,mat.roughness);gl.uniform1f(u.metalness,mat.metalness);gl.uniform1f(u.floorMaterial,floor?1:0);}
      gl.drawElements(gl.TRIANGLES,b.count,gl.UNSIGNED_SHORT,0);
    }
    render(objects){
      const gl=this.gl;if(gl.isContextLost())return;
      const r=this.canvas.getBoundingClientRect(),ratio=Math.min(root.devicePixelRatio||1,1.5),w=Math.max(1,Math.round(r.width*ratio)),h=Math.max(1,Math.round(r.height*ratio));
      if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
      gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffer);gl.viewport(0,0,this.shadowSize,this.shadowSize);gl.clear(gl.DEPTH_BUFFER_BIT);gl.useProgram(this.depth);gl.uniformMatrix4fv(this.d.lightMatrix,false,this.lightMatrix);
      for(const o of objects)this.draw(o.geometry,o.matrix,o.material,true);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,w,h);gl.clearColor(...this.background,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.main);
      gl.uniformMatrix4fv(this.u.viewProjection,false,mul(perspective(Math.PI/5.3,w/h,.1,50),lookAt(this.eye,this.target)));
      gl.uniformMatrix4fv(this.u.lightMatrix,false,this.lightMatrix);gl.uniform3fv(this.u.eye,this.eye);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.shadow);gl.uniform1i(this.u.shadowMap,0);gl.uniform1f(this.u.shadowTexel,1/this.shadowSize);
      this.draw(plane(),T(0,this.ground,0),{color:this.background,roughness:1,metalness:0},false,true);
      for(const o of objects)this.draw(o.geometry,o.matrix,o.material);
      this.stats.frames++;this.stats.triangles=objects.reduce((sum,o)=>sum+o.geometry.indices.length/3,0);
    }
    // Explicit test-only readback: inspect real GPU pixels, never a CSS stand-in.
    inspectFrame(objects){
      this.render(objects);
      const gl=this.gl,w=this.canvas.width,h=this.canvas.height,pixels=new Uint8Array(w*h*4);
      gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      const background=this.background.map(v=>Math.round(v*255));let nonBackgroundPixels=0,hash=2166136261;
      for(let i=0;i<pixels.length;i+=4){
        if(Math.abs(pixels[i]-background[0])+Math.abs(pixels[i+1]-background[1])+Math.abs(pixels[i+2]-background[2])>30)nonBackgroundPixels++;
        hash=Math.imul(hash^pixels[i],16777619);hash=Math.imul(hash^pixels[i+1],16777619);hash=Math.imul(hash^pixels[i+2],16777619);
      }
      return {width:w,height:h,nonBackgroundPixels,hash:hash>>>0,error:gl.getError(),triangles:this.stats.triangles};
    }
    dispose(){const gl=this.gl;for(const b of this.buffers.values()){gl.deleteVertexArray(b.vao);b.buffers.forEach(v=>gl.deleteBuffer(v));}gl.deleteFramebuffer(this.framebuffer);gl.deleteTexture(this.shadow);gl.deleteProgram(this.main);gl.deleteProgram(this.depth);this.buffers.clear();}
  }
  const api={I,mul,T,S,RX,RY,RZ,chain,norm,cross,dot,lookAt,perspective,ortho,normalMatrix,roundedBox,sphere,cylinder,torus,plane,color,material,Studio};
  root.Travel3D=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
