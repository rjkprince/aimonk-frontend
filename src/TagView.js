import React, { useEffect, useState } from "react";
import { ObjectId } from "bson";

const TagView = ({ node, updateNode, tagId, parentTagId, setUpdates }) => {
  const parentKey = parentTagId ? `${parentTagId}.${tagId}` : tagId;
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(node.name);
  const [data, setData] = useState(node.data || "");

  // Toggle Collapse
  const toggleCollapse = () => setCollapsed(!collapsed);

  // Update the node name or data in the parent component
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDataChange = (e) => {
    setData(e.target.value);
    updateNode(parentKey, { ...node, data: e.target.value });
    setUpdates((prevUpdates) => [
      ...prevUpdates,
      { ...node, data: e.target.value },
    ]);
  };

  const handleNameSave = (e) => {
    if (e.key === "Enter") {
      setEditingName(false);
      updateNode(parentKey, { ...node, name });
      setUpdates((prevUpdates) => [...prevUpdates, { ...node, name }]);
    }
  };

  // Add a new child when the "Add Child" button is clicked
  const addChild = () => {
    const newChildId = new ObjectId().toString();
    const newChild = {
      id: newChildId,
      name: "New Child",
      data: "Data",
      parentTagId: tagId,
    };
    if (!node.children) {
      updateNode(parentKey, {
        ...node,
        children: [newChild],
      });
    } else {
      updateNode(parentKey, {
        ...node,
        children: [...node.children, newChild],
      });
    }
    setUpdates((prevUpdates) => [...prevUpdates, newChild]);
  };

  useEffect(() => {
    setName(node.name);
    setData(node.data);
  }, [node]);

  return (
    <div className="tag">
      <div className="tag-header">
        <div>
          <button onClick={toggleCollapse}>{collapsed ? ">" : "v"}</button>
          {!editingName ? (
            <span
              className="tag-name"
              onDoubleClick={() => setEditingName(true)}
            >
              {name}
            </span>
          ) : (
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleNameSave}
            />
          )}
        </div>

        <button onClick={addChild}>Add Child</button>
      </div>
      {node.data && !collapsed && (
        <div className="tag-data-container">
          <div className="tag-data">
            Data: <input type="text" value={data} onChange={handleDataChange} />
          </div>
        </div>
      )}
      {!collapsed && node.children && (
        <div className="tag-children">
          {node.children.map((child, index) => (
            <TagView
              key={child.id}
              node={child}
              tagId={child.id}
              parentTagId={parentKey}
              updateNode={updateNode}
              setUpdates={setUpdates}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TagView;
