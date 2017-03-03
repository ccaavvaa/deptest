"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mark;
(function (Mark) {
    Mark[Mark["Unmarked"] = 0] = "Unmarked";
    Mark[Mark["Temporary"] = 1] = "Temporary";
    Mark[Mark["Permanent"] = 2] = "Permanent";
})(Mark || (Mark = {}));
class TopologicalSorter {
    execute(nodes) {
        this.markers = new Map(nodes.map((n) => [n, Mark.Unmarked]));
        this.result = [];
        this.stack = [];
        for (const node of nodes) {
            const state = this.markers.get(node);
            if (state === Mark.Unmarked) {
                this.visit(node);
            }
        }
        return this.result;
    }
    visit(node) {
        this.stack.push(node);
        const nodeState = this.markers.get(node);
        switch (nodeState) {
            case Mark.Permanent:
                return;
            case Mark.Temporary:
                throw new Error(TopologicalSorter.NOT_A_DAG);
            case Mark.Unmarked: {
                this.markers.set(node, Mark.Temporary);
                node.nodes.forEach((n) => this.visit(n));
                this.markers.set(node, Mark.Permanent);
                this.result.push(node);
                break;
            }
            default:
                throw new Error('invalid state');
        }
        this.stack.pop();
    }
}
TopologicalSorter.NOT_A_DAG = 'Graph is not a Direct acyclic graph';
exports.TopologicalSorter = TopologicalSorter;

//# sourceMappingURL=node.js.map
