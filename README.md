# Jugend forscht Presentation: The SpaceBalloon Team

This repository contains the source code for [the SpaceBalloon team's](https://github.com/BOGYLI/SpaceBalloon) presentation about our project and journey in the German science competition, *Jugend forscht*.

## Technical Setup

This presentation is built using the **reveal.js** framework. It has been structured as a minimal, dependency-free project, meaning it does not require any build tools or package managers like Node.js to view.

### File Structure

The repository is kept as clean as possible and contains only the essential runtime files:

```
.
├── index.html     // The main file with all presentation slides.
├── dist/          // Contains the core reveal.js engine (JavaScript and CSS).
└── plugin/        // Contains reveal.js plugins for features like notes, markdown, etc.
```

### How to View the Presentation

There are two easy ways to run and view the presentation.

#### Method 1: Directly in the Browser (Simple)

This is the simplest way to view the presentation and requires no special tools.

1.  Navigate to the project folder on your computer.
2.  Double-click the `index.html` file.
3.  It will open in your default web browser.

> **Note:** When you edit the `index.html` file, you will need to manually refresh the browser tab (usually with the `F5` key) to see your changes.

#### Method 2: Using the VS Code Live Server Extension (Recommended for Editing)

This method automatically reloads the browser tab whenever you save a change, making it ideal when you are actively working on the slides.

1.  **Prerequisite**: You need to have [Visual Studio Code](https://code.visualstudio.com/) installed.
2.  Install the [**Live Server**](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension from the VS Code Marketplace.
3.  Open this project folder in VS Code.
4.  In the file explorer, right-click on the `index.html` file and select `Open with Live Server`.
    *   Alternatively, you can click the `Go Live` button in the bottom-right status bar of VS Code.

This will start a local server and open the presentation in your default browser. Any changes you save to the files will now appear instantly.
