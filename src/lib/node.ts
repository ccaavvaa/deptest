export interface IDepNode {
    nodes: IDepNode[];
}

enum Mark {
    Unmarked = 0,
    Temporary = 1,
    Permanent = 2,
}
export class TopologicalSorter {
    public static readonly NOT_A_DAG = 'Graph is not a Direct acyclic graph';
    public result: IDepNode[];

    public stack: IDepNode[];

    private markers: Map<IDepNode, Mark>;

    public execute(nodes: IDepNode[]): IDepNode[] {
        this.markers = new Map<IDepNode, Mark>(
            nodes.map((n) =>
                <[IDepNode, Mark]> [n, Mark.Unmarked])
        );
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

    private visit(node: IDepNode): void {
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
