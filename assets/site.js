// Five interactions: the mode toggle, the career ruler, the skills ↔ work filter,
// the "How I work" stepper and the "Follow one task" stepper. Without JS both steppers show in full.
(function () {
  var root = document.documentElement;

  var modeBtn = document.querySelector(".mode");
  function label() { modeBtn.querySelector(".mode-label").textContent = root.dataset.mode === "day" ? "dark" : "light"; }
  if (modeBtn) {
    label();
    modeBtn.addEventListener("click", function () {
      var mode = root.dataset.mode === "day" ? "night" : "day";
      root.dataset.mode = mode;
      root.dataset.theme = "umbra-" + root.dataset.variant + (mode === "day" ? "-day" : "");
      try { localStorage.setItem("mode", mode); } catch (e) {}
      label();
    });
  }

  var segs = document.querySelectorAll(".seg"), roles = document.querySelectorAll(".role");
  segs.forEach(function (seg) {
    seg.addEventListener("click", function () {
      var id = seg.dataset.role;
      segs.forEach(function (s) { var on = s.dataset.role === id; s.classList.toggle("on", on); s.setAttribute("aria-pressed", on); });
      roles.forEach(function (r) { r.classList.toggle("on", r.dataset.role === id); });
    });
  });

  var st = document.querySelector(".stepper");
  if (st) {
    var step = 0, last = +st.dataset.steps, labels = st.dataset.labels.split("|");
    var next = st.querySelector("[data-act=next]"), back = st.querySelector("[data-act=back]");
    var drawStep = function () {
      st.dataset.step = step;
      st.querySelectorAll(".rail li").forEach(function (li, i) { li.classList.toggle("done", i <= step); });
      st.querySelectorAll(".layer").forEach(function (l) { l.classList.toggle("show", +l.dataset.layer <= step); });
      back.disabled = step === 0;
      next.textContent = (step === last ? "↺ " : "▶ ") + labels[step];
    };
    next.addEventListener("click", function () { step = step === last ? 0 : step + 1; drawStep(); });
    back.addEventListener("click", function () { step = Math.max(0, step - 1); drawStep(); });
    drawStep();
  }

  var pk = document.querySelector(".packet");
  if (pk) {
    var at = -1, scn = pk.querySelector("button[data-scn]"), items = pk.querySelectorAll(".flow li");
    var go = pk.querySelector("[data-act=next]"), first = go.textContent;
    var drawFlow = function () {
      var stop = +scn.dataset.stop, bad = stop < items.length - 1;
      items.forEach(function (li, i) {
        li.className = i > stop ? (at >= stop ? "skipped" : "later") : i < at ? "past" : i === at ? (bad && i === stop ? "stop" : "here") : "later";
        li.querySelectorAll(".say").forEach(function (s) { s.classList.toggle("on", s.dataset.scn === scn.dataset.scn); });
      });
      go.disabled = at >= stop;
      go.textContent = at < 0 ? first : at >= stop ? (bad ? "⛔ stopped" : "✅ done") : "▶ next step";
    };
    go.addEventListener("click", function () { at++; drawFlow(); });
    pk.querySelector("[data-act=reset]").addEventListener("click", function () { at = -1; drawFlow(); });
    pk.querySelectorAll("button[data-scn]").forEach(function (b) {
      b.addEventListener("click", function () {
        scn = b; at = -1;
        pk.querySelectorAll("button[data-scn]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        drawFlow();
      });
    });
    drawFlow();
  }

  var chips = document.querySelectorAll("button.chip"), cards = document.querySelectorAll(".card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var on = chip.getAttribute("aria-pressed") !== "true", skill = chip.dataset.skill;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", String(on));
      cards.forEach(function (card) {
        var has = card.dataset.skills.split("|").indexOf(skill) !== -1;
        card.classList.toggle("dim", on && !has);
        card.classList.toggle("hit", on && has);
      });
    });
  });
})();
