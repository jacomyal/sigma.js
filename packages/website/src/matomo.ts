import process from "node:process";

// Set by CI (see .github/workflows/website.yml); empty locally, so Matomo rejects the hits
const siteId = process.env.MATOMO_SITE_ID ?? "";

// language=javascript
export const MATOMO_SCRIPT = /*javascript*/ `
(function () {
  // Examples iframed in docs pages are already counted by their parent page
  if (window.self !== window.top) return;
  var _paq = (window._paq = window._paq || []);
  // Groups 404s with their broken URL and referrer, following Matomo's convention
  if (document.title.indexOf("404 |") === 0)
    _paq.push(["setDocumentTitle", "404/URL = " + encodeURIComponent(location.pathname + location.search) + "/From = " + encodeURIComponent(document.referrer)]);
  _paq.push(["setDomains", ["*.sigmajs.org"]]);
  _paq.push(["enableHeartBeatTimer"]);
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);
  var u = "https://matomo.ouestware.com/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", ${JSON.stringify(siteId)}]);
  var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = u + "matomo.js";
  s.parentNode.insertBefore(g, s);

  // Tracks the last query typed when the search modal closes
  var lastKeyword = null;
  function trackSearch(target) {
    var search = target.closest && target.closest("site-search");
    if (!search) return;
    var input = search.querySelector("input");
    var keyword = input && input.value.trim();
    // The input keeps its value when the modal reopens
    if (!keyword || keyword === lastKeyword) return;
    lastKeyword = keyword;
    var message = search.querySelector(".pagefind-ui__message");
    var match = (message ? message.textContent.trim() : "").match(/^(\\d+|No) results? for\\s+(.*)$/);
    // The message can still describe a previous query
    var count = match && match[2] === keyword ? (match[1] === "No" ? 0 : +match[1]) : false;
    // matomo.js replaces window._paq once loaded
    window._paq.push(["trackSiteSearch", keyword, false, count]);
  }
  document.addEventListener("close", function (e) { trackSearch(e.target); }, true);
  // Pagefind clears the input on Escape, before the modal closes
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && e.target.tagName === "INPUT") trackSearch(e.target); }, true);
})();
`;
