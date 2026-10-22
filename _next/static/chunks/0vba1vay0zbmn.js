(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,35717,e=>{"use strict";var t=e.i(43476),i=e.i(71645);let o={opal:{base:"#b7b9cf",shine:"#fff4e4",vein:"#07070e",filmA:"#ff6fd8",filmB:"#59e8ff",filmC:"#ffc896"},noir:{base:"#34353f",shine:"#f2f0ff",vein:"#000000",filmA:"#c04dff",filmB:"#2de2c4",filmC:"#ff9a3c"},"rose-gold":{base:"#d8b6aa",shine:"#fff1df",vein:"#1c0a0d",filmA:"#ff8fb1",filmB:"#ffd68a",filmC:"#b58dff"},glacier:{base:"#a8c4d6",shine:"#f4fbff",vein:"#020a12",filmA:"#6ff4ff",filmB:"#9b86ff",filmC:"#e9fffa"},aurora:{base:"#9aa3b6",shine:"#effff8",vein:"#030611",filmA:"#3dffb0",filmB:"#7a5cff",filmC:"#ff5ec4"}};function a(e){let t=String(e).trim().replace(/^#/,"");if(3===t.length||4===t.length?t=t.slice(0,3).split("").map(e=>e+e).join(""):8===t.length&&(t=t.slice(0,6)),!/^[0-9a-f]{6}$/i.test(t))return[0,0,0];let i=parseInt(t,16);return[(i>>16&255)/255,(i>>8&255)/255,(255&i)/255]}function n(e,t){let i=String(e).trim();return/^#[0-9a-f]{3}$/i.test(i)&&(i="#"+i.slice(1).split("").map(e=>e+e).join("")),/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(i)?i:t}let r=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`,l=`#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uRippleTime;
uniform vec2 uMouse;        // centred, y up, in units of the canvas height
uniform float uHover;       // 0 idle drift, 1 pointer inside
uniform vec2 uDrag;         // smoothed pointer velocity
uniform vec3 uBase;
uniform vec3 uShine;
uniform vec3 uVein;
uniform vec3 uFilmA;
uniform vec3 uFilmB;
uniform vec3 uFilmC;
uniform float uFlow;
uniform float uScale;
uniform float uStretch;
uniform float uAngle;
uniform float uIrid;
uniform float uRidges;
uniform float uVeins;
uniform float uSparkle;
uniform float uTilt;
uniform float uSmear;
uniform float uGrain;
uniform float uVignette;
uniform float uSeed;
uniform vec4 uRipples[6];   // xy centre, z start time, w strength

out vec4 outColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p;
    a *= 0.5;
  }
  return v;
}

// The metal. Warp the plane by fbm, warp it again by the result, and read fbm
// once more through both — the classic way to get folds that look poured.
// Returns height in x and the second warp's magnitude in y, which is where the
// folds pinch and the veins open.
vec2 surface(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + vec2(0.11, 0.04) * t),
    fbm(p + vec2(5.2, 1.3) - vec2(0.03, 0.09) * t)
  );
  vec2 r = vec2(
    fbm(p + 3.2 * uFlow * q + vec2(1.7, 9.2) + 0.13 * t),
    fbm(p + 3.2 * uFlow * q + vec2(8.3, 2.8) - 0.10 * t)
  );
  float f = fbm(p + 3.0 * uFlow * r);
  return vec2(f, length(r - q));
}

float height(vec2 p, float t, out float pinch) {
  vec2 s = surface(p, t);
  pinch = s.y;
  // Fine ridges along the contour lines: the layered, poured look.
  return s.x + 0.016 * uRidges * sin(s.x * 70.0);
}

// Three stops, cycled smoothly: A -> B -> C -> A.
vec3 film(float x) {
  x = fract(x) * 3.0;
  vec3 a = mix(uFilmA, uFilmB, smoothstep(0.0, 1.0, x));
  vec3 b = mix(uFilmB, uFilmC, smoothstep(1.0, 2.0, x));
  vec3 c = mix(uFilmC, uFilmA, smoothstep(2.0, 3.0, x));
  return x < 1.0 ? a : (x < 2.0 ? b : c);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;
  vec2 m = uMouse;

  // Comb the plane in one direction so the folds stream like the pour.
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  mat2 comb = mat2(ca, sa, -sa, ca);

  vec2 p = uv;

  // Smear: drag the metal along with the pointer, and twist it a little.
  vec2 d = p - m;
  float fall = exp(-dot(d, d) * 7.0);
  p -= uDrag * fall * 0.22 * uSmear;
  float tw = uSmear * (0.25 * uHover + length(uDrag) * 0.6) * fall;
  float cs = cos(tw);
  float sn = sin(tw);
  p = m + mat2(cs, -sn, sn, cs) * (p - m);

  // Beads of mercury: a damped ring that pushes the metal radially as it passes.
  float ring = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 rp = uRipples[i];
    float age = uRippleTime - rp.z;
    if (rp.w <= 0.0 || age < 0.0 || age > 4.0) continue;
    vec2 dd = uv - rp.xy;
    float rr = length(dd);
    float x = rr - age * 0.38;
    float env = exp(-x * x * 50.0) * exp(-age * 1.1) * rp.w;
    p += (dd / max(rr, 1e-3)) * sin(x * 36.0) * env * 0.05;
    ring += env * (0.5 + 0.5 * sin(x * 36.0));
  }

  vec2 q = comb * p;
  q.x /= max(uStretch, 0.2);
  float freq = 1.85 * uScale;
  q = q * freq + vec2(uSeed * 7.31, uSeed * 3.17);

  // Height and its gradient, by finite differences a pixel and a half apart.
  float e = 1.5 / uRes.y * freq;
  float pinch;
  float pinchDummy;
  float h = height(q, t, pinch);
  float hx = height(q + vec2(e, 0.0), t, pinchDummy);
  float hy = height(q + vec2(0.0, e), t, pinchDummy);
  vec2 g = vec2(hx - h, hy - h) / e;
  float slope = length(g);
  // Back into screen space so the light is not combed along with the folds.
  g.x /= max(uStretch, 0.2);
  g = transpose(comb) * g;
  vec3 n = normalize(vec3(-g * 0.08, 1.0));

  // The pointer tilts the foil: the light swings and the film slides.
  // Clamped, so a pointer in a far corner of a wide canvas tilts the foil
  // rather than turning the key light straight into the camera.
  vec2 tiltv = m * uTilt;
  tiltv *= min(1.0, 0.45 / max(length(tiltv), 1e-4));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-V, n);
  float fres = pow(1.0 - n.z, 1.2);

  // A soft studio: dim below, bright above, a long softbox and a warm key.
  // The tilt swings the lights around the axis rather than raising them, so
  // the highlights travel across the folds while the exposure stays put.
  float az = 2.16 + tiltv.x * 2.2 - tiltv.y * 1.2;
  vec3 L = normalize(vec3(cos(az) * 0.56, sin(az) * 0.56, 0.8));
  vec3 L2 = normalize(vec3(-cos(az + 0.4) * 0.72, -sin(az + 0.4) * 0.72, 0.7));
  float sky = smoothstep(-0.6, 0.8, R.y + tiltv.y * 0.25 + 0.2 * R.x);
  // Squared, so slopes turned away from the light fall into cool shadow.
  vec3 chrome = uBase * (0.34 + 1.08 * pow(sky, 1.5));
  float strip = exp(-pow((dot(R.xy, vec2(0.7, 0.7)) - 0.3 - 0.25 * (tiltv.x + tiltv.y)) * 4.0, 2.0));
  chrome += uBase * strip * 0.3;
  float kd = max(dot(R, L), 0.0);
  float key = pow(kd, 22.0);
  float keyWide = pow(kd, 5.0);
  float rim = pow(max(dot(R, L2), 0.0), 8.0);

  // Thin film: hue walks with the viewing angle, the height, and the tilt.
  float phase = fres * 2.2 + h * 3.0 + dot(n.xy, tiltv) * 2.5 + t * 0.03 + uSeed * 0.37;
  vec3 holo = film(phase);
  float lum = dot(chrome, vec3(0.299, 0.587, 0.114));
  // The film rides the slopes and the bright side; flat, dim metal stays silver.
  float iridMask = clamp(smoothstep(0.12, 0.6, fres) * (0.25 + 0.75 * sky) + keyWide * 0.9, 0.0, 1.0) * uIrid;
  // Pushed past the palette a touch, so the film reads as colour, not tint.
  vec3 vivid = clamp(mix(vec3(dot(holo, vec3(0.333))), holo, 1.35), 0.0, 1.0);
  vec3 col = mix(chrome, chrome * 0.35 + vivid * (0.28 + lum), clamp(iridMask * 0.9, 0.0, 1.0));

  // Highlights: warm key, film-tinted rim, and a soft warm pool of light that
  // drifts with the tilt — the glow at the heart of the pour.
  col += uShine * key * 1.1;
  col += mix(uShine, holo, 0.5) * keyWide * 0.25;
  col += holo * rim * 0.5 * uIrid;
  // Spectral fringe: a fast rainbow around the rim of each hot highlight, the
  // way a hologram splits white light at the edge of a reflection.
  float kf = pow(kd, 12.0);
  float fringe = smoothstep(0.2, 0.45, kf) * (1.0 - smoothstep(0.5, 0.85, kf));
  vec3 split = clamp(mix(vec3(0.5), film(kf * 2.4 + h * 1.5 + dot(n.xy, tiltv) * 3.0), 1.5), 0.0, 1.0);
  col += (split - 0.35) * fringe * 0.45 * uIrid;
  vec2 hot = uv - tiltv * 0.55;
  col += mix(uShine, uFilmC, 0.35) * exp(-dot(hot, hot) * 2.2) * 0.22 * (0.5 + sky);

  // Veins: where the folds dip lowest the metal opens into dark channels; where
  // the second warp pinches, a thin seam runs along the fold.
  // Veins: a narrow band along the low contour, so the dark reads as gaps
  // between folds rather than holes; plus a thin seam where the second warp
  // pinches. Below the band the metal carries on as a deeper fold.
  float lo = 0.3;
  // Distance to the contour in pattern space, so a vein keeps its width
  // whether the fold is steep or shallow.
  float vd = abs(h - lo) / (slope + 0.25);
  // Tapered by a slow noise so veins swell and pinch out like real seams.
  float vw = (0.003 + 0.04 * uVeins) * (0.25 + 1.1 * noise(q * 0.45 + 11.0));
  float veinLow = (1.0 - smoothstep(vw * 0.3, vw, vd));
  float seam = (1.0 - smoothstep(0.0, 0.004 + 0.02 * uVeins, abs(pinch - 0.3))) * (1.0 - smoothstep(0.32, 0.55, h));
  float vein = clamp(max(veinLow, seam * 0.9) * step(0.001, uVeins), 0.0, 1.0);
  // The lip of each vein catches a hairline of light.
  float lip = smoothstep(0.0, 0.5, vein) * (1.0 - smoothstep(0.5, 1.0, vein));
  col = mix(col, uVein + holo * 0.035, vein);
  col += mix(uShine, holo, 0.6) * lip * 0.25 * (0.35 + keyWide);

  // Sparkles: a scatter of points, brighter and denser in the dark.
  vec2 sg = gl_FragCoord.xy / uRes.y * 140.0;
  vec2 cell = floor(sg);
  float rnd = hash21(cell + uSeed * 13.1);
  vec2 off = vec2(hash21(cell + 7.7), hash21(cell + 3.3)) * 0.6 + 0.2;
  vec2 dp = fract(sg) - off;
  float tw2 = 0.5 + 0.5 * sin(t * (2.0 + rnd * 5.0) + rnd * 40.0);
  float star = (1.0 - smoothstep(0.0, 0.11, length(dp))) + 0.35 * (1.0 - smoothstep(0.0, 0.03, abs(dp.x) * abs(dp.y) * 30.0)) * (1.0 - smoothstep(0.0, 0.45, length(dp)));
  float density = mix(0.985, 0.93, vein);
  col += mix(uShine, holo, 0.4) * star * step(density, rnd) * tw2 * uSparkle * mix(0.6, 1.6, vein);

  // Mercury rings catch the light on their crests.
  col += (uShine * 0.25 + holo * 0.15) * ring;

  // The light that sits under the pointer, as if the foil were catching it.
  float dist = length(uv - m);
  col += mix(uShine, holo, 0.35) * (0.06 / (dist + 0.18)) * 0.25 * uHover * (1.0 - vein * 0.7);

  float vig = (1.0 - smoothstep(0.2, 1.35, length(uv * vec2(0.8, 1.0))));
  col *= mix(1.0, vig, uVignette);

  // Gentle shoulder so the highlights bloom instead of clipping flat.
  col = col / (1.0 + max(col - 1.0, 0.0) * 0.6);

  float gr = hash21(gl_FragCoord.xy + fract(t * 7.13) * vec2(97.3, 41.7));
  col += (gr - 0.5) * 0.05 * uGrain;
  col += (hash21(gl_FragCoord.yx + 13.7) - 0.5) / 255.0;

  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;function s({height:e="100svh",preset:f="opal",colors:h,speed:c=1,flow:m=1,scale:u=1,stretch:d=2.2,angle:p=35,iridescence:v=1,ridges:g=1,veins:x=.5,sparkle:w=1,tilt:y=1,smear:b=1,grain:S=.6,vignette:L=.45,seed:k=0,interactive:A=!0,ripples:R=!0,maxDpr:F=1.25,children:T,className:C=""}){let U=i.useRef(null),E=i.useRef(null),M=i.useRef(()=>{}),B=function(){let[e,t]=i.useState(!1);return i.useEffect(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)"),i=()=>t(e.matches);return i(),e.addEventListener("change",i),()=>e.removeEventListener("change",i)},[]),e}(),[V,q]=i.useState(0),[P,I]=i.useState(!1),D={...o[f]??o.opal,...h},z={base:a(D.base),shine:a(D.shine),vein:a(D.vein),filmA:a(D.filmA),filmB:a(D.filmB),filmC:a(D.filmC),speed:c,flow:m,scale:Math.max(.05,u),stretch:d,angle:p*Math.PI/180,iridescence:v,ridges:g,veins:Math.min(1,Math.max(0,x)),sparkle:w,tilt:y,smear:b,grain:S,vignette:L,seed:k,ripples:R},_=i.useRef(z);_.current=z;let j=JSON.stringify(z);i.useEffect(()=>{M.current()},[j]),i.useEffect(()=>{let e=U.current,t=E.current;if(!e||!t)return;let i=t.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});if(!i)return void I(!0);let o=function(e,t,i){let o=e.createProgram();if(!o)return null;for(let[a,n]of[[e.VERTEX_SHADER,t],[e.FRAGMENT_SHADER,i]]){let t=e.createShader(a);if(!t)return e.deleteProgram(o),null;if(e.shaderSource(t,n),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))return console.error("holo-chrome-flow:",e.getShaderInfoLog(t)),e.deleteShader(t),e.deleteProgram(o),null;e.attachShader(o,t),e.deleteShader(t)}return(e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS))?o:(console.error("holo-chrome-flow:",e.getProgramInfoLog(o)),e.deleteProgram(o),null)}(i,r,l);if(!o)return void I(!0);let a=i.createVertexArray(),n={res:i.getUniformLocation(o,"uRes"),time:i.getUniformLocation(o,"uTime"),rippleTime:i.getUniformLocation(o,"uRippleTime"),mouse:i.getUniformLocation(o,"uMouse"),hover:i.getUniformLocation(o,"uHover"),drag:i.getUniformLocation(o,"uDrag"),base:i.getUniformLocation(o,"uBase"),shine:i.getUniformLocation(o,"uShine"),vein:i.getUniformLocation(o,"uVein"),filmA:i.getUniformLocation(o,"uFilmA"),filmB:i.getUniformLocation(o,"uFilmB"),filmC:i.getUniformLocation(o,"uFilmC"),flow:i.getUniformLocation(o,"uFlow"),scale:i.getUniformLocation(o,"uScale"),stretch:i.getUniformLocation(o,"uStretch"),angle:i.getUniformLocation(o,"uAngle"),irid:i.getUniformLocation(o,"uIrid"),ridges:i.getUniformLocation(o,"uRidges"),veins:i.getUniformLocation(o,"uVeins"),sparkle:i.getUniformLocation(o,"uSparkle"),tilt:i.getUniformLocation(o,"uTilt"),smear:i.getUniformLocation(o,"uSmear"),grain:i.getUniformLocation(o,"uGrain"),vignette:i.getUniformLocation(o,"uVignette"),seed:i.getUniformLocation(o,"uSeed"),ripples:i.getUniformLocation(o,"uRipples")},s=new Float32Array(24),f=0,h={x:.12,y:.1},c={x:.12,y:.1},m={x:0,y:0},u=0,d=0,p=9,v=0,g=0,x=0,w=!0,y=!1,b=e=>{let r,l,f;if(x=0,!B&&g&&e-g<1e3/30){!w||document.hidden||y||(x=requestAnimationFrame(b));return}let S=g?Math.min((e-g)/1e3,.05):.016;g=e,r=Math.min(window.devicePixelRatio||1,Math.max(.5,F)),l=Math.max(1,Math.round(t.clientWidth*r)),f=Math.max(1,Math.round(t.clientHeight*r)),(t.width!==l||t.height!==f)&&(t.width=l,t.height=f);let L=_.current;if(B)c.x=h.x,c.y=h.y,d=u,m.x=0,m.y=0;else{if(v+=S,p+=S*L.speed*.6,0===u){let e=t.width/t.height;h.x=.3*Math.sin(.19*v)*e,h.y=.24*Math.sin(.13*v+1.1)}let e=c.x,i=c.y,o=1-Math.exp(-S*(u?6:1.2));c.x+=(h.x-c.x)*o,c.y+=(h.y-c.y)*o,d+=(u-d)*(1-Math.exp(-(3*S)));let a=1/Math.max(S,.001),n=u?(c.x-e)*a:0,r=u?(c.y-i)*a:0,l=Math.hypot(n,r),s=l>1.6?1.6/l:1,f=1-Math.exp(-(3.5*S));m.x+=(n*s-m.x)*f,m.y+=(r*s-m.y)*f}i.viewport(0,0,t.width,t.height),i.useProgram(o),i.bindVertexArray(a),i.uniform2f(n.res,t.width,t.height),i.uniform1f(n.time,p),i.uniform1f(n.rippleTime,v),i.uniform2f(n.mouse,c.x,c.y),i.uniform1f(n.hover,d),i.uniform2f(n.drag,m.x,m.y),i.uniform3fv(n.base,L.base),i.uniform3fv(n.shine,L.shine),i.uniform3fv(n.vein,L.vein),i.uniform3fv(n.filmA,L.filmA),i.uniform3fv(n.filmB,L.filmB),i.uniform3fv(n.filmC,L.filmC),i.uniform1f(n.flow,L.flow),i.uniform1f(n.scale,L.scale),i.uniform1f(n.stretch,L.stretch),i.uniform1f(n.angle,L.angle),i.uniform1f(n.irid,L.iridescence),i.uniform1f(n.ridges,L.ridges),i.uniform1f(n.veins,L.veins),i.uniform1f(n.sparkle,L.sparkle),i.uniform1f(n.tilt,L.tilt),i.uniform1f(n.smear,L.smear),i.uniform1f(n.grain,L.grain),i.uniform1f(n.vignette,L.vignette),i.uniform1f(n.seed,L.seed),i.uniform4fv(n.ripples,s),i.drawArrays(i.TRIANGLES,0,3),i.bindVertexArray(null),B||!w||document.hidden||y||(x=requestAnimationFrame(b))},S=()=>{x||!w||document.hidden||y||(x=requestAnimationFrame(b))};M.current=S,S();let L=new ResizeObserver(S);L.observe(t);let k=new IntersectionObserver(([e])=>{(w=e.isIntersecting)&&(g=0,S())});k.observe(e);let R=t=>{let i=e.getBoundingClientRect(),o=i.height||1;return{x:(t.clientX-i.left-i.width/2)/o,y:-(t.clientY-i.top-i.height/2)/o}},T=e=>{if(!A)return;let t=R(e);h.x=t.x,h.y=t.y,u=1,B&&S()},C=()=>{u=0,B&&S()},V=e=>{if(!A||e.target?.closest?.('a,button,input,textarea,select,[role="dialog"]')||(T(e),B||!_.current.ripples))return;let t=R(e),i=f++%6*4;s[i]=t.x,s[i+1]=t.y,s[i+2]=v,s[i+3]=1},P=window.setInterval(()=>{for(let e=0;e<6;e++)s[4*e+3]>0&&Math.abs(v-s[4*e+2])>4&&(s[4*e+3]=0)},1e3),D=e=>{e.preventDefault(),y=!0,cancelAnimationFrame(x),x=0},z=()=>q(e=>e+1),j=()=>{document.hidden?(cancelAnimationFrame(x),x=0):(g=0,S())};return document.addEventListener("visibilitychange",j),window.addEventListener("pointermove",T,{passive:!0}),window.addEventListener("pointerdown",V,{passive:!0}),document.addEventListener("pointerleave",C),window.addEventListener("blur",C),t.addEventListener("webglcontextlost",D),t.addEventListener("webglcontextrestored",z),()=>{cancelAnimationFrame(x),document.removeEventListener("visibilitychange",j),M.current=()=>{},window.clearInterval(P),L.disconnect(),k.disconnect(),window.removeEventListener("pointermove",T),window.removeEventListener("pointerdown",V),document.removeEventListener("pointerleave",C),window.removeEventListener("blur",C),t.removeEventListener("webglcontextlost",D),t.removeEventListener("webglcontextrestored",z),i.deleteProgram(o),i.deleteVertexArray(a)}},[A,B,V,F]);let N=n(D.base,"#b7b9cf"),H=n(D.vein,"#07070e");return(0,t.jsxs)("div",{ref:U,className:"relative w-full overflow-hidden holo-chrome "+C,style:{height:e,background:H},children:[P?(0,t.jsx)("div",{"aria-hidden":"true",className:"absolute inset-0",style:{background:"radial-gradient(ellipse 45% 30% at 35% 40%, "+n(D.shine,"#fff4e4")+"cc, transparent 70%), linear-gradient(125deg, transparent 20%, "+n(D.filmA,"#ff6fd8")+"55 35%, transparent 45%, "+n(D.filmB,"#59e8ff")+"55 60%, transparent 70%, "+n(D.filmC,"#ffc896")+"44 85%, transparent 95%), repeating-linear-gradient(35deg, "+N+" 0 38px, "+H+" 46px, "+N+" 60px), "+N}}):(0,t.jsx)("canvas",{ref:E,"aria-hidden":"true",className:"absolute inset-0 block h-full w-full"}),null!=T&&(0,t.jsx)("div",{className:"relative z-10 h-full w-full",children:T})]})}e.s(["default",0,function(){let[e,o]=(0,i.useState)(!0);return(0,i.useEffect)(()=>{let e=window.matchMedia("(max-width: 767px), (pointer: coarse)"),t=()=>o(e.matches);return t(),e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]),(0,t.jsxs)("div",{className:"chrome-background","aria-hidden":"true",children:[(0,t.jsx)(s,{preset:"noir",speed:e?.22:.32,flow:.8,scale:.85,ridges:.55,sparkle:.25,grain:.2,tilt:.5,smear:.3,iridescence:.7,maxDpr:e?.65:1,interactive:!e}),(0,t.jsx)("div",{className:"background-scrim"})]})}],35717)},81215,e=>{e.n(e.i(35717))}]);