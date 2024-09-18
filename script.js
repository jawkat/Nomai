
// Define built-in preparations with ingredients
const builtInPreparations = [
    {
    name: "Supreme de Poulet alla Parmiggiana",
    ingredients: [
      { name: "Poulet", amount: 0.160, unit: "kg", pricePerKg: 70.00 },
      { name: "Aubergine", amount: 0.250, unit: "kg", pricePerKg: 6.00 },
      { name: "Sauce Tomate MUTTI", amount: 0.100, unit: "kg", pricePerKg: 36.00 },
      { name: "Parmesan", amount: 0.040, unit: "kg", pricePerKg: 180.00 },
      { name: "Mozzarella", amount: 0.080, unit: "kg", pricePerKg: 57.00 },
      { name: "Basilic", amount: 0.100, unit: "bote", pricePerBote: 15.00 },
      //{ name: "Sauce Pesto", amount: 1.000, unit: "portion", pricePerPortion: 3.24 },
      { name: "Sel", amount: 0.005, unit: "kg", pricePerKg: 10.00 },
      { name: "Poivre Blanc", amount: 0.005, unit: "kg", pricePerKg: 110.00 },
      { name: "02 Garnitures (leg *100g)", amount: 2.000, unit: "portion", pricePerPortion: 3.51 },
      { name: "Basilic", amount: 0.1000, unit: "bote", pricePerBote: 15.00 },
      { name: "Huile d'Olive", amount: 0.0125, unit: "L", pricePerL: 77.00 },
      { name: "Ail", amount: 0.0005, unit: "kg", pricePerKg: 30.00 },
      { name: "Parmesan", amount: 0.0035, unit: "kg", pricePerKg: 180.00 },
      { name: "Noix 500g", amount: 0.0013, unit: "g", pricePerG: 85.80 },
      { name: "Sel", amount: 0.0003, unit: "kg", pricePerKg: 10.00 },
      { name: "Poivre Blanc", amount: 0.0003, unit: "kg", pricePerKg: 110.00 },
    ],
    },
    {
    name: "Coquelet Fermier",
    ingredients: [
      { name: "Coquelet", amount: 1.000, unit: "piece", pricePerPiece: 24.00 },
      { name: "Romarin", amount: 0.125, unit: "bte", pricePerBte: 15.00 },
      { name: "Citron", amount: 0.015, unit: "kg", pricePerKg: 20.00 },
      { name: "Beurre", amount: 0.025, unit: "kg", pricePerKg: 100.00 },
      //{ name: "Marinade", amount: 1.000, unit: "portion", pricePerPortion: 6.60 },
      { name: "02 Garnitures (leg *100g)", amount: 2.000, unit: "portion", pricePerPortion: 3.51 },
      { name: "Oignon Poudre", amount: 0.002, unit: "kg", pricePerKg: 165.00 },
      { name: "Ail Poudre", amount: 0.002, unit: "kg", pricePerKg: 80.00 },
      { name: "Beurre", amount: 0.005, unit: "kg", pricePerKg: 100.00 },
      { name: "Ail", amount: 0.005, unit: "kg", pricePerKg: 30.00 },
      { name: "Oignon", amount: 0.010, unit: "kg", pricePerKg: 7.00 },
      { name: "Hrissa", amount: 0.010, unit: "kg", pricePerKg: 10.00 },
      { name: "Jus de Citron", amount: 0.005, unit: "kg", pricePerKg: 20.00 },
      { name: "Origan", amount: 0.001, unit: "kg", pricePerKg: 120.00 },
      { name: "Herbe de Provence", amount: 0.001, unit: "kg", pricePerKg: 120.00 },
      { name: "Moutarde à l'Ancienne 21cl", amount: 5.000, unit: "g", pricePerG: 0.57 },
      { name: "Poivre Blanc", amount: 0.002, unit: "kg", pricePerKg: 110.00 },
      { name: "Huile d'Olive", amount: 0.010, unit: "L", pricePerL: 77.00 },
      { name: "Sauce Worcestershire 150ml", amount: 5.000, unit: "g", pricePerG: 0.17 },
      { name: "Sel", amount: 0.005, unit: "kg", pricePerKg: 10.00 },
      { name: "Piment Fort", amount: 0.001, unit: "kg", pricePerKg: 60.00 },
      { name: "Paprika", amount: 0.002, unit: "kg", pricePerKg: 67.20 },
      { name: "Persil", amount: 0.002, unit: "kg", pricePerKg: 2.00 },
      { name: "Zeste de Citron", amount: 0.001, unit: "kg", pricePerKg: 20.00 },
    ],
    },
    {
    name: "Chateaubriand et son Jus",
    ingredients: [
      { name: "Cœur de Filet de Bœuf", amount: 0.200, unit: "kg", pricePerKg: 125.00 },
      { name: "Sel", amount: 0.002, unit: "kg", pricePerKg: 10.00 },
      { name: "Poivre Blanc", amount: 0.002, unit: "kg", pricePerKg: 110.00 },
      { name: "Romarin", amount: 0.050, unit: "bte", pricePerBte: 15.00 },
      { name: "Échalote", amount: 0.060, unit: "kg", pricePerKg: 26.00 },
      //{ name: "Jus de Bœuf", amount: 1.000, unit: "portion", pricePerPortion: 5.08 },
      { name: "Thym", amount: 0.050, unit: "bote", pricePerBote: 15.00 },
      { name: "Pomme de Terre", amount: 0.150, unit: "kg", pricePerKg: 8.00 },
      { name: "Oignon", amount: 0.600, unit: "kg", pricePerKg: 7.00 },
      { name: "02 Garnitures (leg *100g)", amount: 1.000, unit: "portion", pricePerPortion: 3.51 },
      { name: "Fond de Bœuf", amount: 0.125, unit: "L", pricePerL: 0.00 },
      { name: "Crème Fraîche Gastro", amount: 0.008, unit: "kg", pricePerKg: 27.00 },
      { name: "Demi Glace 500g", amount: 0.038, unit: "kg", pricePerKg: 130.00 },
    ],
    },
    {
    name: "Filet de Bœuf à la Sauce au Champignons",
    ingredients: [
      { name: "Filet de Bœuf -30%", amount: 0.200, unit: "kg", pricePerKg: 180.00 },
      { name: "Huile d'Olive", amount: 0.010, unit: "L", pricePerL: 77.00 },
      { name: "Sel", amount: 0.003, unit: "kg", pricePerKg: 10.00 },
      { name: "Poivre Blanc", amount: 0.003, unit: "kg", pricePerKg: 110.00 },
      //{ name: "Sauce de Champignon", amount: 1.000, unit: "portion", pricePerPortion: 3.88 },
      { name: "02 Garnitures (leg *100g)", amount: 2.000, unit: "portion", pricePerPortion: 3.51 },
      //{ name: "Jus de Bœuf", amount: 1.000, unit: "portion", pricePerPortion: 1.91 },
      { name: "Champignons", amount: 0.070, unit: "kg", pricePerKg: 18.00 },
      { name: "Crème Fraîche", amount: 0.010, unit: "kg", pricePerKg: 25.00 },
      { name: "Échalote", amount: 0.015, unit: "kg", pricePerKg: 26.00 },
      { name: "Beurre", amount: 0.015, unit: "kg", pricePerKg: 100.00 },
    ],
    },
    ];

    let selectedPreparations = [];

    // Populate the preparation select dropdown with built-in preparations
    function loadBuiltInPreparations() {
      const prepSelect = document.getElementById("prep-select");
      builtInPreparations.forEach((prep, index) => {
        const option = document.createElement("option");
        option.value = index; // Store index to reference selected preparation
        option.textContent = prep.name;
        prepSelect.appendChild(option);
      });
    }

    // Add selected preparation and its quantity to the list
    function addSelectedPreparation() {
      const selectedIndex = document.getElementById("prep-select").value;
      const selectedPrep = builtInPreparations[selectedIndex];
      const prepQuantity = Number(document.getElementById("prep-quantity").value);

      if (selectedPrep && prepQuantity > 0) {
        selectedPreparations.push({
          ...selectedPrep,
          quantity: prepQuantity,
        });

        displayChosenPreparations();
      }
    }

    // Display chosen preparations with their quantities
    function displayChosenPreparations() {
      const chosenPrepList = document.getElementById("chosen-prep-list");
      chosenPrepList.innerHTML = "";

      selectedPreparations.forEach((prep, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>
          ${prep.name}
          <button class="btn btn-danger btn-sm float-end" onclick="removePreparation(${index})">✖</button>
        </td>
        <td>
          <input type="number" value="${prep.quantity}" min="1" class="form-control adjust-quantity" onchange="updateQuantity(${index}, this.value)" />
        </td>
      `;
      chosenPrepList.appendChild(row);

      });
    }

    // Remove a preparation from the list
    function removePreparation(index) {
      selectedPreparations.splice(index, 1);
      displayChosenPreparations();
    }

    // Update the quantity of a preparation
    function updateQuantity(index, quantity) {
      if (quantity > 0) {
        selectedPreparations[index].quantity = Number(quantity);
        calculateTotal(); // Recalculate totals when quantity is updated
      }
    }

    // Calculate total ingredients needed based on selected preparations
    function calculateTotal() {
      const ingredientTotals = {};

      selectedPreparations.forEach((prep) => {
        prep.ingredients.forEach((ingredient) => {
          const totalAmount = ingredient.amount * prep.quantity;
          if (!ingredientTotals[ingredient.name]) {
            ingredientTotals[ingredient.name] = {
              totalAmount: 0,
              unit: ingredient.unit,
              price: ingredient.pricePerKg || ingredient.pricePerL || ingredient.pricePerPiece || ingredient.pricePerG || ingredient.pricePerPortion || ingredient.pricePerBte,
            };
          }
          ingredientTotals[ingredient.name].totalAmount += totalAmount;
        });
      });

      displayTotalIngredients(ingredientTotals);
    }

    // Display the total amount of each ingredient
    function displayTotalIngredients(ingredientTotals) {
      const totalIngredients = document.getElementById("total-ingredients");
      totalIngredients.innerHTML = "";

      for (const [name, data] of Object.entries(ingredientTotals)) {
        const li = document.createElement("li");
        const totalPrice = data.price * data.totalAmount; // Calculate total price
        li.textContent = `${name}: ${data.totalAmount.toFixed(2)} ${data.unit} (Price: ${totalPrice.toFixed(2)})`;
        totalIngredients.appendChild(li);
      }

    }

    // Load built-in preparations when the page loads
    loadBuiltInPreparations();
