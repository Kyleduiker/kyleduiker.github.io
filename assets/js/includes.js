async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url);
  if (!res.ok) {
    el.innerHTML = `<!-- Failed to load: ${url} -->`;
    return;
  }
  el.innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("#header", "/partials/header.html");
  loadPartial("#footer", "/partials/footer.html");
});
