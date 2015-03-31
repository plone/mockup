/** slides-video.js
 *
 * Auto-play videos in slides if requested
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */

(function() {

function onSlideDisplay(event) {
        var slide = event.detail.slide.element,
            videos = slide.querySelectorAll("video");

        for (var i=0; i<videos.length; i++) {
                var video = videos[i];
                if (video.paused) {
                        video.currentTime=0;
                        video.play();
                }
        }
}


function onSlideHide(event) {
        var slide = event.detail.slide.element,
            videos = slide.querySelectorAll("video");

        for (var i=0; i<videos.length; i++) {
                var video = videos[i];
                if (!video.paused)
                        video.pause();
        }
        
}

window.addEventListener("SlideDisplay", onSlideDisplay);
window.addEventListener("SlideHide", onSlideHide);

})();
