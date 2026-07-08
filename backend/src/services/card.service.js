const Card=require('../models/card')
const List=require('../models/List')
const { getIO } = require('../config/socket'); 
const createCard=async({title,listId})=>{
    const list = await List.findById(listId);
    if (!list) {
    const error = new Error('List not found');
    error.statusCode = 404;
    throw error;
    }
    const lastCard = await Card.findOne({ list: listId }).sort({ position: -1 });
    const position = lastCard ? lastCard.position + 1000 : 1000;
    const card=await Card.create(
        {
            title,
            list:listId,
            board:list.board,
            position
        }
    );
    return card

}
const getCards=async(listId)=>{
    const cards=await Card.find({list:listId}).sort({position:1});
    return cards;
}
const moveCard=async({cardId,newListId,prevCardId,nextCardId})=>{
    let newPosition;
    const prevCard=prevCardId ? await Card.findById(prevCardId) : null;
    const nextCard=nextCardId ? await Card.findById(nextCardId) : null;
    if(prevCard && nextCard)
    {
        newPosition=(prevCard.position+nextCard.position)/2;
    }else if(prevCard && !nextCard)
    {
        newPosition=prevCard.position+1000
    }else if(!prevCard && nextCard)
    {
        newPosition=nextCard.position/2;
    }
    else newPosition=1000;
    const card=await Card.findByIdAndUpdate(
        cardId,
        {list:newListId,position:newPosition},
        {new:true}
    )
    getIO().to(card.board.toString()).emit('cardMoved', card);
    return card;
}
module.exports = { createCard, getCards ,moveCard};
