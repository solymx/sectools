fetch("data/tools.json")
  .then(response => response.json())
  .then(data => {
    const toolList = document.getElementById("toolList");
    const searchInput = document.getElementById("search");
    const categoryFilter = document.getElementById("categoryFilter");

    const categories = [...new Set(data.map(tool => tool.category))];
    categories.sort();
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    function renderTools(tools) {
      toolList.innerHTML = "";
      tools.forEach(tool => {
        const card = document.createElement("div");
        card.className = "tool-card";

        const title = document.createElement("h2");
        title.textContent = tool.name;

        const desc = document.createElement("p");
        desc.textContent = tool.description;

        const category = document.createElement("p");
        category.innerHTML = `<strong>Category:</strong> ${tool.category}`;

        const tags = document.createElement("p");
        tags.innerHTML = `<strong>Tags:</strong> ${tool.tags.join(", ")}`;

        const link = document.createElement("a");
        link.href = tool.url;
        link.textContent = "GitHub Repository";
        link.target = "_blank";

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(category);
        card.appendChild(tags);
        card.appendChild(link);

        // Optional "extra" links
        if (tool.extra && typeof tool.extra === "object") {
          const extras = document.createElement("div");
          extras.style.marginTop = "0.5rem";

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
    }

    function applyFilters() {
      const keyword = searchInput.value.toLowerCase();
      const selectedCategory = categoryFilter.value;

      const filtered = data.filter(tool => {
        const matchKeyword =
          tool.name.toLowerCase().includes(keyword) ||
          tool.description.toLowerCase().includes(keyword) ||
          tool.tags.join(" ").toLowerCase().includes(keyword);
        const matchCategory = selectedCategory === "All" || tool.category === selectedCategory;
        return matchKeyword && matchCategory;
      });

      renderTools(filtered);
    }

    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);

    renderTools(data);
  });