# Tetris
A functional approach to tetris (its game logic atleast) using a lot of ramda
for fun. Game state is presented purely with html components and css.
## BUGS
* you can't rotate a piece that is not fully inside board yet (from top), because
the validator invalidates rotation transforms that are out of bounds on both Y, it should
only invalidate bottom Y, not top Y
* O piece can be rotated, it shouldn't rotate. Can't put the pivot in center
I wonder if most games don't acually rotate pieces but have an array of orientations and the O piece
has only one orientation. I think my solution will be to build a validator that includes
checking that the token is not O, downside is that it will still try the rotation
* I think that the isPieceOverlapping returns true now if piece is out of bounds,
it should not care about bounds, that is not its job. I think the problem is that it
tries to read a token value on board[-1][10] and it fails and returns error/false,
maybe I can be lazy and clamp the values?
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
* I wonder about rotations, some tetris games will raise the piece if it 
intersect on Y (and maybe on X with a shift). Older variants don't do this
I think. Maybe disregard until much later, should be easy enough to modify.