# Tetris
A functional approach to tetris (its game logic atleast) using a lot of ramda
for fun. Game state is presented purely with html components and css.
## BUGS
## TODO
* Definitely need to refactor all the extremely explicit state creation in test so they all
call some function that creates the test. Changing the lenses now and this would take 1 second
if they all just called a function
* Pause function (Need to implement 'gravity' first, so pause turns that off and locks controls)
* On clearing rows, have a slight pause and flashing of row to be cleared. Not exactly sure how to do this one.
* Refactor css, a lot of styling is housed in root index.scss file right now because it is used by many files.
I don't think this is according to react way, I think I should refactor it out to a partial and have the components
explicitly importing that partial and applying it as needed.
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
intersect on Y and slide it to side if it intersects on X (wall kicks they call it). 
Older variants don't do this, they just reject rotation. Maybe disregard until much
 later, should be easy enough to modify.