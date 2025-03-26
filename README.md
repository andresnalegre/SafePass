# About SafePass

**SafePass** is a password manager developed using React and PHP, and integrated with MariaDB. It's designed to easily create secure and strong passwords, featuring a password validator that shows how strong your password is, and makes it easy to store them.

---

## Features

- Password Storage
- Strong Password Generator
- User Autentication

---

## Technologies Used

- React
- PHP
- MariaDB

---

## Step 1: Clone the Repository

   - Open your terminal and clone the SafePass repository:

     ```bash
     git clone https://github.com/andresnalegre/SafePass
     ```
     

## Step 2: How to use the SafePass app

   - Navigate to the SafePass Folder:

     ```bash
     cd SafePass
     ```
     
   - Run the project:

     ```bash
     npm start
     ```
     
   **The packege.json is already configured to set up the database and run the React project automatically. Just make sure all dependencies are installed.**

## Step 3:  Validating your data into safepass at XAMPP
1. **Access MariaDB**:
   - Open a new terminal and run:

     ```bash
     /Applications/XAMPP/xamppfiles/bin/mysql -u root -p --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock;
     ```
     
   - Alternatively, you can access phpMyAdmin:

     ```bash
     http://localhost/phpmyadmin
     ```
     
   **Make sure that XAMPP is running properly.**

2. **Select the SafePass Database**:  
   - Select safepass Database:
     
     ```sql
     USE safepass;
     ```
     
3. **Analyze Stored Data**:  
   - view all stored users:

     ```sql
     SELECT * FROM users;
     ```
     
   - view all stored dashboard data: 

     ```sql
     SELECT * FROM dashboard;
     ```
     
---

## License

This project is licensed under the [MIT License](LICENSE)

---

## Contributing

Contributions are welcome! If you have any improvements or new features you’d like to add, feel free to fork the repository and submit a pull request. Please ensure that your code follows the existing style and structure.

[![GitHub](https://img.shields.io/badge/Made%20by-Andres%20Nicolas%20Alegre-brightgreen)](https://github.com/andresnalegre)
