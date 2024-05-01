export const getSensorData =  (req, res) => {
    console.log("Sensor data :" , req.body)
    return res.status(200).json({data: req.body})
}