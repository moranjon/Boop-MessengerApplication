# README.md - CPS490 - Capstone I - Team 3

Source: <https://bitbucket.org/capstones-cs-udayton/cps490/src/master/README.md>

*NOTE*: _This is just a tentative template for your team to start working on sprint 0. It is a minimum requirement for your project final report and can be updated later.
Your team can revise/add more sections, however, it is highly recommended to seek approval from the instructor for a pull request._

University of Dayton

Department of Computer Science

CPS 490 - Capstone I, Fall 2021

Instructor: Dr. Phu Phung


## Capstone I Project 


# The Messenger Application


# Team members

1.  Jon Moran, moranj13@udayton.edu
2.  John Conroy, conroyj4@udayton.edu
3.  Will Manzella, manzellaw2@udayton.edu
4.  James Oei, oeij01@udayton.edu


# Project Management Information

Management board (private access): <https://trello.com/b/lRZsXKxB/team-3-capstone-i-fall-2021>

Source code repository (private access): <https://bitbucket.org/cps490f21-team3/>


## Revision History

| Date     |   Version     |  Description |
|----------|:-------------:|-------------:|
|09/02/2021|  0.0          | Init draft   |
|10/04/2021|  1.0          | Sprint1 draft|
|10/27/2021|  2.0          | Sprint1 draft|


# Overview

Our application is a messenger app that will allow users to create an account, login, and send messages to a single or multiple users — privately and publicly. Users will be able to add friends (or contacts) in order to communicate. They'll be able to send audio and images to each other while chatting. 
_(Start from Sprint 0, keep updating)_

# System Analysis

![Architecture](https://i.ibb.co/3SBkgf0/arct.png)
_(Start from Sprint 0, keep updating)_

## User Requirements

- Users will login using a username and password which will give them access to their account
- Once loggined into their account users can send messages into private or public chats
- Users will be notified of the typing status of their recipients
- Users can delete messages
- Users can create groups/rooms of desired recipients

List high-level requirements of the project that your team will develop into use cases in later steps _(Main focus of Sprint 0)_

## Use cases


![Use-Case](https://i.ibb.co/F3fhtWc/use-case-capstone1-drawio.png)

User Create Account:
- When using the messenger application, the first page is the user login page. The user login page will consist of two text boxes and two buttons, one for username, one for password, a button to submit credentials, and a button to create a new user. If the credentials are accepted using the new user button, the user will be taken to the main messenger page. 

User Login:
- When using the messenger application, the first page is the user login page. The user login page will consist of two text boxes and a button, one for username, one for password, a button to submit credentials, and a button to create a new user. If the credentials are accepted using the login button, the user will be taken to the main messenger page.

User Private Message:
- When trying to send a private message, user will use the recipient text box to input a private users username. Once the recipients username is specified and the confirm recipient button is clicked, the user can then type out their message and send it using the send button.

Join/Create Group Message:
- When trying to join or create a group message, the user can input the group name into the join group chat 

Public/Private Group Message:
- User can set a group chat as public or private

User Group Message: 
- When trying to send a group message, will be able to communicate through text to that specific group

User Sends Image to Other User(s): 
- When trying to send an image, the user will send their image file

User Sends Audio to Other User(s): 
- When trying to send an image, the user will send their audio file

Show Password:
- When trying to login, a user can select a checkbox to show password

Toggle Darkmode/Lightmode:
- User can select a button to toggle between lightmode and darkmode for all UI

_Draw the overview use case diagram, and define brief use case description for each use case (Main focus of Sprint 0)_


# System Design

![Interaction_Diagram](https://i.ibb.co/6PbsvBg/System-Design.png)
_(Start from Sprint 1, keep updating)_

## Use-Case Realization

![Sprint-1 Use Cases](https://i.ibb.co/0j1wvRV/Sprint1-Use-Cases.png)

## Database 

_(Start from Sprint 3, keep updating)_

## User Interface

Login Page: 
- Contains a Login and Password text box with a JOIN button
- Contains a show password checkbox for showing password when signing in
- Contains a register user link

Register User Page:
- Contains a username and password textbox for registering a new user with a Join button

Chat Page: 

- Public Chat (user clicks on "PUBLIC" button):
	
	-Displays the option to add a friend
	
	-Displays online users
	
	-has a message box to type in & a SEND button
	
	-Displays when a user is typing
	
	-Has a CLEAR MESSAGES button for the user to clear the current info in their chat box


- Private Chat (user clicks on "PRIVATE" button):
	
	-Displays the option to add a friend
	
	-Displays online users
	
	-has a recipient box to type a username to send a message to
	
	-has a message box to type in & a SEND button (sends to recipient)
	
	-Displays when a user is typing
	
	-Has a CLEAR MESSAGES button for the user to clear the current info in their chat box
	
- Group Chat:
	-Displays the option to add a friend to a chat
	
	-Displays online users
	
	-Displays who is typing
	
	-Allows users to send messages to multiple individuals in a group chat
	
	-Has a CLEAR MESSAGES button

_(Start from Sprint 1, keep updating)_

# Implementation

_(Start from Sprint 1, keep updating)_

0. For each new sprint cycle, update the implementation of your system (break it down into subsections). It is helpful if you can include some code snippets to illustrate the implementation


SPRINT 1 IMPLEMENTATION:

Login (updated Sprint 2)

Backend: The ChatServer checks the login info and then compares it with information from messengerdb.js. It checks to see if the information is valid (exists in database); if it is valid it will allow the user to login --> if not then it notifies the user if there is an error. It also welcomes the user into the chat and logs records the username and password. Lastly it logs the username into the UserList array. 


ChatServer.js
![login](https://i.ibb.co/KxyPnz1/LOGIN.png)
![login2](https://i.ibb.co/S30WNnn/Data-Layer.png)
messengerdb.js

![login3](https://i.ibb.co/rpk0xdK/loginDB.png)



Frontend: Users are prompted to input their username and password and then it is sent to the server to verify. If successfully authenticated the login div is hidden and the landing page and add friend divs are shown.

![login_front1](https://i.ibb.co/W6YS9hF/loginfront2.png)
![login_front2](https://i.ibb.co/W6YS9hF/loginfront2.png)


Public Chat

Backend: The message is received from the front end and process by the backend. If the user is authenicated then the server returns the message notofyinbng all users who sent it.

![public](https://i.ibb.co/4pBtzgz/Screenshot-177.png)


Frontend: A text field promts the user for the desired message and is then sent back to the server. It is then recepted from the server and displayed to the public chat window.

![public_front](https://i.ibb.co/JcWJf74/Screenshot-181.png)


Private Chat

Backend: Traverses socketId and chekcs if the username matches the intended recipient. If it does then the message is sent to oonly that user. The message is sent to the chatServer and the the ChatServer sends it back letting the recipient know which user it came from. If the intended recipients is not a registered user than it notifies the user and no message is sent. 

![private](https://i.ibb.co/nfSRpGh/Screenshot-176.png)


Frontend: The front end has a text box to prompt the user for the recipients user name and another for the intended message. These two fields are sent to the chatServer and then a new message is recieved from the server and displayed to both users in the private chat.

![private_front](https://i.ibb.co/KVhB73L/Screenshot-182.png)


Add User as a friend

Backend: the desired username is compared to the active user list and if it matches a username it adds that user as a friend and sends the message back to the index.html page. If a user is not found then it tells the frontend that it was a failure and to input a valid username.

![friend](https://i.ibb.co/71ttBwp/Screenshot-173.png)


Frontend: A text box appears in which a user types in the desired username of the user they want to add as a friend. Successfull or unsuccessful requests are communicated through public chat window

![friend_front](https://i.ibb.co/VHJcXvv/Screenshot-180.png)


Disconnected User

Backend: listens for an event in which the user closes that tab and notifies the user. It also searches the userlIst for the user and removes it from the array.

![friend](https://i.ibb.co/Rb0hvGm/Screenshot-172.png)

Clear Chat

![clear](https://i.ibb.co/27z43SC/Screenshot-184.png)



SPRINT 2 IMPLEMENTATION:

Registration

Backend: If the user name does not exist and is new, then the information (username and password) are inputted as new data into the database. If the username already exists then don't input duplicate data into the database.


ChatServer.js
![registerBack1](screenshot link)
messengerdb.js
![registerBack1](screenshot link)


Frontend: BLAH BLAH

![registerFront1](screenshot link)


0. Specify the development approach of your team, including programming languages, database, development, testing, and deployment environments. 

This project is being created by all four members. Each member is assigned tasks from the trello board and work on the according to the Gantt Chart. The front end of the site is created using html5 with styling done in CSS. The backend is created using javaScript, more specifically Node.js for the server. All editing is done in Google Cloud Shell Editor. Code is shared with each other using bitbucket, utilizing git commands to push and pull code. The site is deployed through heroku for free.

## Deployment

We deployed out application via Heroku. Heroku allows us to have our web application actively running.

# Software Process Management

_(Start from Sprint 0, keep updating)_

Jon Moran will serve as scrum manager this sprint. All use cases and tasks are on a trello board and we divided up the task so that everyone has something to complete each week. Everyday at our weekly meeting we discuss any stoppages or if any one needs any help completing their tasks.

![Trello](https://i.ibb.co/BGSGc7z/Software-Process-Management.png)


Trello Board Cards were created by team members with each use case serving as a card. In addition there is a goal for when we should complete each task. The goal timelines is more easily veiwed in the Gantt chart below. Once someone begins a task it will be moved to in progress and then upon completion moved to the completed list of the corresponding sprint.
Also, include the Gantt chart reflects the timeline from the Trello board. _(Main focus of Sprint 0)_

![Gantt](https://i.ibb.co/6mSS6KJ/Software-Process-Management-Gantt.png)

Each task is in a certain order. The basic steps are first so that we can build off of them for a future task. Each task is scheduled for a week and each team member was assigned a task to do that week. Timeline is subject to change if need be. 


## Scrum process

### Sprint 0

Duration: 08/26/2021 - 09/09/2021

#### Completed Tasks: 

1. Create Use Case Diagram
2. Plan System Design
3. Create System Diagram
4. Create README.md and update with team information
5. Finish Presentation for Spring 1 preparation

#### Contributions: 

1.  Jon Moran, 10-14 hours, contributed in planning, the overall overview, use cases, the slides/presentation
2.  John Conroy, 10-14 hours, contributed in planning, meeting scheduling, deployment, the slides/presentation
3.  James Oei, 10-14 hours, contributed in planning, deployment, system design, features, the slides/presentation
4.  Will Manzella, 10-14 hours, contributed in planning, organization, use cases, the slides/presentation

#### Sprint Retrospective:

_(Introduction to Sprint Retrospective:


Sprint 0 was a really great experience for all of us. It not only introduced to Agile Development and how to plan/develop a sophisticated project, but it showed us how to be professionally organized and work as a group. We were very efficient in planning, but we fell through when it came to maintaining that energy towards progressivley putting out plan into action (except the presentation).
Our retrospective meeting aided us in reflecting on our own indivudal performance through Sprint 0 and also our performance as a cooperative team. 

|            Good              |                      Could have been better                |                      How to improve?                      |
|------------------------------|:----------------------------------------------------------:|----------------------------------------------------------:|
| communication, presentation  |  More focus on this project, maintain progress constantly  |  better time management, set more time to work together   |


-------------------------------------------------------------------------------
### Sprint 1 - COMPLETE

Duration: 09/09/2021 - 10-05-2021

#### Completed Tasks: 

1. Create Login UI
2. Create Public message page
3. Create Private message page
4. Implement CSS
5. Display/ send and recieve messages
6. Maintain userlist
7. Send and recieve messages from a specific user
8. Add users as friends
9. Clear Chat
10. Notify others when a user disconnects

#### Contributions: 

1.  Jon Moran, 10-14 hours, contributed in planning, the overall overview, use cases, the slides/presentation
2.  John Conroy, 10-14 hours, contributed in planning, meeting scheduling, deployment, the slides/presentation
3.  James Oei, 10-14 hours, contributed in planning, deployment, system design, features, the slides/presentation
4.  Will Manzella, 10-14 hours, contributed in planning, organization, use cases, the slides/presentation


#### Sprint Retrospective:

_(Introduction to Sprint Retrospective:

Sprint 1 became a greater time crunch due to the increased workload from sprint 0 as well as busier schedules and time mismanagement. Fortunately, even through all of that adversity, our team was able to come together and dedicate important time to completing sprint 1. 
Everyone worked together to fulfill their roles and the project progressed smoothly. We learned how through small feature additions, many unintentional bugs can be producted which is frustrating. 

| Good                                       |   Could have been better    |  How to improve?  |
|--------------------------------------------|:---------------------------:|------------------:|
|  Working together and focusing on the task |  Preplanning for task ideas |  Time management  |


-----------------------------------------------------------------------------
### Sprint 2 - IN PROGRESS

Duration: 10/05/2021-10/26/2021

#### Completed Tasks: 

Functional
1. Users need to login with username/password. Invalid username/password cannot be logged in
2. Anyone can register for a new account to log in.
3. Only logged-in users can send/receive messages (any)
4. Logged-in users can logout
5. (5 points) Logged-in users can create a group chat (more than 2 members)
6. (5 points) Logged-in users in a group chat can send/receive messages from the group
7. (5 points) Seperated chat window for group chat
8. (10 points) Two use cases of your team choice
	(a) Use case:  show password feature on login page
	(b) Use case: user can switch between dark mode and light mode
Non-functional requirements
1. (2.5 points) All data must be validated in all layers before sending/checking/forwarding
2. (2.5 points) All data must be sanitized in client-side before displaying
3. (2.5 points) Enter in an input to send data, clear data after sending

Lates Commit Link: (insert link here)

#### Contributions: 

1.  Jon Moran, 9-13 hours, Developer, contributed in planning, documentation, use cases(logout functionality), the slides/presentation
2.  John Conroy, 9-13 hours, Developer, contributed in planning, meeting scheduling, use cases(group chat functionality, DB login/authentication), the slides/presentation
3.  James Oei, 9-13 hours, Product Owner, contributed in planning, system design, features, use cases(group chat functionality), the slides/presentation
4.  Will Manzella, 9-13 hours, Scrum Master, contributed in planning, organization, CSS and UI, use cases(show password, darkmode/lightmode), the slides/presentation

#### Sprint Retrospective:

_(Introduction to Sprint Retrospective:

Sprint 2 went a lot smoother in most aspects compared to previous sprints, but with midterms and busy schedules it was still hard to get to meet as often. We encountered multiple issues with the CSS; this included getting the external CSS to function properly and also our use case of darkmode/lightmode took a bit of debugging to get to work.
However, regardless of the bugs and issues we were very successful in working productively and as a team to complete our tasks. Collaboration was important especially when we had to put our minds together to solve the functionality of adding a "group chat".

|          Good           |              Could have been better                |        How to improve?        |
|-------------------------|:--------------------------------------------------:|------------------------------:|
| Teamwork, Communication |  Organizing our ideas for "mock ups" of use cases  |  Better use case preparation  |



-----------------------------------------------------------------------------
### Sprint x - START TO FILL OUT ONCE SPRINT 1 IS COMPLETE

Duration: dd/mm/yyyy-dd/mm/yyyy

#### Completed Tasks: 

1. Task 1
2. Task 2
3. ...

#### Contributions: 

1.  Member 1, x hours, contributed in xxx
2.  Member 2, x hours, contributed in xxx
3.  Member 3, x hours, contributed in xxx
4.  Member 4, x hours, contributed in xxx

#### Sprint Retrospective:

_(Introduction to Sprint Retrospective:

_Working through the sprints is a continuous improvement process. Discussing the sprint has just completed can improve the next sprints walk through a much efficient one. Sprint retrospection is done once a sprint is finished and the team is ready to start another sprint planning meeting. This discussion can take up to 1 hour depending on the ideal team size of 6 members. 
Discussing good things happened during the sprint can improve the team's morale, good team-collaboration, appreciating someone who did a fantastic job to solve a blocker issue, work well-organized, helping someone in need. This is to improve the team's confidence and keep them motivated.
As a team, we can discuss what has gone wrong during the sprint and come-up with improvement points for the next sprints. Few points can be like, need to manage time well, need to prioritize the tasks properly and finish a task in time, incorrect design lead to multiple reviews and that wasted time during the sprint, team meetings were too long which consumed most of the effective work hours. We can mention every problem is in the sprint which is hindering the progress.
Finally, this meeting should improve your next sprint drastically and understand the team dynamics well. Mention the bullet points and discuss how to solve it.)_

| Good     |   Could have been better    |  How to improve?  |
|----------|:---------------------------:|------------------:|
|          |                             |                   |



# User guide/Demo

Write as a demo with screenshots and as a guide for users to use your system.

_(Start from Sprint 1, keep updating)_