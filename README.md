# Client (front-end) for Kanban-board-task
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
- ESLint, Prettier for fixing code-style.

# Important!
Whenever you trying to grab the task from one column to another one, it takes the first place onto destination board.
It was implemented in case of simply logic - whatever you trying to put onto "Done" or "In Progress", it should be much more important to work for than all another tasks.

# User Instructions
If you want to create a new ID, you can do this on two different ways:
1. Creating a new ID after App is loaded;
2. Creating a new ID after working with some oldest issues onto your prev kanban.

Creating a new ID within any tasks on prev are prohibited (button is disabled).

# Server store logic
In case of best productivity, some of options (deleting/dragging cards etc.) can be done locally first, instead of sync with server.
All server operations are still working, don't be in worry :)

Have a good experience!