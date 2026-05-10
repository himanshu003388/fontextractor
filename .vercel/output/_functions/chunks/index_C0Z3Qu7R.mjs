import { c as createComponent } from './astro-component_BYLiv0E1.mjs';
import 'piccolore';
import { n as createRenderInstruction, h as addAttribute, o as renderHead, p as renderSlot, r as renderTemplate, q as renderComponent, m as maybeRenderHead } from './entrypoint_o6sY1XSN.mjs';
import 'clsx';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="description" content="Fontextractor - Extract fonts from any website instantly."><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-black text-white font-sans antialiased selection:bg-[#ff4f00] selection:text-white"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/Jarvis/Desktop/New folder (2)/fontextractor/src/layouts/Layout.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Fontextractor [v1.0.0]" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="noise-overlay"></div> <main class="min-h-screen bg-grid-industrial relative flex flex-col"> <!-- Header --> <header class="p-6 border-b border-[#222] flex justify-between items-center bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40"> <div class="font-display font-bold text-xl tracking-tighter uppercase flex items-center gap-2"> <div class="w-3 h-3 bg-primary rounded-full"></div>
Fontextractor
</div> <div class="font-mono text-xs text-neutral-500 uppercase tracking-widest">
Sys.Status <span class="text-green-500 ml-1">● Online</span> </div> </header> <!-- Hero --> <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10 relative"> <div class="max-w-5xl w-full"> <h1 class="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight uppercase mb-4"> <span class="block">Extract</span> <span class="block text-outline hover-text-filled transition-colors duration-300">Typography</span> </h1> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border-t border-[#222] pt-4"> <p class="col-span-1 md:col-span-2 text-sm text-neutral-400 max-w-2xl font-mono leading-relaxed">
Input target URL to extract all font families from any website.
</p> <div class="col-span-1 flex flex-col gap-2 font-mono text-xs text-neutral-500 uppercase"> <div class="flex justify-between border-b border-[#222] pb-2"> <span>Engine</span> <span class="text-white">v1.0.0</span> </div> <div class="flex justify-between border-b border-[#222] pb-2"> <span>Accuracy</span> <span class="text-primary">High</span> </div> <div class="flex justify-between pb-2"> <span>Status</span> <span class="text-white">Ready</span> </div> </div> </div> <!-- Interactive Form --> <div class="bg-[#121212] border border-[#222] p-1 flex flex-col sm:flex-row gap-1 relative group"> <div class="absolute -inset-0.5 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-lg -z-10"></div> <div class="flex-1 flex items-center px-3"> <span class="font-mono text-neutral-500 mr-2">&gt;</span> <input type="text" id="urlInput" placeholder="https://example.com" class="w-full bg-transparent border-none outline-none font-mono text-base text-white placeholder-neutral-600 py-3"> </div> <button id="extractBtn" class="bg-white hover:bg-primary hover:text-white transition-colors text-black font-display font-bold uppercase tracking-wider px-4 py-3 flex items-center justify-center gap-2 cursor-pointer text-sm"> <span id="btnText">Scan</span> <svg id="btnIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg> <svg id="loadingIcon" class="w-5 h-5 animate-spin hidden" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> </button> </div> <!-- Error State --> <div id="errorMessage" class="hidden mt-3 font-mono text-xs text-red-500 border border-red-500/30 bg-red-500/10 p-3">
[ERROR] Invalid URL or extraction failed.
</div> <!-- Results Area --> <div id="resultsArea" class="hidden mt-8"> <div class="flex items-center justify-between border-b border-[#222] pb-2 mb-4"> <h2 class="font-display text-2xl font-bold uppercase tracking-tight">Extracted Data</h2> <span id="resultCount" class="font-mono text-sm text-primary border border-primary px-3 py-1 bg-primary/10">0 Fonts Found</span> </div> <div id="fontsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> <!-- Font cards will be injected here --> </div> </div> </div> </div> <!-- Footer --> <footer class="p-6 border-t border-[#222] flex justify-between items-center text-xs font-mono text-neutral-600 uppercase mt-auto"> <div>[Fontextractor] &copy; 2026</div> <div class="flex gap-4"> <a href="#" class="hover:text-primary transition-colors">GitHub</a> <a href="#" class="hover:text-primary transition-colors">API Docs</a> </div> </footer> </main> ` })} ${renderScript($$result, "C:/Users/Jarvis/Desktop/New folder (2)/fontextractor/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Jarvis/Desktop/New folder (2)/fontextractor/src/pages/index.astro", void 0);

const $$file = "C:/Users/Jarvis/Desktop/New folder (2)/fontextractor/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
