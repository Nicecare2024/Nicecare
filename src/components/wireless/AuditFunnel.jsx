import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { wirelessDb } from "../../config/firebaseWireless";
import emailjs from "@emailjs/browser";

const ESID=import.meta.env.VITE_EMAILJS_SERVICE_ID;
const ETID=import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EPKEY=import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const GROQ_KEY=import.meta.env.VITE_GROQ_API_KEY;
const SERVICES=["Phone Repairs","Accessories Sales","Activations","Bill Payments","Unlocks","Device Sales"];
const CHALLENGES=["Inventory issues","Low profit margins","Employees not selling enough","No clear reporting","Pricing uncertainty","Disconnected systems"];

function calcScore(d){
  const inv={Fast:0,Moderate:1,"Slow (30+ days)":3,"Don't track":4};
  const price={"Cost + margin":0,Competitors:1,Guesswork:3,"Not consistent":4};
  const emp={Yes:0,Sometimes:2,No:4};
  return (inv[d.inventoryTurnover]??0)+(price[d.pricingStrategy]??0)+(emp[d.employeeTracking]??0);
}

function getLabel(s){
  if(s<=3) return{level:"Healthy Store",color:"#00d4aa",emoji:"✅"};
  if(s<=6) return{level:"Growth Opportunities",color:"#0ea5e9",emoji:"📈"};
  if(s<=9) return{level:"Profit Leakage Detected",color:"#f59e0b",emoji:"⚠️"};
  return{level:"Critical Inefficiencies",color:"#ef4444",emoji:"🚨"};
}

const REV_MAP={"Under $10K":7500,"$10K-$25K":17500,"$25K-$50K":37500,"$50K-$100K":75000,"$100K+":120000};

function getDollarEstimates(score,monthlyRevenue){
  const mid=REV_MAP[monthlyRevenue]||20000;
  const leakPct=score<=3?0.05:score<=6?0.12:score<=9?0.20:0.28;
  const leakDollar=Math.round((mid*leakPct)/100)*100;
  const recoverDollar=Math.round(leakDollar*0.70/100)*100;
  return{mid,leakDollar,recoverDollar};
}

// Strong local report — fires when Gemini is unavailable
function buildLocalReport(data,score){
  const{leakDollar,recoverDollar}=getDollarEstimates(score,data.monthlyRevenue);
  const topServices=data.services.slice(0,2).join(" and ");
  const topChallenges=(data.challenges||[]).slice(0,2).join(" and ");

  const priceNote={
    "Guesswork":"Guesswork pricing is the single fastest way to destroy margin — stores pricing by feel run 12-18% below optimal on repairs and 8-15% below on accessories.",
    "Not consistent":"Inconsistent pricing means different customers pay different amounts for the same job. That destroys trust and makes revenue forecasting impossible.",
    "Competitors":"Matching competitors without knowing your own costs means you could be losing money on every transaction and not realize it until end of month.",
    "Cost + margin":"Cost-plus is the right foundation. The next level is value-based pricing on high-demand services — repairs, unlocks, and activations all have room to charge more."
  };
  const invNote={
    "Don't track":"Not tracking inventory means dead stock is invisible. Accessories depreciate 35-40% in 6 months — capital locked in the wrong products is profit you'll never recover.",
    "Slow (30+ days)":"Slow-moving inventory locks up capital in depreciating stock. A $10K accessory order sitting 60 days has already lost $3-4K in resale value.",
    "Moderate":"Moderate turnover leaves room on the table. Optimized stores turn accessories in under 21 days — every extra week is margin erosion.",
    "Fast":"Fast turnover is a real strength. The risk is stockouts on high-margin items — without reorder triggers, you lose sales you don't even know you're missing."
  };
  const empNote={
    "No":"With no employee tracking, performance variance between your best and worst rep goes completely undetected. That gap is typically 23-35% of total revenue — and it compounds every week.",
    "Sometimes":"Inconsistent tracking means you catch problems late. By the time you notice an underperformer, they've already cost you weeks of lost sales and missed upsells.",
    "Yes":"You're tracking — that's ahead of most stores. The opportunity now is using that data to set targets, run incentives, and systematically coach up the bottom 30%."
  };

  const actionMap={
    "Phone Repairs":"Audit your last 30 repair tickets — check if parts cost, labor time, and final price were tracked on every job. Any job without all three is invisible profit.",
    "Accessories Sales":"Add a structured accessory prompt at every checkout this week. Even a $10 case upsell on 30% of transactions adds $300-600/month at zero extra cost.",
    "Activations":"Pull your last month of activations and match each one to the rep who processed it. If you can't do that in 10 minutes, your spiff tracking has a hole.",
    "Bill Payments":"Identify your top 10 bill-pay customers by frequency. These are your highest-traffic customers — they should be getting an offer every single visit.",
    "Unlocks":"Check your unlock pricing against the market this week. Most stores are $5-15 below optimal. A $10 price increase on 20 unlocks/month is $200 recovered immediately.",
    "Device Sales":"List every device in inventory sitting over 30 days. That's your dead stock number — price it to move this week before it depreciates further.",
    "Inventory issues":"Do a physical count of your top 10 accessories and compare to what your system says. The gap between those two numbers is your shrinkage rate.",
    "Low profit margins":"Calculate your actual net margin on your top 3 services this week — revenue minus parts, labor, and overhead. Most owners are shocked by the real number.",
    "No clear reporting":"Set up a daily close report this week: total revenue, total transactions, revenue per employee. 10 minutes a day, done manually if needed — just start.",
    "Pricing uncertainty":"Pick your 5 most common services and set a fixed price for each. Post it. Consistency alone recovers 8-12% margin in the first 30 days.",
    "Employees not selling enough":"Rank your employees by revenue generated this week. Share the list with the team. Visibility alone shifts behavior — top performers rise, bottom performers self-correct.",
    "Disconnected systems":"List every place your store data currently lives — POS, spreadsheet, notebook, memory. Every extra location is a blind spot costing you $500-2,000/month in missed decisions."
  };

  const actionSources=[...data.services.slice(0,3),...(data.challenges||[]).slice(0,3)];
  const usedKeys=new Set();
  const actions=[];
  for(const k of actionSources){
    if(actionMap[k]&&!usedKeys.has(k)){actions.push(actionMap[k]);usedKeys.add(k);if(actions.length===3)break;}
  }
  const fallbacks=["Review your pricing on your 5 most common services and set fixed rates this week — consistency alone recovers 8-12% margin.","Pull a revenue-per-employee report for the last 30 days. If you can't generate it in 5 minutes, that's the first system to fix.","Identify your 3 slowest-moving inventory items and discount them to move this week — recovering capital beats holding depreciating stock."];
  while(actions.length<3)actions.push(fallbacks[actions.length]);

  const s1=`${data.storeName} is a ${data.employees}-employee store doing ${data.monthlyRevenue}/month across ${topServices}${data.services.length>2?" and more":""}. Right now the store is running with ${topChallenges} as the primary friction points — and based on this diagnostic, these aren't isolated issues. They're connected problems that compound each other every single day.`;
  const s2=`The diagnostic puts ${data.storeName}'s monthly profit leak at approximately $${leakDollar.toLocaleString()}. ${priceNote[data.pricingStrategy]||""} ${invNote[data.inventoryTurnover]||""} ${empNote[data.employeeTracking]||""} For a store at ${data.monthlyRevenue}, this combination is particularly damaging because each gap amplifies the others.`;
  const s3=`1. ${actions[0]} 2. ${actions[1]} 3. ${actions[2]}`;
  const s4=`Stores at ${data.monthlyRevenue} that address the gaps identified in this audit typically recover $${recoverDollar.toLocaleString()}/month within 90 days — not from working harder, but from eliminating invisible leaks. For ${data.storeName}, that means fixing ${topChallenges} with systems instead of guesswork. WirelessCEO gives you automated inventory tracking, AI-powered pricing recommendations, real-time employee performance dashboards, and daily profit visibility — everything needed to run ${data.storeName} like a system, not chaos.`;

  return`SECTION 1: ${s1}\n\nSECTION 2: ${s2}\n\nSECTION 3: ${s3}\n\nSECTION 4: ${s4}`;
}

async function callAI(data,score){
  if(!GROQ_KEY) return null;
  const{level}=getLabel(score);
  const pct=Math.round((score/11)*100);
  const{mid,leakDollar,recoverDollar}=getDollarEstimates(score,data.monthlyRevenue);

  const prompt=`You are WirelessCEO — a battle-tested AI business analyst who has audited 500+ wireless retail stores across the USA. You know the exact economics of phone repairs, activations, accessories, unlocks, and device sales. You know the real benchmarks and the specific ways these stores bleed profit.

A store owner just completed your Store Profit Diagnostic. Write a sharp, personalized audit report.

STORE: ${data.storeName} | Revenue: ${data.monthlyRevenue} (~$${mid.toLocaleString()}/mo) | Team: ${data.employees} employees
Services: ${data.services.join(", ")}
Challenges: ${(data.challenges||[]).join(", ")}
Inventory Turnover: ${data.inventoryTurnover} | Pricing: ${data.pricingStrategy} | Employee Tracking: ${data.employeeTracking}
Score: ${score}/11 (${pct}% inefficiency) | Classification: ${level}
Monthly profit leak: ~$${leakDollar.toLocaleString()} | Recoverable: ~$${recoverDollar.toLocaleString()}/mo

Write exactly 4 sections. Start each with the label. Plain text only — no asterisks, no hashtags, no markdown.

SECTION 1: WHAT'S HAPPENING RIGHT NOW
2-3 sentences. Name ${data.storeName} directly. Describe their exact operational reality — team size, revenue, specific challenges. Make it feel like you've been inside their store.

SECTION 2: WHERE THE PROFIT IS LEAKING
3-4 sentences. Name the specific dollar amount $${leakDollar.toLocaleString()}/month. Explain exactly WHY their combination of ${data.pricingStrategy} pricing + ${data.inventoryTurnover} inventory + ${data.employeeTracking} employee tracking creates this leak. Be brutally specific.

SECTION 3: 3 ACTIONS TO TAKE THIS WEEK
1. [specific action for their services/challenges]. 2. [specific action]. 3. [specific action]. Concrete operational moves, not strategy.

SECTION 4: WHAT'S POSSIBLE IN 90 DAYS
2-3 sentences. Use the $${recoverDollar.toLocaleString()}/month recovery number. Be specific about what a ${data.monthlyRevenue} store can realistically achieve. End with what WirelessCEO makes possible for ${data.storeName}.`;

  try{
    const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
      body:JSON.stringify({
        model:"llama-3.3-70b-versatile",
        messages:[{role:"user",content:prompt}],
        temperature:0.6,
        max_tokens:1200,
      })
    });
    const j=await r.json();
    if(j.error){return null;}
    const text=j.choices?.[0]?.message?.content;
    if(!text){return null;}
    console.log("Groq AI OK, length:",text.length);
    return text;
  }catch(e){return null;}
}


function buildEmailHtml(data,score,report){
  const{level,emoji,color}=getLabel(score);
  const pct=Math.round((score/11)*100);
  const titles=["What's Happening Right Now","Where the Profit Is Leaking","3 Actions to Take This Week","What's Possible in 90 Days"];
  const sections=report.split(/SECTION \d+:\s*/i).filter(s=>s.trim());
  const reportHtml=sections.map((s,i)=>`
    <div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #e2e8f0;">
      <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:${color};margin:0 0 8px 0;">${titles[i]||""}</p>
      <p style="font-size:14px;line-height:1.75;color:#374151;margin:0;white-space:pre-line;">${s.trim()}</p>
    </div>`).join("");
  return`<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">
  <div style="background:linear-gradient(135deg,#0d1117,#1a2332);border-radius:16px 16px 0 0;padding:28px;">
    <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#00d4aa;margin:0 0 8px 0;">WirelessCEO · Store Profit Diagnostic</p>
    <h1 style="font-size:22px;font-weight:800;color:#fff;margin:0 0 4px 0;">Your Store Audit Results Are Ready</h1>
    <p style="font-size:13px;color:rgba(255,255,255,0.5);margin:0;">Personalized for ${data.storeName}</p>
  </div>
  <div style="background:#fff;padding:20px 28px;border-left:4px solid ${color};">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin:0 0 8px 0;">Diagnostic Result</p>
    <p style="font-size:22px;font-weight:800;color:#0d1117;margin:0;">${emoji} ${level}</p>
    <p style="font-size:13px;color:#64748b;margin:6px 0 0 0;">Score: ${score}/11 &nbsp;·&nbsp; ${pct}% inefficiency index</p>
  </div>
  <div style="background:#f8fafc;padding:16px 28px;border-bottom:1px solid #e2e8f0;">
    <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin:0 0 10px 0;">Store Profile</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr><td style="padding:3px 0;color:#64748b;width:45%;">Revenue</td><td style="color:#0d1117;font-weight:600;">${data.monthlyRevenue}/mo</td></tr>
      <tr><td style="padding:3px 0;color:#64748b;">Team</td><td style="color:#0d1117;font-weight:600;">${data.employees} employees</td></tr>
      <tr><td style="padding:3px 0;color:#64748b;">Services</td><td style="color:#0d1117;font-weight:600;">${data.services.join(", ")}</td></tr>
      <tr><td style="padding:3px 0;color:#64748b;">Challenges</td><td style="color:#0d1117;font-weight:600;">${(data.challenges||[]).join(", ")}</td></tr>
      <tr><td style="padding:3px 0;color:#64748b;">Pricing</td><td style="color:#0d1117;font-weight:600;">${data.pricingStrategy}</td></tr>
      <tr><td style="padding:3px 0;color:#64748b;">Inventory</td><td style="color:#0d1117;font-weight:600;">${data.inventoryTurnover}</td></tr>
    </table>
  </div>
  <div style="background:#fff;padding:24px 28px;">
    <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#00d4aa;margin:0 0 18px 0;">Your Personalized Profit Report</p>
    ${reportHtml}
  </div>
  <div style="background:linear-gradient(135deg,#0d1117,#1a2332);border-radius:0 0 16px 16px;padding:24px 28px;text-align:center;">
    <p style="font-size:14px;color:rgba(255,255,255,0.7);margin:0 0 16px 0;">Ready to fix these issues and recover your profit?</p>
    <a href="https://wirelesspos.ai/early-access" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#0ea5e9);color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:14px 32px;border-radius:10px;">Join Early Access — WirelessCEO</a>
    <p style="font-size:11px;color:rgba(255,255,255,0.3);margin:16px 0 0 0;">© 2025 WirelessCEO · wirelesspos.ai</p>
  </div>
</div></body></html>`;
}

async function sendEmail(data,score,report){
  const{level}=getLabel(score);
  // Initialize EmailJS with public key before sending
  emailjs.init(EPKEY);
  // Build a plain text version for the email body (HTML can exceed EmailJS limits)
  const sections=report.split(/SECTION \d+:\s*/i).filter(s=>s.trim());
  const titles=["WHAT'S HAPPENING RIGHT NOW","WHERE THE PROFIT IS LEAKING","3 ACTIONS TO TAKE THIS WEEK","WHAT'S POSSIBLE IN 90 DAYS"];
  const plainReport=sections.map((s,i)=>`${titles[i]||""}\n${s.trim()}`).join("\n\n---\n\n");
  const plainText=`Hi ${data.name},\n\nYour WirelessCEO Store Profit Audit for ${data.storeName} is ready.\n\nScore: ${score}/11 — ${level}\n\n${plainReport}\n\nJoin Early Access: https://wirelesspos.ai/early-access\n\n— The WirelessCEO Team`;

  await emailjs.send(ESID,ETID,{
    to_name:data.name,
    to_email:data.email,
    email:data.email,
    from_name:"WirelessCEO",
    subject:`Your Store Profit Audit — ${data.storeName}`,
    message:plainText,
    store_name:data.storeName,
    audit_score:`${score}/11`,
    audit_level:level,
    challenges:(data.challenges||[]).join(", "),
    monthly_revenue:data.monthlyRevenue,
    employees:data.employees,
    services:data.services.join(", "),
    pricing_strategy:data.pricingStrategy,
    inventory_turnover:data.inventoryTurnover,
    employee_tracking:data.employeeTracking
  });
}

const ic="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 text-sm bg-gray-50 focus:bg-white outline-none transition-colors";
const lc="block text-sm font-semibold text-gray-700 mb-1.5";
const grad={background:"linear-gradient(135deg,#00d4aa,#0ea5e9)"};

function Opt({sel,onClick,children,full}){
  return(
    <button type="button" onClick={onClick}
      className={(full?"w-full text-left ":"")+"px-3 py-3 rounded-xl text-sm font-medium border transition-all"}
      style={{borderColor:sel?"#00d4aa":"#e2e8f0",background:sel?"rgba(0,212,170,0.06)":"#f8fafc",color:sel?"#00a88a":"#374151"}}>
      {sel?"\u2713 ":""}{children}
    </button>
  );
}

const SECTION_TITLES=["What's Happening Right Now","Where the Profit Is Leaking","3 Actions to Take This Week","What's Possible in 90 Days"];

export default function AuditFunnel({isOpen,onClose}){
  const[step,setStep]=useState(1);
  const[data,setData]=useState({storeName:"",monthlyRevenue:"",employees:"",services:[],challenges:[],inventoryTurnover:"",pricingStrategy:"",employeeTracking:"",name:"",email:"",phone:""});
  const[report,setReport]=useState(null);
  const[reportText,setReportText]=useState(null);
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
      // Try Groq AI first, fall back to local report — never show blank
      let finalReport=await callAI(data,sc);
      if(!finalReport){
        finalReport=buildLocalReport(data,sc);
      }
      setReportText(finalReport);
      try{await sendEmail(data,sc,finalReport);setMailSt("sent");}
      catch(e){console.error("email:",e);setMailSt("failed");}
      await addDoc(collection(wirelessDb,"auditSubmissions"),{
        ...data,score:sc,reportLevel:level,aiGenerated:!!GROQ_KEY,report:finalReport,createdAt:serverTimestamp()
      });
      await addDoc(collection(wirelessDb,"demoRequests"),{
        firstName:data.name,email:data.email,phone:data.phone||"",
        company:data.storeName,source:"Audit Funnel",status:"new",
        auditScore:sc,auditLevel:level,
        monthlyRevenue:data.monthlyRevenue,employees:data.employees,
        services:data.services,challenges:data.challenges,
        inventoryTurnover:data.inventoryTurnover,pricingStrategy:data.pricingStrategy,
        employeeTracking:data.employeeTracking,
        createdAt:serverTimestamp(),updatedAt:serverTimestamp()
      });
    }catch(e){console.error(e);}
    finally{setBusy(false);}
  };

  const close=()=>{
    setStep(1);
    setData({storeName:"",monthlyRevenue:"",employees:"",services:[],challenges:[],inventoryTurnover:"",pricingStrategy:"",employeeTracking:"",name:"",email:"",phone:""});
    setReport(null);setReportText(null);setMailSt(null);
    onClose();
  };

  const parsedSections=reportText?reportText.split(/SECTION \d+:\s*/i).filter(s=>s.trim()):[];

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
              <div><label className={lc}>Top Services (select all that apply)</label><div className="grid grid-cols-2 gap-2">{SERVICES.map(s=><Opt key={s} sel={data.services.includes(s)} onClick={()=>tog(s)}>{s}</Opt>)}</div></div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Back</button>
                <button onClick={()=>setStep(3)} disabled={!data.services.length} className="py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40" style={{...grad,flex:2}}>Next</button>
              </div>
            </div>
          )}
          {step===3&&(
            <div className="space-y-4">
              <div>
                <label className={lc}>Biggest Challenges <span className="text-gray-400 font-normal">(select at least 3)</span></label>
                <div className="flex flex-col gap-2">{CHALLENGES.map(c=><Opt key={c} sel={data.challenges.includes(c)} onClick={()=>togC(c)} full>{c}</Opt>)}</div>
                {data.challenges.length>0&&data.challenges.length<3&&(
                  <p className="text-xs mt-2" style={{color:"#f59e0b"}}>Select {3-data.challenges.length} more to continue</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Back</button>
                <button onClick={()=>setStep(4)} disabled={data.challenges.length<3} className="py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40" style={{...grad,flex:2}}>Next</button>
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
              <div className="rounded-xl p-3 text-xs" style={{background:"rgba(0,212,170,0.06)",border:"1px solid rgba(0,212,170,0.2)",color:"#00a88a"}}>
                Your full personalized audit report will be sent to your email instantly.
              </div>
              <div><label className={lc}>Your Name *</label><input type="text" value={data.name} onChange={e=>set("name",e.target.value)} className={ic} placeholder="John Smith"/></div>
              <div><label className={lc}>Email Address *</label><input type="email" value={data.email} onChange={e=>set("email",e.target.value)} className={ic} placeholder="john@store.com"/></div>
              <div><label className={lc}>Phone <span className="text-gray-400 font-normal">(optional)</span></label><input type="tel" value={data.phone} onChange={e=>set("phone",e.target.value)} className={ic} placeholder="(555) 123-4567"/></div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setStep(4)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm">Back</button>
                <button onClick={submit} disabled={!data.name||!data.email||busy} className="py-3 font-bold rounded-xl text-white text-sm disabled:opacity-40" style={{...grad,flex:2}}>
                  {busy?"Analyzing...":"Get My Audit Results"}
                </button>
              </div>
            </div>
          )}
          {step===6&&report&&(
            <div className="space-y-4">
              <div className="rounded-2xl p-5 text-center" style={{background:`${report.color}10`,border:`2px solid ${report.color}30`}}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:report.color}}>Your Store Audit Results</p>
                <h3 className="text-2xl font-black mb-1" style={{color:"#0d1117"}}>{report.level}</h3>
                <p className="text-xs" style={{color:"#64748b"}}>Score: {report.score}/11 &nbsp;&middot;&nbsp; {Math.round((report.score/11)*100)}% inefficiency index</p>
              </div>
              {busy?(
                <div className="rounded-xl p-5 text-center" style={{background:"#f8fafc",border:"1px solid #e2e8f0"}}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg className="w-4 h-4 animate-spin" style={{color:"#00d4aa"}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    <span className="text-sm font-semibold" style={{color:"#00d4aa"}}>Analyzing your store data...</span>
                  </div>
                  <p className="text-xs" style={{color:"#94a3b8"}}>Generating your personalized profit report</p>
                </div>
              ):(
                <div className="rounded-xl overflow-hidden" style={{border:"1px solid #e2e8f0"}}>
                  <div className="px-4 py-3" style={{background:"linear-gradient(135deg,#0d1117,#1a2332)"}}>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{color:"#00d4aa"}}>Your Personalized Profit Report</p>
                  </div>
                  <div className="px-4 py-4 space-y-4" style={{background:"#f8fafc"}}>
                    {parsedSections.length>0?parsedSections.map((sec,i)=>(
                      <div key={i} className={i<parsedSections.length-1?"pb-4":""} style={i<parsedSections.length-1?{borderBottom:"1px solid #e2e8f0"}:{}}>
                        {SECTION_TITLES[i]&&<p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:report.color}}>{SECTION_TITLES[i]}</p>}
                        <p className="text-sm leading-relaxed whitespace-pre-line" style={{color:"#374151"}}>{sec.trim()}</p>
                      </div>
                    )):(
                      <p className="text-sm leading-relaxed" style={{color:"#94a3b8"}}>Loading your report...</p>
                    )}
                  </div>
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
                  <p className="text-xs" style={{color:"#ef4444"}}>Could not send email — your results are saved above.</p>
                </div>
              )}
              <div className="flex flex-col gap-3 pt-1">
                <a href="https://wirelesspos.ai/early-access" target="_blank" rel="noopener noreferrer"
                  className="w-full py-3.5 font-bold rounded-xl text-white text-sm text-center block" style={grad}>
                  Join Early Access — WirelessCEO
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
