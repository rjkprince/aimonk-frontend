import React, { useEffect, useState } from "react";
import "./App.css"; // For styling
import TagView from "./TagView"; // Import the Tag component
import axios from "axios";

const initialTree = {
  id: "id-1",
  name: "root",
  children: [
    {
      id: "id-2",
      name: "child1",
      children: [
        { id: "id-3", name: "child1-child1", data: "c1-c1 Aloha" },
        { id: "id-4", name: "child1-child2", data: "c1-c2 JS" },
      ],
      data: "c1 Py",
    },
    { id: "id-5", name: "child2", data: "c2 World" },
  ],
  data: "root xyz",
};

const App = () => {
  const [tree, setTree] = useState(initialTree);
  const [exportTree, setExportTree] = useState();
  const [updates, setUpdates] = useState([]);
  // Recursively update the tree node with new values (name or data)
  const updateNode = (path, updatedNode) => {
    console.log({ path, updatedNode });
    const update = (node, currPath) => {
      if (currPath.split(".").length === 1) {
        return updatedNode;
      }
      const indexOfFirstDot = currPath.indexOf(".");
      const [currId, childIds] = [
        currPath.slice(0, indexOfFirstDot),
        currPath.slice(indexOfFirstDot + 1),
      ];
      const targetChildId = childIds.split(".")[0];
      return {
        ...node,
        children: node.children.map((child) => {
          if (child.id === targetChildId) {
            return update(child, childIds);
          }
          return child;
        }),
      };
    };

    setTree((prevTree) => update(prevTree, path));
  };

  // Export the tree as a JSON string
  const handleExport = async () => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/tags/pushUpdates`, {
      updates,
    });
    fetchTags();
    setUpdates([]);
    const exportTree = JSON.stringify(tree, null, 2);
    // console.log(exportTree);
    setExportTree(exportTree);
  };

  const fetchTags = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/tags/tree`
    );
    setTree(res.data[0]);
  };
  useEffect(() => {
    fetchTags();
  }, []);
  // console.log(tree);
  return (
    <div className="app">
      <TagView
        node={tree}
        tagId={tree.id}
        parentTagId={null}
        updateNode={updateNode}
        setUpdates={setUpdates}
      />
      <button onClick={handleExport}>Export</button>
      <div>{exportTree}</div>
    </div>
  );
};

export default App;
