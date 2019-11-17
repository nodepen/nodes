// Snippet shared by StackOverflow user Fenton
// https://stackoverflow.com/questions/26501688/a-typescript-guid-class

export function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
    });
}