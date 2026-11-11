import { readFileSync } from "node:fs";
import path from "node:path";
import DesignFrame from "./design-frame";

const designFiles = {
  home: "home_where_design_meets_durability/code.html",
  technology: "how_tuffskin_works_technology_science/code.html",
  surfaces: "protected_surfaces_marble_quartzite_onyx/code.html",
  warranty: "10_year_warranty_lab_testing/code.html",
  contact: "free_quote_contact_mirador_stoneworks/code.html",
} as const;

export type DesignPageKey = keyof typeof designFiles;

const routeByDesignPath: Record<string, string> = {
  home: "/",
  "how-tuffskin-works": "/technology",
  "protected-surfaces": "/protected-surfaces",
  "residential-commercial": "/protected-surfaces#residential-applications",
  "warranty-testing": "/warranty",
  "free-quote-contact": "/contact",
};

const mobileNavigation = `
  <nav class="site-mobile-nav" aria-label="Primary navigation">
    <a href="/" target="_top">Home</a>
    <a href="/technology" target="_top">Technology</a>
    <a href="/protected-surfaces" target="_top">Surfaces</a>
    <a href="/warranty" target="_top">Warranty</a>
    <a href="/contact" target="_top">Contact</a>
  </nav>
`;

const embeddedStyles = `
  .brand-wordmark { gap: 4px; }
  .brand-wordmark-name {
    color: #f8fafc;
    font-family: Outfit, Inter, sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.045em;
    line-height: 1;
    white-space: nowrap;
  }
  .brand-wordmark-name span { color: #ffba46; font-style: italic; }
  .brand-wordmark-caption {
    color: #ffba46;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    line-height: 1.2;
    text-transform: uppercase;
  }
  .site-mobile-nav { display: none; }
  @media (max-width: 1279px) {
    body { padding-bottom: calc(74px + env(safe-area-inset-bottom)); }
    .site-mobile-nav {
      position: fixed;
      z-index: 100;
      right: 12px;
      bottom: max(12px, env(safe-area-inset-bottom));
      left: 12px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 4px;
      min-height: 54px;
      padding: 8px 10px;
      border: 1px solid rgb(255 186 70 / 26%);
      border-radius: 8px;
      background: rgb(4 14 31 / 94%);
      box-shadow: 0 10px 35px rgb(2 6 23 / 58%);
      backdrop-filter: blur(16px);
    }
    .site-mobile-nav a {
      min-width: 0;
      padding: 10px 7px;
      color: #bec6e0;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      line-height: 1;
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
    }
    .site-mobile-nav a:hover,
    .site-mobile-nav a:focus-visible { color: #ffba46; }
  }
  @media (max-width: 380px) {
    .site-mobile-nav { right: 8px; left: 8px; gap: 0; padding-inline: 4px; }
    .site-mobile-nav a { padding-inline: 5px; font-size: 10px; }
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
`;

const siteInteractions = `
window.toggleFaq = function (faq) {
  const answer = faq.querySelector(".faq-content");
  const icon = faq.querySelector(".material-symbols-outlined");

  if (answer) answer.classList.toggle("hidden");
  if (icon) icon.classList.toggle("rotate-180");
};

window.submitQuote = function () {
  const field = function (id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
  };
  const selected = function (name) {
    const element = document.querySelector('input[name="' + name + '"]:checked');
    return element ? element.value : "";
  };
  const files = document.getElementById("fileUpload");
  const sampleKit = document.getElementById("sampleKitCheck");
  const details = [
    "Name: " + field("fullName"),
    "Email: " + field("email"),
    "Phone: " + field("phone"),
    "Houston ZIP code: " + field("zipCode"),
    "Project type: " + selected("projectType"),
    "Finish: " + selected("finish"),
    "Stone: " + field("stoneType"),
    "Estimated area: " + field("sqft"),
    "Project notes: " + field("concerns"),
    "Sample kit requested: " + (sampleKit && sampleKit.checked ? "Yes" : "No"),
    "Files selected: " + (files && files.files ? files.files.length : 0) + " (attach these to the email draft)",
  ].join("\\n");

  window.location.href = "mailto:contact@tuffskinhouston.com?subject=" +
    encodeURIComponent("TuffSkin Houston quote request") +
    "&body=" + encodeURIComponent(details);
};

document.addEventListener("click", function (event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest("a[data-path], .site-mobile-nav a");
  if (!anchor) return;

  try {
    window.parent.sessionStorage.setItem("tuffskin:route-load", "route");
  } catch {
    // The destination page will use its normal startup duration.
  }
});
`;

function getDesignDocument(page: DesignPageKey) {
  const filePath = path.join(process.cwd(), "tuffskin", designFiles[page]);
  let markup = readFileSync(filePath, "utf8");

  markup = markup.replace(
    /<div\b(?=[^>]*\brounded-full)(?=[^>]*\bbg-primary)[^>]*>\s*<span\b[^>]*>person<\/span>\s*<\/div>/gi,
    "",
  );

  markup = markup.replace(
    /<img\b[^>]*\balt="TuffSkin Houston Brand Logo"[^>]*>/gi,
    "",
  );

  markup = markup.replace(
    /<div class="flex flex-col"><span class="font-headline-sm text-headline-sm text-marble-white tracking-wide uppercase leading-none">TuffSkin<\/span><span class="font-label-caps text-label-caps text-primary tracking-widest uppercase mt-space-xs">[^<]*<\/span><\/div>/,
    '<div class="flex flex-col brand-wordmark"><span class="brand-wordmark-name">Tuffskin <span>Houston</span></span><span class="brand-wordmark-caption">Mirador Stoneworks</span></div>',
  );

  markup = markup.replace(
    /<a\b[^>]*\bdata-path="([^"]+)"[^>]*>/gi,
    (anchorTag, designPath: string) => {
      const href = routeByDesignPath[designPath];
      if (!href) return anchorTag;

      const routedAnchor = anchorTag.replace(
        /\bhref=(["'])#\1/i,
        `href="${href}"`,
      );
      return /\btarget=/i.test(routedAnchor)
        ? routedAnchor.replace(/\btarget=(['"])[^'"]*\1/i, 'target="_top"')
        : routedAnchor.replace(/>$/, ' target="_top">');
    },
  );

  if (page === "surfaces") {
    const residentialHeading = markup.indexOf("Residential Applications Across");

    if (residentialHeading !== -1) {
      const sectionStart = markup.lastIndexOf("<section", residentialHeading);
      const openingTagEnd = markup.indexOf(">", sectionStart);

      if (sectionStart !== -1 && openingTagEnd !== -1) {
        const openingTag = markup.slice(sectionStart, openingTagEnd + 1);
        markup =
          markup.slice(0, sectionStart) +
          openingTag.replace("<section", '<section id="residential-applications"') +
          markup.slice(openingTagEnd + 1);
      }
    }
  }

  markup = markup.replace(
    /<\/head>/i,
    `<style>${embeddedStyles}</style></head>`,
  );
  markup = markup.replace(
    /<\/body>/i,
    `${mobileNavigation}<script>${siteInteractions}</script></body>`,
  );

  return markup;
}

export default function DesignPage({ page }: { page: DesignPageKey }) {
  const titles: Record<DesignPageKey, string> = {
    home: "TuffSkin Houston home",
    technology: "TuffSkin Houston technology and specifications",
    surfaces: "TuffSkin Houston protected surfaces",
    warranty: "TuffSkin Houston warranty and testing",
    contact: "Contact TuffSkin Houston",
  };

  return <DesignFrame html={getDesignDocument(page)} title={titles[page]} />;
}
