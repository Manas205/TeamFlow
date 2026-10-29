import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { DndContext, closestCenter,useDroppable} from '@dnd-kit/core';
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
    let destListIndex = lists.findIndex((list) =>
  list.cards.some((card) => card._id === over.id)
);

let droppedOnEmptyList = false;
if (destListIndex === -1) {
  destListIndex = lists.findIndex((list) => list._id === over.id);
  droppedOnEmptyList = true;
}

if (destListIndex === -1) return;

    const sourceList=lists[sourceListIndex];
    const oldIndex=sourceList.cards.findIndex((card)=>card._id===active.id);
   const destList = lists[destListIndex];
const newIndex = droppedOnEmptyList
  ? destList.cards.length
  : destList.cards.findIndex((card) => card._id === over.id);
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
  if (loading) return <div className="mx-auto flex min-h-[50vh] items-center justify-center px-4 text-sm text-slate-500">Loading board...</div>;
  return (
    <div className="space-y-6">
      <Link to={`/workspace/${workspaceId}`}>← Back to Boards</Link>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Board</h1>

      <form className="flex w-full gap-2 sm:w-auto" onSubmit={handleCreateList}>
        <input className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          required
        />
        <button className="min-h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100" type="submit">Add List</button>
      </form>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={lists.map((l) => l._id)} strategy={horizontalListSortingStrategy}>
  <div className="flex min-h-[420px] gap-4 overflow-x-auto pb-4">
    {lists.map((list) => (
      <SortableList key={list._id} list={list}>
        <SortableContext items={list.cards.map((c) => c._id)} strategy={verticalListSortingStrategy}>
          <ul className="mb-4 min-h-12 space-y-2">
            {list.cards.map((card) => (
              <SortableCard key={card._id} card={card} />
            ))}
          </ul>
        </SortableContext>
        <form onSubmit={(e) => handleCreateCard(e, list._id)}>
          <input className="min-h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            value={newCardTitles[list._id] || ''}
            onChange={(e) =>
              setNewCardTitles((prev) => ({ ...prev, [list._id]: e.target.value }))
            }
            placeholder="New card title"
          />
          <button className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100" type="submit">Add Card</button>
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
    <li className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-indigo-200 hover:shadow-md active:cursor-grabbing" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {card.title}
    </li>
  );
};
const SortableList = ({ list, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: list._id });
  const { setNodeRef: setDroppableRef } = useDroppable({ id: list._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDroppableRef(node);
      }}
      className="w-72 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm"
      style={style}
    >
      <div className="mb-3 flex cursor-grab items-center justify-between border-b border-slate-200 px-1 pb-3" {...attributes} {...listeners}>
        <h3 className="text-sm font-semibold text-slate-900">{list.name}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">{list.cards.length}</span>
      </div>
      {children}
    </div>
  );
};
export default BoardDetail
