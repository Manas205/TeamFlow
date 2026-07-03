const Card=require('../models/card')
const List=require('../models/List')
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
module.exports = { createCard, getCards };
