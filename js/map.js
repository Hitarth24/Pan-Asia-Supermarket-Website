/* Pan-Asia Supermarket — Leaflet map helpers
   Requires Leaflet (loaded via CDN) and locations-data.js on the page. */
(function () {
  "use strict";

  function pinIcon(isSoon) {
    return L.divIcon({
      className: "",
      html:
        '<div class="map-marker-pin' + (isSoon ? " is-soon" : "") + '"><span>' +
        (isSoon ? "★" : "🛒") +
        "</span></div>",
      iconSize: [34, 34],
      iconAnchor: [17, 32],
      popupAnchor: [0, -30],
    });
  }

  function popupHTML(loc, opts) {
    opts = opts || {};
    var basePath = opts.basePath || "";
    var statusLine =
      loc.status === "coming-soon"
        ? '<p style="color:#b6790f;font-weight:600;">' + (loc.comingLabel || "Coming soon") + "</p>"
        : "<p>" + (loc.address ? loc.address + ", " : "") + loc.cityStateZip + "</p>";
    var cta =
      loc.status === "coming-soon" || opts.forPage
        ? ""
        : '<a class="btn btn-primary btn-sm" href="' + basePath + loc.page + '">Store details</a>';
    return (
      '<div class="map-popup"><h4>' +
      loc.city +
      "</h4>" +
      statusLine +
      cta +
      "</div>"
    );
  }

  /**
   * Initialize a Leaflet map showing all (or a filtered set of) Pan-Asia locations.
   * @param {string} elementId - id of the map container div
   * @param {object} options
   *   basePath: string prefix to reach root from current page (e.g. "" or "../")
   *   onlyId: if set, center/zoom tightly on a single location id and show only that pin
   *   fitAll: default true, fit bounds to all shown pins
   */
  window.PanAsiaMap = {
    init: function (elementId, options) {
      options = options || {};
      var el = document.getElementById(elementId);
      if (!el || typeof L === "undefined" || typeof PAN_ASIA_LOCATIONS === "undefined") return null;

      var basePath = options.basePath || "";
      var locations = PAN_ASIA_LOCATIONS;
      if (options.onlyId) {
        locations = locations.filter(function (l) { return l.id === options.onlyId; });
      }

      var map = L.map(elementId, {
        scrollWheelZoom: false,
        center: [39.5, -95],
        zoom: 4,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      var markers = [];
      locations.forEach(function (loc) {
        var isSoon = loc.status === "coming-soon";
        var marker = L.marker([loc.lat, loc.lng], {
          icon: pinIcon(isSoon),
          title: loc.city,
        }).addTo(map);
        marker.bindPopup(popupHTML(loc, { basePath: basePath, forPage: options.onlyId }));
        markers.push(marker);
      });

      if (options.onlyId && locations.length === 1) {
        map.setView([locations[0].lat, locations[0].lng], 14);
        markers[0].openPopup();
      } else if (options.fitAll !== false && markers.length) {
        var group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.25));
      }

      map.on("focus", function () { map.scrollWheelZoom.enable(); });
      map.on("blur", function () { map.scrollWheelZoom.disable(); });

      return map;
    },
  };
})();
