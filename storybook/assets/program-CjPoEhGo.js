var v=Object.defineProperty;var y=(i,o,e)=>o in i?v(i,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[o]=e;var m=(i,o,e)=>y(i,typeof o!="symbol"?o+"":o,e);import{d as z,N as b,f as S}from"./sigma-BsJT_GRv.js";function T(i,o,e){return z(i,o,e)}function g(i,o,e){const r=e.labelSize,a=e.labelFont,s=e.labelWeight;i.font=`${s} ${r}px ${a}`,i.fillStyle="#FFF",i.shadowOffsetX=0,i.shadowOffsetY=0,i.shadowBlur=8,i.shadowColor="#000";const f=2;if(typeof o.label=="string"){const n=i.measureText(o.label).width,c=Math.round(n+5),u=Math.round(r+2*f),l=Math.max(o.size,r/2)+f;i.beginPath(),i.moveTo(o.x+l,o.y+u/2),i.lineTo(o.x+l+c,o.y+u/2),i.lineTo(o.x+l+c,o.y-u/2),i.lineTo(o.x+l,o.y-u/2),i.lineTo(o.x+l,o.y-l),i.lineTo(o.x-l,o.y-l),i.lineTo(o.x-l,o.y+l),i.lineTo(o.x+l,o.y+l),i.moveTo(o.x+l,o.y+u/2),i.closePath(),i.fill()}else{const n=o.size+f;i.fillRect(o.x-n,o.y-n,n*2,n*2)}i.shadowOffsetX=0,i.shadowOffsetY=0,i.shadowBlur=0,T(i,o,e)}const h=`
precision mediump float;

varying vec4 v_color;

void main(void) {
  gl_FragColor = v_color;
}
`,E=`
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_cameraAngle;
uniform float u_correctionRatio;

varying vec4 v_color;

const float bias = 255.0 / 254.0;
const float sqrt_8 = sqrt(8.0);

void main() {
  float size = a_size * u_correctionRatio / u_sizeRatio * sqrt_8;
  float angle = a_angle + u_cameraAngle; 
  vec2 diffVector = size * vec2(cos(angle), sin(angle));
  vec2 position = a_position + diffVector;
  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  #ifdef PICKING_MODE
  v_color = a_id;
  #else
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`,{UNSIGNED_BYTE:R,FLOAT:t}=WebGLRenderingContext,A=["u_sizeRatio","u_correctionRatio","u_cameraAngle","u_matrix"],_=Math.PI;class w extends b{constructor(){super(...arguments);m(this,"drawHover",g);m(this,"drawLabel",T)}getDefinition(){return{VERTICES:6,VERTEX_SHADER_SOURCE:E,FRAGMENT_SHADER_SOURCE:h,METHOD:WebGLRenderingContext.TRIANGLES,UNIFORMS:A,ATTRIBUTES:[{name:"a_position",size:2,type:t},{name:"a_size",size:1,type:t},{name:"a_color",size:4,type:R,normalized:!0},{name:"a_id",size:4,type:R,normalized:!0}],CONSTANT_ATTRIBUTES:[{name:"a_angle",size:1,type:t}],CONSTANT_DATA:[[_/4],[3*_/4],[-_/4],[3*_/4],[-_/4],[-3*_/4]]}}processVisibleItem(e,r,a){const s=this.array,f=S(a.color);s[r++]=a.x,s[r++]=a.y,s[r++]=a.size,s[r++]=f,s[r++]=e}setUniforms(e,{gl:r,uniformLocations:a}){const{u_sizeRatio:s,u_correctionRatio:f,u_cameraAngle:n,u_matrix:c}=a;r.uniform1f(s,e.sizeRatio),r.uniform1f(n,e.cameraAngle),r.uniform1f(f,e.correctionRatio),r.uniformMatrix3fv(c,!1,e.matrix)}}export{w as N};
