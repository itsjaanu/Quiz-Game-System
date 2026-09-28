# QUIZLAB

A complete browser-based quiz game project designed for GitHub Pages.

## Features

- 393 unique questions across 28 quiz themes
- 11–15 questions currently available in each theme, with the data structure ready for much larger banks
- Age-group filtering
- Easy, Medium and Hard difficulty
- Question Mode with an exact requested question count
- Time Mode: answer as many unseen questions as possible before the timer expires
- Time Mode automatically advances immediately after an answer — there is no Submit/Next button
- Random question order
- Random answer order
- No duplicate question within a quiz
- Replay avoids the previous attempt's questions whenever the selected pool is large enough
- Score, streak and speed bonuses
- Results, high scores and statistics
- Light/dark theme
- Browser localStorage for player data, scores and settings
- Responsive layout
- GitHub Pages deployment workflow

## Project structure

```text
QuizLab_GitHub_Project/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── data/
│   └── questions.json
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .nojekyll
├── .gitignore
└── README.md
```

## Run locally

Because the site loads `data/questions.json`, serve the project through a local web server instead of opening `index.html` directly.

For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload the contents of this project to the repository root.
3. Keep the default branch as `main`.
4. Open **Settings → Pages**.
5. Set the publishing source to **GitHub Actions**.
6. Push changes to `main`.

The included workflow deploys the static site automatically.

## Adding questions

Questions live in `data/questions.json`. Each question contains:

- `id`
- `category`
- `ageGroup`
- `difficulty`
- `question`
- `options`
- `correctAnswer`
- `explanation`

Keep every question ID unique and make sure `correctAnswer` points to the correct option index.
