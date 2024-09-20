
// Define built-in preparations with ingredients

const correctPassword = '00'; // Set your password here
const correctUser = 'nomai'

function showNotification(message, type) {
  // Create a new notification element
  const notificationHTML = `
  <div class="alert alert-${type} alert-dismissible fade show" role="alert">
    <strong>${message}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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


function checkPassword() {
  const enteredPassword = document.getElementById('password').value;
  const enteruser = document.getElementById('username').value;
  if (enteredPassword === correctPassword && enteruser === correctUser)
      {
    showNotification("Vous êtes autorisé à accéder au formulaire de calcul.", "success") ;
    document.getElementById('password-prompt').style.display = 'none';
    document.getElementById('protected-content').style.display = 'block';
    document.body.style.background = 'none'; // Supprime l'image de fond
  } else {
    showNotification("Nom d'utilisateur ou mot de passe incorrect. Merci de réessayer.", "danger") ;
  }
}


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



    // // Add selected preparation and its quantity to the list
    // function addSelectedPreparation() {
    //   const selectedIndex = document.getElementById("prep-select").value;
    //   const selectedPrep = builtInPreparations[selectedIndex];
    //   const prepQuantity = Number(document.getElementById("prep-quantity").value);

    //   if (selectedPrep && prepQuantity > 0) {

    //     if (isPreparationInList(selectedPrep.name)) {
    //       showNotification("Cette préparation est déjà dans la liste !", 'warning');
    //     } else {
    //       // Add preparation to the list
    //       selectedPreparations.push({
    //         ...selectedPrep,
    //         quantity: prepQuantity
    //       });

    //     displayChosenPreparations();
    //     }
    //   } else {
    //     showNotification("Veuillez sélectionner une préparation et entrer une quantité valide.", 'danger');
    //   }
    // }

    function addSelectedPreparation() {
      const selectedIndex = document.getElementById("prep-select").value;
      const selectedPrep = builtInPreparations[selectedIndex];

      if (selectedPrep) {
        // Prompt user for the preparation quantity
        const prepQuantityInput = prompt("Veuillez entrer la quantité de la préparation sélectionnée :");

        // Convert the input into a number
        const prepQuantity = Number(prepQuantityInput);

        if (prepQuantity > 0) {
          if (isPreparationInList(selectedPrep.name)) {
            showNotification("Cette préparation est déjà dans la liste !", 'warning');
          } else {
            // Add preparation to the list
            selectedPreparations.push({
              ...selectedPrep,
              quantity: prepQuantity
            });

            displayChosenPreparations();
          }
        } else {
          showNotification("Veuillez entrer une quantité valide.", 'danger');
        }
      } else {
        showNotification("Veuillez sélectionner une préparation.", 'danger');
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
      <td>${data.totalAmount.toFixed(2)} ${data.unit}</td>
      <td>${brute} ${data.unit}</td> <!-- New column for brute -->
      <td>${totalPrice.toFixed(2)} Dh</td> <!-- New column for brute -->
    `;

    // Append the row to the tbody
    totalIngredients.appendChild(row);
  });
}

    // Load built-in preparations when the page loads
    loadBuiltInPreparations();


    function generateExcelReport(event) {
      if (event) {
        event.preventDefault();
      }
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
        ["Ingrédient", "Unité", "Rendement", "Qté Net", "Qté Brute", "Prix Total"]
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
          formattedBrute,
          totalPrice                   // Brute value with comma decimal
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
      showNotification("Le fichier de reporting Excel a été généré avec succès.", 'success');
    }


    async function generatePDFReport() {
      // Load pdf-lib
      const { PDFDocument, rgb } = PDFLib;

      // Create a new PDF document
      const doc = await PDFDocument.create();

      // Add a page to the document
      const page = doc.addPage([600, 800]);

      // Set up the font size and color
      const fontSize = 12;
      const textColor = rgb(0, 0, 0); // Black color

      // Draw a title
      page.drawText('Report of Selected Preparations', {
        x: 50,
        y: 750,
        size: 18,
        color: textColor,
      });

      // Draw Selected Preparations
      page.drawText('Selected Preparations', {
        x: 50,
        y: 720,
        size: 14,
        color: textColor,
      });

      // Draw column headers
      page.drawText('Préparation', { x: 50, y: 690, size: fontSize, color: textColor });
      page.drawText('Quantité', { x: 300, y: 690, size: fontSize, color: rgb(0, 0, 0) });

      // Draw the data
      let y = 670;
      selectedPreparations.forEach(prep => {
        page.drawText(prep.name, { x: 50, y, size: fontSize, color: textColor });
        page.drawText(prep.quantity.toString(), { x: 300, y, size: fontSize, color: textColor });
        y -= 20;
      });

      // Add a new page for Total Ingredients
      const page2 = doc.addPage([600, 800]);

      // Draw title on the second page
      page2.drawText('Total Ingredients', {
        x: 50,
        y: 750,
        size: 18,
        color: textColor,
      });

      // Draw column headers on the second page
      page2.drawText('Ingrédient', { x: 50, y: 720, size: fontSize, color: textColor });
      page2.drawText('Unité', { x: 200, y: 720, size: fontSize, color: textColor });
      page2.drawText('Rendement', { x: 200, y: 720, size: fontSize, color: textColor });
      page2.drawText('Qté Net', { x: 300, y: 720, size: fontSize, color: textColor });
      page2.drawText('Qté Brute', { x: 400, y: 720, size: fontSize, color: textColor });
      page2.drawText('Prix Total', { x: 500, y: 720, size: fontSize, color: textColor });

      // Draw the ingredients data
      y = 690;
      Object.entries(ingredientTotals).forEach(([name, data]) => {
        const totalPrice = data.price * data.totalAmount; // Calculate total price
        const brute = data.rendement ? (data.totalAmount / data.rendement).toFixed(2) : 'N/A'; // Calculate brute

        // Replace the decimal point (.) with a comma (,) manually
        const formattedTotalAmount = data.totalAmount.toFixed(2).replace('.', ',');
        const formattedBrute = brute !== 'N/A' ? brute.replace('.', ',') : 'N/A';

        page2.drawText(name, { x: 50, y, size: fontSize, color: textColor });
        page2.drawText(data.unit, { x: 150, y, size: fontSize, color: textColor });
        page2.drawText((data.rendement * 100).toFixed(0) + "%", { x: 200, y, size: fontSize, color: textColor });
        page2.drawText(formattedTotalAmount, { x: 300, y, size: fontSize, color: textColor });
        page2.drawText(formattedBrute, { x: 400, y, size: fontSize, color: textColor });
        page2.drawText(totalPrice.toFixed(2).replace('.', ','), { x: 500, y, size: fontSize, color: textColor });
        y -= 20;
      });

      // Serialize the document to bytes
      const pdfBytes = await doc.save();

      // Download the PDF
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const filename = `preparation_report_${formattedDate}.pdf`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      link.download = filename;
      link.click();

      showNotification("Le fichier de reporting PDF a été généré avec succès.", 'success');
    }

    // Example button click event to trigger the function
    document.getElementById('generatePDFButton').addEventListener('click', generatePDFReport);






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
      displayTotalIngredients(ingredientTotals); // Display totals

    }
