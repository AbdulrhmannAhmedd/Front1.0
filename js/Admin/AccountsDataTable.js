import { data, getOrders, getUsers, loadDataFromLocalStorage,
     saveDataInLocalStorage, isAuthorized, getUserById, SetUserById,DeleteUser,increaseStock,decreaseTotalSales,DeleteOrders } from "../Data.js";

import {AddAccounts} from './AddAccounts.js'
import { DeleteSeller } from "./DeleteSellerAccount.js";

// ! Tesing Only Remove For Production 
//saveDataInLocalStorage();
// ! Note ----------------- Remove All Console.log() in Production

// * Function to Display the User Table
function displayTable(Users, currentPage = 1, rowsPerPage = 5) {
    const table = document.getElementsByTagName("table")[0];
    const tbody = document.querySelector("tbody");
    const thead = document.querySelector("thead");
    tbody.innerHTML = ""; // Clear previous rows
    thead.innerHTML = ""; // Clear previous rows


    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = Users.slice(start, end);
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <tr >
    <th  id="id" > Id</th>
    <th  id="Name" > Name</th>
    <th  id="Email" > Email</th>
    <th  id="Phone" > Phone</th>
    <th  id="City" > City</th>
    <th  id="Role" > Role</th>
    <th  id="CreatedAt" > CreatedAt</th>
    <th  id="delete" > Delete</th>
    <th  id="update" > Update</th>
    </tr>   
`;
    thead.appendChild(tr);
    // * Add Asc Sorting Event
    tr.addEventListener("click", function (event) {
        const prop = event.target.id;
        console.log("Asc Sorting")
        if (prop) {
            Users.sort((a, b) => a[prop] > b[prop] ? 1 : -1);
            displayTable(Users, currentPage, rowsPerPage);
        }
    });
    // * Add Desc Sorting Event
    tr.addEventListener("dblclick", function (event) {
        const prop = event.target.id;
        console.log("Desc Sorting")
        if (prop) {
            Users.sort((a, b) => a[prop] < b[prop] ? 1 : -1);
            displayTable(Users, currentPage, rowsPerPage);
        }
    });
    paginatedUsers.forEach((employee, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td >${employee._id}</td>
            <td >${employee.Name}</td>
            <td >${employee.Email}</td>
            <td >${employee.Phone}</td>
            <td >${employee.City}</td>
            <td >${employee.Role}</td>
            <td >${employee.CreatedAt}</td>
            <td class="delete-btn" >
            <button id="Del" type="button"  data-index="${start + index}" class="btn btn-danger">
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

    setupPagination(Users, rowsPerPage, currentPage);
}

// * Function to Set Up Pagination
function setupPagination(Users, rowsPerPage, currentPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // * Clear previous pagination
    const totalPages = Math.ceil(Users.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "btn btn-info m-1";
        if (i === currentPage) button.className = ("btn btn-dark");
        button.addEventListener("click", () => {
            displayTable(Users, i, rowsPerPage);
        });
        pagination.appendChild(button);
    }
}


// * Event Listeners Load 
window.addEventListener("load", function () {
    isAuthorized();
    let isUpdate=false;

    let Users = getUsers();
    let Tickets=data.Tickets;
    let rowsPerPage = 10; // * Default rows per page
    let currentPage = 1;

    const counterInput = document.querySelector('input[type="number"]');
    const searchInput = document.querySelector('input[type="text"]');

    const TicketcounterInput = document.getElementById('TicketCounterInput');
    const TicketsearchInput = document.getElementById('TicketSearhInput');



    const table = document.getElementsByTagName("table")[0];
    const UsersNum = this.document.getElementById("Users");
    UsersNum.innerText = getUsers().length


    displayTable(Users, currentPage, rowsPerPage);
    displayTicketsTable(Tickets, currentPage, rowsPerPage);

    // * Update Rows Per Page Based on Counter Input
    counterInput.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value, 10) || 5;
        currentPage = 1; // * Reset to the first page
        displayTable(Users, currentPage, rowsPerPage);
    });
    // * Tickets counter Row / Page Event
    TicketcounterInput.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value, 10) || 5;
        currentPage = 1; // * Reset to the first page
        displayTicketsTable(Tickets, currentPage, rowsPerPage);
    });

    // * Delete || update User Row
    table.addEventListener("click", function (event) {
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

                    const index = +event.target.dataset.index;
                    console.log(index);
                    const user = Users.splice(index, 1);
                    if(user[0].Role=="User"){
                        DeleteCustomer(user[0]._id);
                    }else{
                        DeleteSeller(user[0]._id)
                    }
                    displayTable(Users, currentPage, rowsPerPage);
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
    // * Search Users
    searchInput.addEventListener("keyup", function () {
        const searchTerm = this.value.trim().toLowerCase();
        const filteredUsers = Users.filter(user =>
            user.Name.toLowerCase().includes(searchTerm) ||
            user._id.toLowerCase().includes(searchTerm) ||
            user.Email.toLowerCase().includes(searchTerm) ||
            user.Phone.toLowerCase().includes(searchTerm) ||
            user.City.toLowerCase().includes(searchTerm) ||
            user.Role.toLowerCase().includes(searchTerm) ||
            user.CreatedAt.toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // * Reset to the first page
        displayTable(filteredUsers, currentPage, rowsPerPage);
    });
    // * Ticket Search Input 
    TicketsearchInput.addEventListener("keyup", function () {
        const searchTerm = this.value.trim().toLowerCase();
        const filteredTickets = Tickets.filter(ticket =>
            
            ticket.Comment.toLowerCase().includes(searchTerm) ||
            ticket.CreatedAt.toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // * Reset to the first page
        displayTicketsTable(filteredTickets, currentPage, rowsPerPage);
    });

    // * on click Add Account Button the form will reset and the header will change to the default 
    $("#add-Account").on('click', function () {
        $("#in-head").text("Add New Account");
        $("#AccountsForm")[0].reset();
        isUpdate=false
        
    });
    $("#Confirm").on('click', function (e) {
        console.log(e.target.parentElement)
        AddAccounts(isUpdate);
        loadDataFromLocalStorage();
        Users=getUsers();
        displayTable(Users,currentPage,rowsPerPage);
    });
   



    function DeleteCustomer(customerid) {
        const selectedorders = data.Orders.filter(function (e) {
            return e.UserID == customerid && e.Status != "Shipped"
        });
        console.log(selectedorders);
        selectedorders.forEach(function (or) {
            console.log(or.Items)
            decreaseTotalSales(or.Items)
            increaseStock(or.Items);
            DeleteOrders(customerid);
        });
        DeleteUser(customerid);
    }



});// * end of load


//! ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// * Function to Display the User Table
function displayTicketsTable(Tickets, currentPage = 1, rowsPerPage = 10) {
    const tbody = document.getElementById("TicketBody");
    const thead = document.getElementById("TicketHead");
    tbody.innerHTML = ""; // Clear previous rows
    thead.innerHTML = ""; // Clear previous rows


    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = Tickets.slice(start, end);
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <tr >
    <th  id="Name" > Name</th>
    <th  id="Comment" > Comments</th>
    <th  id="CreatedAt" > CreatedAt</th>
    </tr>   
`;
    thead.appendChild(tr);
    // * Add Asc Sorting Event
    tr.addEventListener("click", function (event) {
        const prop = event.target.id;
        console.log("Asc Sorting")
        if (prop) {
            Tickets.sort((a, b) => a[prop] > b[prop] ? 1 : -1);
            displayTicketsTable(Tickets, currentPage, rowsPerPage);
        }
    });
    // * Add Desc Sorting Event
    tr.addEventListener("dblclick", function (event) {
        const prop = event.target.id;
        console.log("Desc Sorting")
        if (prop) {
            Tickets.sort((a, b) => a[prop] < b[prop] ? 1 : -1);
            displayTicketsTable(Tickets, currentPage, rowsPerPage);
        }
    });
    paginatedUsers.forEach((ticket) => {
        let UserName=data.Users.find(user=>user._id==ticket.UserID).Name
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td >${UserName}</td>
            <td >${ticket.Comment}</td>
            <td >${ticket.CreatedAt}</td>
            `;
        tbody.appendChild(tr);
    });

    setupTicketsPagination(Tickets, rowsPerPage, currentPage);
}

// * Function to Set Up Pagination
function setupTicketsPagination(Tickets, rowsPerPage, currentPage) {
    const pagination = document.getElementById("Ticketpagination");
    pagination.innerHTML = ""; // * Clear previous pagination
    const totalPages = Math.ceil(Tickets.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "btn btn-info m-1";
        if (i === currentPage) button.className = ("btn btn-dark");
        button.addEventListener("click", () => {
            displayTicketsTable(Tickets, i, rowsPerPage);
        });
        pagination.appendChild(button);
    }
}

