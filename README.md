# Event Ticket Management System (ETMS)

Many musical bands, opera singers, or any kind of event organisers are looking for a website to list their events on, as they want to reach a wider audience who are also looking for events to participate in. 
This platform allows easier listing of their event on the website along with a easier management of the events. 

## Project Overview

## Technical Requirements:
To run ETMS, please ensure that your system meets the following requirements:

- Operating System: Windows, macOS, or Linux
- Docker

## Libraries Used:

- Python Django REST framework 
- C++ CROW 
- PostgreSQL server
- React Typescript

## Installation Guidline

- Please install Docker 
- Make sure to download this ETMS project folder

## Run the docker image

Once Docker is installed, it is possible to use the .yml file of this project to build the docker image using this command: 
```bash 
    docker compose up -d --build 
```

Make sure to run the project container. 

Once the container is up and running, go back to where python-backend is located and create a superuser:

```bash
   docker-compose exec web python manage.py createsuperuser
```
The command will ask for your username and password, which allow you to access Django admin panel.

Access the application at: 
``` bash
    http://localhost:3000/login 
```

To stop the container: Press CTRL + C 

## PostgreSQL 

username: mario
password:mariopassword

## Project File Structure 


etms/
├── cpp-backend/              # C++ Crow backend folder
├── python-backend/           # Python Django backend folder
├── etms_app_frontend/        # React TypeScript frontend folder
├── docker-compose.yml        # Docker Compose configuration file
├── README.md                 # Project documentation

