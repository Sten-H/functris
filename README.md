# Tetris
A functional approach to tetris (its game logic atleast) using a lot of ramda
for fun. Game state is presented purely with html components and css.
## BUGS
* O piece can be rotated, it shouldn't rotate. Can't put the pivot in center
I wonder if most games don't acually rotate pieces but have an array of orientations and the O piece
has only one orientation. I think my solution will be to build a validator that includes
checking that the token is not O, downside is that it will still try the rotation
## TODO
* Line clear after piece locked (I did this? Did I not commit before I changed computer?)
* Piece shadow where it would end up on drop
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