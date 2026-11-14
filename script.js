
let letters = {};

const content = document.getElementById("content");
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".menu-toggle");

// Load letters published through Pages CMS
async function loadLetters() {
  try {
    const response = await fetch("./letters.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Could not load letters.json");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid letters data");
    }

    // Sort letters newest first
    data.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });

    letters = {};

    data.forEach((entry, index) => {
      const key = entry.slug || String(index);

      letters[key] = {
        date: entry.displayDate || entry.date || entry.title,
        homeDate: entry.displayDate || entry.date || entry.title,
        text: entry.text || ""
      };
    });

    render();
  } catch (error) {
    console.error("Error loading letters:", error);

    if (content) {
      content.textContent =
        "Unable to load letters. Please try refreshing the page.";
    }
  }
}

// Display the homepage or a selected letter
function render() {
  if (!content) return;

  const page = decodeURIComponent(
    location.hash.replace(/^#\/?/, "")
  ).replace(/\/$/, "") || "home";

  const entry = letters[page];

  content.replaceChildren();

  if (entry) {
    // Individual letter page
    const section = document.createElement("article");
    section.className = "letter";

    const heading = document.createElement("h1");
    heading.textContent = entry.date;

    const body = document.createElement("div");
    body.className = "body";

    const paragraphs = entry.text.split(/\n\s*\n/);

    paragraphs.forEach(paragraph => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      body.appendChild(p);
    });

    section.append(heading, body);
    content.appendChild(section);

  } else {
    // Homepage listing all letters
    const section = document.createElement("section");
    section.className = "home";

    const list = document.createElement("div");
    list.className = "letter-links";

    Object.entries(letters).forEach(([key, value]) => {
      const link = document.createElement("a");

      link.href = "#/" + encodeURIComponent(key);
      link.textContent = value.homeDate;

      list.appendChild(link);
    });

    if (Object.keys(letters).length === 0) {
      const message = document.createElement("p");
      message.textContent = "No letters published yet.";
      list.appendChild(message);
    }

    section.appendChild(list);
    content.appendChild(section);
  }

  // Update navigation
  document.querySelectorAll(".nav a").forEach(link => {
    const active = link.dataset.page === page;

    link.setAttribute(
      "aria-current",
      active ? "page" : "false"
    );
  });

  // Close mobile navigation
  if (nav) nav.classList.remove("open");

  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
  }

  window.scrollTo(0, 0);
}

// Mobile menu
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      String(open)
    );
  });
}

// Handle navigation between letters
window.addEventListener("hashchange", render);

// Start the website
loadLetters();
