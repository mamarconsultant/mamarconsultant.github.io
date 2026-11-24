// ============================================================================
// WHAT THIS FILE IS (in plain English)
//
// Runs in the visitor's browser. Until someone clicks a launch video, the page
// only shows a picture and a play button (built by website/media.js). When they
// click, this script swaps in the real YouTube player from youtube-nocookie.com
// and starts it. The YouTube player itself (its iframe, scripts, and cookies)
// does not load until the visitor clicks; only the static thumbnail image
// (fetched from YouTube's image host) loads beforehand.
// ============================================================================
(function () {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".video[data-yt]") : null;
    if (!btn) return;
    var id = btn.getAttribute("data-yt");
    if (!id) return;
    var frame = document.createElement("iframe");
    frame.className = "video-frame";
    frame.width = "560"; frame.height = "315";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
    btn.replaceWith(frame);
  });
})();
