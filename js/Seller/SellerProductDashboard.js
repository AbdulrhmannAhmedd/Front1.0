import {
    getOrders,
    loadDataFromLocalStorage,
    saveDataInLocalStorage,
    data,
    isAuthorized,
    PendingProducts,
    ApproveProducts,
    SellerProducts,
} from "../Data.js";

import { AddProducts } from "../Seller/AddProducts.js";

// ! Tesing Only Remove For Production
//saveDataInLocalStorage();
// ! Note ----------------- Remove All Console.log() in Production

// * Event Listeners Load
window.addEventListener("load", function () {
    //   isAuthorized();
    let Products = SellerProducts();
    let isUpdate = true;
    console.log("Hola");
    console.log(Products);
    let rowsPerPage = 10; // * Default rows per page
    let currentPage = 1;

    const Producttable = document.getElementsByTagName("table")[0];

    const ProductcounterInput = document.getElementById("ProductCounterInput");
    const ProductsearchInput = document.getElementById("ProductsearchInput");

    ProductcounterInput.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value, 10) || 5;
        currentPage = 1; // * Reset to the first page
        displayProductsTable(Products, currentPage, rowsPerPage);
    });

    ProductsearchInput.addEventListener("keyup", function () {
        const searchTerm = this.value.trim().toLowerCase();
        const filteredProducts = Products.filter(
            (product) =>
                product.Name.toLowerCase().includes(searchTerm) ||
                product.Price.toLocaleString().toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // * Reset to the first page
        displayProductsTable(filteredProducts, currentPage, rowsPerPage);
    });

    displayProductsTable(Products, currentPage, rowsPerPage);

    Producttable.addEventListener("click", function (event) {
        console.log(event.target.id);
        if (event.target.id == "Del") {
            // * Start Sweet Alert
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });

                    
                    displayProductsTable(Products, currentPage, rowsPerPage);

                }
            });
            // * End Sweet Alert
        }
        if (event.target.id == "Update") {
                // * When Clicked is update trun True Then AddAccounts Function Will Know that is update not addning new Accounts 
            isUpdate=true;
            const selectedUser = data.Users[event.target.dataset.index]
            $("#in-head").text(" Update Account");
            $("#in-email").val(selectedUser.Email);
            $("#in-name").val(selectedUser.Name);
            $("#in-password").val(selectedUser.Password);
            $("#in-Phone").val(selectedUser.Phone);
            $("#in-City").val(selectedUser.City);
            $("#in-Street").val(selectedUser.Street);
            selectedUser.Role == "Admin"
                ? $("#roleAdmin").prop("checked", true)
                : selectedUser.Role == "Seller"
                    ? $("#roleSeller").prop("checked", true)
                    : $("#roleCustomer").prop("checked", true);
            console.log("Changes");
        }
    });

    // * on click Add Products Button the form will reset and the header will change to the default
    $("#add-Product").on("click", function () {
        //   $("#in-head").text("Add New Account");
        //    $("#AccountsForm")[0].reset();
        isUpdate = false;
    });
    $("#Confirm").on("click", function (e) {
        AddProducts(isUpdate);
        // AddAccounts(isUpdate);
        // loadDataFromLocalStorage();
        // Users=getUsers();
        // displayTable(Users,currentPage,rowsPerPage);
    });
}); // * end of load

//! ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// * Function to Display the Pending products Table
function displayProductsTable(Products, currentPage = 1, rowsPerPage = 10) {
    const tbody = document.getElementById("ProductBody");
    const thead = document.getElementById("ProductHead");
    tbody.innerHTML = ""; // Clear previous rows
    thead.innerHTML = ""; // Clear previous rows

    const tr = document.createElement("tr");
    tr.innerHTML = `
    <tr >
    <th  id="Name" > Name</th>
    <th  id="Description" > Description</th>
    <th  id="Price" > Price</th>
    <th  id="Stock" > Stock</th>
    <th  id="CategoryID" > Category</th>
    <th  id="SellerName" > SellerName</th>
    <th  id="Images" > Images</th>
    <th  id="CreatedAt" > CreatedAt</th>
    <th  id="Status" > Status</th>
    <th  id="Delete" > Delete</th>
    <th  id="Update" > Update</th>
    </tr>   
`;
    thead.appendChild(tr);
    // * Add Asc Sorting Event
    tr.addEventListener("click", function (event) {
        const prop = event.target.id;
        console.log("Asc Sorting");
        if (prop) {
            Products.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
            displayProductsTable(Products, currentPage, rowsPerPage);
        }
    });
    // * Add Desc Sorting Event
    tr.addEventListener("dblclick", function (event) {
        const prop = event.target.id;
        console.log("Desc Sorting");
        if (prop) {
            Products.sort((a, b) => (a[prop] < b[prop] ? 1 : -1));
            displayProductsTable(Products, currentPage, rowsPerPage);
        }
    });
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = Products.slice(start, end);
    paginatedUsers.forEach((product, index) => {
        let SellerName = data.Users.find(
            (user) => user._id == product.SellerID
        ).Name;
        //console.log(SellerName)
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td >${product.Name}</td>
            <td >${product.Description}</td>
            <td >${product.Price}</td>
            <td >${product.Stock}</td>
            <td >${product.CategoryID}</td>
            <td >${SellerName}</td>
            <td><img src="${product.Images[0]
            }" style="width: 150px !important; height: 150px !important;" /></td>
            <td >${product.CreatedAt}</td>
            <td class="Status-btn" >
            <button id="Approve" type="button" 
            data-index="${start + index}" 
            data-Productid="${product._id}" 
            class="${product.Approved ? "btn btn-success" : "btn btn-danger"}">
        ${product.Approved ? "Approved" : "Not Approved"}
            </button>
            </td>
            <td class="delete-btn" >
            <button id="Del" type="button" 
            data-index="${start + index}" 
            data-Productid="${product._id}" 
            class="btn btn-danger">
            <i id="Del" data-index="${start + index}" class="bi bi-trash-fill"> </i>
            </button>
            </td>
             <td class="Update-btn" >
            <button id="Update" type="button"  data-index="${start + index}" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#addCustomerModal">
            <i id="Update" data-index="${start + index}"  class="bi bi-pencil-fill"> </i>
            </button>
            </td>
            `;
        tbody.appendChild(tr);
    });

    setupProductsPagination(Products, rowsPerPage, currentPage);
}

// * Function to Set Up Pagination
function setupProductsPagination(Products, rowsPerPage, currentPage) {
    const pagination = document.getElementById("Productpagination");
    pagination.innerHTML = ""; // * Clear previous pagination
    const totalPages = Math.ceil(Products.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "btn btn-info m-1";
        if (i === currentPage) button.className = "btn btn-dark";
        button.addEventListener("click", () => {
            displayProductsTable(Products, i, rowsPerPage);
        });
        pagination.appendChild(button);
    }
}