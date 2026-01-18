export async function fetchWithTimeout(url:string, opts: any = {}, timeout = 7000){
  for(let attempt=1; attempt<=2; attempt++){
    const controller = new AbortController();
    const id = setTimeout(()=> controller.abort(), timeout);
    try{
      const res = await fetch(url, { signal: controller.signal, ...opts });
      clearTimeout(id);
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json;
    }catch(err){
      clearTimeout(id);
      if(attempt===2) throw err;
      await new Promise(r=>setTimeout(r, 200*attempt));
    }
  }
}

export async function fetchUsers(){
  const data = await fetchWithTimeout('http://localhost:8000/api/admin/users', {}, 7000);
  if(data && data.users) return data.users;
  if(Array.isArray(data)) return data;
  return [];
}
