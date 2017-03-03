import * as chai from 'chai';
import 'mocha';
import * as topologicalSorter from '../lib/index';
const assert = chai.assert;
const expect = chai.expect;

class TestNode implements topologicalSorter.IDepNode {
    public nodes: topologicalSorter.IDepNode[] = [];
    constructor(public name: string) {
    }
}

function findNode(nodeName: string): TestNode {
    return nodes.find((n) => n.name === nodeName);
}
function findNodes(nodeNames: string[]): TestNode[] {
    return nodeNames.map((nodeName) => findNode(nodeName));
}

function addDeps(targetNode: string, ...deps: string[]) {
    findNode(targetNode).nodes = findNodes(deps);
}

function nodesToString(nodes: topologicalSorter.IDepNode[]) {
    return nodes.map((n) => (n as TestNode).name).join('');
}

function setNodes(names: string[]) {
    nodes = names.map((v) => new TestNode(v));
}

function check(sorted: topologicalSorter.IDepNode[]): boolean {
    const ok: boolean = !sorted.find((n, i) =>
        n.nodes.find((c) => sorted.indexOf(c) > i) !== undefined
    );
    // tslint:disable-next-line:no-console
    console.log(nodesToString(sorted));
    return ok;
}
let nodes: TestNode[];
describe('TopologicalSorter', () => {
    it('sort A->B->C as CBA', () => {
        setNodes(['a', 'b', 'c']);
        addDeps('a', 'b', 'c');
        addDeps('b', 'c');
        const sorted = new topologicalSorter.TopologicalSorter()
            .execute(nodes);
        assert(check(sorted));
    });

    it('sort A->B->A throw', () => {
        setNodes(['a', 'b']);
        addDeps('a', 'b');
        addDeps('b', 'a');
        expect(() => new topologicalSorter.TopologicalSorter().execute(nodes)).to
            .throw(topologicalSorter.TopologicalSorter.NOT_A_DAG);
    });

    it('sort a->bc, d->c', () => {
        setNodes(['a', 'b', 'c', 'd']);
        addDeps('a', 'b', 'c');
        addDeps('d', 'a');
        const sorted = new topologicalSorter.TopologicalSorter()
            .execute(nodes);
        assert(check(sorted));
    });

    it('sort a->bc, d->e', () => {
        setNodes(['a', 'b', 'c', 'd', 'e']);
        addDeps('a', 'b', 'c');
        addDeps('d', 'e');
        const sorted = new topologicalSorter.TopologicalSorter()
            .execute(nodes);
        assert(check(sorted));
    });

    it('sort A->B->A throw and stack', () => {
        setNodes(['a', 'b', 'c']);
        addDeps('a', 'b', 'c');
        addDeps('b', 'a');
        const sorter = new topologicalSorter.TopologicalSorter();
        expect(() => sorter.execute(nodes)).to
            .throw(topologicalSorter.TopologicalSorter.NOT_A_DAG);
        const deps = sorter.stack.map((n) => (n as TestNode).name);
        expect(deps).to.contain('a');
        expect(deps).to.contain('b');
        expect(deps.length).to.be.equal(3);
    });
});
