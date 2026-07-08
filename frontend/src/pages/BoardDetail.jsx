import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import socket from '../api/socket';
const BoardDetail=()=>{
  const { workspaceId, boardId } = useParams();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [newCardTitles, setNewCardTitles] = useState({});
    useEffect(() => {
    fetchLists();
  }, [boardId]);
  useEffect(() => {
  socket.connect();
  socket.emit('joinBoard', boardId);
  return () => {
    socket.emit('leaveBoard', boardId);
    socket.disconnect();
  };
}, [boardId]);
useEffect(() => {
  socket.on('cardMoved', () => {
    fetchLists();
  });

  socket.on('listMoved', () => {
    fetchLists();
  });

  return () => {
    socket.off('cardMoved');
    socket.off('listMoved');
  };
}, []);
  const fetchLists = async () => {
    try {
      const response = await axiosInstance.get(`/workspaces/${workspaceId}/boards/${boardId}/lists/full`);
      setLists(response.data.lists);
    } catch (err) {
      console.error('Failed to fetch lists:', err);
    } finally {
      setLoading(false);
    }
};
    const handleDragEnd=async (event)=>{
      const {active,over}=event;
      if(!over || active.id===over.id) return;
      const isListDrag = lists.some((list) => list._id === active.id);

if (isListDrag) {
  const oldIndex = lists.findIndex((list) => list._id === active.id);
  const newIndex = lists.findIndex((list) => list._id === over.id);
  if (oldIndex === -1 || newIndex === -1) return;

  const reorderedLists = [...lists];
  const [movedList] = reorderedLists.splice(oldIndex, 1);
  reorderedLists.splice(newIndex, 0, movedList);
  setLists(reorderedLists);

  const prevList = newIndex > 0 ? reorderedLists[newIndex - 1] : null;
  const nextList = newIndex < reorderedLists.length - 1 ? reorderedLists[newIndex + 1] : null;

  try {
    await axiosInstance.patch(
      `/workspaces/${workspaceId}/boards/${boardId}/lists/${active.id}/move`,
      {
        prevListId: prevList ? prevList._id : null,
        nextListId: nextList ? nextList._id : null,
      }
    );
  } catch (err) {
    console.error('Failed to save list move:', err);
    fetchLists();
  }
  return;
}
      const sourceListIndex=lists.findIndex((list)=>
      list.cards.some((card)=>card._id===active.id)
    );
    if(sourceListIndex===-1) return;
    let destListIndex=lists.findIndex((list)=>
    list.cards.some((card)=>card._id===over.id));
    if(destListIndex===-1) return;

    const sourceList=lists[sourceListIndex];
    const oldIndex=sourceList.cards.findIndex((card)=>card._id===active.id);
    const destList=lists[destListIndex];
    const newIndex=destList.cards.findIndex((card)=>card._id===over.id);
   const updatedLists = [...lists];
  let finalDestCards;
  if (sourceListIndex === destListIndex) {
    // SAME LIST — reorder (same logic as before)
    const reorderedCards = [...sourceList.cards];
    const [movedCard] = reorderedCards.splice(oldIndex, 1);
    reorderedCards.splice(newIndex, 0, movedCard);
    updatedLists[sourceListIndex] = { ...sourceList, cards: reorderedCards };
    finalDestCards=reorderedCards;
  } else {
    // DIFFERENT LIST — remove from source, insert into destination
    const sourceCards = [...sourceList.cards];
    const [movedCard] = sourceCards.splice(oldIndex, 1);

    const destCards = [...destList.cards];
    destCards.splice(newIndex, 0, movedCard);

    updatedLists[sourceListIndex] = { ...sourceList, cards: sourceCards };
    updatedLists[destListIndex] = { ...destList, cards: destCards };
    finalDestCards=destCards
  }
    setLists(updatedLists)
     const movedCardFinalIndex = finalDestCards.findIndex((card) => card._id === active.id);
  const prevCard = movedCardFinalIndex > 0 ? finalDestCards[movedCardFinalIndex - 1] : null;
  const nextCard = movedCardFinalIndex < finalDestCards.length - 1 ? finalDestCards[movedCardFinalIndex + 1] : null;

  try {
    await axiosInstance.patch(
      `/workspaces/${workspaceId}/boards/${boardId}/cards/${active.id}/move`,
      {
        newListId: lists[destListIndex]._id,
        prevCardId: prevCard ? prevCard._id : null,
        nextCardId: nextCard ? nextCard._id : null,
      }
    );
  } catch (err) {
    console.error('Failed to save card move:', err);
    fetchLists(); // if the backend call fails, refetch to resync UI with real data
  }
    }
     const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/workspaces/${workspaceId}/boards/${boardId}/lists`, { name: newListName });
      setNewListName('');
      fetchLists();
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };
  const handleCreateCard = async (e, listId) => {
  e.preventDefault();
  const title = newCardTitles[listId];
  if (!title) return;

  try {
    await axiosInstance.post(
      `/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`,
      { title }
    );
    setNewCardTitles((prev) => ({ ...prev, [listId]: '' })); // clear just this list's input
    fetchLists(); // refetch to show the new card
  } catch (err) {
    console.error('Failed to create card:', err);
  }
};
  if (loading) return <div>Loading board...</div>;
  return (
    <div>
      <Link to={`/workspace/${workspaceId}`}>← Back to Boards</Link>
      <h1>Board</h1>

      <form onSubmit={handleCreateList}>
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          required
        />
        <button type="submit">Add List</button>
      </form>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={lists.map((l) => l._id)} strategy={horizontalListSortingStrategy}>
  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
    {lists.map((list) => (
      <SortableList key={list._id} list={list}>
        <SortableContext items={list.cards.map((c) => c._id)} strategy={verticalListSortingStrategy}>
          <ul>
            {list.cards.map((card) => (
              <SortableCard key={card._id} card={card} />
            ))}
          </ul>
        </SortableContext>
        <form onSubmit={(e) => handleCreateCard(e, list._id)}>
          <input
            value={newCardTitles[list._id] || ''}
            onChange={(e) =>
              setNewCardTitles((prev) => ({ ...prev, [list._id]: e.target.value }))
            }
            placeholder="New card title"
          />
          <button type="submit">Add Card</button>
        </form>
      </SortableList>
    ))}
  </div>
  </SortableContext>
      </DndContext>
    </div>
  );

};
const SortableCard = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card._id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {card.title}
    </li>
  );
};
const SortableList = ({ list, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: list._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={{ ...style, border: '1px solid #ccc', padding: '8px', minWidth: '200px' }}>
      <div {...attributes} {...listeners}>
        <h3>{list.name}</h3>
      </div>
      {children}
    </div>
  );
};
export default BoardDetail