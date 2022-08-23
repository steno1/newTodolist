//todolist
const express = require("express"); // express
const bodyParser = require("body-parser"); // body=parser
const mongoose = require("mongoose")
const date = require(__dirname + '/date.js')
const _ = require("lodash");

const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"))
app.set("view engine", "ejs"); // set our server to use ejs





//creating a new database//
mongoose.connect("mongodb+srv://steno12:toochukwu@cluster0.ixu754a.mongodb.net/anotherOnuDB");
const itemSchema = {
    name: String
}
//create collection
const Item = mongoose.model("item", itemSchema);
//create document
const doc1 = new Item({
    name: "Welcome to princeley sites. Click the checkbox to delete item"
});
const doc2 = new Item({
    name: "How are you today? Click the + button to add new item"
});
//create array for your document
const defaultItem = [doc1, doc2];
//schema for List
const listSchema = {
    name: String,
    items: [itemSchema]
}
//create collection for listSchema
const List = mongoose.model("list", listSchema);
//Home route


//serving the defautItem into our webpage
app.get("/", function (req, res) {
    



    const day = date.dateName();
    Item.find({}, function (err, foundItem) {
        if (foundItem.length === 0) {
            Item.insertMany(defaultItem, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("successfully inserted")
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {
                listDate: day,
                listTitle: "Home",
                things: foundItem
            })
        }

    })

});
app.get('/knowme', function (req, res) {
    res.render("knowme")
});
app.get('/aboutApp', function (req, res) {
    res.render("aboutApp")
})
//express route parameter
app.get("/:customListRoute", function (req, res) {
    const day = date.dateName();
    const newCustomList = _.capitalize(req.params.customListRoute);


    //create new document for customListRoute
    List.findOne({
        name: newCustomList
    }, function (err, foundItem) {
        if (newCustomList === "about") {
            res.render("knowme");
        } else if (newCustomList === "aboutApp") {
            res.render('aboutApp')
        } else if (!err) {
            if (!foundItem) {
                const doc3 = new List({
                    name: newCustomList,
                    items: defaultItem

                })
                doc3.save();
                res.redirect("/" + newCustomList)
            } else {
                res.render("list", {
                    listDate: day,
                    listTitle: foundItem.name,
                    things: foundItem.items
                })
            }
        }
    })

})
app.post("/", function (req, res) {
    const newPost = req.body.newItem;
    const listName = req.body.list;

    //create new document for posting
    const newDoc = new Item({ //will use this method for the customList
        name: newPost
    });
    if (listName === 'Home') {
        newDoc.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: listName
        }, function (err, foundItem) {
            foundItem.items.push(newDoc);
            foundItem.save();
        });
        res.redirect("/" + listName);
    }


});

app.post("/delete", function (req, res) {
    const deleteItemId = req.body.checking;
    const listNameOne = req.body.listName;
    if (listNameOne === "Home") {
        Item.findByIdAndDelete(deleteItemId, function (err) {
            if (!err) {
                console.log("successfully deleted item");

            }
            res.redirect("/")
        })
    } else {
        List.findOneAndUpdate({
            name: listNameOne
        }, {
            $pull: {
                items: {
                    _id: deleteItemId
                }
            }
        }, function (err) {
            if (!err) {
                res.redirect("/" + listNameOne);
            }
        })
    }

})

let port=process.env.PORT;
if(port==null || port==""){
port=3000;
}

app.listen(port, function () {
    console.log("server is listening to port 3000")
})