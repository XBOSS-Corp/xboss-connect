import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const ids=['payslip-xlsx','register-xlsx','invoice-issue','invoice-cancel','cash-receipt'];
const job='job_01ARZ3NDEKTSV4RRFFQ69G5FAV';
const run=(code,input,ref={},index=0)=>new Function('$input','$','$runIndex',code)({first:()=>({json:input})},()=>({first:()=>({json:ref})}),index);
for(const id of ids){
 const w=JSON.parse(await readFile(new URL('../examples/n8n/'+id+'.json',import.meta.url),'utf8'));
 const find=n=>w.nodes.find(x=>x.name===n);
 const code=n=>find(n).parameters.jsCode;
 const input=()=>run(code('Task inputs'))[0].json;
 test(id+': no secrets, pin data, auto trigger, or automatic submission retry',()=>{
  assert.equal(w.active,false);assert.deepEqual(w.pinData,{});
  assert.ok(w.nodes.every(n=>!n.credentials));
  assert.equal(w.nodes.filter(n=>n.type.endsWith('Trigger')).length,1);
  for(const n of w.nodes.filter(n=>n.type.endsWith('httpRequest'))){assert.equal(n.retryOnFail,false);assert.equal(n.parameters.genericAuthType,'httpBasicAuth');assert.equal(n.parameters.options.redirect.redirect.followRedirects,false);}
  assert.equal(w.settings.saveDataSuccessExecution,'none');assert.equal(w.settings.saveDataErrorExecution,'none');
 });
 test(id+': default input cannot submit',()=>assert.throws(()=>run(code('Validate inputs'),input()),/business_key/));
 test(id+': recovery bypasses submission and only uses a validated job id',()=>{
  const x=run(code('Validate inputs'),{...input(),resume_job_id:job})[0].json;
  assert.equal(x.resume,true);assert.equal(x.job_id,job);assert.equal(x.body,undefined);
  assert.equal(w.connections['Resume existing job'].main[0][0].node,'Keep job reference');
  assert.throws(()=>run(code('Validate inputs'),{...input(),resume_job_id:'../other'}),/Invalid/);
 });
 test(id+': explicit input review is mandatory',()=>assert.throws(()=>run(code('Validate inputs'),{...input(),business_key:'task-001'}),/Review inputs/));
 test(id+': missing submit id stops rather than resubmitting',()=>assert.throws(()=>run(code('Keep job reference'),{}),/No valid job_id/));
 test(id+': failed, unknown and mismatched jobs cannot become successful',()=>{
  for(const status of ['FAILED','TIMEOUT','CANCELED','UNRECOGNIZED'])assert.throws(()=>run(code('Check job status'),{job_id:job,status},{job_id:job}));
  assert.throws(()=>run(code('Check job status'),{job_id:'wrong',status:'SUCCEEDED'},{job_id:job}),/Mismatched/);
 });
 test(id+': polling is bounded and successful completion still returns results',()=>{
  assert.throws(()=>run(code('Check job status'),{job_id:job,status:'RUNNING'},{job_id:job},59),/Polling limit/);
  assert.equal(run(code('Check job status'),{job_id:job,status:'SUCCEEDED'},{job_id:job},59)[0].json.status,'SUCCEEDED');
  assert.equal(w.connections.Completed.main[0][0].node,'Get task result');
  assert.equal(w.connections['Wait before polling'].main[0][0].node,'Read job status');
 });
 test(id+': graph references exist',()=>{const names=new Set(w.nodes.map(n=>n.name));for(const [from,c]of Object.entries(w.connections)){assert.ok(names.has(from));for(const branch of c.main)for(const e of branch)assert.ok(names.has(e.node));}});
 if(id.startsWith('invoice')||id==='cash-receipt')test(id+': writes require confirmation',()=>{
  const x=input();for(const k of Object.keys(x.params))x.params[k]='example';x.params.confirm=false;x.business_key='task-001';x.reviewed=true;x.account_link_id='link_example';
  assert.throws(()=>run(code('Validate inputs'),x),/Obtain user consent/);
 });
}
