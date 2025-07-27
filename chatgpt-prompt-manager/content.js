(function () {
  'use strict';

  const localKey = "chatgpt_prompt_objects";
  let prompts = [];
  let autosend = JSON.parse(localStorage.getItem("autosend_enabled") || "false");

  function loadPrompts() {
    const data = localStorage.getItem(localKey);
    try {
      prompts = data ? JSON.parse(data) : [];
    } catch (e) {
      prompts = [];
    }
  }

  function savePrompts() {
    localStorage.setItem(localKey, JSON.stringify(prompts));
  }

  function insertPrompt(content) {
    const editor = document.querySelector("#prompt-textarea");
    if (editor) {
      editor.focus();
      document.getSelection().selectAllChildren(editor);
      document.execCommand("delete", false, null);
      document.execCommand("insertText", false, content);
    } else {
      alert("Prompt input not found!");
    }
  }

  function autoSendPrompt() {
    const sendButton = document.querySelector("#composer-submit-button");
    if (sendButton) {
      sendButton.click();
    } else {
      console.warn("❌ Không tìm thấy nút gửi sau khi nạp prompt.");
    }
  }

  function createPromptMenu() {
    loadPrompts();

    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      position: "fixed",
      top: "50px",
      right: "20px",
      zIndex: 9999,
      fontFamily: "Arial",
    });

    const menuBtn = document.createElement("button");
    menuBtn.textContent = "☰";
    Object.assign(menuBtn.style, {
      color: "#000",
      fontSize: "20px",
      padding: "6px 12px",
      marginBottom: "5px",
      borderRadius: "6px",
      border: "1px solid #000",
      background: "#fff",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    });

    const dropdown = document.createElement("div");
    Object.assign(dropdown.style, {
      color: "#000",
      display: "none",
      marginTop: "10px",
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      minWidth: "300px",
    });

    // AutoSend label + button
    const autoSendRow = document.createElement("div");
    autoSendRow.style.display = "flex";
    autoSendRow.style.alignItems = "center";
    autoSendRow.style.marginBottom = "10px";

    const autoSendLabel = document.createElement("span");
    autoSendLabel.textContent = "AutoSend";
    autoSendLabel.style.marginRight = "8px";

    const autoSendToggle = document.createElement("button");
    autoSendToggle.textContent = autosend ? "🟢 ON" : "⚫ OFF";
    Object.assign(autoSendToggle.style, {
      color: "#000",
      padding: "4px 10px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      cursor: "pointer",
      background: "#fff",
    });

    autoSendToggle.onclick = () => {
      autosend = !autosend;
      localStorage.setItem("autosend_enabled", JSON.stringify(autosend));
      autoSendToggle.textContent = autosend ? "🟢 ON" : "⚫ OFF";
    };

    autoSendRow.appendChild(autoSendLabel);
    autoSendRow.appendChild(autoSendToggle);

    const select = document.createElement("select");
    Object.assign(select.style, {
      marginBottom: "10px",
      width: "100%",
      padding: "5px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      color: "#000",
      outline: "none", 
      boxShadow: "none", 
    });

    function refreshOptions(selectedIndex = null) {
      select.innerHTML = "";
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "-- No prompt --";
      select.appendChild(emptyOption);

      prompts.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = item.title || `Prompt ${index + 1}`;
        select.appendChild(option);
      });

      select.selectedIndex = selectedIndex !== null ? selectedIndex + 1 : 0;
    }

    select.onchange = () => {
      const selected = parseInt(select.value);
      if (!isNaN(selected)) {
        insertPrompt(prompts[selected].content);
        if (autosend) {
          setTimeout(autoSendPrompt, 300);
        }
      } else {
        const editor = document.querySelector("#prompt-textarea");
        if (editor) {
          editor.focus();
          document.getSelection().selectAllChildren(editor);
          document.execCommand("delete", false, null);
        }
      }
    };

    refreshOptions();

    const formWrapper = document.createElement("div");
    Object.assign(formWrapper.style, {
      display: "none",
      marginTop: "10px",
    });

    const titleInput = document.createElement("input");
    Object.assign(titleInput, {
      placeholder: "Title",
    });
    Object.assign(titleInput.style, {
      width: "100%",
      marginBottom: "5px",
      padding: "6px",
      color: "#000",
      border: "1px solid #ccc",
      borderRadius: "4px",
      outline: "none", 
      boxShadow: "none", 

    });

    const contentInput = document.createElement("textarea");
    Object.assign(contentInput, {
      placeholder: "Prompt content...",
    });
    Object.assign(contentInput.style, {
      width: "100%",
      height: "100px",
      padding: "6px",
      marginBottom: "5px",
      color: "#000",
      border: "1px solid #ccc",
      borderRadius: "4px",
      outline: "none", 
      boxShadow: "none", 
    });

    const saveFormBtn = document.createElement("button");
    saveFormBtn.textContent = "💾 Save";

    const cancelFormBtn = document.createElement("button");
    cancelFormBtn.textContent = "❌ Cancel";

    [saveFormBtn, cancelFormBtn].forEach(btn => {
      Object.assign(btn.style, {
        color: "#000",
        padding: "6px 10px",
        marginRight: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        background: "#fff",
      });
    });

    formWrapper.appendChild(titleInput);
    formWrapper.appendChild(contentInput);
    formWrapper.appendChild(saveFormBtn);
    formWrapper.appendChild(cancelFormBtn);

    let editingIndex = null;

    const controlRow = document.createElement("div");
    Object.assign(controlRow.style, {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "10px",
    });

    const addBtn = document.createElement("button");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    addBtn.textContent = "➕";
    editBtn.textContent = "✏️";
    deleteBtn.textContent = "🗑️";

    [addBtn, editBtn, deleteBtn].forEach(btn => {
      Object.assign(btn.style, {
        fontSize: "18px",
        marginRight: "8px",
        padding: "6px 10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#fff",
        color: "#000",
      });
    });

    addBtn.onclick = () => {
      editingIndex = null;
      titleInput.value = "";
      contentInput.value = "";
      formWrapper.style.display = "block";
    };

    editBtn.onclick = () => {
      const selected = parseInt(select.value);
      if (isNaN(selected)) return;
      editingIndex = selected;
      titleInput.value = prompts[selected].title;
      contentInput.value = prompts[selected].content;
      formWrapper.style.display = "block";
    };

    deleteBtn.onclick = () => {
      const selected = parseInt(select.value);
      if (isNaN(selected)) return;
      if (confirm("Delete this prompt?")) {
        prompts.splice(selected, 1);
        savePrompts();
        refreshOptions();
      }
    };

    saveFormBtn.onclick = () => {
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      if (!title || !content) return alert("Fields cannot be empty!");

      let selectedAfter = 0;
      if (editingIndex !== null) {
        prompts[editingIndex] = { title, content };
        selectedAfter = editingIndex;
      } else {
        prompts.push({ title, content });
        selectedAfter = prompts.length - 1;
      }

      savePrompts();
      refreshOptions(selectedAfter);
      insertPrompt(prompts[selectedAfter].content);
      if (autosend) {
        setTimeout(autoSendPrompt, 300);
      }

      formWrapper.style.display = "none";
    };

    cancelFormBtn.onclick = () => {
      formWrapper.style.display = "none";
    };

    controlRow.appendChild(addBtn);
    controlRow.appendChild(editBtn);
    controlRow.appendChild(deleteBtn);

    menuBtn.onclick = () => {
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    };

    dropdown.appendChild(autoSendRow);
    dropdown.appendChild(select);
    dropdown.appendChild(controlRow);
    dropdown.appendChild(formWrapper);

    wrapper.appendChild(menuBtn);
    wrapper.appendChild(dropdown);
    document.body.appendChild(wrapper);
  }

  // Hiển thị menu sau khi textarea xuất hiện
  const waitInterval = setInterval(() => {
    if (document.querySelector("#prompt-textarea")) {
      clearInterval(waitInterval);
      createPromptMenu();
    }
  }, 1000);
})();
