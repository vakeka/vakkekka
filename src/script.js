document.addEventListener("DOMContentLoaded", () => {
  try {
    const isLiquidsPage = document.body.classList.contains("liquids");
    const isDevicesPage = document.body.classList.contains("devices");

 
    const liquids = {
      "Ягодные": [
        { id: "L001", name: "Strawberry Cherry Lemon", qty: 5 },
        { id: "L002", name: "Strawberry Raspberry Cherry Ice", qty: 3 },
        { id: "L003", name: "Strawberry Banana", qty: 0 },
        { id: "L004", name: "Blueberry Raspberry Pomegranate", qty: 2 },
        { id: "L005", name: "Blueberry Sour Raspberry", qty: 0 },
        { id: "L006", name: "Blueberry", qty: 1 },
        { id: "L007", name: "Raspberry Lychee", qty: 0 },
        { id: "L008", name: "Blackberry Lemon", qty: 4 },
        { id: "L009", name: "Blackcurrant Aniseed", qty: 1 },
        { id: "L010", name: "Grape Cherry", qty: 2 },
        { id: "L011", name: "Blue Razz Lemonade", qty: 2 }
      ],
      "Сладкие": [
        { id: "L012", name: "Cherry Cola", qty: 1 },
        { id: "L013", name: "P&B Cloudd", qty: 0 },
        { id: "L014", name: "ELF Jack", qty: 2 },
        { id: "L015", name: "Rhubarb Snoow", qty: 0 },
        { id: "L016", name: "Jasmine Raspberry", qty: 3 }
      ],
      "Со льдом": [
        { id: "L017", name: "Cool Mint", qty: 2 },
        { id: "L018", name: "Spearmint", qty: 0 },
        { id: "L019", name: "Blue Razz Ice", qty: 1 },
        { id: "L020", name: "Pineapple Ice", qty: 4 },
        { id: "L021", name: "Elfbull Ice", qty: 0 },
        { id: "L022", name: "Sour Apple", qty: 1 },
        { id: "L023", name: "Peach Ice", qty: 2 },
        { id: "L024", name: "Lemon Lime", qty: 2 }
      ],
      "Фруктовые": [
        { id: "L025", name: "Watermelon", qty: 0 },
        { id: "L026", name: "Cherry Lemon Peach", qty: 1 },
        { id: "L027", name: "Pineapple Colada", qty: 4 },
        { id: "L028", name: "Pina Colada", qty: 0 },
        { id: "L029", name: "Pink Grapefruit", qty: 2 },
        { id: "L030", name: "Mango Peach", qty: 1 },
        { id: "L031", name: "Apple Peach", qty: 3 },
        { id: "L032", name: "Apple Pear", qty: 2 },
        { id: "L033", name: "Double Apple", qty: 0 },
        { id: "L034", name: "Grape", qty: 2 },
        { id: "L035", name: "Green Grape Rose", qty: 1 },
        { id: "L036", name: "Kiwi Passion Fruit Guava", qty: 1 }
      ]
    };

 
    function renderCardsAndSelect(data, containerMap, selectEl) {
      if (!selectEl) return;
      selectEl.innerHTML = '<option value="" disabled selected>Выберите вариант</option>';

      Object.entries(data).forEach(([category, items]) => {
        const container = document.getElementById(containerMap[category]);
        if (!container) return;
        container.innerHTML = "";

        const group = document.createElement("optgroup");
        group.label = category;

        items.forEach(item => {
          // Карточка
          const card = document.createElement("div");
          card.className = "card";
          card.textContent = item.name;
          card.dataset.id = item.id;
          if (item.qty === 0) {
            card.classList.add("unavailable");
            card.style.textDecoration = "line-through";
            card.style.color = "red";
            card.title = "Нет в наличии";
          }
          card.addEventListener("click", () => {
            if (item.qty === 0) return;
            document.querySelectorAll(".card.selected").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            if (selectEl) {
              selectEl.value = item.id;
              selectEl.dispatchEvent(new Event("change"));
            }
          });
          container.appendChild(card);

       
          const opt = document.createElement("option");
          opt.value = item.id;
          opt.textContent = item.name + (item.qty === 0 ? " (нет в наличии)" : "");
          opt.disabled = item.qty === 0;
          if (item.qty === 0) {
            opt.style.textDecoration = "line-through";
            opt.style.color = "red";
          }
          group.appendChild(opt);
        });

        selectEl.appendChild(group);
      });

 
      selectEl.addEventListener("change", () => {
        const val = selectEl.value;
        document.querySelectorAll(".card").forEach(c => {
          c.classList.toggle("selected", c.dataset.id === val);
        });
      });
    }


    function handleSubmit({ formId, selectId, getFields, typeName }) {
      const form = document.getElementById(formId);
      const select = document.getElementById(selectId);
      if (!form || !select) return;

      form.addEventListener("submit", e => {
        try {
          e.preventDefault();

          const val = select.value;
          const selectedOption = select.selectedOptions[0];
          const id = selectedOption ? selectedOption.value : null;
          const { date, time, qty } = getFields();

          if (!val) {
            if (form.querySelector(".status")) {
              form.querySelector(".status").textContent = `Выберите ${typeName.toLowerCase()}`;
            } else {
              alert(`Выберите ${typeName.toLowerCase()}`);
            }
            return;
          }

          if (!date) {
            if (form.querySelector(".status")) {
              form.querySelector(".status").textContent = "Выберите дату";
            } else {
              alert("Выберите дату");
            }
            return;
          }

          if (!time) {
            if (form.querySelector(".status")) {
              form.querySelector(".status").textContent = "Выберите время";
            } else {
              alert("Выберите время");
            }
            return;
          }

          if (!qty || isNaN(qty) || Number(qty) <= 0) {
            if (form.querySelector(".status")) {
              form.querySelector(".status").textContent = "Введите корректное количество";
            } else {
              alert("Введите корректное количество");
            }
            return;
          }

      
          const order = { type: typeName, id, date, time, qty };
          localStorage.setItem("lastOrder", JSON.stringify(order));

          if (form.querySelector(".status")) form.querySelector(".status").textContent = "Сохранено!";
 
        } catch (err) {
          console.error("Ошибка обработки формы:", err);
          if (form.querySelector(".status")) form.querySelector(".status").textContent = "Ошибка!";
        }
      });
    }

   
    if (isLiquidsPage) {
      try {
        const containers = {
          "Ягодные": "liquidsBerry",
          "Сладкие": "liquidsSweet",
          "Со льдом": "liquidsIce",
          "Фруктовые": "liquidsFruit"
        };
        const select = document.getElementById("liquidSelect");
        renderCardsAndSelect(liquids, containers, select);
        handleSubmit({
          formId: "liquidForm",
          selectId: "liquidSelect",
          getFields: () => ({
            date: document.getElementById("date")?.value || "",
            time: document.getElementById("time")?.value || "",
            qty: document.getElementById("qty")?.value || ""
          }),
          typeName: "Жидкость"
        });
      } catch (err) {
        console.error("Ошибка инициализации liquids:", err);
      }
    }

   
    if (isDevicesPage) {
      try {

     
        renderCardsAndSelect(deviceStock, containers, selectDevice);

        if (selectFlavor) {
          selectFlavor.innerHTML = '<option value="" disabled selected>Выберите вкус</option>';
          selectFlavor.disabled = true;
        }
       
        if (selectDevice && selectFlavor) {
          selectDevice.addEventListener("change", () => {
            const deviceId = selectDevice.value;
            const flavors = flavorStock[deviceId] || [];
            selectFlavor.innerHTML = '<option value="" disabled selected>Выберите вкус</option>';
            let hasAvailable = false;
            flavors.forEach(f => {
              const opt = document.createElement("option");
              opt.value = f.flavorCode;
              opt.textContent = f.name + (f.qty === 0 ? " (нет в наличии)" : "");
              opt.disabled = f.qty === 0;
              if (f.qty > 0) hasAvailable = true;
              if (f.qty === 0) {
                opt.style.textDecoration = "line-through";
                opt.style.color = "red";
              }
              selectFlavor.appendChild(opt);
            });
            selectFlavor.disabled = !hasAvailable;
          });
        }
  
        if (selectFlavor) selectFlavor.disabled = true;

        const priceField = document.getElementById("devicePrice");
        if (selectDevice && priceField) {
          selectDevice.addEventListener("change", () => {
            const deviceId = selectDevice.value;
            priceField.textContent = devicePrices[deviceId] ? devicePrices[deviceId] + "₽" : "";
          });
        }
      
        const deviceForm = document.getElementById("deviceForm");
        if (deviceForm) {
          deviceForm.addEventListener("submit", e => {
            e.preventDefault();
            try {
            
              const deviceCode = selectDevice.value;
              const deviceName = selectDevice.selectedOptions[0]?.textContent || "";
              const flavorCode = selectFlavor.value;
           
              let flavorName = "";
              const deviceFlavors = flavorStock[deviceCode] || [];
              for (const f of deviceFlavors) {
                if (f.flavorCode === flavorCode) {
                  flavorName = f.name;
                  break;
                }
              }
              const date = document.getElementById("date")?.value || "";
              const time = document.getElementById("time")?.value || "";
              const qty = document.getElementById("qty")?.value || "";
           
              if (!deviceCode) {
                alert("Выберите устройство");
                return;
              }
              if (!flavorCode) {
                alert("Выберите вкус");
                return;
              }
              if (!date) {
                alert("Выберите дату");
                return;
              }
              if (!time) {
                alert("Выберите время");
                return;
              }
              if (!qty || isNaN(qty) || Number(qty) <= 0) {
                alert("Введите корректное количество");
                return;
              }
            
              const price = devicePrices[deviceCode] || 0;
        
              const orderId = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
           
              const order = {
                orderId,
                deviceCode,
                deviceName,
                flavorCode,
                flavorName,
                qty,
                price,
                date,
                time
              };
              localStorage.setItem("lastOrder", JSON.stringify(order));
              if (deviceForm.querySelector(".status")) deviceForm.querySelector(".status").textContent = "Сохранено!";
            } catch (err) {
              console.error("Ошибка обработки формы:", err);
              if (deviceForm.querySelector(".status")) deviceForm.querySelector(".status").textContent = "Ошибка!";
            }
          });
        }
      } catch (err) {
        console.error("Ошибка инициализации devices:", err);
      }
    }
  } catch (err) {
    console.error("Ошибка инициализации:", err);
  }
});
