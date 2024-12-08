 export const data = {
    guestCart: [],
    CurrentUSer: 
    {
        "_id": "user3",
        "Name": "Bob Buyer",
        "Email": "buyer@example.com",
        "Password": "hashed_password3",
        "Phone": "123987456",
        "Address": "789 Oak Lane, Shelbyville",
        "Role": "User",
        "CreatedAt": "2024-11-27T12:36:00Z",
        "cart" : [
            { "_id": "prod1", "Quantity": 2 },
            { "_id": "prod2", "Quantity": 2 },
        ],
    },
    Users: [
        {
            "_id": "user1",
            "Name": "John Doe",
            "Email": "admin@example.com",
            "Password": "hashed_password1",
            "Phone": "123456789",
            "Address": "123 Elm Street, Springfield",
            "Role": "Admin",
            "CreatedAt": "2024-11-27T12:34:56Z"
        },
        {
            "_id": "user2",
            "Name": "Alice Seller",
            "Email": "seller@example.com",
            "Password": "hashed_password2",
            "Phone": "987654321",
            "Address": "456 Maple Avenue, Springfield",
            "Role": "Seller",
            "CreatedAt": "2024-11-27T12:35:00Z"
        },
        {
            "_id": "user3",
            "Name": "Bob Buyer",
            "Email": "buyer@example.com",
            "Password": "hashed_password3",
            "Phone": "123987456",
            "Address": "789 Oak Lane, Shelbyville",
            "Role": "User",
            "CreatedAt": "2024-11-27T12:36:00Z",
            "cart" : [
                { "_id": "prod1", "Quantity": 2 },
                { "_id": "prod2", "Quantity": 2 },
              ],
        }
    ],
    Categories: [
        {
            "_id": "cat1",
            "Name": "Chairs",
            "Description": "Seating furniture for all purposes."
        },
        {
            "_id": "cat2",
            "Name": "Tables",
            "Description": "Dining and work tables."
        }
    ],
    Products: [
        {
            "_id": "prod1",
            "Name": "Wooden Chair",
            "Description": "A sturdy wooden chair for dining or work.",
            "Price": 59.99,
            "Stock": 50,
            "CategoryID": "cat1",
            "SellerID": "user2",
            "Images": [
                "../assets/chair2.jpg",
                "../assets/chair.jpg",
            ],
            "CreatedAt": "2024-11-27T12:37:00Z",
            "NumOfSales": 5
        },
        {
            "_id": "prod2",
            "Name": "Wodden Table",
            "Description": "A stylish wooden table.",
            "Price": 120.0,
            "Stock": 20,
            "CategoryID": "cat2",
            "SellerID": "user2",
            "Images": [
                "../assets/table.jpg",
                "../assets/tabelswebp.webp"
            ],
            "CreatedAt": "2024-11-27T12:38:00Z",
            "NumOfSales": 5
        },
        {
            "_id": "prod3",
            "Name": "kitchen",
            "Description": "A stylish kitchen.",
            "Price": 1200.0,
            "Stock": 20,
            "CategoryID": "cat3",
            "SellerID": "user2",
            "Images": [
                "../assets/dinningroom.jpg",
                "../assets/kitchen.avif"
            ],
            "CreatedAt": "2024-11-27T12:38:00Z",
            "NumOfSales": 5
        },{
            "_id": "prod4",
            "Name": "master room",
            "Description": "A stylish master room.",
            "Price": 120.0,
            "Stock": 20,
            "CategoryID": "cat4",
            "SellerID": "user2",
            "Images": [
                "../assets/file.png",
                "../assets/img3.avif"
            ],
            "CreatedAt": "2024-11-27T12:38:00Z",
            "NumOfSales": 5
        },
        ,{
            "_id": "prod5",
            "Name": "master room",
            "Description": "A stylish master room.",
            "Price": 120.0,
            "Stock": 20,
            "CategoryID": "cat4",
            "SellerID": "user2",
            "Images": [
                "../assets/children-bed.avif",
                "../assets/img3.avif"
            ],
            "CreatedAt": "2024-11-27T12:38:00Z",
            "NumOfSales": 5
        }
    ],
    Orders: [
        {
            "_id": "order1",
            "UserID": "user3",
            "Items": [
                {
                    "ProductID": "prod1",
                    "Quantity": 2,
                    "Price": 59.99
                },
                {
                    "ProductID": "prod2",
                    "Quantity": 1,
                    "Price": 120.0
                }
            ],
            "TotalAmount": 239.98,
            "Status": "Pending",
            "CreatedAt": "2024-11-27T12:40:00Z"
        }
    ],
    Cart: [
        {
            "_id": "cart1",
            "UserID": "user3",
            "Items": [
                {
                    "ProductID": "prod1",
                    "Quantity": 1
                },
                {
                    "ProductID": "prod2",
                    "Quantity": 2
                }
            ],
            "UpdatedAt": "2024-11-27T12:41:00Z"
        }
    ],
    Reviews: [
        {
            "_id": "review1",
            "ProductID": "prod1",
            "UserID": "user3",
            "Rating": 4,
            "Comment": "Great quality, sturdy chair.",
            "CreatedAt": "2024-11-27T12:42:00Z"
        }
    ]
}

// export default data;


  export function loadDataFromLocalStorage() {
    console.log("Data LOADED:>> ");
    for (const key in data) {
        data[key] = JSON.parse(localStorage.getItem(key)) || data[key];
    }
    return data;
}
  export function saveDataInLocalStorage() {
    for (const key in data) {
        localStorage.setItem(key, JSON.stringify(data[key]));
    }

}
 export function saveInLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentUser() {
    return data.CurrentUSer;
}
 export function addUser(User) {
    data.Users.push(User);
    saveDataInLocalStorage();
}

 export function getUserById(id) {
    return data.Users.find((user) => user._id === id);
}
 export function getUserByEmail(email) {
    return data.Users.find((user) => user.Email === email);
}