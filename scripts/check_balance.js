const fs = require('fs');
const path = process.argv[2];
if(!path) { console.error('Usage: node check_balance.js <file>'); process.exit(1); }
const s = fs.readFileSync(path,'utf8');
let parenStack=[], braceStack=[];
let inS=false,inD=false,inB=false,inLine=false,inBlock=false;
for(let i=0;i<s.length;i++){
  const ch=s[i];
  const prev=s[i-1];
  if(inLine){ if(ch==='\n') inLine=false; continue; }
  if(inBlock){ if(prev==='*' && ch==='/') inBlock=false; continue; }
  if(!inS && !inD && !inB && ch==='/' && s[i+1]==='/'){ inLine=true; continue; }
  if(!inS && !inD && !inB && ch==='/' && s[i+1]==='*'){ inBlock=true; i++; continue; }
  if(!inD && !inB && ch==="'"){ inS = !inS; continue; }
  if(!inS && !inB && ch==='"'){ inD = !inD; continue; }
  if(!inS && !inD && ch==='`'){ inB = !inB; continue; }
  if(!inS && !inD && !inB && !inLine && !inBlock){
    if(ch==='(') parenStack.push(i);
    if(ch===')') { if(parenStack.length) parenStack.pop(); else parenStack.push(-i); }
    if(ch==='{') braceStack.push(i);
    if(ch==='}') { if(braceStack.length) braceStack.pop(); else braceStack.push(-i); }
  }
}
console.log('parenStackLen',parenStack.length,'braceStackLen',braceStack.length);
if(parenStack.length) console.log('firstUnmatchedParenIndex',parenStack[0], 'context:\n', s.slice(Math.max(0,parenStack[0]-80), Math.min(s.length,parenStack[0]+80)));
if(braceStack.length) console.log('firstUnmatchedBraceIndex',braceStack[0], 'context:\n', s.slice(Math.max(0,braceStack[0]-80), Math.min(s.length,braceStack[0]+80)));
console.log('Done');
