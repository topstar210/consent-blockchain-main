const home = (req, res) => {
    res.status(200).json({ name: 'John Doe' })
}

export default home