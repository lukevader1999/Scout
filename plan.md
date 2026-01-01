# Plan: Scout Board Game with boardgame.io
Create a fully functional Scout card game implementation using boardgame.io and JavaScript. Scout is a 2-5 player ladder-climbing card game with dual-indexed cards where players play sets of cards and scout opponent cards to build winning stacks. The implementation will include game logic, state management, and a basic playable client.

Steps
1. Initialize project structure — Create package.json, install boardgame.io and parcel bundler, set up src/ and index.html boilerplate.

2. Define Scout game state — Model the deck (45 dual-indexed cards), player hands, current table set, scouted stacks per player, phase tracking (play/scout), and round/scoring logic in the game object.

3. Implement card mechanics — Create playCards move to validate card sequences (same value or consecutive), rank sets by rules (more cards > same values > higher values), and handle scouting as an alternative action.

4. Implement core game loop — Handle turn transitions, round ending (empty hand or all but one player scouted), scoring calculation (VP per scouted card minus unplayed cards), and multi-round progression.

5. Build basic React/HTML client UI — Display player hands, table set, scouted stacks, current player, and buttons to play cards or scout. Use client.moves to trigger game actions.

6. Add game-over detection — Determine winner after final round based on accumulated VP scores.

Further Considerations
1. Turn structure complexity — Scout allows 1 action per turn (play or scout). Do you want to implement this as separate moves, stages within each turn, or a single "action" move that accepts a parameter? This affects turn ordering and UI flow.

2. Hand rotation mechanic — Scout cards are dual-indexed and players rotate entire hand to access alternate values. Should the UI visualize both values simultaneously, toggle between them on rotation, or auto-select the best orientation? This impacts UX significantly.

3. Validation strictness — Should invalid moves be rejected silently, logged, or cause errors? How should you handle edge cases like empty hands or incomplete plays?