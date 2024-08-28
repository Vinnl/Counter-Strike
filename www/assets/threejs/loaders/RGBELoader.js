import{DataTextureLoader as e,DataUtils as t,FloatType as r,HalfFloatType as a,LinearFilter as o,LinearSRGBColorSpace as n}from"three";class RGBELoader extends e{constructor(e){super(e),this.type=a}parse(e){let o=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},n=function(e,t,r){t=t||1024;let a=e.pos,o=-1,n=0,s="",i=String.fromCharCode.apply(null,new Uint16Array(e.subarray(a,a+128)));for(;0>(o=i.indexOf("\n"))&&n<t&&a<e.byteLength;)s+=i,n+=i.length,a+=128,i+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(a,a+128)));return -1<o&&(!1!==r&&(e.pos+=n+o+1),s+i.slice(0,o))},s=new Uint8Array(e);s.pos=0;let i=function(e){let t=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,r=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,a=/^\s*FORMAT=(\S+)\s*$/,s=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,i={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},l,h;for(!(e.pos>=e.byteLength)&&(l=n(e))||o(1,"no header found"),(h=l.match(/^#\?(\S+)/))||o(3,"bad initial token"),i.valid|=1,i.programtype=h[1],i.string+=l+"\n";!1!==(l=n(e));){if(i.string+=l+"\n","#"===l.charAt(0)){i.comments+=l+"\n";continue}if((h=l.match(t))&&(i.gamma=parseFloat(h[1])),(h=l.match(r))&&(i.exposure=parseFloat(h[1])),(h=l.match(a))&&(i.valid|=2,i.format=h[1]),(h=l.match(s))&&(i.valid|=4,i.height=parseInt(h[1],10),i.width=parseInt(h[2],10)),2&i.valid&&4&i.valid)break}return 2&i.valid||o(3,"missing format specifier"),4&i.valid||o(3,"missing image size specifier"),i}(s),l=i.width,h=i.height,d=function(e,t,r){let a=t;if(a<8||a>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);a!==(e[2]<<8|e[3])&&o(3,"wrong scanline width");let n=new Uint8Array(4*t*r);n.length||o(4,"unable to allocate buffer space");let s=0,i=0,l=4*a,h=new Uint8Array(4),d=new Uint8Array(l),$=r;for(;$>0&&i<e.byteLength;){i+4>e.byteLength&&o(1),h[0]=e[i++],h[1]=e[i++],h[2]=e[i++],h[3]=e[i++],(2!=h[0]||2!=h[1]||(h[2]<<8|h[3])!=a)&&o(3,"bad rgbe scanline format");let f=0,p;for(;f<l&&i<e.byteLength;){p=e[i++];let c=p>128;if(c&&(p-=128),(0===p||f+p>l)&&o(3,"bad scanline data"),c){let m=e[i++];for(let _=0;_<p;_++)d[f++]=m}else d.set(e.subarray(i,i+p),f),f+=p,i+=p}let u=a;for(let g=0;g<u;g++){let w=0;n[s]=d[g+w],w+=a,n[s+1]=d[g+w],w+=a,n[s+2]=d[g+w],w+=a,n[s+3]=d[g+w],s+=4}$--}return n}(s.subarray(s.pos),l,h),$,f,p;switch(this.type){case r:p=d.length/4;let c=new Float32Array(4*p);for(let m=0;m<p;m++)!function(e,t,r,a){let o=e[t+3],n=Math.pow(2,o-128)/255;r[a+0]=e[t+0]*n,r[a+1]=e[t+1]*n,r[a+2]=e[t+2]*n,r[a+3]=1}(d,4*m,c,4*m);$=c,f=r;break;case a:p=d.length/4;let _=new Uint16Array(4*p);for(let u=0;u<p;u++)!function(e,r,a,o){let n=e[r+3],s=Math.pow(2,n-128)/255;a[o+0]=t.toHalfFloat(Math.min(e[r+0]*s,65504)),a[o+1]=t.toHalfFloat(Math.min(e[r+1]*s,65504)),a[o+2]=t.toHalfFloat(Math.min(e[r+2]*s,65504)),a[o+3]=t.toHalfFloat(1)}(d,4*u,_,4*u);$=_,f=a;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:l,height:h,data:$,header:i.string,gamma:i.gamma,exposure:i.exposure,type:f}}setDataType(e){return this.type=e,this}load(e,t,s,i){return super.load(e,function e(s,i){switch(s.type){case r:case a:s.colorSpace=n,s.minFilter=o,s.magFilter=o,s.generateMipmaps=!1,s.flipY=!0}t&&t(s,i)},s,i)}}export{RGBELoader};