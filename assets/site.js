// Three interactions: the mode toggle, the career ruler, the skills ↔ work filter.
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
