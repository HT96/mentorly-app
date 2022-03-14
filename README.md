# Mentorly

Simple API app with NodeJs Express and MySQL

## Getting Started

Clone the project repository by running the command:

```bash
git clone https://github.com/HT96/mentorly-app.git
```

After cloning, duplicate `.env.example` and rename it `.env`

Repeat the same with `src/www/config/default.example.json` and rename it `default.json`

For create and start containers run:

```bash
docker-compose up --build
```

Then open the `src/www/database/db.sql` file and run the given commands to create required tables in the database

And you should get a running application on your [http://localhost](http://localhost)

The API provides the following interactions

Register (create user)
```bash
POST http://localhost/api/v1/auth/signup
Request {
  first_name: required,
  last_name: required,
  email: required,
  password: required,
  is_mentor: 1/0,
  position: optional,
  plans: optional,
  education: optional,
  experience: optional,
  about: optional
}
Response {
  user: {
    id,
    email,
    ...
  },
  msg: message
}
```

Sign in
```bash
POST http://localhost/api/v1/auth/signin
Request {
  email: required,
  password: required
}
Response {
  token: JWT,
  msg: message
}
```

Get user by id
```bash
GET http://localhost/api/v1/users/:id
Response {
  id,
  email,
  ...
}
```

Get list of users by filters
```bash
GET http://localhost/api/v1/users
Request {
  search: optional,
  is_mentor: optional(1/0),
  field_id: optional,
  order: optional([column, dir])
}
Response [
  {
    id,
    email,
    ...
  },
  {
    id,
    email,
    ...
  }
]
```

Update user information
```bash
PUT http://localhost/api/v1/users/:id
Request {
  first_name: required,
  last_name: required,
  is_mentor: 1/0,
  position: optional,
  plans: optional,
  education: optional,
  experience: optional,
  about: optional
}
Response {
  msg: message
}
```

Delete account
```bash
DELETE http://localhost/api/v1/users/:id
Response {
  msg: message
}
```

Create professional field
```bash
POST http://localhost/api/v1/auth/fields
Request {
  title: required
}
Response {
  field: {
    id,
    title,
    ...
  },
  msg: message
}
```

Create professional field by id
```bash
GET http://localhost/api/v1/fields/:id
Response {
  id,
  title,
  ...
}
```

Get list of professional fields by filters
```bash
GET http://localhost/api/v1/fields
Request {
  search: optional,
  user_id: optional,
  order: optional([column, dir])
}
Response [
  {
    id,
    title,
    ...
  },
  {
    id,
    title,
    ...
  }
]
```

Attach professional field to user 
```bash
POST http://localhost/api/v1/auth/users/fields
Request {
  field_id: required
}
Response {
  msg: message
}
```

Detach professional field from user
```bash
DELETE http://localhost/api/v1/auth/users/fields/:id
Response {
  msg: message
}
```