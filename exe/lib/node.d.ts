export interface IDepNode {
    nodes: IDepNode[];
}
export declare class TopologicalSorter {
    static readonly NOT_A_DAG: string;
    result: IDepNode[];
    stack: IDepNode[];
    private markers;
    execute(nodes: IDepNode[]): IDepNode[];
    private visit(node);
}
