# Weather History

#### This App allows you to search for a location and a date range and visualize a graph with weather history information for those inputs, according to the locations and weather information provided by [Meteo-API](https://open-meteo.com/). It works alongside a REST API backend that provides access to weather information for specific locations and dates. This server stores the weather entries information in a SQLite3 database, and makes HTTP requests to the [Meteo-API](https://open-meteo.com/) when the database doesn't have the necessary information (and updates the database with the new entries).

#### Developed using React, Typescript, SASS, Ruby, and Ruby on Rails

## Instructions to run application in development mode:

### Backend: 
- Download/clone this repository's code
- Open command line and navigate to server's folder: "weather-history-server"
- Run command "bundle install && rails db:create && rails db:migrate"
- Run command "rails s -p 3001" to start the server
- It's now possible to run the "weather-history-client" frontend project and make calls to this backend

### Frontend:
- Download/clone this repository's code
- Open command line and navigate to clients's folder: "weather-history-client"
- Run command "npm install"
- Run command "npm start" to start application in the browser

###### Note: <br /> - The backend part of this project should be running on port 3001 alongside this frontend for the application to work <br /> - The app's functionality may be hindered by the [Meteo-API](https://open-meteo.com/)'s availability

## App functionalities:
- Search and dinamically select a location to search weather information about.
- Show a chart with weather information for the chosen location and date range

## Aspects shown in this project:
- React, Typescript, SASS
- Ruby, Ruby on Rails
- Model View Controller (MVC) architectural pattern
- Gitflow Workflow
