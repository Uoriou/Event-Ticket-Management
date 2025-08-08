# Event Ticket Management System (ETMS)

Many musical bands, opera singers, or any kind of event organisers are looking for a website to list their events on, as they want to reach a wider audience who are also looking for events to participate in. 
This platform allows easier listing of their event on the website along with a easier management of the events. 

## Project Overview

## Technical Requirements:
To run ETMS, please ensure that your system meets the following requirements:

- Operating System: Windows, macOS, or Linux
- Docker / Docker desktop

## Libraries / Technologies Used:

- Python Django REST framework 
- Express JS 
- PostgreSQL server
- React Typescript
- Docker
  
  [![My Skills](https://skillicons.dev/icons?i=py,django,express,js,postgres,react,ts,docker&perline=3)](https://skillicons.dev)

## Installation Guidline

- Please install Docker desktop: https://www.docker.com/products/docker-desktop/
- Make sure to clone this ETMS project

## Run the docker image

Once Docker is installed, it is possible to use the .yml file of this project to build the docker image to run the project using this command: 
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

To stop the container and the application run:
```bash
    docker compose down
```



