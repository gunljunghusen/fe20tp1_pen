// VARIABLES
const textarea = new SimpleMDE();
const noteTitle = document.querySelector(".note-title");
const favorite = document.querySelector(".favorite-tag");
const tagInputField = document.querySelector(".tag-input-field");
const noteList = document.querySelector(".note-list");
const newDocButton = document.querySelector(".new-doc");
const editor = document.querySelector(".editor");
const tagsList = document.querySelector(".tags-list");

const leftSidebar = document.querySelector(".left-sidebar");
const tagMenu = document.querySelector(".tag-menu");
let currentTagFilter;
const rightSidebar = document.querySelector(".right-sidebar");
const searchButton = document.querySelector("#search-button");
const searchBar = document.querySelector("#search-input");

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

document.querySelector(".delete-doc").addEventListener("click", () => {
  window.localStorage.removeItem(docDataSkeleton.id);
  editor.style.width = "0%";
  displayNotesList();
});

textarea.codemirror.on("inputRead", () => {
  saveDoc();
});

noteTitle.addEventListener("input", (e) => {
  saveDoc();
});

favorite.addEventListener("click", (e) => {
  if (docDataSkeleton.favorite === true) {
    favorite.setAttribute("src", "./icons/star.svg");
    docDataSkeleton.favorite = false;
  } else {
    favorite.setAttribute("src", "./icons/star-clicked.svg");
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
    //Appends tagslist till tagsbar
    document.querySelector(".tags-bar").appendChild(tagsList);
  });
}

function saveDoc() {
  if (!docDataSkeleton.id) {
    docDataSkeleton.creationDate = new Date();
    // unique ID generated by timestamp
    docDataSkeleton.id = Date.now();
  }
  if (docDataSkeleton.favorite === true) {
    favorite.setAttribute("src", "icons/star-clicked.svg");
  } else {
    favorite.setAttribute("src", "icons/star.svg");
  }

  docDataSkeleton.content = textarea.value();
  docDataSkeleton.title = noteTitle.value;
  docDataSkeleton.lastSavedDate = Date.now();

  //Filtrerar tags i LS
  let arr = docDataSkeleton.tags;
  let uniqueSet = new Set(arr);
  let newArr = [...uniqueSet];
  docDataSkeleton.tags = newArr;

  //Spara anteckning i local storage
  window.localStorage.setItem(docDataSkeleton.id, JSON.stringify(docDataSkeleton));
  displayNotesList();
  tagsInSidebar();
  tagsEventListener();
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
    favorite.setAttribute("src", "icons/star-clicked.svg");
  } else {
    favorite.setAttribute("src", "icons/star.svg");
  }

  // TODO: formatera tiden och styling
  document.querySelector(".creation-date").innerHTML = docData.creationDate;
  createNewTag();
}

function displayNotesList() {
  noteList.innerHTML = "";
  let notes = [];
  let tempNotesArr = [];

  for (key in localStorage) {
    if (JSON.parse(localStorage.getItem(key)) !== null) {
      if (JSON.parse(localStorage.getItem(key)).favorite) {
        notes.push(JSON.parse(localStorage.getItem(key)));
      } else {
        tempNotesArr.push(JSON.parse(localStorage.getItem(key)));
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
  const starIcon = document.createElement("img");

  sideContent.classList.add("side-content");
  sinceEdited.classList.add("since-edited");
  starIcon.classList.add("star-icon");

  //TODO: Fixa if statements som räknar på timmar.
  sinceEdited.innerHTML = Math.floor((Date.now() - docData.lastSavedDate) / 60000) + "m";

  if (docData.favorite === true) {
    starIcon.setAttribute("src", "icons/star-clicked.svg");
  } else {
    starIcon.setAttribute("src", "icons/star.svg");
  }

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

function tagsInSidebar() {
  tagMenu.innerHTML = "";

  let allTags = [];
  for (key in localStorage) {
    let allNotesInLS = JSON.parse(localStorage.getItem(key));
    if (allNotesInLS !== null) {
      allTags.push(...allNotesInLS.tags);
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
        document.querySelectorAll(".tag").forEach((tag) => tag.classList.remove("active-tag"));
        tag.classList.add("active-tag");
      }

      displayNotesList();
    });
  });
}

document.querySelector(".left-sidebar-button").addEventListener("click", (event) => {
  leftSidebar.style.width = "100%";
});

document.querySelector(".left-sidebar-close-button").addEventListener("click", (event) => {
  leftSidebar.style.width = "0%";
});

newDocButton.addEventListener("click", (event) => {
  editor.style.width = "100%";
});

document.querySelector(".editor-back-button").addEventListener("click", (event) => {
  editor.style.width = "0%";
});

document.querySelector(".right-sidebar-button").addEventListener("click", (event) => {
  rightSidebar.style.width = "100%";
});

document.querySelector(".right-sidebar-close-button").addEventListener("click", (event) => {
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
  window.localStorage.setItem(docDataSkeleton.id, JSON.stringify(docDataSkeleton));
}

/**
 * SEARCH FUNCTION START HERE!
 *
 * [X1] 'click' event listener for search icon
 * [X2] 'keyup' event listener for input field
 *      BUG -- tömma inputfält!
 * [3] search for Titles in LS
 * [4] filter non-matching events in console to only show matches (console)
 * [5] search bar animation and input (notes page)
 * [6] filter non-matching events to only show matches (notes page)
 *
 *  */

/* KRILLES LÖSNING

search.addEventListener('input', function (evt) {
        evt.preventDefault();
        let searchStr = evt.target.value;
        console.log(searchStr);
        if (searchStr.length >= 1) {
            // anävndare har sökt något
            let foundNotes = searchNotes(searchStr);
            renderNotesList(foundNotes);
        } else {
            // anv har tömt sökrutan
            renderNotesList(notesArr)
        }
    }) */

searchButton.addEventListener("click", () => {
  // tömma inputfält!

  // fylla med titlar från notes
  let title = [];
  // let test123 = [];

  for (key in localStorage) {
    if (JSON.parse(localStorage.getItem(key)) !== null) {
      //if (key === key.length) {
      // ngn form av ifsats för att slippa dubletter
      // loopar 7 ggr för att få ut hela objektet
      // key.title length?
      // title.push(JSON.parse(localStorage.getItem(key)).title);

      console.log(title);
    }
  }
  // searchNotes();
});

searchBar.addEventListener("keyup", (text) => {
  // searchStr lagrar textvärdet
  let searchStr = text.target.value;
  // console.log(searchStr);
  console.log(searchNotes(searchStr));
});

function searchNotes(str) {
  return str;
}

// function testTitle() {
//   let title = docDataSkeleton.title;
//   console.log("text???" + docDataSkeleton.title);
// }

displayNotesList();
tagsInSidebar();
tagsEventListener();
