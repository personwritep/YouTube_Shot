// ==UserScript==
// @name        YouTube Shot
// @namespace        http://tampermonkey.net/
// @version        0.5
// @description        YouTube動画のスクリーンショットツール
// @author        YouTube User
// @match        https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @updateURL        https://github.com/personwritep/YouTube_Shot/raw/main/YouTube_Shot.user.js
// @downloadURL        https://github.com/personwritep/YouTube_Shot/raw/main/YouTube_Shot.user.js
// ==/UserScript==


let target=document.querySelector('head title');
let monitor=new MutationObserver(main);
monitor.observe(target, { childList: true, });

main();

function main(){
    let path_name=location.pathname;
    let sel
    if(path_name.includes('/shorts/')){ // ショート動画
        sel='ytd-player.ytd-shorts video.html5-main-video'; }
    else if(path_name.includes('/embed/')){ // 埋込の動画
        sel='video.html5-main-video'; }
    else{
        sel='ytd-player.ytd-watch-flexy video.html5-main-video'; }

    let retry=0;
    let interval=setInterval(wait_target, 50);
    function wait_target(){
        retry++;
        if(retry>100){ // リトライ制限 100回 5secまで
            clearInterval(interval); }
        let video=document.querySelector(sel);
        if(video){
            clearInterval(interval);
            set_canvas(); }}



    function set_canvas(){
        let cv=document.createElement("canvas");
        cv.id='draw';
        let cv_style='position: absolute; z-index: -1; visibility: hidden;';
        cv.setAttribute('style', cv_style);
        if(!document.querySelector('#draw')){
            document.body.appendChild(cv); }
        let canvas=document.querySelector('#draw');

        setTimeout(()=>{
            document.addEventListener('keyup', (event)=>{
                //「Ctrl+PrintScreen」キー入力
                if(event.keyCode==44 && event.ctrlKey){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    player_capture(canvas, 0); }
                //「Shift+PrintScreen」キー入力
                else if(event.keyCode==44 && event.shiftKey){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    player_capture(canvas, 1); }
            });
        }, 400);

    } // set_canvas()



    function player_capture(canvas, n){
        let path_name=location.pathname;
        let sel
        if(path_name.includes('/shorts/')){ // ショート動画
            sel='ytd-player.ytd-shorts video.html5-main-video'; }
        else if(path_name.includes('/embed/')){ // 埋込の動画
            sel='video.html5-main-video'; }
        else{
            sel='ytd-player.ytd-watch-flexy video.html5-main-video'; }
        let video=document.querySelector(sel);

        let cover; // スクリーンショットのサイズ 🔴
        if(n==0){
            cover=720; } // サイズ0 🔴 通常
        else if(n==1){
            cover=1920; } // サイズ1 🔴 トリミング用 ランドスケープ

        if(video.videoHeight < video.videoWidth){
            canvas.width=cover;
            canvas.height=cover*video.videoHeight/video.videoWidth; }
        else{
            if(n==1){
                cover=1080; } // サイズ1 🔴 トリミング用 ポートレイト
            canvas.height=cover;
            canvas.width=cover*video.videoWidth/video.videoHeight; }

        //videoをcanvas描写
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        let link=document.createElement("a");
        link.href=canvas.toDataURL("image/png");
        link.download="YT.png";
        link.click();

    } // player_capture()

}// main()
