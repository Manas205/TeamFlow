import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const BoardDetail=()=>{
  const { workspaceId, boardId } = useParams();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [newCardTitles, setNewCardTitles] = useState({});
    useEffect(() => {
    fetchLists();
  }, [boardId]);
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
        <DndContext collisionDetection={closestCenter}>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        {lists.map((list) => (
          <div key={list._id} style={{ border: '1px solid #ccc', padding: '8px', minWidth: '200px' }}>
    <h3>{list.name}</h3>

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
  </div>
        ))}
      </div>
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
export default BoardDetail