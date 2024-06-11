# BILLED-APP

This project, called frontend, is connected to a backend API service that you must also launch locally.

Backend Project: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

![billed.JPG](https://github.com/Laurene45/Billed-app-FR-Front/blob/main/documentation/billed.JPG?raw=true)

## Method of working:


For good organization, you can create a bill-app folder in which you will clone the backend project and subsequently, the frontend project:

- Clone the backend project into the bill-app folder:
```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```
```
bill-app/
   - Billed-app-FR-Back
```

Clone the frontend project into the bill-app folder:
```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
```
```
bill-app/
   - Billed-app-FR-Back
   - Billed-app-FR-Front
```

## How to launch the application locally?

### step 1 - Launch the backend:

Follow the instructions in the README of the backend project.

### step 2 - Launch the frontend:

Go to the cloned repo:
```
$ cd Billed-app-FR-Front
```

Install the npm packages (described in `package.json`):
```
$ npm install
```

Install live-server to launch a local server:
```
$ npm install -g live-server
```

Launch application :
```
$ live-server
```

Then go to the address: `http://127.0.0.1:8080/`


## How to run all tests locally with Jest?

```
$ npm run test
```

## How to run a single test?

Install jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## How to view test coverage?

`http://127.0.0.1:8080/coverage/lcov-report/`

## Accounts and users :

Vous pouvez vous connecter en utilisant les comptes:

### administrator : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employee:
```
utilisateur : employee@test.tld
mot de passe : employee
```


