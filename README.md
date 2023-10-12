## Approach

For this project I decided to use Nest.js as that's what I'm most familiar with. I also believe that because it's very opinionated, it enforces best practices (dependency injection, controller/service architecture, etc.).

I used class-validator for the validation, primarily to ensure the username is long enough, and the password is strong. There are other validation libraries like Zod that are quicker, but a bit of work to implement with Nest.js, so I went with class-validator for simplicity.

I implemented an endpoint to create a user under **/register** which checks Redis (as per the coding assignment requirements) to see if the user exists, and if they don't it creates a new user. I used Bcrypt to hash the user's password before saving it in Redis. In a real world application, I would choose PostgreSQL for the database.

For authentication, I decided to use Passport, as it's an industry-standard package and makes authentication super easy. I created a **/login** endpoint which uses **LocalAuthGuard** and **LocalStrategy** to ensure the user exists and their password is valid. If the username and password are both valid, it will return an `accessToken` and a `refreshToken`. These are both validated with a special secret which is present in the **.env** file. I also created a **/refresh** endpoint to refresh the JWT.

## Future Considerations

For the sake of time there were a few security considerations that are marked with `TODO`'s.

1. The API uses CORS, however, the origin is set to `*`. If this hypothetical application were to go to production, the origin would need to be updated to match the origin(s) of the client(s) requesting it.
2. Currently, the mechanism to refresh tokens is very simplistic. In a real-world application, the best practice would be to create a way of blacklisting old tokens when issuing a new token to a user. This could then be verified in the JwtStrategy's `validate` method.

## Installation

We are using the PNPM package manager. You can install it [here](https://pnpm.io/installation).

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Starting Docker Containers
```bash
pnpm services:start
```

## Accessing API
http://localhost:4000

## Accessing API Documentation
http://localhost:4000/docs
