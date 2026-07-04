const cardService=require('../services/card.service')
const createCard=async(req,res)=>{
    try {
        const {title}=req.body;
        const {listId}=req.params;
        if(!title)
        {
            return res.status(400).json({ message: 'Card title is required' });
        }
         const card = await cardService.createCard({ title, listId });
        return res.status(201).json({ message: 'Card created successfully', card });
    } catch (err) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message || 'Something went wrong' })
    }
}

const getCards = async (req, res) => {
  try {
    const { listId } = req.params;
    const cards = await cardService.getCards(listId);
    return res.status(200).json({ cards });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
  }
};
const moveCard=async(req,res)=>{
  try {
    const {cardId}=req.params;
    const {newListId,prevCardId,nextCardId}=req.body;
    const card=await cardService.moveCard({cardId,newListId,prevCardId,nextCardId});
    return res.status(200).json({ message: 'Card moved successfully', card });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    console.log("Error in move card controller");
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' })
  }
}
module.exports = { createCard, getCards,moveCard };