// VARIABLES
const textarea = document.querySelector("#textarea");
const newDoc = document.querySelector("#new-doc");
const deleteDocButton = document.querySelector("#delete-doc");
const noteTitle = document.querySelector("#note-title");
const favorite = document.querySelector("#favorite-tag");
const tagName = document.querySelector("#tag-name");
const tagButton = document.querySelector("#tag-button");
const noteList = document.querySelector("#note-menu");
const newDocButton = document.querySelector(".new-doc");
const edit = document.querySelector(".edit");
const editBackButton = document.querySelector(".edit-back-button");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const sidebarCloseButton = document.querySelector(".sidebar-close-button");

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
newDoc.addEventListener("click", () => {

  createNewDoc();
});

deleteDocButton.addEventListener("click", () => {
  textarea.value = "";

  deleteDoc();
});

// Input event
textarea.addEventListener("input", (e) => {
  // input value in textarea,
  saveDoc();
});

noteTitle.addEventListener("input", (e) => {
  saveDoc();
});

favorite.addEventListener("click", () => {
  saveDoc();
});

tagButton.addEventListener("click", () => {
  saveDoc();
  tagName.value = "";
});

// FUNCTIONS
function saveDoc() {
  // börja fylla docDataSkeleton med textarea & note value
  docDataSkeleton.content = textarea.value;
  docDataSkeleton.title = noteTitle.value;
  docDataSkeleton.favorite = favorite.checked;
  docDataSkeleton.tags.push(tagName.value);

  // kollar om det finns ett creation date, om inte så skapar den datum)
  // genererar även ID genom date object
  // ! gör att tom stärng = false
  if (!docDataSkeleton.creationDate) {
    docDataSkeleton.creationDate = new Date();

    // unique ID generated by timestamp
    docDataSkeleton.id = Date.now();
  }
  docDataSkeleton.lastSavedDate = new Date();
  window.localStorage.setItem(
    docDataSkeleton.id,
    JSON.stringify(docDataSkeleton)
  );
}

function deleteDoc() {
  // remove ID and remove the item
  window.localStorage.removeItem(docDataSkeleton.id);
}

function createNewDoc() {
  // töm textarea för ny yta
  textarea.value = "";
  noteTitle.value = "";
  tagName.value = "";

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





let storage = window.localStorage;

for (key in storage) {
  if (window.localStorage.getItem(key) !== null) {
    const docData = JSON.parse(window.localStorage.getItem(key));

    createNewMenuItem(docData);
  }
}

function createNewMenuItem(docData) {
  const noteContainer = document.createElement("li");
  noteContainer.classList.add("note-container");

  const side = document.createElement("div");
  const sinceEdited = document.createElement("p");
  const starIcon = document.createElement("img");

  side.classList.add("side");
  sinceEdited.classList.add("since-edited");
  starIcon.classList.add("star-icon");

  sinceEdited.innerHTML = "1m";
  starIcon.setAttribute("src", "icons/star.svg");

  side.appendChild(sinceEdited);
  side.appendChild(starIcon);


  const main = document.createElement("div");
  const noteTitle = document.createElement("h2");
  const noteContent = document.createElement("p");

  main.classList.add("main");
  noteTitle.classList.add("note-title");
  noteContent.classList.add("note-content");

  noteTitle.innerHTML = docData.title;
  noteContent.innerHTML = docData.content;

  main.appendChild(noteTitle);
  main.appendChild(noteContent);


  noteContainer.appendChild(side);


  noteList.appendChild(noteContainer);

  noteContainer.appendChild(main);
}



sidebarToggle.addEventListener('click', event => {
    sidebar.style.width = "100%";
});

sidebarCloseButton.addEventListener('click', event => {
  sidebar.style.width = "0%";
});




newDocButton.addEventListener('click', event => {
  edit.style.width = "100%";
});




editBackButton.addEventListener('click', event => {
  edit.style.width = "0%";
});
