# Native WebSockets Course by JS Mastery

- [Video Link](https://www.youtube.com/watch?v=pbOXOY78dNA)
- [Full hand written notes](https://drive.google.com/drive/folders/1lUiIDMHbiA0PfveW3w6FjblAL_OjzUYf?usp=drive_link)
- [basic arcjet template](https://github.com/CamRonUn/ArcJet-Template)

- In this course i learnt how to use native websockets in JS, how websockets work and how to manage websockets. I also imporved my understanding in how to make secure, readable, reliable production ready API's. 

## Sports API 

- inside the sportsProject folder you will find a fully functioning rest/ws API using a neon ORP database, protected by arcjet, formatting enforced by zod, monitored by site24x7. websockets were achieved using the native ws libary 

- key WS learnings 
    1. how to upgrade a connection from REST API 
    2. how to subscribe and unsubsribe websockets from rooms
    3. 4 stages of WS life cycle 
        1. opening 
        2. open
        3. closing
        4. closed 
    4. how to handle each stage of WS life cycle 
    5. how to ping/pong and manage subscribers of a room to avoid dead connections 
    5. how to broadcast to rooms or broadcast to all
    6. how to design a system s.t static data is handeled through rest and dynamic data is handled through ws's 

## Basic Dashboard 

- inside this project you will find the introduction to the course this is a simple websocket server and dashboard. That taught me how to initialy setup a websocket server independent of a rest API, and a visual dashboard that taught me how WS's can be used for real time data such as chat rooms and commentary as well as the Life cycle of a websocket. 

## Other Important skills this course taught me

- This was my first time on a project merging features using git branch -b feat/... then merging the feature. This seems like a much more proffesional way to use git that im sure will be useful in my own projects but especially during team projects / collaberation.

- This was my first time seeing a third party security tool such as arcjet. This is something i want to incoperate into my own projects as it seems highly effective. 

- I liked the overall structure of his API with a focus on security and structure - heavily enforcing zod schemas can be initially slightly frustrating but ensures anythign sent to database will follow the correct schema is important.

- The use of AI prompting to make very detailed prompts for repatitive tasks was interesting and something i will try to incoperate. 

- This project was my first time seeing code rabbit a unique tool that helps imporve code quality. This is defenitely a tool i intend on usign to improve my own code quality. 

- this was my first time usign NEON database which is used slightly differently to supabase or local postgres. This had a small initial learning curve but it was good to learn a new db alternative. 

