const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5500;
app.use(express.json());
 // git the home page
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,"index.html"))
})
// git the notes page
app.get('/notes',(req,res) => {
     res.sendFile(path.join(__dirname,"notes.html"))
     })

// Reading the db file and sinding back the data 
     app.get("/api/notes",(req,res) => {
      fs.readFile(path.join(__dirname,"../db/db.json"),"utf8",(err,data) => {
        if (err) console.log(err)
      
        res.json(JSON.parse(data))
      })
    })
    
    // receive a new note to save on the request body, 
    //add it to the db.json file, and then return the new note to the client.
     
app.POST('/api/notes',(req,res)=>{
  const note = req.body
  fs.readFile(path.join(__dirname,"../db/db.json"),"utf8",(err,data) => {
    if (err) console.log(err)
  // create id for each note.
    const notesArray = JSON.parse(data)
    note.id = notesArray[notesArray.length-1].id + 1;
    notesArray.push(note);

    fs.writeFile(path.join(__dirname,"../db/db.json"), JSON.stringify(notesArray) , (err) =>  {
      if(err) res.send(err);

      res.send(note);

    })
  })
})

/* 
receive a query parameter containing the id of a note to delete
read all notes from the db.json file,
remove the note with the given id property, and then rewrite the notes to the db.json file.
*/

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile(path.join(__dirname,"../db/db.json"),"utf8",(err,data) => {
    if (err) throw err;
    data = JSON.parse(data).filter(el => el.id != id);

    fs.writeFile(path.join(__dirname,"../db/db.json"), JSON.stringify(data) , (err) =>  {
      if(err) res.send(err);
    })
    res.json(data);
  })
});

// listening to the port
app.listen(PORT,()=>{
    console.log(`Server is listing in port ${PORT}`)
})
