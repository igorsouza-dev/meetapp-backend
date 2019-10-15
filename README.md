# Meetapp - Backend

Backend made for the MeetApp project.

## What is Meetapp?

- It's an app where the users can sign up for free and create Meetups for other users to join and meet.

## Where is the frontend?

- You can find the frontend [here](https://github.com/igorsouza-dev/meetapp-frontend).

- There is also a mobile version [here](https://github.com/igorsouza-dev/meetapp-mobile).

## Getting started

You should setup the following software on your machine in order for this backend work.

- [Node](https://nodejs.org/en/download/) (I usually prefer installing using [nvm](https://nodejs.org/en/download/package-manager/#nvm))
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)
- [Postgres](https://www.postgresql.org/download/)
- [MongoDB](https://www.mongodb.com/download-center/community)
- [Redis](https://redis.io/download)

If you have [docker](https://www.docker.com/get-started) on your machine, you can run the following command to install the databases:

`$ docker run --name mongo-meetapp -p 27017:27017 -d -t mongo`

`$ docker run --name redis-meetapp -p 6379:6379 -d -t redis:alpine`

`$ docker run --name postgres-meetapp -e POSTGRES_PASSWORD=mysecretpassword -d postgres`

### But why 3 databases?

MongoDB is being used for storing notifications, Redis is for storing the mail queue used by the Queue server. Postgres is the main database, responsible for storing all data used by the server.

### Installing Dependencies

Just run `yarn`.

### Initializing the database

After installing the project's dependencies, you have to copy the `.env.example` file and rename it to `.env`. Fill in all empty fields with your sensitive data and run the following command in order to create the necessary tables:

`$ yarn sequelize db:migrate`

### Starting the server

`$ yarn dev`

### Starting the Queue server

`$ yarn queue`

### Routes

If you use [Insomnia](https://insomnia.rest/download), I left a `.json` file containing all of the possible API Requests that can be imported into Insomnia.

## Error handling with Sentry

You can also integrate with [Sentry](https://sentry.io) for handling erros in this project while in production. After you signed up in their website and created a project, you should put the DSN inside de `.env` file in a `SENTRY_DSN` variable. Also note that the node environment variable (`NODE_ENV`) should be set to `production` in the `.env` file. If not, the server will handle errors locally.

---

<div align="center">
This project was made during the Rockeseat's Gostack Bootcamp 8.0 as a challenge in order to get the certification.
</div>
