// Import the js file to test
import { TestScheduler } from "jest";
import { isImage } from "../src/client/js/app"

describe('testing parts of app.js', () => {
    test('test if isImage() function works correctly', () => {
        const id1 = "trip-image";
        const id2 = "temp";
        expect(isImage(id1)).toEqual(true);
        expect(isImage(id2)).toEqual(false);
    });
});