/* Destination-specific light, atmospheric depth and emissive signage, using the local mesh pipeline. */
(function(root){'use strict';const G=root.Travel3D;
const vertex=`#version 300 es
precision highp float;layout(location=0) in vec3 position;layout(location=1) in vec3 normal;
uniform mat4 model,viewProjection,lightMatrix;uniform mat3 normalTransform;
out vec3 worldPosition,worldNormal;out vec4 shadowPosition;
void main(){vec4 p=model*vec4(position,1.);worldPosition=p.xyz;worldNormal=normalTransform*normal;shadowPosition=lightMatrix*p;gl_Position=viewProjection*p;}`;
const fragment=`#version 300 es
precision highp float;in vec3 worldPosition,worldNormal;in vec4 shadowPosition;
uniform vec3 baseColor,eye,keyColor,ambientColor,lightDirection,fogColor;
uniform float roughness,metalness,floorMaterial,shadowTexel,emission;uniform sampler2D shadowMap;out vec4 outColor;
void main(){vec3 n=normalize(worldNormal),l=normalize(lightDirection),v=normalize(eye-worldPosition);vec3 s=shadowPosition.xyz/shadowPosition.w*.5+.5;float shadow=0.;
if(s.x>0.&&s.x<1.&&s.y>0.&&s.y<1.&&s.z<1.){for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)shadow+=s.z-.002>texture(shadowMap,s.xy+vec2(x,y)*shadowTexel*1.4).r?1.:0.;shadow/=9.;}
float diffuse=max(dot(n,l),0.),spec=pow(max(dot(n,normalize(l+v)),0.),mix(75.,8.,roughness));
vec3 light=ambientColor*(.4+.18*max(n.y,0.))+keyColor*diffuse*(1.-shadow*.55)*.65;
vec3 col=baseColor*light+keyColor*spec*(1.-roughness)*.3+baseColor*emission;
float fog=smoothstep(12.,36.,distance(eye,worldPosition));col=mix(col,fogColor,fog*.8);outColor=vec4(col,1.);}`;
function program(gl){const p=gl.createProgram();for(const [type,src] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));gl.attachShader(p,s);gl.deleteShader(s);}gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
class Renderer extends G.Studio{
 constructor(canvas,d){super(canvas,{background:d.sky,eye:d.eye,target:d.target,ground:-.38,shadowSize:512});const gl=this.gl;gl.deleteProgram(this.main);this.main=program(gl);this.u=Object.fromEntries('model viewProjection lightMatrix normalTransform baseColor eye roughness metalness floorMaterial shadowMap shadowTexel keyColor ambientColor lightDirection fogColor emission'.split(' ').map(n=>[n,gl.getUniformLocation(this.main,n)]));this.environment=d;this.lightMatrix=G.mul(G.ortho(-12,12,-10,12,.1,45),G.lookAt(d.sun.map(v=>v*1.5),[0,0,0]));}
 draw(g,m,mat,depth=false,floor=false){if(!depth)this.gl.uniform1f(this.u.emission,mat.emission||0);super.draw(g,m,mat,depth,floor);}
 render(objects){const gl=this.gl,d=this.environment;gl.useProgram(this.main);for(const [key,value] of [['keyColor',G.color(d.light)],['ambientColor',G.color(d.ambient)],['lightDirection',d.sun],['fogColor',G.color(d.sky)]])gl.uniform3fv(this.u[key],value);super.render(objects);}
}
root.DestinationRenderer=Renderer;
})(typeof window!=='undefined'?window:globalThis);
