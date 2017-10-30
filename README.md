# Tetris

## TODO
* Write piece to board
* Figure out how to have a tick that will shift piece down in intervals of 
increasing speed
## Idea
Instead of having a universal fill token ('X'), maybe the fill token can be
the shape of the piece ('J' for example) and this can help for coloring
on draw. Only problem is that piece object needs to contain that info somehow
probably piece {coords: [], token: 'J'}