// Storage Controller
const StorageCtrl = (function() {
  // Public Method
  return {
    storeItem: function(item) {
      let items;

      // Check if any items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];

        // push new item
        items.push(item);

        // Set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get from local storage
        items = JSON.parse(localStorage.getItem("items"));

        // Push new item
        items.push(item);

        // Re set local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(item, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new Item
      newItem = new Item(ID, item, calories);

      // Add to items Array
      data.items.push(newItem);

      return newItem;
    },
    getItemsById: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
    updateItem: function(name, calories) {
      // calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id) {
      // get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // Loop items
      data.items.forEach(item => {
        total += item.calories;
      });

      // Set total calories
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };

  // Public Methods
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"> </i>
            </a>
        </li>`;
      });

      // Insert list item
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add Class
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;

      // Add Html
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"> </i>
        </a>
      `;
      // Insert
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"> </i>
            </a>
            `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItem = document.querySelectorAll(UISelectors.listItems);

      // Turn into array
      listItem = Array.from(listItem);

      listItem.forEach(item => {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline-block";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display =
        "inline-block";
      document.querySelector(UISelectors.deleteBtn).style.display =
        "inline-block";
      document.querySelector(UISelectors.backBtn).style.display =
        "inline-block";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listener
  const loadEventListener = function() {
    // Get UI Selector
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable Submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add Item Submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI List
      UICtrl.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Edit item
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;
      // Break into ana array
      const listIdArr = listId.split("-");
      // Get actual id
      const id = parseInt(listIdArr[1]);
      // Get item
      const itemToEdit = ItemCtrl.getItemsById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);
    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete form local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear All Items Event
  const clearAllItemsClick = function(e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Hide UI
    UICtrl.hideList();

    // Clear all from storage
    StorageCtrl.clearItemFromStorage();

    e.preventDefault();
  };

  // Public methods
  return {
    init: function() {
      // Clear initial state
      UICtrl.clearEditState();

      // Fetch item
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with item
        UICtrl.populateItemList(items);
      }

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event listener
      loadEventListener();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
