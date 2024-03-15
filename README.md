# Client for Kanban-board-task

In this task I've implemented a simple but reliable and easy-to-use UI for kanban-board.

DEMO LINK: https://anton-kuchmasov.github.io/client-kanban-board-task/

Technologies I've used on my way to deploy:

- HTML/CSS as well;
- Bulma.io for creating UI on the simplest way;
- JS in case of base programming language for front-end solutions;
- React.js for creating functional components (app application is React-based);
- Axios lib in case of simplify http requests for taking data from back-end;
- Redux.js to store all the data on one store;
- React Beautiful DnD (drag-and-drop lib);
- ESLint, Prettier, Husky for fixing code-style.

# How to use App
In general, as user you should only follow the link upwards.
You may not be worry about storage data, order or statuses of your todos as well - all of them are stored onto back-end server store 
(link for the back-end repo: https://github.com/Anton-Kuchmasov/api-kanban-board-task)

In dev mode just run:

- npm run dev 

# Important!

Whenever you trying to grab the task from one column to another one, it may instantly take the first or the last place onto destination board.
It was implemented in case of simply logic - whatever you trying to put onto "Done" or "In Progress", it should be much more important to work for than all another tasks and have much more priority, than the every other one.

# User Instructions

If you want to create a new ID, you can do this on two different ways:

1. Creating a new ID after App is loaded;
2. Creating a new ID after working with some oldest issues onto your prev kanban.

Creating a new ID within any tasks on prev are prohibited (button is disabled).

# Server store logic

In case of best productivity, some of options (deleting/dragging cards etc.) can be done locally first, instead of sync with server.
All server operations are still working, don't be in worry :)

# Handling errors

There are 6 types of errors which can appear during working into app.
All of them have straight text (enum Error in types dir.), and small but useful component ErrorMessage can display text of current error onto user's screen.
Error state is in global store, which (in my humble opinion) will be a best practice.

Have a good experience!
