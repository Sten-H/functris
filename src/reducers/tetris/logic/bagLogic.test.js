import { getBag } from "./bagLogic";
import { compose, takeLast, values } from "ramda";

describe('Seven Bag logic', () => {
    it('should return list of seven pieces (in random order)', () => {
        const bag = getBag();
        expect(bag).toHaveLength(7);
        expect(takeLast(bag).length).toBeGreaterThanOrEqual(1);
    });
});