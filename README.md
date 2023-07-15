# Library Management System App

A simple libarry management system application running across multiple Docker containers.

## Getting started

Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows. [Docker Compose](https://docs.docker.com/compose) will be automatically installed. On Linux, make sure you have the latest version of [Compose](https://docs.docker.com/compose/install/).

## Download repository & run the application

Run the following command in your terminal to download the repo. You can also use your package-manager of choice.

```shell

wget https://github.com/nklsdhbw/database-project/archive/refs/heads/docker.zip
```

Now unzip the `docker.zip` folder e.g. with the `unzip`package

```shell

unzip docker.zip

```

Change to the directory containing the `docker-compose.yml` file

```shell

cd database-project-docker/docker/

```

Now start the containers using the following command

```shell

docker compose up --build

```

The `libary management React-app` will be running at [http://localhost:3000](http://localhost:3000), the `flask app` will be at [http://localhost:8000](http://localhost:8000), the `postgres server` will be at [http://localhost:5433](http://localhost:5432) and the `adminer` instance will be at [http://localhost:8080](http:localhost:8080).

## Architecture

The systems consists of

- A front-end [React](https://react.dev/) web app which lets you manage your Library System Management

- A [Flask](https://flask.palletsprojects.com/en/2.3.x/) server that uses psychopg2 to run the SQL queries against the postgres database

- A [Postgres](https://hub.docker.com/_/postgres/) database backed by a Docker volume

- A [adminer](https://hub.docker.com/_/adminer/) instance to interact with the database

## Notes

This web application for a library management system was developed by [Aref Hasan](https://github.com/aref-hasan), [Luca Mohr](https://github.com/Luca2732) and [Niklas Scholz](https://github.com/nklsdhbw) as a database project in the 4th semester @DHBW Mannheim.
