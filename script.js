// Parse tool ID from URL (e.g., tools.html?id=ghidra)
function getToolIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadTool() {
  const toolId = getToolIdFromURL();
  if (!toolId) {
    document.getElementById("tool-container").innerHTML = "<p>Tool not specified.</p>";
    return;
  }

  const res = await fetch("data/tools.json");
  const tools = await res.json();
  const tool = tools.find(t => t.id === toolId);

  if (!tool) {
    document.getElementById("tool-container").innerHTML = "<p>Tool not found.</p>";
    return;
  }

  const extra = tool.extra ? `<p>${tool.extra}</p>` : "";

  document.title = tool.name;
  document.getElementById("tool-container").innerHTML = `
    <h1>${tool.name}</h1>
    <p>${tool.description}</p>
    <p><strong>Category:</strong> ${tool.category}</p>
    <p><strong>Tags:</strong> ${tool.tags.join(", ")}</p>
    ${extra}
    <p><a href="${tool.url}">GitHub Repository</a></p>
    <p><a href="index.html">← Back</a></p>
  `;
}

document.addEventListener("DOMContentLoaded", loadTool);