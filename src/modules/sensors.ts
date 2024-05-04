export const getSensorData =  (req, res) => {
    console.log("Sensor data :" , req.body)
    const io = req.app.get('socketio')
    io.emit('sensorData' , req.body);
    console.log("works!")
    return res.status(200).json({data: req.body})
}