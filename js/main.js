/* Düzenleme modu değişkenleri */
let editMode = false;
let editItem;
let editItemId;

/* HTML'den elemanları çağir */
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

/* Fonksiyonlar */

const addItem = (e) => {
  e.preventDefault();
  const value = input.value;
  if ((value !== "") & !editMode) {
    /* Silme işlemleri için benzersiz değere ihtiyacımız var bunun içi ID oluşturduk */
    const id = new Date().getTime().toString();
    createElement(id, value);
    setToDefault();
    showAlert("Eleman Eklendi", "success");
    addToLocalStorage(id, value);
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItemId, value);
    showAlert("Eleman Güncellendi", "success");
    setToDefault();
  }
};

/* Uyarı veren fonksiyon */
const showAlert = (text, action) => {
  /* Alert kısmının içeriğini belirle */
  alert.textContent = `${text}`;
  /* Alert kısmına class ekle */
  alert.classList.add(`alert-${action}`);
  /* Alert kısmının içeriğini güncelle ve eklele class'ı kaldır*/
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};
/* elemanları silen fonks. */
const deleteItem = (e) => {
  /* Silmek istenilen elemana erişim */
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;

  itemList.removeChild(element);
  removeFromLocalStorage(id);
  showAlert("Eleman Silindi", "danger");
  /* eğer ki hiç eleman yoksa sıfırlama butonunu kaldır */
  if (!itemList.children.length) {
    clearButton.style.display = "none";
  }
};
/* Elemanları güncelleyecek fonksiyon */
const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Düzenle";
};

/* Varsayılan değerlere döndüren fonks. */
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  addButton.textContent = "Ekle";
};

/* sayfa yüklendğinde elemanları render edecek fonks. */
const renderItems = () => {
  let items = getFromLocalStorage();
  console.log(items);
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
  }
};

/* Eleman oluşturan fonksiyon */
const createElement = (id, value) => {
  /* Yeni bir div oluşturur */
  const newDiv = document.createElement("div");
  /* Bu div'e attiribute ekle */
  newDiv.setAttribute(
    "data-id",
    id
  ); /* setAttribute işle bir elemanı Attribute ekleyebiliriz, 
  bu özellik bizden eklenecek özelliğin adını ve bu özelliğin değerini ister. */

  /* Bu div'e class ekle */
  newDiv.classList.add("items-list-item");
  /* Bu div HTML içeriğini belirle */
  newDiv.innerHTML = `
        <p class="item-name">${value}</p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>    
`;
  const deleteBtn = newDiv.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = newDiv.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItems);
  itemList.appendChild(newDiv);
  showAlert("Eleman Eklendi", "success");
};

/* Sıfırlama hyapan fonks. */
const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    clearButton.style.display = "none";
    showAlert("Liste Boş", "danger");
    /* localstorage temizler */
    localStorage.removeItem("items");
  }
};

/* Localstorage kayıt yapan fonks. */
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};
/* Localstorage'dan verileri alan fonks. */
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};
/* localstorage'dan verileri kaldıran fonks. */

const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};

/* localstorage'ı güncelleyen fonks. */
const updateLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      /* spread operatör: bu özellilk bir elemanı güncellerken veri kaybını önlemek için kullanılır.
      burada biz obje içerisinde yer alan value güncelledik. ama bunu yaparken İD değerini,
      kaybetmemek için spread operatör kullandık. */
      return { ...item, value: newValue };
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
};
/* Olay İzleyicileri */

/* formun gönderildiği anı yakala */
form.addEventListener("submit", addItem);
/* sayfanın yüklendiği anı yakala */

window.addEventListener("DOMContentLoaded", renderItems);

/* clear button'a tıklayınca elemanları sıfırlama */
clearButton.addEventListener("click", clearItems);
