// Box.js
import React from 'react';
import { useDrop } from 'react-dnd';

function Box({ onDrop , id }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'draggableItem',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        border: '1px dashed black',
        padding: '16px',
        margin: '8px',
        backgroundColor: isOver ? 'lightgreen' : 'transparent',
      }}
    >
     Box {id} 
    </div>
  );
}

export default Box;
