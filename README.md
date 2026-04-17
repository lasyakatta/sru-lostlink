# SRU LostLink
SRU LostLink is a full-stack web application designed to help students report and recover lost items within a campus environment. The platform provides a simple and efficient way to post lost or found items and connect with the respective owners.

## Overview
Users can register and log in to the system, post details of lost or found items, and browse existing posts. The application includes a search and filter feature to quickly locate relevant items.
A communication feature allows users to send requests to item owners. The owner receives the message along with the sender’s contact details, enabling direct communication outside the platform.

## Key Features
* User registration and login
* Post lost and found items
* Search and filter items
* Send contact requests to item owners
* View incoming requests with contact details
* Delete items (only by the user who posted them)
* Delete messages after resolution


## Technology Stack
* **Frontend:** React.js, CSS
* **Backend:** Node.js, Express.js
* **Databases:**
  * MongoDB for items and messages
  * PostgreSQL for user authentication

## Functionality
The system ensures that only the user who posted an item can delete it. Communication between users is handled through a request-based system where one user sends a message and shares their contact information. The receiver can then use the provided contact details to communicate further.

## Conclusion
SRU LostLink provides a practical solution for managing lost and found items within a campus by combining ease of use with essential functionality for user interaction.
