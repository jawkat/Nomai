
// Define built-in preparations with ingredients

let ingredientTotals = {}; // Declare globally
  fetch('file.json')
  .then(response => response.json())
  .then(data => {
    console.log('Loaded data:', data);
    builtInPreparations = data;
    loadBuiltInPreparations();
  })
  .catch(error => console.error('Error loading JSON:', error));


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

        // Check if a preparation is already in the selected list
    function isPreparationInList(preparationName) {
      return selectedPreparations.some(prep => prep.name === preparationName);
    }

function showNotification(message, type) {
  // Create a new notification element
  const notificationHTML = `
        <div class="toast align-items-center text-white bg-${type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex ">
            <div class="toast-body flash-message text-black">
              ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      `;
   // Append the notification element to the notification container
   const notificationContainer = document.getElementById("notification-container");
   notificationContainer.innerHTML += notificationHTML;

   // Initialize and show the toast
   const toastElement = notificationContainer.lastElementChild;
   const toast = new bootstrap.Toast(toastElement);
   toast.show();
 }


    // Add selected preparation and its quantity to the list
    function addSelectedPreparation() {
      const selectedIndex = document.getElementById("prep-select").value;
      const selectedPrep = builtInPreparations[selectedIndex];
      const prepQuantity = Number(document.getElementById("prep-quantity").value);

      if (selectedPrep && prepQuantity > 0) {

        if (isPreparationInList(selectedPrep.name)) {
          showNotification('This preparation is already in the list!', 'warning');
        } else {
          // Add preparation to the list
          selectedPreparations.push({
            ...selectedPrep,
            quantity: prepQuantity
          });

        displayChosenPreparations();
        }
      } else {
        showNotification('Please select a preparation and enter a valid quantity.', 'danger');
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
      calculateTotal();
    }

    // Update the quantity of a preparation
    function updateQuantity(index, quantity) {
      if (quantity > 0) {
        selectedPreparations[index].quantity = Number(quantity);
        calculateTotal(); // Recalculate totals when quantity is updated
      }
    }



// Function to display the total ingredients in the predefined table
function displayTotalIngredients(ingredientTotals) {
  const totalIngredients = document.getElementById("total-ingredients");
  totalIngredients.innerHTML = ""; // Clear any existing rows

  // Convert the ingredientTotals object to an array and sort it by total price (descending order)
  const sortedIngredients = Object.entries(ingredientTotals).sort((a, b) => {
    const totalPriceA = a[1].price * a[1].totalAmount;
    const totalPriceB = b[1].price * b[1].totalAmount;
    return totalPriceB - totalPriceA; // Sort descending by price
  });

  // Loop through the sorted ingredients and create rows for each
  sortedIngredients.forEach(([name, data]) => {
    const totalPrice = data.price * data.totalAmount; // Calculate total price
    const brute = data.rendement ? (data.totalAmount / data.rendement).toFixed(2) : 'N/A'; // Calculate brute

    // Create a new table row
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${(data.rendement * 100).toFixed(0)}%</td>
      <td>${data.totalAmount.toFixed(4)} ${data.unit}</td>
      <td>${brute} ${data.unit}</td> <!-- New column for brute -->
      <td>${totalPrice.toFixed(2)}</td> <!-- New column for brute -->
    `;

    // Append the row to the tbody
    totalIngredients.appendChild(row);
  });
}

    // Load built-in preparations when the page loads
    loadBuiltInPreparations();


    function generateExcelReport() {
      // First, calculate the total ingredients to ensure data is up to date
      calculateTotal(); // This will populate ingredientTotals

      // Debugging: Check if ingredientTotals has data
      console.log("Ingredient Totals after calculation:", ingredientTotals);

      if (Object.keys(ingredientTotals).length === 0) {
        console.error("No ingredients found for the selected preparations.");
        return;
      }

      // Create a new workbook and add a worksheet
      const wb = XLSX.utils.book_new();

      // Prepare data for the first sheet (Selected Preparations)
      const preparationsSheet = [
        ["Preparation", "Quantity"]
      ];

      selectedPreparations.forEach(prep => {
        preparationsSheet.push([prep.name, prep.quantity]);
      });

      // Add preparations sheet to the workbook
      const preparationsWS = XLSX.utils.aoa_to_sheet(preparationsSheet);
      XLSX.utils.book_append_sheet(wb, preparationsWS, "Selected Preparations");

      // Prepare data for the second sheet (Total Ingredients)
      const ingredientsSheet = [
        ["Ingrédient", "Unité", "Rendement", "Qté Net", "Qté Brute"]
      ];

      // Convert the ingredientTotals object to an array and sort it by total price (descending order)
      const sortedIngredients = Object.entries(ingredientTotals).sort((a, b) => {
        const totalPriceA = a[1].price * a[1].totalAmount;
        const totalPriceB = b[1].price * b[1].totalAmount;
        return totalPriceB - totalPriceA; // Sort descending by price
      });

      // Prepare data for the sorted ingredients
      sortedIngredients.forEach(([name, data]) => {
        const totalPrice = data.price * data.totalAmount; // Calculate total price
        const brute = data.rendement ? (data.totalAmount / data.rendement).toFixed(2) : 'N/A'; // Calculate brute

        // Replace the decimal point (.) with a comma (,) manually
        const formattedTotalAmount = data.totalAmount.toFixed(2).replace('.', ',');
        const formattedBrute = brute !== 'N/A' ? brute.replace('.', ',') : 'N/A';

        // Push the values as per your requirement, replacing decimal points with commas
        ingredientsSheet.push([
          name,                            // Ingredient Name
          data.unit,                       // Unit (e.g., kg, L)
          (data.rendement * 100).toFixed(0) + "%", // Rendement as percentage
          formattedTotalAmount,            // Total Amount with comma decimal
          formattedBrute                   // Brute value with comma decimal
        ]);
      });

      // Add ingredients sheet to the workbook
      const ingredientsWS = XLSX.utils.aoa_to_sheet(ingredientsSheet);
      XLSX.utils.book_append_sheet(wb, ingredientsWS, "Total Ingredients");

      // Generate and download the Excel file


      // Format the current date for the filename
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      // Generate the Excel filename with the current date
      const filename = `preparation_report_${formattedDate}.xlsx`;

      XLSX.writeFile(wb, filename);
      showNotification('Excel généré avec succès', 'success');
    }


    function calculateTotal() {
      ingredientTotals = {}; // Reset totals

      selectedPreparations.forEach((prep) => {
        prep.ingredients.forEach((ingredient) => {
          const totalAmount = ingredient.amount * prep.quantity;
          if (!ingredientTotals[ingredient.name]) {
            ingredientTotals[ingredient.name] = {
              totalAmount: 0,
              unit: ingredient.unit,
              price: ingredient.pricePerKg || ingredient.pricePerL || ingredient.pricePerPiece || ingredient.pricePerG || ingredient.pricePerPortion || ingredient.pricePerBte || ingredient.pricePerBotte,
              rendement: ingredient.rendement || 1,
            };
          }
          ingredientTotals[ingredient.name].totalAmount += totalAmount;
        });
      });

      console.log("Calculated Ingredient Totals:", ingredientTotals);
      displayTotalIngredients(ingredientTotals); // Display totals

    }
