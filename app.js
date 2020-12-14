// VARIABLES
const textarea = new SimpleMDE({
  spellChecker: false,
  toolbar: [
    {
      name: "bold",
      action: SimpleMDE.toggleBold,
      className: "fa fa-bold",
      title: "Bold",
    },
    {
      name: "italic",
      action: SimpleMDE.toggleItalic,
      className: "fa fa-italic",
      title: "Italic",
    },
    {
      name: "heading",
      action: SimpleMDE.toggleHeader,
      className: "fa fa-header",
      title: "Heading",
    },
    // "|",
    // {
    //   name: "quote",
    //   action: SimpleMDE.toggleBlockquote,
    //   className: "fa fa-quote-left",
    //   title: "Quote",
    // },
    {
      name: "unordered-list",
      action: SimpleMDE.toggleUnorderedList,
      className: "fa fa-list-ul",
      title: "Generic List",
    },
    // {
    //   name: "ordered-list",
    //   action: SimpleMDE.toggleOrderedList,
    //   className: "fa fa-list-ol",
    //   title: "Numbered List",
    // },
    // "|",
    // {
    //   name: "link",
    //   action: SimpleMDE.drawLink,
    //   className: "fa fa-link",
    //   title: "Create Link",
    // },
    {
      name: "image",
      action: SimpleMDE.drawImage,
      className: "fa fa-picture-o",
      title: "Insert Image",
    },
    // "|",
    {
      name: "preview",
      action: SimpleMDE.togglePreview,
      className: "fa fa-eye no-disable",
      title: "Toggle Preview",
    },
    // {
    //   name: "side-by-side",
    //   action: SimpleMDE.toggleSideBySide,
    //   className: "fa fa-columns no-disable no-mobile",
    //   title: "Toggle Side by Side",
    // },
    // {
    //   name: "fullscreen",
    //   action: SimpleMDE.toggleFullScreen,
    //   className: "fa fa-arrows-alt no-disable no-mobile",
    //   title: "Toggle Fullscreen",
    // },
    // "|",
    {
      name: "downloadNote",
      action: function downloadNote() {
        document.querySelector(".fa-download").addEventListener("click", () => {
          const link = document.createElement("a");
          link.download = "data.md";
          const blob = new Blob([textarea.value()], { type: "text/plain" });
          link.href = window.URL.createObjectURL(blob);
          link.click();
        });
      },
      className: "fa fa-download",
      title: "Download Note",
    },
    {
      name: "print",
      action: function printNote() {
        document.querySelector(".CodeMirror").style.border = "none";
        document.querySelector(".editor-toolbar").style.border = "none";

        document.querySelector(".fa-print").addEventListener("click", () => {
          const cm = textarea.codemirror;
          const wrapper = cm.getWrapperElement();
          const preview = wrapper.lastChild;

          document.querySelector(".ttpo").innerHTML = noteTitle.value;
          document.querySelector(
            ".ttpo"
          ).innerHTML += textarea.options.previewRender(
            textarea.value(),
            preview
          );
          window.print();
        });
      },
      className: "fa fa-print",
      title: "Print Note",
    },
    {
      name: "trash",
      action: function deleteDoc() {
        document.querySelector(".fa-trash").addEventListener("click", () => {
          console.log("click");
          window.localStorage.removeItem(docDataSkeleton.id);
          editor.style.width = "0%";
          displayNotesList();
        });
      },
      className: "fa fa-trash",
      title: "Trash Button",
    },
    {
      name: "guide",
      action: function redirectToGuide() {
        document
          .querySelector(".fa-question-circle")
          .addEventListener("click", () => {
            window.open("https://simplemde.com/markdown-guide", "_blank");
          });
      },
      className: "fa fa-question-circle",
      title: "Markdown Guide",
    },
  ],
});

// @TODO add variable for LSkeys
const noteTitle = document.querySelector(".title-input-field");
const favorite = document.querySelector(".favorite-tag");
const tagInputField = document.querySelector(".tag-input-field");
const noteList = document.querySelector(".note-list");
const newDocButton = document.querySelector(".new-doc");
const editor = document.querySelector(".editor");
const tagsList = document.querySelector(".tags-list");

const leftSidebar = document.querySelector(".left-sidebar");
const tagMenu = document.querySelector(".tag-menu");
const rightSidebar = document.querySelector(".right-sidebar");
const searchBar = document.querySelector("#search-input");
let currentTagFilter;

const docDataSkeleton = {
  id: "",
  title: "",
  content: "",
  favorite: false,
  creationDate: "",
  lastSavedDate: "",
  tags: [],
};

let config = { darkMode: false };

function saveConfig() {
  localStorage.setItem("config", JSON.stringify(config));
}

if (!localStorage.getItem("config")) {
  localStorage.setItem("config", JSON.stringify(config));
} else {
  config = JSON.parse(localStorage.getItem("config"));
}

// EVENTLISTENERS
newDocButton.addEventListener("click", () => {
  createNewDoc();
});

textarea.codemirror.on("inputRead", () => {
  saveDoc();
});

textarea.codemirror.on("keyHandled", () => {
  saveDoc();
});

noteTitle.addEventListener("input", (e) => {
  saveDoc();
});

favorite.addEventListener("click", (e) => {
  if (docDataSkeleton.favorite === true) {
    favorite.setAttribute("fill", "none");
    docDataSkeleton.favorite = false;
  } else {
    favorite.setAttribute("fill", "#f58a8a");
    docDataSkeleton.favorite = true;
  }
  saveDoc();
});

document.querySelector(".add-tag-button").addEventListener("click", () => {
  if (tagInputField.value !== "") {
    docDataSkeleton.tags.push(tagInputField.value.toLowerCase());
  }
  tagsList.innerHTML = "";
  tagInputField.value = "";
  createNewTag();
  saveDoc();
});

//FUNCTIONS
function createNewTag(arr) {
  arr = docDataSkeleton.tags;
  //   Sortera bort duplicates
  let uniqueSet = new Set(arr);
  let newArr = [...uniqueSet];
  // Loopar igenom unika tags
  newArr.forEach(function (tag) {
    //Skapar list-item
    let li = document.createElement("li");
    //Lägger li under tags-ul
    tagsList.appendChild(li);
    let p = document.createElement("p");
    //Ersätt p-tag-texten med enskilda tag:en
    p.innerHTML = tag.toLowerCase();
    li.appendChild(p);
  });
}

function saveDoc() {
  if (textarea.value().length > 0 || noteTitle.value.length > 0) {
    if (!docDataSkeleton.id) {
      docDataSkeleton.creationDate = new Date();
      // unique ID generated by timestamp
      docDataSkeleton.id = Date.now();
    }

    if (!noteTitle.value) {
      docDataSkeleton.title = textarea.value().split("\n")[0];
    } else {
      docDataSkeleton.title = noteTitle.value;
    }

    docDataSkeleton.content = textarea.value();
    docDataSkeleton.lastSavedDate = Date.now();

    //Filtrerar tags i LS
    let arr = docDataSkeleton.tags;
    let uniqueSet = new Set(arr);
    let newArr = [...uniqueSet];
    docDataSkeleton.tags = newArr;

    //Spara anteckning i local storage
    window.localStorage.setItem(
      docDataSkeleton.id,
      JSON.stringify(docDataSkeleton)
    );
    displayNotesList();
    tagsInSidebar();
    tagsEventListener();
    noteStats();
  }
}

function createNewDoc() {
  textarea.value("");
  noteTitle.value = "";
  tagInputField.value = "";
  tagsList.innerHTML = "";
  favorite.setAttribute("src", "./icons/star.svg");

  for (element in docDataSkeleton) {
    if (element === "tags") {
      docDataSkeleton[element] = [];
    } else {
      docDataSkeleton[element] = "";
    }
  }
}

function loadDoc(docData) {
  tagsList.innerHTML = "";
  tagInputField.value = "";
  textarea.value(docData.content);
  noteTitle.value = docData.title;
  favorite.value = docData.favorite;
  docDataSkeleton.id = docData.id;
  docDataSkeleton.tags = docData.tags;

  if (docData.favorite === true) {
    favorite.setAttribute("fill", "#f58a8a");
  } else {
    favorite.setAttribute("fill", "none");
  }

  // TODO: formatera tiden och styling
  document.querySelector(".creation-date").innerHTML = docData.creationDate;
  createNewTag();
  noteStats();
}

function displayNotesList(searchList) {
  noteList.innerHTML = "";
  if (!searchList) {
    let notes = [];
    let tempNotesArr = [];

    for (key in localStorage) {
      if (key !== "config") {
        if (JSON.parse(localStorage.getItem(key)) !== null) {
          if (JSON.parse(localStorage.getItem(key)).favorite) {
            notes.push(JSON.parse(localStorage.getItem(key)));
          } else {
            tempNotesArr.push(JSON.parse(localStorage.getItem(key)));
          }
        }
      }
    }
    tempNotesArr.sort(function (a, b) {
      return b.lastSavedDate - a.lastSavedDate;
    });
    notes.sort(function (a, b) {
      return b.lastSavedDate - a.lastSavedDate;
    });
    notes.push(...tempNotesArr);

    if (currentTagFilter) {
      notes = notes.filter((note) => {
        return note.tags.includes(currentTagFilter);
      });
    }
    notes.forEach((note) => createNoteListItem(note));
  } else searchList.forEach((note) => createNoteListItem(note));
}

function createNoteListItem(docData) {
  const noteContainer = document.createElement("li");
  noteContainer.classList.add("note-container");
  noteContainer.addEventListener("click", function () {
    editor.style.width = "100%";
    loadDoc(docData);
  });

  //SIDE
  const sideContent = document.createElement("div");
  const sinceEdited = document.createElement("p");
  let starIcon;

  if (docData.favorite === true) {
    starIcon = createSVGStar(true);
  } else {
    starIcon = createSVGStar();
  }

  sideContent.classList.add("side-content");
  sinceEdited.classList.add("since-edited");
  starIcon.classList.add("star-icon");
  starIcon.classList.add("non");

  let minutes = Math.floor((Date.now() - docData.lastSavedDate) / 60000);

  let hours = Math.floor(minutes / 60);
  let days = Math.floor(minutes / 60 / 24);
  let weeks = Math.floor(minutes / 60 / 24 / 7);

  if (minutes < 60) {
    sinceEdited.innerHTML = `${minutes} m`;
  } else if (minutes < 60 * 24) {
    sinceEdited.innerHTML = `${hours} h`;
  } else if (minutes < 60 * 24 * 7) {
    sinceEdited.innerHTML = `${days} d`;
  } else if (minutes < 60 * 24 * 7 * 4) {
    sinceEdited.innerHTML = `${weeks} w`;
  } else {
    sinceEdited.innerHTML = `long time ago`;
  }

  sideContent.appendChild(sinceEdited);
  sideContent.appendChild(starIcon);

  //MAIN
  const mainContent = document.createElement("div");
  const noteTitle = document.createElement("h2");
  const noteContent = document.createElement("p");

  mainContent.classList.add("main-content");
  noteTitle.classList.add("note-title");
  noteContent.classList.add("note-content");

  noteTitle.innerHTML = docData.title;
  noteContent.innerHTML = docData.content;
  mainContent.appendChild(noteTitle);
  mainContent.appendChild(noteContent);

  //container för notes och info på vänstra sidan
  noteContainer.appendChild(sideContent);
  noteContainer.appendChild(mainContent);
  noteList.appendChild(noteContainer);
}

function tagsInSidebar() {
  tagMenu.innerHTML = "";

  let allTags = [];
  for (key in localStorage) {
    let allNotesInLS = JSON.parse(localStorage.getItem(key));
    if (key !== "config") {
      if (allNotesInLS !== null) {
        allTags.push(...allNotesInLS.tags);
      }
    }
  }

  let uniqueTags = new Set(allTags);
  [...uniqueTags].forEach((tag) => {
    let li = document.createElement("li");
    tagMenu.appendChild(li);
    let p = document.createElement("p");
    p.classList.add("tag");
    p.innerHTML = tag;
    li.appendChild(p);
  });
}

function tagsEventListener() {
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      currentTagFilter = tag.innerHTML;

      if (tag.classList.contains("active-tag")) {
        currentTagFilter = "";
        tag.classList.remove("active-tag");
      } else {
        document
          .querySelectorAll(".tag")
          .forEach((tag) => tag.classList.remove("active-tag"));
        tag.classList.add("active-tag");
      }
      displayNotesList();
    });
  });
}

document
  .querySelector(".left-sidebar-button")
  .addEventListener("click", (event) => {
    if (leftSidebar.style.width === "100%") {
      leftSidebar.style.width = "0%";
    } else leftSidebar.style.width = "100%";
  });

newDocButton.addEventListener("click", (event) => {
  editor.style.width = "100%";
});

document
  .querySelector(".editor-back-button")
  .addEventListener("click", (event) => {
    editor.style.width = "0%";
  });

document
  .querySelector(".right-sidebar-button")
  .addEventListener("click", (event) => {
    rightSidebar.style.width = "100%";
  });

document
  .querySelector(".right-sidebar-close-button")
  .addEventListener("click", (event) => {
    rightSidebar.style.width = "0%";
  });

//TODO: Skriv if-sats: om användaren har raderat welcome msg, ska det ej komma tillbaka.
if (localStorage.getItem(1) === null) {
  docDataSkeleton.content =
    "Quire är en multifunktionell anteckningsbok som fungerar direkt i webbläsaren. Den första versionen av tjänsten sparar alla anteckningar lokalt i datorn/webbläsaren och har alltså ingen server eller backend.";
  docDataSkeleton.title = "Welcome to Quire, almost as good as Bear";
  docDataSkeleton.creationDate = new Date();
  docDataSkeleton.id = 1;
  docDataSkeleton.lastSavedDate = Date.now();
  window.localStorage.setItem(
    docDataSkeleton.id,
    JSON.stringify(docDataSkeleton)
  );
}

searchBar.addEventListener("keyup", (text) => {
  let notes = [];

  for (key in localStorage) {
    if (JSON.parse(localStorage.getItem(key)) !== null) {
      const lsObject = JSON.parse(localStorage.getItem(key));
      let searchStr = text.target.value.toLowerCase();

      if (
        lsObject.title.toLowerCase().includes(searchStr) ||
        lsObject.content.toLowerCase().includes(searchStr)
      ) {
        notes.push(lsObject);
      }
      displayNotesList(notes);
    }
  }
});

function noteStats() {
  let lineCount = document.querySelector(".lines");
  let wordCount = document.querySelector(".words");

  let lines = lineCount.innerHTML;
  let words = wordCount.innerHTML;

  // const noteContent = document.createElement("p");
  // mainContent.classList.add("main-content");
}

displayNotesList();
tagsInSidebar();
tagsEventListener();
setDarkMode();

function setDarkMode(save) {
  if (config.darkMode) {
    document.documentElement.style.setProperty(
      "--main-background-color",
      "#131921"
    );
    document.documentElement.style.setProperty("--main-text-color", "#d7d5c5");

    document.querySelectorAll("svg").forEach((svg) => {
      svg.style.stroke = "white";
    });
  } else {
    document.documentElement.style.setProperty(
      "--main-background-color",
      "white"
    );
    document.documentElement.style.setProperty("--main-text-color", "black");

    document.querySelectorAll("svg").forEach((svg) => {
      svg.style.stroke = "black";
    });
  }
  config.darkMode = !config.darkMode;

  if (save) {
    save();
  }
}

document.querySelector(".dark-mode").addEventListener("click", () => {
  setDarkMode(saveConfig());
});

document.querySelector(".search-button").addEventListener("click", (event) => {
  const input = document.querySelector(".search-input");
  input.classList.toggle("active");
  input.focus();
  input.innerHTML = "";
});

function createSVGStar(filled = false) {
  let fillColor = "none";
  if (filled) fillColor = "#f58a8a";

  const svgStar = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgStar.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgStar.setAttribute("width", "24");
  svgStar.setAttribute("height", "24");
  svgStar.setAttribute("svgviewBox", "0 0 24 24");
  svgStar.setAttribute("fill", fillColor);
  svgStar.setAttribute("stroke", "#f58a8a");
  svgStar.setAttribute("stroke-width", "1");
  svgStar.setAttribute("stroke-linecap", "round");
  svgStar.setAttribute("stroke-linejoin", "round");
  svgStar.setAttribute("class", "feather feather-star");

  const polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  polygon.setAttribute(
    "points",
    "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
  );
  svgStar.appendChild(polygon);

  return svgStar;
}
