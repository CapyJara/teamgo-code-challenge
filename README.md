# About
## Tech Stack
- This API is built in node.js, uses an express server, a mongo database and uses mongoose for data modeling.
## Auth
- The authentication uses bcrypt and jwt to keep non members from creating events, and only authorizes event organizers to update their events.
- Users do not need to sign in to search events. This allows anyone to use the api, but only members are allowed to edit the database.
## Hosting
- The server is hosted on Heroku and provisioned with a m-Lab database.
## Testing
- This project used a test driven design based methodology where tests for models and routes where written first and then made to pass. I used jest for unit and e2e testing and travis as a continuous integration service.
## Seeding
- I created a package.json script that would run a file that seeds a local database, and I also created a seed route that seeds the deployed database. The route requires a secret key that is stored in the env variables and only available to people I give it to.

# Routes
Base url: https://teamgo-code-challenge.herokuapp.com/api/

## User/Auth Routes:
### Signup
- Route: /user/signup
- Type: POST
- Send:
  - email (unique)
  - password
- Format: JSON
### Signin
- Route: /user/signin
- Type: POST
- Send:
  - email
  - password
- Format: JSON
## Event Routes:
### Post new event
- Route: /event
- Type: POST
- Send: 
  - name
  - description
  - eventDate - Date must be in ISO format ex: 
2020-01-22T07:09:00.946Z
  - state
  - city
  - address
- Format: JSON
- Headers:
  - Authorization: token (get token from signup/signin post)
### Get events and query by location and or by date
- Route: /event
- Type: GET
- Paging - See paging section
- Query
  - state - excepts only two letter abbreviation ex: or
  - city
  - start - starting date in format YYYY-MM-DD
  - end - end date in format YYYY-MM-DD
- Notes:
  - If no query, will return all events
  - Can search by location and date separately or together
  - If searching by city, state must be include
  - If searching by date, both start and end are required
  - If only wanting to search for single day, the end day is the day after ex: start=2020-01-01 end=2020-01-02
  - ex: /api/v1/event?state=or&city=portland&start=2020-01-01&end=2020-01-15
### Get events by id
- Route: /event/:eventId
- Type: GET
### Attend an event
- Route: /event/attend/:eventId
- Type: PUT
- Headers:
   - Authorization: token (get token from signup/signin post)
### Update an event
- Route: /event/update/:eventId
- Type: PUT
- Headers:
   - Authorization: token (get token from signup/signin post)
- Send:
  - Send JSON to update any existing fields
    - name
    - description
    - eventDate - Date must be in ISO format ex: 
2020-01-22T07:09:00.946Z
    - state
    - city
    - address
    - organizer
- Format: JSON

## Paging
- Page:
  - (Optional) Add page to query ex: ?page=2
  - Page default is 1
- Perpage:
  - (Optional) Add perpage to query ex: ?perpage=20
  - Perpage default is 50
- Paging option is only available on get events route.

## Seeding the database
- Route: /seed/"SEED_KEY"
- This route will add 20 event organizers, 1000 events and 2000 event attendees to the database. 
- This route requires a SEED_KEY, that you can only get by asking me (Jared), in order to use it. 
- Please allow a few minutes after hitting this route to see the results.
