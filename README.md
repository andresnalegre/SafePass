
# SafePass

**SafePass** is a password management developed using React and PHP, and integrated with MariaDB. It's designed to create secure and strong passwords, featuring a password validator that shows how strong your password is, and makes it easy to store them.

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
     

## Step 2: Setting Up the Database

   **Validate the username and password**:
   - Open your terminal, navigate to the backend folder:

     ```bash
     Safepass/backend/database.php
     ```

   - By default, the credentials are:

     ```bash
       $this->username = getenv('DB_USER') ?: 'root';
       $this->password = getenv('DB_PASS') ?: 'admin';
     ```
     
   **If you already have a password set, please update it in database.php**


## Step 3:  How to use the app

   - Navigate to the SafePass Folder:

     ```bash
     cd SafePass
     ```
     
   - Run the project:

     ```bash
     npm start
     ```
     
   **The packege.json is already configured to set up the database and run the React project automatically. Just make sure all dependencies are installed.**

## Step 4: Validating your data into storify at MariaDB
1. **Access MariaDB**: 

   - Open a new terminal and run:

     ```bash
     mysql -u root -p
     ```
 
   - Enter the Database password:

     ```text
     admin
     ```
     
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
