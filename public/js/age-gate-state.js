(function(global){
  const STORAGE_KEY = 'karin_age_verified';
  const TTL_MS = 30 * 60 * 1000; // 30分保持

  function remember(ttlMs = TTL_MS){
    const expiresAt = Date.now() + ttlMs;
    try{ sessionStorage.setItem(STORAGE_KEY, String(expiresAt)); }catch(err){}
  }

  function clear(){
    try{ sessionStorage.removeItem(STORAGE_KEY); }catch(err){}
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

    return false;
  }

  global.KarinAgeGate = global.KarinAgeGate || {};
  global.KarinAgeGate.key = STORAGE_KEY;
  global.KarinAgeGate.setVerified = remember;
  global.KarinAgeGate.clearVerified = clear;
  global.KarinAgeGate.isVerified = isVerified;
})(window);
