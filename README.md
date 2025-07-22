## <a name="introduction">Introduction</a>

Built with React.js for the user interface, Express.js and SQLite3 for backend, and styled with TailwindCSS, this Anime List lets users browse trending animes, search titles, and explore content using the **[Jikan API](https://jikan.moe/)**.

## <a name="tech-stack">Tech Stack</a>

- **[React.js](https://react.dev/)** - **[React-use](https://github.com/streamich/react-use)** - **[Tailwind CSS](https://tailwindcss.com/)** 

- **[Vite](https://vite.dev/)** - **[Express.js](https://expressjs.com/pt-br/)** - **[SQLite3](https://www.npmjs.com/package/sqlite3)**


## <a name="features">Features</a>

- **Browse Animes**: Explore all animes available on the Jikan API.

- **Search Animes**: Efficiently find specific anime titles using a responsive search bar.

- **Trending Animes**: Discover popular and most-searched animes, reflecting real-time user interest.

- **Backend**: Manages data persistence for trending anime tracking and serves as an API for the frontend.

and many more...

## <a name="quick-start">Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Droppicode/anime-list.git
cd anime-list
```

**Installation**

Install the project dependencies using npm (for both frontend and backend):

```bash
npm install
cd backend
npm install
```

**Running the Project**

```bash
node index.js
cd ../
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the project, the backend should have started on [http://localhost:5000](http://localhost:5000).