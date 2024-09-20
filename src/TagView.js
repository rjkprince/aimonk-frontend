import React, { useState } from "react";
import { v4 as uuiV4 } from "uuid";

const TagView = ({ node, updateNode, tagId, parentTagId }) => {
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
  };

  const handleNameSave = (e) => {
    if (e.key === "Enter") {
      setEditingName(false);
      updateNode(parentKey, { ...node, name });
    }
  };

  // Add a new child when the "Add Child" button is clicked
  const addChild = () => {
    const newChildId = uuiV4();
    const newChild = { id: newChildId, name: "New Child", data: "Data" };
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
  };

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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TagView;
