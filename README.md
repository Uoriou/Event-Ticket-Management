# Event Ticket Management System (ETMS)

## Project Overview
Many musical bands, opera singers, or any kind of event organisers are looking for a website to list their events on, as they want to reach a wider audience who are also looking for events to participate in. 
This platform allows easier listing of their event on the website along with a easier management of the events. 


## Libraries / Technologies Used:

  ### Frontend 
  * React Typescript
  * MUI material
    
  ### Backend 
  * Python Django REST framework 
  * Express JS
  * JWT token
    
  ### Databases
  * PostgreSQL server

  ### Server Deployment / DevOps
  * Docker
  
  [![My Skills](https://skillicons.dev/icons?i=py,django,express,js,postgres,react,ts,docker&perline=3)](https://skillicons.dev)

## System Architecture 

![alt text](https://github.com/Uoriou/Event-Ticket-Management/blob/main/architecture.jpg?raw=true)


## Getting Started

  ### Technical Requirements:
  
  To run ETMS, please ensure that your system meets the following requirements:
  
  * Operating System: Windows, macOS, or Linux
  * Docker / Docker desktop
  
  * Please install Docker desktop: https://www.docker.com/products/docker-desktop/
  * Make sure to clone this repository:
  ```bash 
    https://github.com/Uoriou/Event-Ticket-Management.git
  ```
  
  ### Run the application using the docker image
  
  Once Docker / Docker desktop is installed, make sure to navigate to where docker-compose.yml file is located to run the project using this command: 
  ```bash 
      docker compose up -d --build 
  ```
  Make sure to run the project container. 
  
  Once the container is up and running, navigate to where python-backend folder is located to create a superuser:
   ```bash
     docker-compose exec web python3 manage.py createsuperuser
  ```
  The command will ask for your username and password, which allow you to access Django admin panel.
  
  Access the application at: 
  ``` bash
      //localhost:3000/login 
  ```
  
  To stop the container and the application run:
  ```bash
      docker compose down
  ```

## Features 

* Access control (authentication) 
* Event viewing for audiences
* CRUD events for event admins
* Sales dashboard for event admins (if they organize events)

  


