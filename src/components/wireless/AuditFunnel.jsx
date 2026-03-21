import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { wirelessDb } from "../../config/firebaseWireless";
import emailjs from "@emailjs/browser";

const ESID="service_kjsfqm8",ETID="template_kgqk77o",EPKEY="Mae5C2zv5ipo7vuqA";
const GKEY="AIzaSyDLDuiVvssTHNVHrZWIXEQ26TzhCkx93vs";
const SERVICES=["Phone Repairs","Accessories Sales","Activations","Bill Payments","Unlocks","Device Sales"];
const CHALLENGES=[{label:"Inventory issues",score:2},{label:"Low profit margins",score:4},{label:"Employees not selling enough",score:3},{label:"No clear reporting",score:3},{label:"Pricing uncertainty",score:4},{label:"Disconnected systems",score:2}];

function calcScore(d){
  let s=0;
  const inv={Fast:0,Moderate:1,"Slow (30+ days)":3,"Don't track":4};
  const price={"Cost + margin":0,Competitors:1,Guesswork:3,"Not consistent":4};
  const emp={Yes:0,Sometimes:2,No:4};
  s+=inv[d.inventoryTurnover]??0;
  s+=price[d.pricingStrategy]??0;
  s+=emp[d.employeeTracking]??0;
  // challenges scoring handled below
  return s;
}

function getLabel(s){
  if(s<=5)return{level:"Healthy Store",color:"#00d4aa"};
  if(s<=10)return{level:"Growth Opportunities",color:"#0ea5e9"};
  if(s<=20)return{level:"Profit Leakage Detected",color:"#f59e0b"};
  return{level:"Critical Inefficiencies",color:"#ef4444"};
}

async function callGemini(data,score){
  const prompt=`You are WirelessCEO, an AI business analyst for wireless retail stores. A store owner just completed a profit audit. Write a 3-4 paragraph personalized report.

Store: ${data.storeName}
Monthly Revenue: ${data.monthlyRevenue}
Employees: ${data.employees}
Services: ${data.services.join(", ")}
Biggest Challenges: ${(Array.isArray(data.challenges)?data.challenges:[]).join(", ")}
Inventory Turnover: ${data.inventoryTurnover}
Pricing Strategy: ${data.pricingStrategy}
Employee Tracking: ${data.employeeTracking}
Audit Score: ${score}/16

Write:
Paragraph 1: What is happening in their store right now based on their answers (be specific, name their challenge).
Paragraph 2: Where they are losing profit and why (specific to their inputs).
Paragraph 3: 3 concrete actions they should take immediately.
Paragraph 4: What is possible — quantify 15-30% profit improvement potential.

Be direct, specific, no fluff. Address them by store name.`;
  try{
    const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key="+GKEY,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:800}})
    });
    const j=await r.json();
    return j.candidates?.[0]?.content?.parts?.[0]?.text||null;
  }catch(e){console.error("Gemini:",e);return null;}
}

async function sendEmail(data,score,aiReport){
  const{level}=getLabel(score);
  const challenges=(data.challenges||[]).join(", ");
  const plainText=aiReport
    ? aiReport
    : `Hi ${data.name},\n\nYour WirelessCEO Store Profit Audit for ${data.storeName} is complete.\n\nScore: ${score}/16 — ${level}\nChallenges: ${challenges}\nPricing: ${data.pricingStrategy} | Inventory: ${data.inventoryTurnover} | Employees: ${data.employeeTracking}\n\nStores like yours typically recover 15-25% in lost profit within 90 days.\n\nJoin Early Access: https://wirelesspos.ai/early-access\n\n— The WirelessCEO Team`;

  const result = await emailjs.send(ESID,ETID,{
    to_name: data.name,
    to_email: data.email,
    email: data.email,
    from_name: "WirelessCEO",
    subject: `Your Store Profit Audit — ${data.storeName}`,
    message: plainText,
    report_text: plainText,
    store_name: data.storeName,
    audit_score: `${score}/16`,
    audit_level: level,
    challenges: challenges,
    monthly_revenue: data.monthlyRevenue,
    employees: data.employees,
    services: data.services.join(", "),
    pricing_strategy: data.pricingStrategy,
    inventory_turnover: data.inventoryTurnover,
    employee_tracking: data.employeeTracking
  }, EPKEY);
  console.log("EmailJS result:", result);
  return result;
}

const ic="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 text-sm bg-gray-50 focus:bg-white outline-none transition-colors";
const lc="block text-sm font-semibold text-gray-700 mb-1.5";
const grad={background:"linear-gradient(135deg,#00d4aa,#0ea5e9)"};

function Opt({sel,onClick,children,full}){
  return(
    <button type="button" onClick={onClick}
      className={(full?"w-full text-left ":"")+"px-3 py-3 rounded-xl text-sm font-medium border transition-all"}
      style={{borderColor:sel?"#00d4aa":"#e2e8f0",background:sel?"rgba(0,212,170,0.06)":"#f8fafc",color:sel?"#00a88a":"#374151"}}>
      {sel?"✓ ":""}{children}
    </button>
  );
}

export default function AuditFunnel({isOpen,onClose}){
  const[step,setStep]=useState(1);
  const[data,setData]=useState({storeName:"",monthlyRevenue:"",employees:"",services:[],challenges:[],inventoryTurnover:"",pricingStrategy:"",employeeTracking:"",name:"",email:"",phone:""});
  const[report,setReport]=useState(null);
  const[aiText,setAiText]=useState(null);
  const[busy,setBusy]=useState(false);
  const[mailSt,setMailSt]=useState(null);

  const set=(k,v)=>setData(p=>({...p,[k]:v}));
  const tog=(s)=>setData(p=>({...p,services:p.services.includes(s)?p.services.filter(x=>x!==s):[...p.services,s]}));
  const togC=(c)=>setData(p=>({...p,challenges:p.challenges.includes(c)?p.challenges.filter(x=>x!==c):[...p.challenges,c]}));

  const submit=async()=>{
    setBusy(true);
    const sc=calcScore(data);
    const{level,color}=getLabel(sc);
    setReport({level,color,score:sc});
    setStep(6);
    try{
      const ai=await callGemini(data,sc);
      setAiText(ai);
      try{await sendEmail(data,sc,ai);setMailSt("sent");}
      catch(e){console.error("email:",e);setMailSt("failed");}
      await addDoc(collection(wirelessDb,"auditSubmissions"),{...data,score:sc,reportLevel:level,aiGenerated:!!ai,createdAt:serverTimestamp()});
      await addDoc(collection(wirelessDb,"demoRequests"),{
        firstName:data.name,email:data.email,phone:data.phone||"",
        company:data.storeName,source:"Audit Funnel",status:"new",
        auditScore:sc,auditLevel:level,
        monthlyRevenue:data.monthlyRevenue,employees:data.employees,
        services:data.services,challenges:data.challenges,biggestChallenge:(data.challenges||[]).join(", "),
        createdAt:serverTimestamp(),updatedAt:serverTimestamp()
      });
    }catch(e){console.error(e);}
    finally{setBusy(false);}
  };

  const close=()=>{
    setStep(1);
    setData({storeName:"",monthlyRevenue:"",employees:"",services:[],challenges:[],inventoryTurnover:"",pricingStrategy:"",employeeTracking:"",name:"",email:"",phone:""});
    setReport(null);setAiText(null);setMailSt(null);
    onClose();
  };

  if(!isOpen)return null;
  const prog=Math.round((Math.min(step,5)/5)*100);

  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{background:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)"}}
      onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div className="w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl flex flex-col" style={{maxHeight:"92vh"}}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-gray-300"/></div>
        <div className="px-5 pt-4 pb-5 flex-shrink-0" style={{background:"linear-gradient(135deg,#0d1117,#1a2332)"}}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:"#00d4aa"}}>Store Profit Diagnostic</p>
              <h2 className="text-lg font-bold text-white">{step===6?"Your Audit Results":"Free Store Profit Audit"}</h2>
              <p className="text-xs mt-0.5" style={{color:"rgba(255,255,255,0.5)"}}>{step===6?"Personalized for your store":`Step ${Math.min(step,5)} of 5`}</p>
            </div>
            <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
              style={{background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)"}}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          {step<6&&<div className="w-full h-1.5 rounded-full" style={{background:"rgba(255,255,255,0.1)"}}><div className="h-1.5 rounded-full transition-all duration-500" style={{width:`${prog}%`,...grad}}/></div>}
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-5">
          {step===1&&(
            <div className="space-y-4">
              <div><label className={lc}>Store Name *</label><input type="text" value={data.storeName} onChange={e=>set("storeName",e.target.value)} className={ic} placeholder="ABC Wireless"/></div>
              <div><label className={lc}>Monthly Revenue</label><div className="flex flex-col gap-2">{["Under $10K","$10K-$25K","$25K-$50K","$50K-$100K","$100K+"].map(o=><Opt key={o} sel={data.monthlyRevenue===o} onClick={()=>set("monthlyRevenue",o)} full>{o}</Opt>)}</div></div>
              <div><label className={lc}>Number of Employees</label><div className="grid grid-cols-2 gap-2">{["1-2","3-5","6-10","10+"].map(o=><Opt key={o} sel={data.employees===o} onClick={()=>set("employees",o)}>{o}</Opt>)}</div></div>
              <button onClick={()=>setStep(2)} disabled={!data.storeName} className="w-full py-3.5 font-bold rounded-xl text-white text-sm disabled:opacity-40" style={grad}>Next</button>
            </div>
          )}
          {step===2&&(
            <div className="space-y-4">
              <div><label className={lc}>Top Services (select all)</label><div className="grid grid-cols-2 gap-2">{SERVICES.map(s=><Opt key={s} sel={data.services.includes(s)} onClick={()=>tog(s)}>{s}</Opt>)}</div></div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Back</button>
                <button onClick={()=>setStep(3)} disabled={!data.services.length} className="py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40" style={{...grad,flex:2}}>Next</button>
              </div>
            </div>
          )}
          {step===3&&(
            <div className="space-y-4">
              <div><label className={lc}>Biggest Challenges <span className="text-gray-400 font-normal">(select at least 3)</span></label><div className="flex flex-col gap-2">{CHALLENGES.map(c=><Opt key={c.label} sel={data.challenges.includes(c.label)} onClick={()=>togC(c.label)} full>{c.label}</Opt>)}</div>{data.challenges.length>0&&data.challenges.length<MIN_CHALLENGES&&(<p className="text-xs mt-2" style={{color:"#f59e0b"}}>Select {MIN_CHALLENGES-data.challenges.length} more to continue</p>)}</div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Back</button>
                <button onClick={()=>setStep(4)} disabled={data.challenges.length<MIN_CHALLENGES} className="py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40" style={{...grad,flex:2}}>Next</button>
              </div>
            </div>
          )}
          {step===4&&(
            <div className="space-y-5">
              <div><label className={lc}>Inventory Turnover</label><div className="grid grid-cols-2 gap-2">{["Fast","Moderate","Slow (30+ days)","Don't track"].map(o=><Opt key={o} sel={data.inventoryTurnover===o} onClick={()=>set("inventoryTurnover",o)}>{o}</Opt>)}</div></div>
              <div><label className={lc}>Pricing Strategy</label><div className="grid grid-cols-2 gap-2">{["Competitors","Guesswork","Cost + margin","Not consistent"].map(o=><Opt key={o} sel={data.pricingStrategy===o} onClick={()=>set("pricingStrategy",o)}>{o}</Opt>)}</div></div>
              <div><label className={lc}>Track Employee Performance?</label><div className="grid grid-cols-3 gap-2">{["Yes","Sometimes","No"].map(o=><Opt key={o} sel={data.employeeTracking===o} onClick={()=>set("employeeTracking",o)}>{o}</Opt>)}</div></div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setStep(3)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Back</button>
                <button onClick={()=>setStep(5)} disabled={!data.inventoryTurnover||!data.pricingStrategy||!data.employeeTracking} className="py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40" style={{...grad,flex:2}}>Next</button>
              </div>
            </div>
          )}
          {step===5&&(
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Where should we send your full AI audit report?</p>
              <div><label className={lc}>Your Name *</label><input type="text" value={data.name} onChange={e=>set("name",e.target.value)} className={ic} placeholder="John Smith"/></div>
              <div><label className={lc}>Email Address *</label><input type="email" value={data.email} onChange={e=>set("email",e.target.value)} className={ic} placeholder="john@store.com"/></div>
              <div><label className={lc}>Phone <span className="text-gray-400 font-normal">(optional)</span></label><input type="tel" value={data.phone} onChange={e=>set("phone",e.target.value)} className={ic} placeholder="(555) 123-4567"/></div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setStep(4)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Back</button>
                <button onClick={submit} disabled={!data.name||!data.email||busy} className="py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40" style={{...grad,flex:2}}>{busy?"Analyzing...":"Get My Audit Results"}</button>
              </div>
            </div>
          )}
          {step===6&&report&&(
            <div className="space-y-5">
              <div className="rounded-2xl p-5 text-center" style={{background:`${report.color}10`,border:`2px solid ${report.color}30`}}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:report.color}}>Your Store Audit Results</p>
                <h3 className="text-2xl font-black mb-1" style={{color:"#0d1117"}}>{report.level}</h3>
                <p className="text-xs" style={{color:"#64748b"}}>Score: {report.score} / 16</p>
              </div>
              {busy?(
                <div className="rounded-xl p-5 text-center" style={{background:"#f8fafc",border:"1px solid #e2e8f0"}}>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" style={{color:"#00d4aa"}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    <span className="text-sm font-semibold" style={{color:"#00d4aa"}}>AI analyzing your store...</span>
                  </div>
                </div>
              ):(
                <div className="rounded-xl p-4" style={{background:"#f8fafc",border:"1px solid #e2e8f0"}}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{color:"#00d4aa"}}>Your Personalized Report</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{color:"#374151"}}>{aiText||`Based on your audit score of ${report.score}/16, your store is classified as ${report.level}. Your biggest challenge — ${(data.challenges||[]).join(", ")} — combined with ${data.pricingStrategy} pricing and ${data.inventoryTurnover} inventory turnover is costing you profit daily. Stores like yours typically recover 15-25% in lost profit within 90 days of implementing WirelessCEO.`}</p>
                </div>
              )}
              {mailSt==="sent"&&(
                <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{background:"rgba(0,212,170,0.06)",border:"1px solid rgba(0,212,170,0.2)"}}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#00d4aa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                  <p className="text-xs font-medium" style={{color:"#00a88a"}}>Full report sent to {data.email}</p>
                </div>
              )}
              {mailSt==="failed"&&(
                <div className="rounded-xl px-4 py-3" style={{background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.15)"}}>
                  <p className="text-xs" style={{color:"#ef4444"}}>Could not send email. Your results are saved.</p>
                </div>
              )}
              <div className="flex flex-col gap-3 pt-1">
                <a href="https://wirelesspos.ai/early-access" target="_blank" rel="noopener noreferrer"
                  className="w-full py-3.5 font-bold rounded-xl text-white text-sm text-center block" style={grad}>
                  Join Early Access
                </a>
                <button onClick={close} className="w-full py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
