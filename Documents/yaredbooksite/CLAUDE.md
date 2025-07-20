# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive **ዜማ ቤት (Zema Bet)** Discord community platform - a modern static web application serving as the complete hub for Ethiopian Orthodox believers. The platform combines reading sacred texts, listening to liturgical music, AI assistance, and community features.

## Architecture

### Core Files
- `index.html` - Modern landing page showcasing the multifunctional hub (books, audio, AI chat)
- `books.html` - Digital library with PDF-like thumbnails, search, and book selection
- `viewer.html` - Advanced scroll-mode PDF viewer with sidebar navigation
- `chat.html` - ChatGPT-style AI assistant for Orthodox questions and guidance
- `audio.html` - Liturgical music player with time markers and search functionality
- `yitbehalzekidistbetelehem.pdf` - The primary Ethiopian Orthodox text currently available

### Technology Stack
- **Frontend Framework**: Vanilla HTML/CSS/JavaScript with Alpine.js for reactivity
- **Styling**: Tailwind CSS (loaded via CDN)
- **PDF Rendering**: PDF.js library (version 2.11.338 for stability)
- **Fonts**: Noto Serif Ethiopic for proper Amharic/Ge'ez text rendering
- **Icons**: Heroicons via SVG

### Key Features

#### Reading Experience
- **Scroll-Mode PDF Viewer**: Continuous vertical scrolling like modern reading apps
- **Smart Sidebar Navigation**: Optional collapsible page navigation with thumbnails
- **Mobile-Optimized Controls**: Floating zoom controls, gesture-friendly interface
- **File Upload Support**: Drag-and-drop and file picker for alternative PDFs
- **URL Navigation**: Direct page linking via `#page=NUMBER` hash routing

#### Audio & Music
- **Liturgical Music Library**: Searchable collection of Ethiopian Orthodox chants (Zema)
- **Time Markers System**: Official markers (admin-set) and personal markers (user-submitted)
- **Advanced Audio Player**: Waveform visualization, precise seeking, marker jumping
- **Category Filtering**: Search by holiday, event, place, or liturgical type
- **Community Markers**: Users can submit time markers for review/approval

#### AI Assistant
- **ChatGPT-Style Interface**: Modern chat UI with conversation history
- **Orthodox Knowledge Base**: Specialized in Ethiopian Orthodox tradition, liturgy, theology
- **Chat Management**: New chat creation, history sidebar, conversation persistence
- **Mobile-Responsive**: Touch-optimized input and navigation

#### General Platform
- **ዜማ ቤት Branding**: Consistent Ethiopian Orthodox community theme throughout
- **Dark Mode Default**: Enhanced dark theme with better contrast and Ethiopian Orthodox colors
- **Ethiopian Orthodox Color Palette**: Golds (#D4AF37), deep reds (#8B0000), elegant neutrals
- **Discord Integration**: Multiple prominent Discord links for community engagement
- **Mobile-First Design**: Touch-optimized, no horizontal scrolling, responsive breakpoints
- **Performance Optimized**: Lazy loading, smooth animations, minimal JavaScript
- **Search Functionality**: Real-time filtering across books and audio content

## Development Commands

This is a static site with no build process. For development:

```bash
# Serve locally (recommended)
python -m http.server 8000
# or
npx serve .
# or use VS Code Live Server extension
```

**Important**: The application requires a web server to load PDFs due to CORS restrictions. Opening `index.html` directly in a browser (file:// protocol) will not work for PDF loading.

## Navigation Flow

1. **Landing Page** (`index.html`) - ዜማ ቤት Hub
   - Hero section with Saint Yared icon and ዜማ ቤት branding
   - Three main action buttons: "Read Books" | "Liturgical Music" | "AI Assistant"
   - Large prominent "Join ዜማ ቤት Discord" button
   - Features grid explaining all platform capabilities
   - Community engagement section

2. **Books Library** (`books.html`)
   - PDF-like book thumbnails with Amharic titles
   - Real-time search filtering
   - 8 books displayed (1 available, 7 coming soon)
   - Clicking available book → `viewer.html`

3. **Scroll PDF Viewer** (`viewer.html`)
   - "Back to Books" | Centered title | Page info + Sidebar toggle + Dark mode
   - Continuous scroll reading (like webtoon/mobile reader)
   - Collapsible sidebar with page navigation thumbnails
   - Floating zoom controls (bottom-right)
   - Mobile-optimized with no horizontal scrolling

4. **AI Chat** (`chat.html`)
   - ChatGPT-style interface with Ethiopian Orthodox knowledge
   - Sidebar with chat history management
   - "Back to Home" | Title | "New Chat" + Dark mode
   - Specialized in Orthodox tradition, liturgy, theology questions

5. **Liturgical Audio** (`audio.html`)
   - Search and category filters for Orthodox music
   - Audio player with waveform and time markers
   - Users can add personal markers (submitted for review)
   - 6 sample recordings across different liturgical categories

## Code Conventions

### Styling
- Uses Tailwind utility classes extensively
- **Ethiopian Orthodox Color Palette**:
  - `--orthodox-gold: #D4AF37` (primary gold)
  - `--orthodox-deep-gold: #B8941F` (darker gold)
  - `--orthodox-red: #8B0000` (ceremonial red)
  - `--orthodox-burgundy: #722F37` (dark red)
  - `--orthodox-cream: #FDF6E3` (light background)
- Dark mode implemented via class-based approach (`.dark`)
- Responsive breakpoints: `lg:` (1024px+), `md:` (768px+), `sm:` (640px+)

### JavaScript
- Alpine.js reactive data pattern with `x-data`, `x-init`, `x-show`
- Async/await for all PDF operations
- Error handling with user-friendly fallbacks
- PDF.js worker configuration for performance

### Ethiopian Text Handling
- Proper font loading for Amharic/Ge'ez characters
- UTF-8 encoding essential for character display
- `.ethiopic` class for font family application

## PDF Integration Notes

- Uses PDF.js version 2.11.338 (ultra-stable) for maximum compatibility
- Legacy viewport syntax fallback: `page.getViewport(scale)` vs `page.getViewport({ scale })`
- Canvas dimensions must be properly calculated and set
- Rendering state management prevents concurrent render operations
- Multiple loading strategies handle different deployment scenarios

## File Organization

The application expects `yitbehalzekidistbetelehem.pdf` in the same directory as the HTML files. Alternative PDFs can be loaded via the upload interface in the viewer.


## External Tool Usage (Gemini CLI)

Claude may call the Gemini CLI to assist with large-scale analysis or architectural summaries. Examples:

- `gemini -p "@src/ Summarize project structure"`
- `gemini --all_files -p "Describe key features of this codebase"`
- Use this output to assist with decisions on refactoring or cross-file edits.


# Using Gemini CLI for Large Codebase Analysis

When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

## File and Directory Inclusion Syntax

Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
  gemini command:

### Examples:

**Single file analysis:**
gemini -p "@src/main.py Explain this file's purpose and structure"

Multiple files:
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"

Entire directory:
gemini -p "@src/ Summarize the architecture of this codebase"

Multiple directories:
gemini -p "@src/ @tests/ Analyze test coverage for the source code"

Current directory and subdirectories:
gemini -p "@./ Give me an overview of this entire project"

# Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"

Implementation Verification Examples

Check if a feature is implemented:
gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"

Verify authentication implementation:
gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"

Check for specific patterns:
gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"

Verify error handling:
gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"

Check for rate limiting:
gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"

Verify caching strategy:
gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"

Check for specific security measures:
gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"

Verify test coverage for features:
gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"

When to Use Gemini CLI

Use gemini -p when:
- Analyzing entire codebases or large directories
- Comparing multiple large files
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if specific features, patterns, or security measures are implemented
- Checking for the presence of certain coding patterns across the entire codebase

Important Notes

- Paths in @ syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for --yolo flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results

# Requirements Gathering System

## /requirements-start {feature_description}

When the user issues `/requirements-start {feature_description}`, Claude Code will follow this systematic discovery process:

### Phase 1: Codebase Analysis
1. **Architecture Discovery**: Analyze current tech stack, patterns, and file organization
2. **Feature Mapping**: Search for similar existing features and implementation patterns
3. **Dependency Analysis**: Identify relevant files, libraries, and components

### Phase 2: Discovery Questions (Top 5 Most Pressing)
Ask the 5 most critical questions to understand the feature scope. Use smart defaults and allow "idk" responses:

**Question Format**: 
- Question with context
- (Default: [SENSIBLE_OPTION] - reasoning)
- Allow "idk" to accept default

**Common Discovery Questions**:
- Will users interact through a visual interface? (Default: YES - consistent with existing UI patterns)
- Should this integrate with existing authentication? (Default: YES if auth exists)
- Does this need mobile responsiveness? (Default: YES - consistent with mobile-first design)
- Should this persist data locally or server-side? (Default: LOCAL - static site architecture)
- Will this feature need real-time updates? (Default: NO - unless explicitly required)

### Phase 3: File Analysis
Based on answers, autonomously:
- Read relevant existing files
- Document patterns found
- Identify exact implementation locations
- Note similar features for consistency

### Phase 4: Clarification Questions (Top 5 Most Clarifying)
Ask specific implementation questions based on codebase analysis:

**Examples for ዜማ ቤት Platform**:
- Should this appear in the main navigation? (Default: YES - consistent with current features)
- Should this use Ethiopian Orthodox color palette? (Default: YES - brand consistency)
- Should this support Amharic/Ge'ez text? (Default: YES if text-related)
- Should this integrate with Discord community features? (Default: YES - platform focus)
- Should this work offline like current PDF viewer? (Default: YES - static site benefits)

### Phase 5: Requirements Documentation
Generate structured requirements with:
- **Feature Summary**: What will be built
- **Technical Approach**: How it fits existing architecture
- **File Locations**: Exact paths for implementation
- **Integration Points**: How it connects to existing features
- **Implementation Pattern**: Based on similar existing features

## /requirements-save {name}
Save current requirements for future reference

## /requirements-load {name}
Load previously saved requirements

## /requirements-implement
Begin implementation using documented requirements and file paths

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

# Git Configuration
IMPORTANT: Always ensure commits show nahom8423 as the author. Before any git commits, run:
```bash
git config user.name "nahom8423"
git config user.email "nahom8423@users.noreply.github.com"
```
This ensures proper contribution attribution in the repository.

IMPORTANT: Never mention "Generated with Claude Code" or any AI assistance in commit messages. Keep commits brief and professional without emojis. Only nahom8423 is the author.