# Tetris
A functional approach to tetris (its game logic atleast) using a lot of ramda
for fun. Game state is presented purely with html components and css.
## BUGS
* Not really a bug but it seems that I'm using bootstrap 3. I'm not sure if this is react-bootstrap
that's made that decision or if can just ask it to use bootstrap 4 instead. Otherwise switch to
reacstrap which uses bootstrap 4, though there will be some issues to fix (there are some bugs with
modals in latest version, which are fixable)
* The Delayed Auto shift seems to need to use delta time when considering how much it should remove from the keytick counter,
I thought it wouldn't have to since it's set to a fixed 5 ms interval, but when changing it to use setState, it behaved
differently when I changed some simple things in the functions, making it slower so that's not good.
## TODO
### High prio
* Piece shadow where it would end up on drop
* Score tally
* Line clear tally
* Level that decides speed (level increases on amt of lines cleared)
## Medium prio
* I think the way the pieces spawn is a bit flexible, in a normal situation they spawn 1 down from top
in most tetris games, but when top out is coming close I think it will spawn piece further up to not spawn
on overlap and give unfair illegal state(overlapping piece) or top out. AKSCHUALLY: this isn't true, I'm just spawning
the piece one cell too low, but other games seem to show half of the illegal row above so you understand which piece you have
* Holding down buttons to move repeatedly. Then more advanced and enjoyable with 
Delayed auto shift http://tetris.wikia.com/wiki/DAS
### Not so high prio
* On clearing rows, have a slight pause and flashing of row to be cleared. Not exactly sure how to do this one.
* Make the next piece "mini-board" 4x4, and maybe set position to [1,2] and then have it rotate the presened piece
until it fits the board or something. Maybe easier to have each presentation piece orientation hard coded
with proper position and rotation individually somewhere 
## Thoughts
* Should 'gravity' tick be reset on manual shift down? Probably? Now it can give you a surprise double down shift
* I wonder about rotations, some tetris games will raise the piece if it 
intersect on Y and slide it to side if it intersects on X (wall kicks they call it). 
Older variants don't do this, they just reject rotation. Maybe disregard until much
 later, should be easy enough to modify.
## Reminders
### Words
I've been using some words in the code and comments which I think I've kind of made up myself, so this is for me when I come back to this
in a month.
* Lock piece, piece position is final and is waiting to be written to board.
* Dirty row, a row that neither full nor empty, is has non-empty tokens in it.
### Other
* The board is structured in a way that it has 5 invisible top rows that are called illegal rows,
these are legal to have an active piece in (for example spawn a piece in or rotatate/moe when you
are very close to top out). However if a piece is written/locked in an illegal row, the game is over.