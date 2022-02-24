const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

const saltRounds = 10;
const app = express();
dotenv.config()

app.use(express.json());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true, parameterLimit: 100000, limit: "500mb"}));

app.use(session({
    key: "userId",
    secret: "ibucanggih",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Number(process.env.EXPIRE)
    }
}));

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const base = process.env.BASE_ROUTE

app.get(`${base}`, (req, res) => {
    db.connect(function(err) {
        if (err) res.send({data: "not connected"});
        res.send({data: "connected"});
      });
    
})

app.post(`${base}/register`, (req, res) => {
    const nama = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const pwconfirm = req.body.pwconfirm;
    const address = req.body.address;
    const wagroup = req.body.wagroup;
    const image = req.body.image;
    
    if (password == pwconfirm) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                res.send({message: err.message});
            }
    
            db.query (
                "INSERT INTO users (name, email, phone, password, role, address, wagroup, image, poin) VALUES (?,?,?,?,?,?,?,?,?)",
                [nama, email, phone, hash, "user", address, wagroup, image, 0],
                (err, result) => {
                    if (result == null) {
                        res.send({message: "Nomor handphone sudah digunakan."});
                    } else {
                        req.session.user = [{id : result.insertId, role: "user"}];
                        res.send(result);
                    }
                }
            );
        })
    } else {
        res.send({message: "Mohon masukkan password dengan benar."})
    }
});

app.post(`${base}/login`, (req, res) => {
    const phone = req.body.phone;
    const password = req.body.password;

    db.query (
        "SELECT * FROM users WHERE phone = ?;",
        phone,
        (err, result) => {
            if (err) {
                res.send({err: err});
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        res.send(result);
                    } else {
                        res.send({message: "Mohon masukkan nomor handphone dan password dengan benar."})
                    }
                })
            } else {
                res.send({message: "Mohon masukkan nomor handphone dengan benar."})
            }
        }
    );
});

app.get(`${base}/login`, (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});
    }
})

app.post(`${base}/profil`, (req, res) => {
    const id = req.body.id;

    db.query (
        "SELECT * FROM users WHERE id = ?;",
        id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.put(`${base}/edit-profil`, (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const wagroup = req.body.wagroup;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            res.send({message: err.message});
        }

        db.query(
            "UPDATE users SET name = ?, phone = ?, address = ?, wagroup = ?, email = ?, password = ? WHERE id = ?",
            [name, phone, address, wagroup, email, hash, id],
            (err, result) => {
                if (err) {
                    res.send({message: err.message});
                } else {
                    res.send(id);
                }
            }
        )
    })
})

app.put(`${base}/edit-profil/half`, (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const wagroup = req.body.wagroup;
    const image = req.body.image;
   
    db.query(
        "UPDATE users SET name = ?, phone = ?, address = ?, wagroup = ?, image = ? WHERE id = ?",
        [name, phone, address, wagroup, image, id],
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(id);
            }
        }
    )
})

app.put(`${base}/edit-profil/email`, (req, res) => {
    const id = req.body.id;
    const email = req.body.email;
    
    db.query(
        "UPDATE users SET email = ? WHERE id = ?",
        [email, id],
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(id);
            }
        }
    )
})

app.put(`${base}/edit-profil/password`, (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    const pwconfirm = req.body.pwconfirm;
    
    if (password == pwconfirm) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                res.send({message: err.message});
            }
    
            db.query (
                "UPDATE users SET password = ? WHERE id = ?",
                [hash, id],
                (err, result) => {
                    res.send(id);
                }
            );
        })
    } else {
        res.send({message: "Mohon masukkan password dengan benar."})
    }
});

app.get(`${base}/get-user`, (req, res) => {
    db.query (
        "SELECT * FROM users",
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.delete(`${base}/delete-user/:id`, (req, res) => {
    const id = req.params.id;

    db.query (
        "DELETE FROM users WHERE id = ?", id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
})

app.get(`${base}/get-wagroup`, (req, res) => {
    db.query (
        "SELECT * FROM wagroups",
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.post(`${base}/add-wagroup`, (req, res) => {
    const nama = req.body.name;
    
    db.query (
        "INSERT INTO wagroups (name) VALUES (?)",
        nama,
        (err, result) => {
            if (result == null) {
                res.send({message: "Nama Grup Whatsapp sudah digunakan."});
            } else {
                res.send(result);
            }
        }
    );
});

app.put(`${base}/edit-wagroup`, (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    
    db.query(
        "UPDATE wagroups SET name = ? WHERE id = ?",
        [name, id],
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(id);
            }
        }
    )
})

app.post(`${base}/get-wagroupid`, (req, res) => {
    const id = req.body.id;
    
    db.query (
        "SELECT * FROM wagroups WHERE id = ?;",
        id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.delete(`${base}/delete-wagroup/:id`, (req, res) => {
    const id = req.params.id;

    db.query (
        "DELETE FROM wagroups WHERE id = ?", id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
})

app.get(`${base}/get-eventtype`, (req, res) => {
    db.query (
        "SELECT * FROM eventtype",
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.get(`${base}/get-eventname`, (req, res) => {
    db.query (
        "SELECT * FROM eventname",
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.post(`${base}/add-eventform`, (req, res) => {
    const user_id = req.body.id;
    const date = req.body.date;
    const month = req.body.month;
    const eventtype = req.body.eventtype;
    const eventname = req.body.eventname;
    const image = req.body.image;

    db.query (
        "INSERT INTO eventform (user_id, date, month, eventtype, eventname, image, review) VALUES (?,?,?,?,?,?,?)",
        [user_id, date, month, eventtype, eventname, image, 99],
        (err, result) => {
            res.send(user_id);
        }
    );
});

app.post(`${base}/add-eventtype`, (req, res) => {
    const nama = req.body.name;
    const image = req.body.image;
    
    db.query (
        "INSERT INTO eventtype (name, image) VALUES (?,?)",
        [nama, image],
        (err, result) => {
            if (result == null) {
                res.send({message: "Nama Tipe Event sudah digunakan."});
            } else {
                res.send(result);
            }
        }
    );
});

app.post(`${base}/event-typeid`, (req, res) => {
    const id = req.body.id;

    db.query (
        "SELECT * FROM eventtype WHERE id = ?;",
        id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.put(`${base}/edit-event-type`, (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const image = req.body.image;

    db.query(
        "UPDATE eventtype SET name = ?, image = ? WHERE id = ?",
        [name, image, id],
        (err, result) => {
            if (result == null) {
                res.send({message: "Nama Tipe Event sudah digunakan."});
            } else {
                res.send(id);
            }
        }
    )
});

app.delete(`${base}/delete-event-type/:id`, (req, res) => {
    const id = req.params.id;

    db.query (
        "DELETE FROM eventtype WHERE id = ?", id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.post(`${base}/add-eventname`, (req, res) => {
    const nama = req.body.name;
    const type = req.body.type;
    const date = req.body.date;
    const month = req.body.month;
    const poin = req.body.poin;
    
    db.query (
        "INSERT INTO eventname (name, type, date, month, poin) VALUES (?,?,?,?,?)",
        [nama, type, date, month, poin],
        (err, result) => {
            res.send(result);
        }
    );
});

app.put(`${base}/edit-event`, (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const type = req.body.type;
    const date = req.body.date;
    const month = req.body.month;
    const poin = req.body.poin;

    db.query(
        "UPDATE eventname SET name = ?, type = ?, date = ?, month = ?, poin = ? WHERE id = ?",
        [name, type, date, month, poin, id],
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(id);
            }
        }
    )
});

app.post(`${base}/get-eventid`, (req, res) => {
    const id = req.body.id;

    db.query (
        "SELECT * FROM eventname WHERE id = ?;",
        id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.delete(`${base}/delete-event/:id`, (req, res) => {
    const id = req.params.id;

    db.query (
        "DELETE FROM eventname WHERE id = ?", id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
})

app.get(`${base}/get-eventform/:id`, (req, res) => {
    const id = req.params.id;

    db.query (
        "SELECT t.image, poin, n.type, n.name, review FROM eventname n, eventform f, eventtype t WHERE n.type = f.eventtype AND t.name = n.type AND n.date = f.date AND n.month = f.month AND f.eventname = n.name AND user_id = ? ORDER BY review DESC",
        id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.get(`${base}/get-eventform`, (req, res) => {
    db.query (
        "SELECT f.id, u.name, user_id, eventtype, f.eventname, f.date, f.month, f.image FROM eventform f, eventname n, users u WHERE u.id = f.user_id AND eventtype = type AND f.eventname = n.name AND f.date = n.date AND f.month = n.month AND review = 99",
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.post(`${base}/get-eventformid`, (req, res) => {
    const id = req.body.id;

    db.query (
        "SELECT u.name, user_id, eventtype, f.eventname, f.date, f.month, f.image, n.poin FROM eventform f, eventname n, users u WHERE u.id = f.user_id AND eventtype = type AND f.eventname = n.name AND f.date = n.date AND f.month = n.month AND review = 99 AND f.id = ?", id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(result);
            }
        }
    )
});

app.put(`${base}/valid-eventform/:id`, (req, res) => {
    const id = req.params.id;

    db.query(
        "UPDATE eventform SET review = 1 WHERE id = ?", id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(id);
            }
        }
    )
});

app.put(`${base}/invalid-eventform/:id`, (req, res) => {
    const id = req.params.id;

    db.query(
        "UPDATE eventform SET review = 0 WHERE id = ?", id,
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(id);
            }
        }
    )
});

app.put(`${base}/edit-user-poin/:id`, (req, res) => {
    const id = req.params.id;
    const poin = req.body.poin;

    db.query(
        "UPDATE users SET poin = poin + ? WHERE id = ?",
        [poin, id],
        (err, result) => {
            if (err) {
                res.send({message: err.message});
            } else {
                res.send(id);
            }
        }
    )
})

app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`));