(function(global){
  const STORAGE_KEY = 'karin_age_verified';
  const COOKIE_NAME = `${STORAGE_KEY}=`;
  const TTL_MS = 30 * 60 * 1000; // 30分保持

  function parseCookieExpiration(){
    try{
      const raw = document.cookie.split(';').find(part => part.trim().startsWith(COOKIE_NAME));
      if(!raw) return null;
      const [, value] = raw.split('=');
      const exp = Number(value);
      return Number.isFinite(exp) ? exp : null;
    }catch(err){
      return null;
    }
  }

  function setCookie(expiresAt){
    try{
      const maxAge = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      document.cookie = `${STORAGE_KEY}=${expiresAt}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }catch(err){
      /* cookieが使えない環境は無視 */
    }
  }

  function clearCookie(){
    try{
      document.cookie = `${STORAGE_KEY}=; Max-Age=0; path=/;`;
    }catch(err){}
  }

  function remember(ttlMs = TTL_MS){
    const expiresAt = Date.now() + ttlMs;
    try{ localStorage.setItem(STORAGE_KEY, String(expiresAt)); }catch(err){}
    try{ sessionStorage.setItem(STORAGE_KEY, String(expiresAt)); }catch(err){}
    setCookie(expiresAt);
  }

  function clear(){
    try{ localStorage.removeItem(STORAGE_KEY); }catch(err){}
    try{ sessionStorage.removeItem(STORAGE_KEY); }catch(err){}
    clearCookie();
  }

  function isVerified(){
    const now = Date.now();

    try{
      const sessionExp = Number(sessionStorage.getItem(STORAGE_KEY));
      if(Number.isFinite(sessionExp)){
        if(now <= sessionExp){ return true; }
        sessionStorage.removeItem(STORAGE_KEY);
      }else if(sessionExp){
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }catch(err){}

    try{
      const localExp = Number(localStorage.getItem(STORAGE_KEY));
      if(Number.isFinite(localExp)){
        if(now <= localExp){ return true; }
        localStorage.removeItem(STORAGE_KEY); // 期限切れなら掃除
      }else{
        localStorage.removeItem(STORAGE_KEY);
      }
    }catch(err){}

    const cookieExp = parseCookieExpiration();
    if(cookieExp && now <= cookieExp){ return true; }
    if(cookieExp !== null && now > cookieExp){ clearCookie(); }

    return false;
  }

  global.KarinAgeGate = global.KarinAgeGate || {};
  global.KarinAgeGate.key = STORAGE_KEY;
  global.KarinAgeGate.setVerified = remember;
  global.KarinAgeGate.clearVerified = clear;
  global.KarinAgeGate.isVerified = isVerified;
})(window);
