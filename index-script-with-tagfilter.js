document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("categoryfilter");
  const tagContainer = document.getElementById("tagfilter");
  const toolList = document.getElementById("toolList");
  const spinner = document.getElementById("spinner");

  if (!searchInput || !categoryFilter || !tagContainer || !toolList || !spinner) {
    console.error("Missing required DOM elements.");
    return;
  }

  let tools = [];

  // 顯示 loading spinner
  spinner.style.display = "block";

  fetch("data/tools.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch tools.json");
      return res.json();
    })
    .then((data) => {
      tools = data;
      renderCategoryOptions(tools);
      renderTags(tools);
      renderTools(tools);
    })
    .catch((err) => {
      console.error("Error loading tools:", err);
      toolList.innerHTML = "<p>Unable to load tools.</p>";
    })
    .finally(() => {
      // 隱藏 loading spinner
      spinner.style.display = "none";
    });

  function renderCategoryOptions(tools) {
    const categorySet = new Set();
    tools.forEach((tool) => categorySet.add(tool.category));
    const categories = Array.from(categorySet).sort();

    categoryFilter.innerHTML = `<option value="All">All</option>`;
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  function renderTags(tools) {
    tagContainer.innerHTML = "";
    const tagSet = new Set();
    tools.forEach((tool) => tool.tags.forEach((tag) => tagSet.add(tag)));
    const tags = Array.from(tagSet).sort();

    tags.forEach((tag) => {
      const label = document.createElement("label");
      label.style.marginRight = "1rem";
      label.innerHTML = `
        <input type="checkbox" name="tag" value="${tag}" />
        ${tag}
      `;
      tagContainer.appendChild(label);
    });

    tagContainer.addEventListener("change", update);
  }

  searchInput.addEventListener("input", update);
  categoryFilter.addEventListener("change", update);

  function update() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedTags = Array.from(tagContainer.querySelectorAll("input:checked")).map(i => i.value);

    const filtered = tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;

      const matchesTags =
        selectedTags.length === 0 || selectedTags.every(tag => tool.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });

    filtered.sort((a, b) => a.name.localeCompare(b.name));
    renderTools(filtered);
  }

  function renderTools(tools) {
    toolList.innerHTML = "";

    tools.forEach((tool) => {
      const card = document.createElement("div");
      card.className = "tool-card";
      card.innerHTML = `
        <h2>${tool.name}</h2>
        <p>${tool.description}</p>
        <p><strong>Category:</strong> ${tool.category}</p>
        <p><strong>Tags:</strong> ${tool.tags.join(", ")}</p>
        <p><a href="${tool.url}" target="_blank">GitHub Repository</a></p>
      `;

      if (tool.extra && typeof tool.extra === "object") {
        const extras = document.createElement("div");
        for (const [label, url] of Object.entries(tool.extra)) {
          const btn = document.createElement("a");
          btn.href = url;
          btn.target = "_blank";
          btn.textContent = label.charAt(0).toUpperCase() + label.slice(1);
          btn.className = "extra-btn";
          extras.appendChild(btn);
        }
        card.appendChild(extras);
      }

      toolList.appendChild(card);
    });

    if (tools.length === 0) {
      toolList.innerHTML = "<p>No matching tools found.</p>";
    }
  }
});