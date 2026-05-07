'use client';
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html><body style={{background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <div style={{textAlign:'center'}}>
        <h2>Something went wrong</h2>
        <button onClick={reset} style={{marginTop:16,padding:'8px 24px',background:'#e11d48',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}>Try again</button>
      </div>
    </body></html>
  );
}
