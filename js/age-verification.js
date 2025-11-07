document.addEventListener('DOMContentLoaded', function(){
  // === Temporarily disable remembering age-confirmation ===
  try{
    // Remove any previously stored keys used for age verification
    localStorage.removeItem('ageVerified');
    sessionStorage.removeItem('ageVerified');
    // delete cookie named ageVerified (if exists)
    document.cookie = 'ageVerified=; Max-Age=0; path=/;';

    // Prevent future storage of age-related keys during this session
    const _origLSSet = localStorage.setItem.bind(localStorage);
    const _origSSSet = sessionStorage.setItem.bind(sessionStorage);
    localStorage.setItem = function(k,v){ if(/age/i.test(k)) return; return _origLSSet(k,v); };
    sessionStorage.setItem = function(k,v){ if(/age/i.test(k)) return; return _origSSSet(k,v); };
  }catch(e){ /* ignore in restricted contexts */ }

  const bodyEl = document.body;
  const enterBtn = document.getElementById('enter-btn');
  const exitBtn = document.getElementById('exit-btn');
  const overlay = document.querySelector('.overlay');
  const video = document.getElementById('bg-video');
  const prefersReducedMotion = window.matchMedia ?
    window.matchMedia('(prefers-reduced-motion: reduce)') :
    { matches: false };

  function flagNoVideo(){ bodyEl.classList.add('no-video'); }
  function clearNoVideo(){ bodyEl.classList.remove('no-video'); }

  if(!video){
    flagNoVideo();
  } else {
    const support = typeof video.canPlayType === 'function' ? video.canPlayType('video/mp4') : 'maybe';
    if(!support){
      flagNoVideo();
    }else{
      video.addEventListener('error', flagNoVideo);
      video.addEventListener('loadeddata', clearNoVideo, { once: true });
    }
  }

  function redirectToOpening(){
    // フェードアニメーションのためにクラス付与
    overlay && overlay.classList.add('fade-out');
    // 少し待ってから遷移（CSSに合わせて500ms）
    setTimeout(()=>{ window.location.href = 'opening.html' }, 520);
  }

  function exitToExternal(){
    // 直接外部サイトへ遷移
    window.location.href = 'https://www.google.com';
  }

  if(enterBtn) enterBtn.addEventListener('click', redirectToOpening);
  if(exitBtn) exitBtn.addEventListener('click', exitToExternal);

  // キーボード操作対応: Enter で入場, Escape で退出
  document.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      const active = document.activeElement;
      // フォーカスがボタンにある場合はクリック動作に任せる
      if(active === enterBtn || active === exitBtn){ return }
      redirectToOpening();
    }
    if(e.key === 'Escape'){
      exitToExternal();
    }
  });

  // スライドショー画像リスト（ユーザー指定）
  const slideshowImages = [
    'images/gallery/scene_mary_onTop.jpg',
    'images/gallery/scene_sex_Elaine.jpg',
    'images/gallery/scene_caning.jpg',
    'images/gallery/scene_pear of anguish.jpg'
  ];

  const slideshowContainer = document.getElementById('bg-slideshow');
  const slideshowImg = document.getElementById('slideshow-img');
  const slideshowFlash = document.getElementById('slideshow-flash');

  function playSlideshow(list, displayTime=500, flashDuration=180){
    if(!slideshowContainer || !slideshowImg || !slideshowFlash) return;
    if(!list || list.length === 0 || prefersReducedMotion.matches) return;
    slideshowContainer.style.display = 'flex';
    slideshowContainer.setAttribute('aria-hidden','false');
    // 隠すビデオ
    if(video){ try{ video.style.display='none' }catch(e){} }
    let i = 0;
    function next(){
      if(i >= list.length){
        // スライドショー終了。最後の状態を維持しておく
        return;
      }
      const src = list[i];
      // encode spaces
      slideshowImg.src = encodeURI(src);
      // 表示時間
      setTimeout(()=>{
        // 白フラッシュを一瞬表示
        slideshowFlash.classList.add('visible');
        setTimeout(()=>{
          slideshowFlash.classList.remove('visible');
          i++;
          // 次の画像へ少し遅延を置く（火花的に短い間隔）
          setTimeout(next, 50);
        }, flashDuration);
      }, displayTime);
    }
    next();
  }

  // video がある場合は再生終了時にスライドを開始
  if(video){
    video.addEventListener('ended', ()=>{
      // 動画終了後にスライドを開始
      playSlideshow(slideshowImages, 500, 180);
    });
    // 保険: 動画が自動で長い場合は8秒後に強制的に開始するオプション
    setTimeout(()=>{
      if(!video.ended){
        // 8秒経過後に動画がまだ終わっていなければ一旦停止してスライド開始
        try{
          video.pause();
          if(Number.isFinite(video.duration)){
            video.currentTime = video.duration;
          }
        }catch(e){}
        playSlideshow(slideshowImages, 500, 180);
      }
    }, 8000);
  } else {
    // video が無ければ即座にスライドを開始
    flagNoVideo();
    playSlideshow(slideshowImages, 500, 180);
  }
});
