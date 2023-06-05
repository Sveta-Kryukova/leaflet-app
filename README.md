<h1>Web Application Description</h1>
This web application is designed to provide users with a map-based interface for adding and managing markers with specific locations and descriptions. The application utilizes front-end technologies such as HTML, CSS, and JavaScript with the Leaflet library. For data storage, Node.js is used on the back-end, along with a PostgreSQL database.

![map](https://github.com/Sveta-Kryukova/leaflet-app/assets/116656921/6bfaf97b-2072-4e53-a739-706e4b774bd8)


[DEMO](https://sveta-kryukova.github.io/leaflet-app/)
<h3>Features</h3>
<ul>
<li>Modal Window: Upon the first launch of the application, users are presented with a modal window introducing them to the navigation and features of the application. Once the user clicks the button indicating that they have familiarized themselves with the information, the modal window is saved in the local storage to prevent it from appearing on subsequent page refreshes.

<li>
  Main Application: After dismissing the modal window, users are presented with the main application view. The header includes a button that can be used to display the modal window with instructions again, if needed.</li>

<li>
  Map Markers: The map displays existing markers that have already been added to the database. Users can interact with these markers by clicking on them to view their names and descriptions.</li>

<li>
  Adding New Markers: To add a new marker, users can click on the desired location on the map. A form will appear allowing them to enter the marker's name, description, longitude, and latitude. The longitude and latitude fields are automatically populated based on the selected location on the map.</li>

<li>
  Form Validation: The form includes validation to ensure data integrity. The name field does not allow the entry of numbers or symbols. If an invalid input is detected, an error window is displayed with a corresponding error message. The description field also has a character limit of 200, and users are provided with real-time feedback on the number of characters remaining.</li>

<li>
  Required Fields: Users cannot create a new marker without providing a name. However, they can proceed without entering a description.</li>

<li>
  Canceling Marker Creation: If a user decides not to create a marker, they can click the "Close" button, which will clear the form and close it.</li>

<li>
  Editing and Deleting Markers: Users can edit existing markers by clicking the "Edit" button, which opens a form with fields for modifying the name and description. The same validation rules apply as in the marker creation form. Additionally, users can delete markers by clicking on them, which will display the marker's name and description and provide an option to delete it.</li>

<li>
  Footer Icons: The footer section includes icons that allow users to contact the developer via email, LinkedIn, or Telegram. Users can also visit the developer's GitHub profile.</li>
  </ul>
  
  <h3>Front-end Technologies</h3>
  <ul>
<li>HTML: The structure and layout of the web pages are created using HTML (Hypertext Markup Language), which provides the foundation for organizing and presenting the content.</li>

<li>CSS: The application's visual styles and layout are implemented using CSS (Cascading Style Sheets). CSS allows for customizing the appearance of HTML elements and ensuring a visually appealing user interface.</li>

<li>JavaScript: The application's interactivity and dynamic functionality are powered by JavaScript. JavaScript enables the manipulation of HTML elements, handling user events, and making requests to the server.</li>

<li>Leaflet: Leaflet is a popular JavaScript library for building interactive maps. It provides functionalities for displaying maps, adding markers, and handling map-related events. Leaflet is used in this application to render the map and manage markers.</li>
</ul>

<h3>Back-end Technologies</h3>
<ul>
<li>Node.js: Node.js is a JavaScript runtime that allows developers to run JavaScript code on the server-side. It provides an efficient and scalable platform for building web applications. In this application, Node.js is used to handle server-side logic, API endpoints, and communicate with the database.</li>

<li>PostgreSQL: PostgreSQL is a powerful and open-source relational database management system. It provides a reliable and efficient solution for storing and retrieving data. In this application, PostgreSQL is used to persist marker data, including their names, descriptions, and coordinates.</li>
</ul>

<h3>Other Tools and Libraries</h3>
<ul>
  <li>LocalStorage: The localStorage feature is utilized to store information about whether the user has already seen the modal window. By saving this information locally, the modal window won't be displayed on subsequent visits or page refreshes.</li>
</ul>
<h3>Getting Started</h3>
To run the application locally, follow these steps:

To start working on the project, follow these steps:

Clone the repository to your local machine using the following command:
```
git clone <repository-url>
```

Replace <repository-url> with the actual URL of the repository.

Make sure you have Node.js installed on your computer. You can check if Node.js is installed by running the following command in your terminal:
```
node --version
```
If Node.js is not installed, you can download and install it from the official Node.js website (https://nodejs.org).

Open the cloned repository in your preferred code editor.

In the terminal, navigate to the project directory.
Install modules:
  ```
  npm install
  ```

Run the following command:
```
npm run dev
  ```
This command will start the server and make the application accessible locally.

You can now begin working on the project and make any necessary changes or additions.

Remember to save your changes regularly and commit them to the repository using Git.

Happy coding!
<h3>Contact</h3>
If you have any questions or feedback, feel free to contact the developer:

Email: [Developer's mail](svetlana.kryukova.job@gmail.com)
LinkedIn: [Developer's LinkedIn Profile](https://www.linkedin.com/in/svetlana-kryukova-a06219265/?locale=en_US)
