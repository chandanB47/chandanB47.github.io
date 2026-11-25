(()=>{const $=s=>document.querySelector(s),rm=matchMedia("(prefers-reduced-motion: reduce)").matches,fine=matchMedia("(pointer:fine)").matches;
document.querySelectorAll(".hx-bars i").forEach((b,i)=>b.style.setProperty("--i",i));
/* typing role rotator */
const roles=["Data Analyst","Business Analyst","SQL Developer","Power BI Reporter","Data Storyteller"],el=$("#hxrole");let r=0,c=0,del=false;
if(el&&!rm)(function t(){const w=roles[r];el.textContent=w.slice(0,c);if(!del&&c===w.length){del=true;return setTimeout(t,1600)}if(del&&c===0){del=false;r=(r+1)%roles.length}c+=del?-1:1;setTimeout(t,del?35:70)})();
if(fine&&!rm){
 /* 3D tilt on hero card */
 const card=$("#hxcard"),hero=$("#cover");
 hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty("--ry",(-6+x*10)+"deg");card.style.setProperty("--rx",(3-y*8)+"deg")});
 /* magnetic buttons */
 document.querySelectorAll(".mag").forEach(b=>{b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.25}px)`});b.addEventListener("pointerleave",()=>b.style.transform="")});
 /* tilt on skill / project cards */
 document.addEventListener("pointermove",e=>{const c=e.target.closest&&e.target.closest(".sk,.pc,.proj");if(!c)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`});
 document.addEventListener("pointerout",e=>{const c=e.target.closest&&e.target.closest(".sk,.pc,.proj");if(c)c.style.transform=""});
}
/* auto-typing code editor */
const SN=[
{l:"SQL",k:/\b(SELECT|FROM|JOIN|ON|GROUP BY|ORDER BY|DESC|LIMIT|AS|SUM|OVER|PARTITION BY|WITH)\b/g,t:`-- Top 5 products by revenue
WITH sales AS (
  SELECT product_id, SUM(qty * price) AS revenue
  FROM orders
  GROUP BY product_id
)
SELECT p.name, s.revenue,
  RANK() OVER (ORDER BY s.revenue DESC) AS rnk
FROM sales s
JOIN products p ON p.id = s.product_id
LIMIT 5;`},
{l:"Python · pandas",k:/\b(import|as|print|for|in|def|return)\b/g,t:`import pandas as pd

df = pd.read_csv("sales.csv")
df["month"] = pd.to_datetime(df["date"]).dt.to_period("M")

summary = (
    df.groupby("month")["revenue"]
      .agg(["sum", "mean"])
      .round(2)
)
print(summary.head())`},
{l:"DAX · Power BI",k:/\b(VAR|RETURN|SUM|DIVIDE|CALCULATE|SAMEPERIODLASTYEAR)\b/g,t:`Total Revenue = SUM ( Sales[Amount] )

Revenue LY =
CALCULATE (
    [Total Revenue],
    SAMEPERIODLASTYEAR ( 'Date'[Date] )
)

Revenue YoY % =
DIVIDE ( [Total Revenue] - [Revenue LY], [Revenue LY] )`}];
const code=$("#hxcode"),tabs=[...document.querySelectorAll("#hxtabs span")],lang=$("#hxlang");
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const hl=(s,kw)=>esc(s).replace(new RegExp("(--[^\\n]*|#[^\\n]*)|(\"[^\"\\n]*\"?|'[^'\\n]*'?)|(\\b\\d+(?:\\.\\d+)?\\b)|"+kw.source,"g"),(m,c,st,n,k)=>c?`<span class="tk-c">${m}</span>`:st?`<span class="tk-s">${m}</span>`:n?`<span class="tk-n">${m}</span>`:`<span class="tk-k">${m}</span>`);
function show(i,upto){const s=SN[i];code.innerHTML=hl(s.t.slice(0,upto),s.k);tabs.forEach((t,x)=>t.classList.toggle("on",x===i));lang.textContent=s.l}
if(code){let i=0,n=0;if(rm)show(0,SN[0].t.length);else(function tick(){const L=SN[i].t.length;show(i,n);if(n<L){n++;setTimeout(tick,SN[i].t[n-1]==="\n"?220:28)}else{setTimeout(()=>{i=(i+1)%SN.length;n=0;tick()},2600)}})()}
})();
