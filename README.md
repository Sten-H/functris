# Tetris
A functional approach to tetris (its game logic atleast) using a lot of ramda
for fun. Game state is presented purely with html components and css.
## TODO
* Piece drop
* Piece shadow where it would end up on drop
* Piece colors that remain when written to board, preferable with as little of
it as possible contained in game logic.
* Make the next piece "mini-board" 4x4, and maybe set position to [1,2] and then have it rotate the presened piece
until it fits the board or something. Maybe easier to have each presentation piece orientation hard coded
with proper position and rotation individually somewhere
* Figure out how to have a tick that will shift piece down in intervals of 
increasing speed
* Score tally
* Line clear tally
## Thoughts
* Instead of having a universal fill token ('X'), maybe the fill token can be
the shape of the piece ('J' for example) and this can help for coloring
on draw. Only problem is that piece object needs to contain that info somehow
probably piece {coords: [], token: 'J'}
* I wonder about rotations, some tetris games will raise the piece if it 
intersect on Y (and maybe on X with a shift). Older variants don't do this
I think. Maybe disregard until much later, should be easy enough to modify.