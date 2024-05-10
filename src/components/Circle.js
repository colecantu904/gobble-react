// Circle.js
import React from 'react';

function Circle({ id, Color }) {
  onDragStart = (ev, id) => {
    console.log('dragstart: ',  {id});
    ev.dataTransfer.setData('id', id);
  }

  return (
    <div
      draggable
      style={{
        cursor: 'move',
        border: '1px solid black',
        borderRadius: '49%',
        padding: '8px',
        margin: '8px',
        backgroundColor: {Color},
      }}
    >
      Draggable Item {id}
    </div>
);
}

export default Circle;