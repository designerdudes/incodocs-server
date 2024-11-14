import factoryManagement from "../models/factoryManagement.js";
const {lot} = factoryManagement;



export const addLot = async (req, res)=>{
    try{
   const  newLot = await lot.create(req.body)
   res.status(200).send(newLot)
    }
    catch (error){
    res.status(500).send('Internal server error')
    }
}


export const updateLot = async (req, res) => {
    const { id } = req.params;
    const body = req.body
    try {

        const updatedLot = await lot.findByIdAndUpdate(id, body, { new: true })

        if (!updatedLot) {
            return res.status(404).send({ message: "Lot not found" })
        }

        res.json(updatedLot)

    }

   catch (error) {
        res.status(404).send({ message: error.message })
    }
 }




export const  getallLot = async (req, res)=> {
    try{
    const allLot = await lot.find()
    res.json(allLot)
    }
    catch (error){

res.status(500).json({message:error.message})

       }   }


export  const getlotById = async (req, res) => {

        const { id } = req.params
        try {
          const getbyId = await lot.findById(id)

            if (!getbyId) {
                res.status(404).json({ message: 'Id does not exist' })
            }

            res.json(getbyId)

        }
        catch (error) {

            res.status(500).json({ message: error.message })

        }
    }


export const removeLot = async(req, res) =>{
    const {id} = req.params
    try{
    
   const  getRemove = await lot.findByIdAndDelete(id)
   if(!getRemove){
    res.status(404).json({message:"Lots does not exist"})
   }
res.status(200).json({message:"Lot successfully deleted"})
}
    catch (error){
        res.status(404).json({message:error.message})
   


    }
}

