import { shiftLeft, shiftRight } from "./positionReducer";

describe('Position reducer', () => {
   it('Shift horizontally', () => {
       const leftExpected1 = [-1, 0];
       const leftExpected2 = [-2, 0];
       expect(shiftLeft([0, 0])).toEqual(leftExpected1);
       expect(shiftLeft(shiftLeft([0, 0]))).toEqual(leftExpected2);
       const rightExpected1 = [1, 0];
       const rightExpected2 = [2, 0];
       expect(shiftRight([0, 0])).toEqual(rightExpected1);
       expect(shiftRight(shiftRight([0, 0]))).toEqual(rightExpected2);
       const mixedExpected = [0, 0];
       expect(shiftLeft(shiftRight([0, 0]))).toEqual(mixedExpected);
   })
});