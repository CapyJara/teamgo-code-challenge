# About
## Tech Stack
- This API is built in node.js, uses an express server, a mongo database and uses mongoose for data modeling.
## Auth
- The authentication uses bcrypt and jwt to keep non members from creating events, and only authorizes event organizers to update their events.
## Hosting
- The server is hosted on Heroku and provisioned with a m-Lab database.
## Testing
- This project used a test driven design based methodology where tests for models and routes where written first and then made to pass. I used jest for all my testing and travis as a continuous integration service.


# Routes
Base url: https://teamgo-code-challenge.herokuapp.com/api/v1

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
- Paging option is only available on get all events, and get events by location/date routes.

## Seeding the database
- Route: /seed/"SEED_KEY"
- This API has a route that will empty the database then seed it with 1000 events, 20 event organizers and 2000 event attendees. 
- Since this route will drop the data base it require a secret key which you must ask me (Jared) in order to hit the route. The key is checked against a hidden env file and variable.
