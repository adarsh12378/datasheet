fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
.then(response => response.json())
.then(data => {
  // Display rows for the first page as 10 rows in a given page according to conditions
  displayRows(data, 10, 1);
  // Setup pagination in the project
  setupPagination(data, 10);
});

function displayRows(items, rowsPerPage, page) {
const tableBody = document.querySelector('tbody');
let rows = '';

// Calculate start and end index for the current page
const startIndex = (page - 1) * rowsPerPage;
const endIndex = startIndex + rowsPerPage;

// Iterate through the items for the current page
items.slice(startIndex, endIndex).forEach(item => {
  rows += `
    <tr>
      <td><input type="checkbox" class="select-row"></td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.role}</td> 
      <td>
        <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>  
        <button class="delete"><i class="fas fa-trash delete-icon"></i></button>
      </td>
    </tr>`;
});

tableBody.innerHTML = rows;

// Apply event listeners for edit and delete the particular row
applyEventListeners();
}

// Pagination logic
function setupPagination(items, rowsPerPage) {
const totalPages = Math.ceil(items.length / rowsPerPage);
const pages = document.querySelector('.page-numbers');
let html = '';

for (let i = 1; i <= totalPages; i++) {
  html += `<div class="page-number ${i === 1 ? 'active' : ''}" onclick="changePage(${i})">${i}</div>`;
}

pages.innerHTML = html;

// Function to change page
window.changePage = function(page) {
  displayRows(items, rowsPerPage, page);
  updateActivePage(page);
};
}

// Add this function to update the active page class
function updateActivePage(activePage) {
const pageNumbers = document.querySelectorAll('.page-numbers .page-number');
pageNumbers.forEach((pageNumber, index) => {
  pageNumber.classList.toggle('active', index + 1 === activePage);
});
}

// Apply event listeners for edit and delete
function applyEventListeners() {
/* Filterinng */
// Get search input
const searchInput = document.querySelector('.search-input');

// Filter rows on input 
searchInput.addEventListener('keyup', filterRows);

function filterRows() {
  // Get value to filter on
  const value = searchInput.value.toLowerCase();

  // Get all rows
  const rows = document.querySelectorAll('tbody tr');

  // Iterate through rows
  rows.forEach(row => {
    // Get cells
    const cells = row.querySelectorAll('td');

    // Check if matches search 
    let matches = false;

    cells.forEach(cell => {
      if(cell.textContent.toLowerCase().includes(value)) {
        matches = true;
      } 
    });

    // Show/hide based on match
    if(matches) {
      row.style.display = "";
    } else {
      row.style.display = "none";  
    }
  });
}

/* Checkbox functionality for bulk deletion */
// Checkbox in header
const selectAll = document.querySelector('.select-all');

// Checkbox in each row  
const rowsCheckboxes = document.querySelectorAll('.select-row');

selectAll.addEventListener('click', () => {
  rowsCheckboxes.forEach(checkbox => {
    checkbox.checked = selectAll.checked;
  });
});

// Deletion
const deleteSelectedBtn = document.querySelector('.delete-selected');

deleteSelectedBtn.addEventListener('click', () => {
  rowsCheckboxes.forEach(checkbox => {
    if(checkbox.checked) {
      checkbox.parentElement.parentElement.remove();
    }
  });
});

/*  Logic for editing the rows and saving it */
const editIcons = document.querySelectorAll('.edit i');

editIcons.forEach(icon => {
  icon.addEventListener('click', e => {
    const row = e.target.closest('tr');
    const existingSaveBtn = row.querySelector('.save');
    if (!existingSaveBtn) {
      row.querySelectorAll('td').forEach(td => {
        td.contentEditable = true;
      });

      const saveBtn = document.createElement('button');
      saveBtn.classList.add('save');
      saveBtn.innerHTML = 'Save';

      saveBtn.addEventListener('click', () => {
        row.querySelectorAll('td').forEach(td => {
          td.contentEditable = false;
        });
        // Save data
        saveBtn.remove(); // Remove the save button after saving
      });
      row.querySelector('td:last-child').appendChild(saveBtn);
    }
  });
});

/* Logic for deleting the rows on selecting the delete icon */
const deleteIcons = document.querySelectorAll('.delete i');

deleteIcons.forEach(icon => {
  icon.addEventListener('click', e => {
    const row = e.target.closest('tr'); // Find the closest row
    row.remove(); // Remove the entire row
  });
});
}