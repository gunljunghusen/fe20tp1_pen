// VARIABLES
const textarea = new SimpleMDE({
  element: document.getElementById("textarea"),
  autoDownloadFontAwesome: true,
  showIcons: ["code", "table"],
});

const deleteDocButton = document.querySelector("#delete-doc");
const noteTitle = document.querySelector("#note-title");
const favorite = document.querySelector("#favorite-tag");
//TODO: Bytt namn på tagName till tagInputFile
const tagName = document.querySelector("#tag-name");
//TODO: Bytt namn på tagButton till addTagButton
const tagButton = document.querySelector("#tag-button");
const noteList = document.querySelector(".note-list");
const newDocButton = document.querySelector(".new-doc");
const editor = document.querySelector(".editor");
const editorBackButton = document.querySelector(".editor-back-button");
//tagsList är en lista för alla tags i editorn
const tagsList = document.querySelector(".tags-list");
//tagsBar container som håller tagsList
const tagsBar = document.querySelector(".tags-bar");

//LEFT SIDEBAR
const leftSidebarButton = document.querySelector(".left-sidebar-button");
const leftSidebar = document.querySelector(".left-sidebar");
const leftSidebarCloseButton = document.querySelector(
  ".left-sidebar-close-button"
);
const tagMenu = document.querySelector(".tag-menu");

//RIGHT SIDEBAR
const rightSidebarButton = document.querySelector(".right-sidebar-button");
const rightSidebar = document.querySelector(".right-sidebar");
const rightSidebarCloseButton = document.querySelector(
  ".right-sidebar-close-button"
);
const createdAt = document.querySelector(".creation-date");

// OBJECTS
const docDataSkeleton = {
  id: "",
  title: "",
  content: "",
  favorite: false,
  creationDate: "",
  lastSavedDate: "",
  tags: [],
};

// EVENTLISTENERS
newDocButton.addEventListener("click", () => {
  createNewDoc();
});

//Vi har en delete function i editorn
deleteDocButton.addEventListener("click", () => {
  textarea.value("");
  deleteDoc();
});

// Input event
//TODO: lägg till en class på alla saveDoc -textarea,noteTitle,favorite

textarea.codemirror.on("change", (e) => {
  saveDoc();
});

noteTitle.addEventListener("input", (e) => {
  saveDoc();
});

favorite.addEventListener("click", () => {
  saveDoc();
});

tagButton.addEventListener("click", () => {
  if (tagName.value !== "") {
    docDataSkeleton.tags.push(tagName.value.toLowerCase());
  }
  //Denna rad är viktigt, då den förhindrar dubbletter.
  tagsList.innerHTML = "";

  createNewTag();

  //CLEAR INPUT FIELD
  tagName.value = "";
  saveDoc();
});

// Generate welcome mssg

//TODO: Skriv if-sats: om användaren har raderat wellcome msg, ska det ej komma tillbaka.
if (localStorage.getItem(1) === null) {
  generateWelcomeMssg();
}
//TODO: radera dubbletter i local storage
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
    //Appends tagslist till tagsbar
    tagsBar.appendChild(tagsList);
    // filter method in loop?
  });
}

function saveDoc() {
  // börja fylla docDataSkeleton med textarea & note value
  docDataSkeleton.content = textarea.value();
  docDataSkeleton.title = noteTitle.value;
  docDataSkeleton.favorite = favorite.checked;

  //Kolla om id finns annars skapa ny anteckning
  if (!docDataSkeleton.id) {
    docDataSkeleton.creationDate = new Date();
    // unique ID generated by timestamp
    docDataSkeleton.id = Date.now();
  }

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
}

function deleteDoc() {
  // remove ID and remove the item
  window.localStorage.removeItem(docDataSkeleton.id);
}

function createNewDoc() {
  // töm textarea för ny yta
  textarea.value("");
  noteTitle.value = "";
  tagName.value = "";
  tagsList.innerHTML = "";

  for (element in docDataSkeleton) {
    if (element === "tags") {
      // töm tags array
      docDataSkeleton[element] = [];
    } else {
      // övriga blir tom sträng
      docDataSkeleton[element] = "";
    }
  }
}

function loadDoc(docData) {
  tagsList.innerHTML = "";
  textarea.value(docData.content);
  noteTitle.value = docData.title;
  tagName.value = "";
  favorite.value = docData.favorite;
  docDataSkeleton.id = docData.id;
  docDataSkeleton.tags = docData.tags;
  // formatera tiden och styling
  createdAt.innerHTML = docData.creationDate;
  createNewTag();
}

function displayNotesList() {
  noteList.innerHTML = "";

  let notes = [];
  for (key in localStorage) {
    if (JSON.parse(localStorage.getItem(key)) !== null) {
      notes.push(JSON.parse(localStorage.getItem(key)));
    }
  }
  notes.sort(function (a, b) {
    return b.lastSavedDate - a.lastSavedDate;
  });
  notes.forEach((note) => createNewMenuItem(note));
}

displayNotesList();

function generateWelcomeMssg() {
  // börja fylla docDataSkeleton med textarea & note value
  docDataSkeleton.content =
    "Quire är en multifunktionell anteckningsbok som fungerar direkt i webbläsaren. Den första versionen av tjänsten sparar alla anteckningar lokalt i datorn/webbläsaren och har alltså ingen server eller backend";
  docDataSkeleton.title = "Welcome to Quire, almost as good as Bear";

  docDataSkeleton.creationDate = new Date();

  // unique ID generated by timestamp
  docDataSkeleton.id = 1;

  docDataSkeleton.lastSavedDate = Date.now();

  window.localStorage.setItem(
    docDataSkeleton.id,
    JSON.stringify(docDataSkeleton)
  );
}

function createNewMenuItem(docData) {
  const noteContainer = document.createElement("li");
  noteContainer.classList.add("note-container");

  noteContainer.addEventListener("click", function () {
    editor.style.width = "100%";
    loadDoc(docData);
  });

  //SIDE
  const sideContent = document.createElement("div");
  const sinceEdited = document.createElement("p");
  const starIcon = document.createElement("img");

  //TODO: Ändra side till sideContent
  sideContent.classList.add("side-content");
  sinceEdited.classList.add("since-edited");
  starIcon.classList.add("star-icon");

  //TODO: Fixa if statements som räknar på timmar.
  sinceEdited.innerHTML =
    Math.floor((Date.now() - docData.lastSavedDate) / 60000) + "m";
  starIcon.setAttribute("src", "icons/star.svg");

  sideContent.appendChild(sinceEdited);
  sideContent.appendChild(starIcon);

  //MAIN
  const mainContent = document.createElement("div");
  const noteTitle = document.createElement("h2");
  const noteContent = document.createElement("p");

  mainContent.classList.add("main");
  noteTitle.classList.add("note-title");
  noteContent.classList.add("note-content");

  noteTitle.innerHTML = docData.title;
  noteContent.innerHTML = docData.content;

  mainContent.appendChild(noteTitle);
  mainContent.appendChild(noteContent);

  //container för notes och info på vänstra sidan
  noteContainer.appendChild(sideContent);
  noteContainer.appendChild(mainContent);
  //sideContent + mainContent = noteContainer
  noteList.appendChild(noteContainer);
}

// function createTagsInSidebar(arr) {
//   arr = localStorage.getItem(docData.tags);
//   console.log("this is" + arr);
//   //   Sortera bort duplicates
//   let uniqueSet = new Set(arr);
//   let newArr = [...uniqueSet];
//   // Loopar igenom unika tags
//   newArr.forEach(function (tag) {
//     //Skapar list-item
//     let li = document.createElement("li");
//     //Lägger li under tags-ul
//     tagsList.appendChild(li);
//     let p = document.createElement("p");
//     //Ersätt p-tag-texten med enskilda tag:en
//     p.innerHTML = tag.toLowerCase();
//     li.appendChild(p);
//     //Appends tagslist till tagsbar
//     tagMenu.appendChild(tagsList);
//     // filter method in loop?
//   });
// }

// let allTags = [];
// for (key in localStorage) {
//   if (JSON.parse(localStorage.getItem(key)) !== null) {
//     allTags.push(JSON.parse(localStorage.getItem(key)));
//   }
// }

function allTagsFilter() {
  let allTags = [];
  for (key in localStorage) {
    let allNotesInLS = JSON.parse(localStorage.getItem(key));
    if (allNotesInLS !== null) {
      allTags.push(...allNotesInLS.tags);
    }
  }
  let uniqueSet = new Set(allTags);
  let newArr = [...uniqueSet];
  return newArr;
}

allTagsFilter();

leftSidebarButton.addEventListener("click", (event) => {
  leftSidebar.style.width = "100%";
  tagMenu.appendChild(tagsList);
});

leftSidebarCloseButton.addEventListener("click", (event) => {
  leftSidebar.style.width = "0%";
});

newDocButton.addEventListener("click", (event) => {
  editor.style.width = "100%";
});

editorBackButton.addEventListener("click", (event) => {
  editor.style.width = "0%";
});

rightSidebarButton.addEventListener("click", (event) => {
  rightSidebar.style.width = "100%";

  // fulstyling
  createdAt.style.color = "white";
});

rightSidebarCloseButton.addEventListener("click", (event) => {
  rightSidebar.style.width = "0%";
});
