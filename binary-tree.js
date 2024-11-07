class Node{
    constructor(value, left = null, right = null){
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

class Tree{
    constructor(Array){
        this.root = this.buildTree(Array);
    }

    buildTree(Array){
        const uniqueSortArray = [...new Set(Array)];
        uniqueSortArray.sort(function (a, b) {
            return a - b;
        });

        return this.recursiveTree(uniqueSortArray);
    }

    recursiveTree(Array){

        if(Array.length === 0){
            return null
        }
        
        if(Array.length === 1 ){
            return new Node(Array[0]);
        }

        let middleIndex = Math.floor(Array.length / 2);

        let arr1 = Array.slice(0, middleIndex);
        let arr2 = Array.slice(middleIndex + 1);
        let value = Array[middleIndex];

        return new Node(value,this.recursiveTree(arr1),this.recursiveTree(arr2))

    }

    printTree() {
        const prettyPrint = (node, prefix = "", isLeft = true) => {
            if (node === null) {
                return;
            }
            if (node.right !== null) {
                prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
            }
            console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
            if (node.left !== null) {
                prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
            }
        };

        prettyPrint(this.root); 
    }

    insert(value, rootNode = this.root){
        if(rootNode === null){
            return new Node(value);
        }

        if(rootNode.value === value){
            return rootNode
        }

        if(value < rootNode.value){
            rootNode.left = this.insert(value, rootNode.left);
        }else if(value > rootNode.value){
            rootNode.right = this.insert(value,rootNode.right)
        }

        return rootNode
    }

    getSuccessor(curr) {
        curr = curr.right;
        while (curr !== null && curr.left !== null) {
            curr = curr.left;
        }
        return curr;
    }
    
    remove(value, root = this.root) {
        if (root === null) {
            return root;
        }
    
        if (root.value > value) {
            root.left = this.remove(value,root.left);
        } else if (root.value < value) {
            root.right = this.remove(value,root.right);
        } else {
            if (root.left === null) 
                return root.right;
    
            if (root.right === null) 
                return root.left;
    
            let succ = this.getSuccessor(root);
            root.value = succ.value;
            root.right = this.remove(root.right, succ.value);
        }
        return root;
    }

    find(value, rootNode = this.root) {
        if (rootNode === null) {
            console.log("Not found");
            return null;
        }
    
        if (rootNode.value === value) {
            return rootNode;
        }
    
        if (value < rootNode.value) {
            return this.find(value, rootNode.left);
        } else {
            return this.find(value, rootNode.right);
        }
    }
    

    levelOrder(callback){
        if(typeof callback !== "function"){
            throw new Error("a callback function is required");
        }

        let queue = [this.root];
        
        while(queue.length > 0){
            let currentNode = queue.shift();
            callback(currentNode);

            if (currentNode.left) queue.push(currentNode.left);
            if (currentNode.right) queue.push(currentNode.right);
        }
    }

    inOrder(callback) {
        if (typeof callback !== "function") {
            throw new Error("A callback function is required.");
        }
    
        const traverse = (node) => {
            if (node === null) return;
            traverse(node.left);
            callback(node);
            traverse(node.right);
        };
    
        traverse(this.root);
    }
    
    preOrder(callback) {
        if (typeof callback !== "function") {
            throw new Error("A callback function is required.");
        }
    
        const traverse = (node) => {
            if (node === null) return;
            callback(node);
            traverse(node.left);
            traverse(node.right);
        };
    
        traverse(this.root);
    }
    
    postOrder(callback) {
        if (typeof callback !== "function") {
            throw new Error("A callback function is required.");
        }
    
        const traverse = (node) => {
            if (node === null) return;
            traverse(node.left);
            traverse(node.right);
            callback(node);
        };
    
        traverse(this.root);
    }

    height(node) {
        if (node === null) return -1; 
        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(node, currentNode = this.root, depth = 0) {
        if (currentNode === null) return -1; 
        if (currentNode === node) return depth;

        if (node.value < currentNode.value) {
            return this.depth(node, currentNode.left, depth + 1);
        } else {
            return this.depth(node, currentNode.right, depth + 1);
        }
    }
    isBalanced(node = this.root) {
        if (node === null) return true;

        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);

        const heightDifference = Math.abs(leftHeight - rightHeight);

        return (
            heightDifference <= 1 &&
            this.isBalanced(node.left) &&
            this.isBalanced(node.right)
        );
    }
    rebalance() {
        const nodes = [];

        const inOrderTraversal = (node) => {
            if (node === null) return;
            inOrderTraversal(node.left);
            nodes.push(node.value);
            inOrderTraversal(node.right);
        };

        inOrderTraversal(this.root);

        this.root = this.buildTree(nodes);
    }


}

let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const newTree = new Tree(arr);
newTree.printTree();
newTree.insert(999);
newTree.insert(6);
newTree.remove(23);
newTree.remove(1);
newTree.printTree();
console.log(newTree.find(8))
console.log(newTree.find(68))
newTree.levelOrder(node => console.log(node.value))
newTree.inOrder(node => console.log(node.value))
newTree.preOrder(node => console.log(node.value))
newTree.postOrder(node => console.log(node.value))
console.log("Altura de la raíz:", newTree.height(newTree.root));
console.log("Profundidad de un nodo específico:", newTree.depth(newTree.root.left));
console.log("¿Está balanceado?", newTree.isBalanced());

if (!newTree.isBalanced()) {
    console.log("Rebalanceando el árbol...");
    newTree.rebalance();
}

console.log("¿Está balanceado ahora?", newTree.isBalanced());