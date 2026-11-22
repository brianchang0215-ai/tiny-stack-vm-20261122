import{readdirSync,readFileSync,writeFileSync,mkdirSync}from"node:fs";
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
const PO=[0,0,0,1,1,2,2,3],PU=[0,1,1,0,2,2,3,3];
function run(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),out=new Uint8Array(65536),tmp=new Uint8Array(11);
 let sp=0,cp=0,pc=0,st=0,ip=0,ol=0,a=0,b=0,v=0,addr=0;
 const n=p.length,R=c=>[c,out.slice(0,ol)];
 for(;;){
  if(st===1e6)return R(10);
  if(pc<0||pc>=n)return R(9);
  const op=p[pc];
  if((op>7&&op<16)||op===31||(op>34&&op<48)||(op>52&&op<64)||(op>65&&op<80)||op>83)return R(5);
  const m=op===1?1:op===2?4:op>=48&&op<=51?2:0;
  if(pc+m>=n)return R(9);
  st++;
  const pops=op<8?PO[op]:op<31?(op===23||op===27?1:2):op>=32&&op<=34?2:op===49||op===50||op===64||op===80||op===81||op===83?1:op===65?2:0;
  const push=op<8?PU[op]:op<31||op>=32&&op<=34||op===64||op===82?1:0;
  if(sp<pops)return R(2);
  if(sp-pops+push>256)return R(3);
  const nx=pc+1+m;
  pc=nx;
  if(op===23){D[sp-1]=-D[sp-1]|0;continue}
  if(op===27){D[sp-1]=~D[sp-1];continue}
  if((op>=16&&op<=30)||(op>=32&&op<=34)){
   b=D[sp-1];a=D[sp-2];let r=0;
   if(op===16)r=(a+b)|0;
   else if(op===17)r=(a-b)|0;
   else if(op===18)r=Math.imul(a,b);
   else if(op===19){if(!b)return R(4);r=a===-2147483648&&b===-1?a:(a/b)|0}
   else if(op===20){if(!b)return R(4);r=b===-1?0:a%b|0}
   else if(op===21){if(!b)return R(4);r=Math.floor((a>>>0)/(b>>>0))|0}
   else if(op===22){if(!b)return R(4);r=(a>>>0)%(b>>>0)|0}
   else if(op===24)r=a&b;
   else if(op===25)r=a|b;
   else if(op===26)r=a^b;
   else if(op===28)r=a<<(b&31);
   else if(op===29)r=a>>(b&31);
   else if(op===30)r=(a>>>(b&31))|0;
   else if(op===32)r=a===b?1:0;
   else if(op===33)r=a<b?1:0;
   else r=(a>>>0)<(b>>>0)?1:0;
   sp-=2;D[sp++]=r;continue;
  }
  switch(op){
   case 0:return R(0);
   case 1:D[sp++]=(p[nx-1]<<24)>>24;break;
   case 2:D[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:sp--;break;
   case 4:D[sp]=D[sp-1];sp++;break;
   case 5:v=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=v;break;
   case 6:D[sp]=D[sp-2];sp++;break;
   case 7:a=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=a;break;
   case 48:pc=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);break;
   case 49:v=D[--sp];if(!v)pc=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);break;
   case 50:v=D[--sp];if(v)pc=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);break;
   case 51:if(cp===64)return R(7);C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
   case 52:if(!cp)return R(8);pc=C[--cp];break;
   case 64:addr=D[sp-1];if(addr<0||addr>255)return R(6);D[sp-1]=M[addr];break;
   case 65:addr=D[sp-1];v=D[sp-2];if(addr<0||addr>255)return R(6);sp-=2;M[addr]=v;break;
   case 80:{
    v=D[sp-1];let u=v<0?-v:v,i=11;
    if(!u)tmp[--i]=48;else while(u){tmp[--i]=48+u%10;u=Math.floor(u/10)}
    if(v<0)tmp[--i]=45;
    const len=11-i;
    if(ol+len>65536)return R(11);
    out.set(tmp.subarray(i),ol);ol+=len;sp--;break;
   }
   case 81:if(ol>=65536)return R(11);out[ol++]=D[--sp]&255;break;
   case 82:D[sp++]=ip<q.length?q[ip++]:-1;break;
   case 83:return R(D[--sp]&255);
  }
 }
}
for(const id of readdirSync(I).sort()){
 const r=run(new Uint8Array(readFileSync(`${I}/${id}/program.bin`)),new Uint8Array(readFileSync(`${I}/${id}/input.bin`)));
 mkdirSync(`${O}/${id}`,{recursive:true});
 writeFileSync(`${O}/${id}/stdout.bin`,r[1]);
 writeFileSync(`${O}/${id}/exit.txt`,r[0]+"\n");
}
