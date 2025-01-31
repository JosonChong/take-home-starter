class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let currentNode = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }
      currentNode = currentNode.children.get(char);
    }
    currentNode.isEndOfWord = true;
  }

  search(word) {
    let currentNode = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!currentNode.children.has(char)) {
        return false;
      }
      currentNode = currentNode.children.get(char);
    }
    return currentNode.isEndOfWord;
  }

  autoComplete(prefix) {
    let currentNode = this.root;
    let suggestions = [];

    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (!currentNode.children.has(char)) {
        return suggestions;
      }
      currentNode = currentNode.children.get(char);
    }

    this._dfs(currentNode, prefix, suggestions);

    return suggestions;
  }

  _dfs(node, prefix, suggestions) {
    if (node.isEndOfWord) {
      suggestions.push(prefix);
    }
    for (const [char, childNode] of node.children.entries()) {
      this._dfs(childNode, prefix + char, suggestions);
    }
  }
}

export default Trie;