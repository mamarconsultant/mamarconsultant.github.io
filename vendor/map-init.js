// ============================================================================
// WHAT THIS FILE IS (in plain English)
//
// Runs in the visitor's browser. It finds every map box on the page and draws
// a small OpenStreetMap map with a single pin on the building, using the
// Leaflet library loaded just before this script. Nothing here talks to our
// server. The only thing fetched from the internet is the map imagery (tiles)
// from OpenStreetMap, and only for maps the visitor actually looks at.
//
// Two kinds of map box are supported so the site can show maps either way:
//   - <div class="map" data-lat=".." data-lng=".." data-label="..">  (always
//     visible: drawn when it scrolls into view)
//   - a <button class="map-toggle"> next to a hidden .map (drawn on click)
// ============================================================================
(function () {
  if (typeof L === "undefined") return; // Leaflet not on this page — nothing to do.

  var MARKER = L.icon({
    iconUrl: "vendor/leaflet/images/marker-icon.png",
    iconRetinaUrl: "vendor/leaflet/images/marker-icon-2x.png",
    shadowUrl: "vendor/leaflet/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  function boot(el) {
    if (!el || el.dataset.booted) return;
    var lat = parseFloat(el.dataset.lat), lng = parseFloat(el.dataset.lng);
    if (isNaN(lat) || isNaN(lng)) return;
    el.dataset.booted = "1";
    var map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([lat, lng], 16);
    // Esri World Street Map: renders place labels in English/Latin. (Both the
    // plain OpenStreetMap tiles and CARTO show Arabic place names in Dubai.)
    // Note the {z}/{y}/{x} order Esri uses.
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles © Esri"
    }).addTo(map);
    var m = L.marker([lat, lng], { icon: MARKER }).addTo(map);
    if (el.dataset.label) {
      var lbl = document.createElement("span");
      lbl.textContent = el.dataset.label;
      m.bindPopup(lbl);
    }
    // Leaflet needs a size recalculation when a box was hidden until now.
    setTimeout(function () { map.invalidateSize(); }, 0);
  }

  // Always-on maps: draw when scrolled into view (keeps a page of maps light).
  var visible = document.querySelectorAll(".map[data-lat]:not(.map-collapsed)");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { boot(e.target); io.unobserve(e.target); } });
    }, { rootMargin: "200px" });
    visible.forEach(function (el) { io.observe(el); });
  } else {
    visible.forEach(boot);
  }

  // Click-to-expand maps: reveal the hidden map next to the button, then draw.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".map-toggle") : null;
    if (!btn) return;
    var box = btn.parentNode.querySelector(".map[data-lat]");
    if (!box) return;
    box.classList.remove("map-collapsed");
    box.hidden = false;
    btn.hidden = true;
    boot(box);
  });
})();
