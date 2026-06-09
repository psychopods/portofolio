You are an expert full-stack engineer and UI/UX designer. We are building a highly performant, minimalist personal portfolio website using Astro (v4+) and Tailwind CSS, along with a private Admin Dashboard to update the content.

Here is my background, the architectural strategy, and the technical requirements for the project.

---

### 1. USER PROFILE & EXPERIENCE
- **Core Identity:** Software Developer & Systems Engineer with a polyglot mindset.
- **Core Languages & Tech:** Rust, Kotlin, Node.js, C++, Linux (Arch/Ubuntu), Compose Multiplatform, Express, SQLite.
- **Engineering Philosophy:** Pragmatic development, mixing low-level systems programming with clean, high-performance applications.

---

### 2. ARCHITECTURAL STRATEGY & DATA FLOW
To keep things lightweight and modern, we will use Astro with an embedded database/data layer:
- **Data Source:** A local SQLite database or a structured local JSON file collection (`src/content/` via Astro Content Collections) to store project information.
- **Public Site:** Statically or server-side rendered (SSR) using Astro components for maximum speed and SEO.
- **Admin Dashboard:** A single, protected page routing at `/admin`. This page will use an interactive client-side framework (like standard client-side JS or a lightweight framework component if needed) to handle login and content updating forms. 

---

### 3. WEBSITE STRUCTURE & PAGES

#### PAGE 1: Public Portfolio (The Front-Facing Site)
- **Aesthetic:** Developer IDE theme. Dark mode by default, crisp typography (e.g., JetBrains Mono for code snippets/accents, Inter for prose), sharp subtle borders, and an optimized layout.
- **Hero Section:** A punchy headline focusing on a systems developer bridging low-level engineering with application development.
- **About Section:** Explains my technical mindset, ability to pick up any stack, and focus on performant software.
- **The Stack Grid:** A clean bento-box grid displaying skills categorized by layer:
  * Low-Level/Systems: Rust, C++
  * Cross-Platform/Mobile: Kotlin, Compose Multiplatform
  * Backend & Web: Node.js, Express, Databases (SQLite)
- **Projects Section:** A grid displaying key projects (like "Cublocks" and a "Computer Maintenance & Management System"). Each project card needs: Title, Description, Tech Tags, Github Link, and a Live Demo Link.
- **Contact:** Links to GitHub, LinkedIn, Email, and a button to download a CV.

#### PAGE 2: Admin Dashboard (The Private Site)
- **URL Path:** `/admin` 
- **Security:** A secure login screen. If using SSR, protect via an API endpoint checking a hashed password using bcrypt/session tokens. If using static builds, provide a local-first node script or protected API route to read/write back to the content source.
- **Features / Forms Needed:**
  - **Project Manager:** Forms to Add, Edit, or Delete projects.
  - **The Stack Updater:** Interface to toggle or add new technologies to the homepage grid.
  - **Status Updates:** A quick text input to update a "What I'm coding right now" status badge on the landing page.

---

### 4. YOUR TASK
1. Propose the ideal Astro project folder structure (including where the data layer lives).
2. Define the schema/structure for the project and skill items.
3. Write the Astro frontmatter and component code for the main landing page (`src/pages/index.astro`).
4. Write the code for the Admin view (`src/pages/admin.astro`) and its corresponding API endpoints or actions for saving changes.

Let's build this step-by-step. Start by showing me the project directory layout and the recommended data schema strategy.