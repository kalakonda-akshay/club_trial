(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Theme sync (reads the same choice made on the main site)
  --------------------------------------------------------- */
  (function () {
    const btn = document.getElementById("themeToggle");
    const root = document.documentElement;
    const KEY = "craft-theme";
    function apply(theme) {
      if (theme === "mono") { root.setAttribute("data-theme", "mono"); if (btn) btn.textContent = "◑"; }
      else { root.removeAttribute("data-theme"); if (btn) btn.textContent = "◐"; }
    }
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
    apply(saved === "mono" ? "mono" : "color");
    if (btn) {
      btn.addEventListener("click", () => {
        const isMono = root.getAttribute("data-theme") === "mono";
        const next = isMono ? "color" : "mono";
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
      });
    }
  })();

  /* ---------------------------------------------------------
     Flicker-on sequence for the spotlight room, then reveal
     the login card once the lights "settle."
     Mirrors the timed on/off pattern from the reference demo.
  --------------------------------------------------------- */
  const lights = document.getElementById("roomLights");
  const bulbs = [document.getElementById("bulb1"), document.getElementById("bulb2"), document.getElementById("bulb3")];
  const revealEls = document.querySelectorAll(".reveal-in");

  function setLit(on) {
    bulbs.forEach(b => { if (b) b.classList.toggle("is-on", on); });
    if (lights) lights.classList.toggle("is-lit", on);
  }

  async function runFlicker() {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    if (!lights) return;

    if (reduceMotion) { setLit(true); revealEls.forEach(el => el.classList.add("is-in")); return; }

    lights.classList.add("is-flicker");
    await sleep(500);
    setLit(true);  await sleep(100);
    setLit(false); await sleep(250);
    setLit(true);  await sleep(60);
    setLit(false); await sleep(180);
    setLit(true);  await sleep(50);
    setLit(false); await sleep(70);
    setLit(true);  await sleep(300);

    lights.classList.remove("is-flicker");
    setLit(true);

    revealEls.forEach((el, i) => {
      setTimeout(() => el.classList.add("is-in"), i * 130);
    });
  }
  runFlicker();

  /* ---------------------------------------------------------
     Mock login form (frontend-only preview)
  --------------------------------------------------------- */
  const form = document.getElementById("loginForm");
  const status = document.getElementById("loginStatus");
  if (form && status) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Enter your email and password to continue.";
        status.classList.remove("success");
        return;
      }
      status.textContent = "This is a preview — login isn't connected to an account system yet.";
      status.classList.add("success");
    });
  }
})();
