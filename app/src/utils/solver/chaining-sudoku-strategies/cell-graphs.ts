import { Cell } from "../../logic/Cell"
import { TableState } from "../../logic/rulesets/TableState";

// We assume a simple graph as the strategies will terminate after scanning 1 graph.
export type CellGraph = {
    nodes : CellNode[]
}

export type CellNode = {
    cells : {r : number, c : number}[]
    adjList : CellNode[];
    visited : boolean,
    color : number[]
}

// We choose to add only the coordinates for ease of checking
// We require that isConnected be followed with a refresh on the graph.
export function isConnected(c : CellNode, d:  CellNode) : boolean{
    if (isAdjacentTo(c, d))
        return true;
    else {
        for (let i = 0 ; i < c.adjList.length; i++) {
            if (!c.adjList[i].visited) {
                if (isConnected(c.adjList[i], d)) {
                    return true;
                }
                c.adjList[i].visited = true;
            }
        }
    }
    return false;
}

export function makeNode(cells : Cell[] ) : CellNode {
    let coords = []
    for (let i = 0; i < cells.length; i++) {
        coords.push({r : cells[i].row, c : cells[i].column});
    }

    return {
        cells : coords ,
        adjList : [],
        visited : false,
        color : []
    }
}

export function addToGraph (graph : CellGraph, node : CellNode) {
    if (!isInGraph(graph, node))
        graph.nodes.push(node);
}

export function isEqual (c : CellNode, d : CellNode) : boolean {
    // Check each cell in c and d, whether one is contained in the other
    for (let i = 0; i < c.cells.length ;i++) {
        let res = false
        for (let j = 0; j < d.cells.length; j++) {
            if (c.cells[i].c === d.cells[j].c && c.cells[i].r === d.cells[j].r){
                res = true;
                break;
            }
        }
        if (res === false)
            return false;
    }

    return true;
}

export function isInGraph (graph : CellGraph, node : CellNode) : CellNode | null{
    for (let i = 0 ; i < graph.nodes.length ; i++){
        if (isEqual (node, graph.nodes[i]))
            return graph.nodes[i];
    }
    return null;
}

export function isAdjacentTo (c : CellNode, d : CellNode) {
    for (let i = 0 ; i < c.adjList.length; i++){
        if(isEqual(c.adjList[i], d))
            return true;
    }
    return false;
}

export function makeLink(c : CellNode, d : CellNode, g : CellGraph) {
    if (isEqual(c, d)){
        return;
    }
    if (isAdjacentTo(c, d)) {
        return;
    }

    if (isInGraph(g, c) !== null)
        c =isInGraph(g , c) as CellNode;
    if (isInGraph(g, d) !== null)
        d =isInGraph(g , d) as CellNode;

    c.adjList.push(d);
    d.adjList.push(c);

}

export function refresh(nodes : CellNode[]) {
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].visited = false;
        nodes[i].color  = []
    }
}

export function getTableEntry (node : CellNode, table : TableState) : Cell[]{
    const list : Cell[]= []

    for (let i = 0; i < node.cells.length; i++) {
        list.push(table.cells[node.cells[i].r - 1][node.cells[i].c - 1])
    }
    return list;
}


export function color (graph : CellGraph) {
    refresh(graph.nodes);
    colorUtil(graph, graph.nodes[0])
}

export function partition(graph : CellGraph, colors : number) : CellNode[][] {
    // Partitions all nodes by their color
    let p : CellNode[][] = []

    for (let i = 0; i < colors; i++) {
        p.push([]);
    }

    for (let i = 0; i < colors ; i++) {
        for (let j = 0 ; j < graph.nodes.length; j++) {
            if (graph.nodes[j].color.includes(i))
                p[i].push(graph.nodes[j]);
        }
    }

    return p
}

function colorUtil (graph : CellGraph, source : CellNode, colors : number = 2, depth : number = 1) {
    if (source === undefined || source === null)
        return;
    if (source.visited)
        return;

    source.visited = true;
    // Check if the source has been colored
    const currColor = depth % colors;
    if (source.color.length === 0) {
        source.color.push(currColor)
    } else {
        if (!source.color.includes(currColor)) {
            source.color.push(currColor);
        }
    }
    
    // We then visit all neighbors
    for (let i = 0; i < source.adjList.length; i++) {
        const dest = source.adjList[i];
        colorUtil(graph, dest, colors, depth + 1);
    }
}