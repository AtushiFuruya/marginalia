(function(global){
  const STORAGE_KEY = 'karin_age_verified';
  const COOKIE_NAME = `${STORAGE_KEY}=`;
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30日保持

  function setCookie(){
    try{
      document.cookie = `${STORAGE_KEY}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    }catch(err){
      /* cookieが使えない環境は無視 */
    }
  }

  function hasCookie(){
    try{
      return document.cookie.split(';').some(part => part.trim().startsWith(COOKIE_NAME));
    }catch(err){
      return false;
    }
  }

  function remember(){
    try{ localStorage.setItem(STORAGE_KEY, '1'); }catch(err){}
    try{ sessionStorage.setItem(STORAGE_KEY, '1'); }catch(err){}
    setCookie();
  }

  function clear(){
    try{ localStorage.removeItem(STORAGE_KEY); }catch(err){}
    try{ sessionStorage.removeItem(STORAGE_KEY); }catch(err){}
    try{
      document.cookie = `${STORAGE_KEY}=; Max-Age=0; path=/;`;
    }catch(err){}
  }

  function isVerified(){
    try{
      if(localStorage.getItem(STORAGE_KEY)){ return true; }
    }catch(err){}
    try{
      if(sessionStorage.getItem(STORAGE_KEY)){ return true; }
    }catch(err){}
    return hasCookie();
  }

  global.KarinAgeGate = global.KarinAgeGate || {};
  global.KarinAgeGate.key = STORAGE_KEY;
  global.KarinAgeGate.setVerified = remember;
  global.KarinAgeGate.clearVerified = clear;
  global.KarinAgeGate.isVerified = isVerified;
})(window);
