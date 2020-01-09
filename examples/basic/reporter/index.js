module.exports = function () {
    return {
        async reportTaskStart() {
            this.write('Task has been started').newline();
        },

        async reportFixtureStart(name) {
            this.write(`Fixture "${name}" has been started`).newline();
        },

        async reportTestStart(name) {
            this.write(`Test "${name}" has been started`).newline();
        },

        async reportTestDone(name){
            this.write(`Test "${name}" has been finished`).newline();
        },

        async reportTaskDone() {
            this.write('Task has been completed').newline();
        }
    };
}
