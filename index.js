var port = (process.env.PORT || 1607);
var express = require("express");
var app = express();
var DataStore = require("nedb");

var BASE_API_PATH_EMPLOYMENTS = "/api/v1/employments-by-status";
var BASE_API_PATH_UNEMPLOYMENTS = "/api/v1/unemployments";
var BASE_API_PATH_EXPENDITURES="/api/v1/expenditures-per-students";

var dbEmployments = __dirname + "/employments-by-status.db";
var dbUnemployments = __dirname + "/unemployments.db";
var dbExpenditures = __dirname + "/expenditures-per-students.db";

var bodyParser = require("body-parser");
app.use(bodyParser.json());

var employments = [
    {"country": "croatia","year": 1998,"total-self-employed":18.5,"total-salaried-employed":75.30000305,"total-contributing-family-worker":6.19999980926514},
    {"country": "cyprus","year": 2005,"total-self-employed":20.5,"total-salaried-employed":76.80000305,"total-contributing-family-worker":2.799999952},
];
var employments1 = [
    {"country": "romania","year": 1998,"total-self-employed":22.60000038,"total-salaried-employed":59.70000076,"total-contributing-family-worker":17.79999924},
    {"country": "romania","year": 2005,"total-self-employed":21.39999962,"total-salaried-employed":64.69999695,"total-contributing-family-worker":13.80000019}
];

var unemployments = [
    {"country": "austria","year": 1998,"young-unemployment":1.600000024,"adult-unemployment":1.600000024,"old-unemployment":1.600000024,"long-term-unemployment":1.600000024},
    {"country": "belgium","year": 2003,"young-unemployment":3.5,"adult-unemployment":3.5,"old-unemployment":3.5,"long-term-unemployment":3.5},
];
var unemployments1 = [
    {"country": "bulgaria","year": 1998,"young-unemployment":8,"adult-unemployment":8,"old-unemployment":8,"long-term-unemployment":8},
    {"country": "croatia","year": 2003,"young-unemployment":8,"adult-unemployment":8,"old-unemployment":8,"long-term-unemployment":8},
];
 
var initialsExpenditures = [
    {"country": "austria","year": 1998,"primary":27.8599,"secundary":27.46764,"tertiery":49.0146},
    {"country": "belgium","year": 2005,"primary":19.83316,"secundary":32.84222,"tertiery":34.572},
    {"country": "romania","year": 1998,"primary":19.7114,"secundary":27.59638,"tertiery":25.89706},
    {"country": "portugal","year": 2005,"primary":22.47196,"secundary":33.54664,"tertiery":26.26249}
];

app.get("/hello",(req,res)=>{
    res.send("Hello World");
});

app.use("/",express.static(__dirname+"/public"));

//expenditures

var dbEx = new DataStore({
    filename: dbExpenditures,
    autoload: true
});

dbEx.find({}, (err, expenditures) => {
    if (err) {
        console.error("Error accesing DB");
        process.exit(1);
    }
    if (expenditures.length == 0) {
        console.log("Empty DB");
        dbEx.insert(initialsExpenditures);
    }
    else {
        console.log("DB initialized with " + expenditures.length + " contacts")
    }
});

//GET

app.get(BASE_API_PATH_EXPENDITURES , (req, res) => {
    console.log(Date() + " - GET /expenditures-per-students");
    res.send(initialsExpenditures);
});

app.get(BASE_API_PATH_EXPENDITURES + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - GET /expenditures-per-students" + country);

    res.send(initialsExpenditures.filter((c) => {
        return (c.country == country);
    }));
});

app.get(BASE_API_PATH_EXPENDITURES + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - GET /expenditures-per-students" + year);

    res.send(initialsExpenditures.filter((c) => {
        return (c.year == year);
    }));
});

app.get(BASE_API_PATH_EXPENDITURES + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    console.log(Date() + " - GET /expenditures-per-students" + country + "/" + year);

    res.send(initialsExpenditures.filter((c) => {
        return (c.country == country);
    }).filter((c) => {
        return (c.year == year);
     }));
});

//DELETE

app.delete(BASE_API_PATH_EXPENDITURES, (req, res) => {
    console.log(Date() + " - DELETE /expenditures-per-students");
    initialsExpenditures = [];
    res.sendStatus(200);
});

app.delete(BASE_API_PATH_EXPENDITURES + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - DELETE /expenditures-per-students/" + country);

    initialsExpenditures =  initialsExpenditures.filter((c) => {
        return (c.country != country);
    });

    res.sendStatus(200);
});

app.delete(BASE_API_PATH_EXPENDITURES + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - DELETE /expenditures-per-students/" + year);

    initialsExpenditures =  initialsExpenditures.filter((c) => {
        return (c.year != year);
    });

    res.sendStatus(200);
});

app.delete(BASE_API_PATH_EXPENDITURES + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    
    console.log(Date() + " - DELETE /expenditures-per-students/" + country + "/" + year);

    initialsExpenditures = initialsExpenditures.filter((c) => {
        return (c.country != country && c.year != year );
    });

    res.sendStatus(200);
});

//POST

app.post(BASE_API_PATH_EXPENDITURES, (req, res) => {
    console.log(Date() + " - POST /expenditures-per-students");
    var expenditure = req.body;
    initialsExpenditures.push(expenditure);
    res.sendStatus(201);
});

app.post(BASE_API_PATH_EXPENDITURES + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - POST /expenditures-per-students" + country);
    res.sendStatus(405);
});

app.post(BASE_API_PATH_EXPENDITURES + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - POST /expenditures-per-students/" + year);
    res.sendStatus(405);
});

app.post(BASE_API_PATH_EXPENDITURES + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    console.log(Date() + " - POST /expenditures-per-students/" + country + "/" + year);
    res.sendStatus(405);
});

//PUT

app.put(BASE_API_PATH_EXPENDITURES, (req, res) => {
    var expenditure = req.body;
    console.log(Date() + " - PUT /expenditures-per-students");
    res.sendStatus(405);
});

app.put(BASE_API_PATH_EXPENDITURES + "/:country", (req, res) => {
    var country = req.params.country;
    var expenditure = req.body;
    
    console.log(Date() + " - PUT /expenditures-per-students/"+ country);
    
    res.sendStatus(405);
});

app.put(BASE_API_PATH_EXPENDITURES + "/:year", (req, res) => {
    var year = req.params.year;
    var expenditure = req.body;
    
    console.log(Date() + " - PUT /expenditures-per-students/"+ year);
    
    res.sendStatus(405);
});

app.put(BASE_API_PATH_EXPENDITURES + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    var expenditure = req.body;

    console.log(Date() + " - PUT /expenditures-per-students/" + country + "/" + year);

    if (country != expenditure.country) {
        res.sendStatus(409);
        console.warn(Date() + " - Hacking attempt!");
        return 1;
    }

    initialsExpenditures = initialsExpenditures.map((c) => {
        if (c.country == expenditure.country  && c.year == expenditure.year)
            return expenditure;
        else
            return c;
    });

    res.sendStatus(200);
});

/////////////////////////////
 
//unemployments

//GET
app.get(BASE_API_PATH_UNEMPLOYMENTS , (req, res) => {
    console.log(Date() + " - GET /unemployments");
    res.send(unemployments);
});

app.get(BASE_API_PATH_UNEMPLOYMENTS + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - GET /unemployments/" + country);

    res.send(unemployments.filter((c) => {
        return (c.country == country);
    }));
});

app.get(BASE_API_PATH_UNEMPLOYMENTS + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - GET /unemployments/" + year);

    res.send(unemployments.filter((c) => {
        return (c.year == year);
    }));
});

app.get(BASE_API_PATH_UNEMPLOYMENTS + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    console.log(Date() + " - GET /unemployments/" + country + "/" + year);

    res.send(unemployments.filter((c) => {
        return (c.country == country);
    }).filter((c) => {
        return (c.year == year);
     }));
});

//DELETE

app.delete(BASE_API_PATH_UNEMPLOYMENTS, (req, res) => {
    console.log(Date() + " - DELETE /unemployments");
    unemployments = [];
    res.sendStatus(200);
});

app.delete(BASE_API_PATH_UNEMPLOYMENTS + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - DELETE /unemployments/" + country);

    unemployments = unemployments.filter((c) => {
        return (c.country != country);
    });

    res.sendStatus(200);
});

app.delete(BASE_API_PATH_UNEMPLOYMENTS + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - DELETE /unemployments/" + year);

    unemployments = unemployments.filter((c) => {
        return (c.year != year);
    });

    res.sendStatus(200);
});

app.delete(BASE_API_PATH_UNEMPLOYMENTS + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    
    console.log(Date() + " - DELETE /unemployments/" + country + "/" + year);

    unemployments = unemployments.filter((c) => {
        return (c.country != country && c.year != year );
    });

    res.sendStatus(200);
});

//POST
app.post(BASE_API_PATH_UNEMPLOYMENTS , (req, res) => {
    console.log(Date() + " - POST /unemployments");
    var unemployment = req.body;
    employments.push(unemployment);
    res.sendStatus(201);
});

app.post(BASE_API_PATH_UNEMPLOYMENTS + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - POST /unemployments/" + country);
    res.sendStatus(405);
});

app.post(BASE_API_PATH_UNEMPLOYMENTS + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - POST /unemployments/" + year);
    res.sendStatus(405);
});

app.post(BASE_API_PATH_UNEMPLOYMENTS + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    console.log(Date() + " - POST /unemployments/" + country + "/" + year);
    res.sendStatus(405);
});

//PUT

app.put(BASE_API_PATH_UNEMPLOYMENTS, (req, res) => {
    var unemployment = req.body;
    console.log(Date() + " - PUT /unemployments");
    res.sendStatus(405);
});

app.put(BASE_API_PATH_UNEMPLOYMENTS + "/:country", (req, res) => {
    var country = req.params.country;
    var unemployment = req.body;
    
    console.log(Date() + " - PUT /unemployments/"+ country);
    
    res.sendStatus(405);
});

app.put(BASE_API_PATH_UNEMPLOYMENTS + "/:year", (req, res) => {
    var year = req.params.year;
    var unemployment = req.body;
    
    console.log(Date() + " - PUT /unemployments/"+ year);
    
    res.sendStatus(405);
});

app.put(BASE_API_PATH_UNEMPLOYMENTS + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    var unemployment = req.body;

    console.log(Date() + " - PUT /unemployments/" + country + "/" + year);

    if (country != unemployment.country) {
        res.sendStatus(409);
        console.warn(Date() + " - Hacking attempt!");
        return 1;
    }

    unemployments = unemployments.map((c) => {
        if (c.country == unemployment.country  && c.year == unemployment.year)
            return unemployment;
        else
            return c;
    });

    res.sendStatus(200);
});

////////////////////////////////////////////////////////////////////////////////////


//employments-by-status

//GET

app.get(BASE_API_PATH_EMPLOYMENTS , (req, res) => {
    console.log(Date() + " - GET /employments-by-status");
    res.send(employments);
}); 

app.get(BASE_API_PATH_EMPLOYMENTS + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - GET /employments-by-status/" + country);
    
    res.send(employments.filter((c) => {
        return (c.country == country);
    }));
});

app.get(BASE_API_PATH_EMPLOYMENTS + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - GET /employments-by-status/" + year);
    
    res.send(employments.filter((c) => {
        return (c.year == year);
    }));
});


app.get(BASE_API_PATH_EMPLOYMENTS + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    console.log(Date() + " - GET /employments-by-status/" + country + "/" + year);

    res.send(employments.filter((c) => {
        return (c.country == country);
    }).filter((c) => {
        return (c.year == year);
     }));
});


//DELETE 

app.delete(BASE_API_PATH_EMPLOYMENTS, (req, res) => {
    console.log(Date() + " - DELETE /employments-by-status");
    employments = [];
    res.sendStatus(200);
});


app.delete(BASE_API_PATH_EMPLOYMENTS + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - DELETE /employments-by-status/" + country);

    employments = employments.filter((c) => {
        return (c.country != country);
    });

    res.sendStatus(200);
});

app.delete(BASE_API_PATH_EMPLOYMENTS + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - DELETE /employments-by-status/" + year);

    employments = employments.filter((c) => {
        return (c.year != year);
    });

    res.sendStatus(200);
});

app.delete(BASE_API_PATH_EMPLOYMENTS + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    
    console.log(Date() + " - DELETE /employments-by-status/" + country + "/" + year);

    employments = employments.filter((c) => {
        return (c.country != country && c.year != year );
    });

    res.sendStatus(200);
});

//POST 

app.post(BASE_API_PATH_EMPLOYMENTS , (req, res) => {
    console.log(Date() + " - POST /employments-by-status");
    var employment = req.body;
    employments.push(employment);
    res.sendStatus(201);
});

app.post(BASE_API_PATH_EMPLOYMENTS + "/:country", (req, res) => {
    var country = req.params.country;
    console.log(Date() + " - POST /employments-by-status/" + country);
    res.sendStatus(405);
});

app.post(BASE_API_PATH_EMPLOYMENTS + "/:year", (req, res) => {
    var year = req.params.year;
    console.log(Date() + " - POST /employments-by-status/" + year);
    res.sendStatus(405);
});

app.post(BASE_API_PATH_EMPLOYMENTS + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    console.log(Date() + " - POST /employments-by-status/" + country + "/" + year);
    res.sendStatus(405);
});

//PUT 

app.put(BASE_API_PATH_EMPLOYMENTS, (req, res) => {
    console.log(Date() + " - PUT /employments-by-status");
    res.sendStatus(405);
});

app.put(BASE_API_PATH_EMPLOYMENTS + "/:country", (req, res) => {
    var country = req.params.country;
    var employment = req.body;
    
    console.log(Date() + " - PUT /employments-by-status/"+ country);
    
    res.sendStatus(405);
});

app.put(BASE_API_PATH_EMPLOYMENTS + "/:year", (req, res) => {
    var year = req.params.year;
    var employment = req.body;
    
    console.log(Date() + " - PUT /employments-by-status/"+ year);
    
    res.sendStatus(405);
});


app.put(BASE_API_PATH_EMPLOYMENTS + "/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    var employment = req.body;

    console.log(Date() + " - PUT /employments-by-status/" +  + country + "/" + year);

    if (country != employment.country) {
        res.sendStatus(409);
        console.warn(Date() + " - Hacking attempt!");
        return 1;
    }

    employments = employments.map((c) => {
        if (c.country == employment.country && c.year == employment.year)
            return employment;
        else
            return c;
    });

    res.sendStatus(200);
});


app.get(BASE_API_PATH_EMPLOYMENTS + "/loadInitialData/", (req, res) => {
   
    if(employments.length==0){
        employments.push(employments1); 
    }
     res.sendStatus(200);
});

app.get(BASE_API_PATH_UNEMPLOYMENTS + "/loadInitialData/", (req, res) => {
   
    if(unemployments.length==0){
        unemployments.push(unemployments1); 
    }
     res.sendStatus(200);
});

app.listen(port, () => {
    console.log("Server ready on port: " + port + "!")
}).on("error", (e) => {
    console.log("Server NOT READY:" + e)
});

console.log("Server setting up...")