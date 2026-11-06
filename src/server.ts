import start from "./index.html"
import home from "./home.html"
import { db } from "./db.ts"

const loggedUsers: any = {}

const srv = Bun.serve({
    port: 3000,
    routes: {

        "/": start,

        "/home": home,

        "/login": {
            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`SELECT * FROM users WHERE email=:email LIMIT 1`)
                const data: any = query.get({ ":email": body.email })
                if (!data)
                    return Response.json({ msg: "usuário não encontrado" }, { status: 404 })
                const hash = data.password_hash
                const isMatch = await Bun.password.verify(body.password, hash)
                if (!isMatch)
                    return Response.json({ msg: "senha incorreta" }, { status: 401 })
                const uuid = crypto.randomUUID()
                delete data.password_hash
                loggedUsers[uuid] = data
                req.cookies.set("ses", uuid)
                return Response.json(isMatch)
            }
        },

        "/logout": {
            GET: (req) => {
                const ses = req.cookies.get("ses") as string
                delete loggedUsers[ses]
                req.cookies.delete("ses")
                return Response.json(null, { status: 204 })
            }
        },

        "/login/user": (req) => {
            const ses = req.cookies.get("ses") as string
            const data = loggedUsers[ses]
            if (!ses || !data)
                return Response.json({ msg: "usuário não esta logado" }, { status: 401 })
            return Response.json(data)
        },

        "/user": {
            GET: () => {
                const query = db.query(`SELECT * FROM users`)
                const data = query.all()
                return Response.json(data)
            },

            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`INSERT INTO users VALUES(null, :username, :email, :password_hash)`)
                const hash = await Bun.password.hash(body.password)
                const dbResp = query.run({
                    ':username': body.username,
                    ':email': body.email,
                    ':password_hash': hash
                })
                return Response.json({
                    "message": "Usuário cadastrado com sucesso!",
                    dbResp
                })

            },
        },

        "/user/:id": {

            GET: (req) => {
                const id = req.params.id
                const query = db.query(`SELECT * FROM users WHERE id=:id`)
                const data = query.get({ ':id': id })
                return Response.json(data)
            },

            PUT: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`UPDATE users SET username = :username, email = :email, password_hash = :password WHERE id = :id`)
                const dbResp = query.run({
                    ':username': body.username,
                    ':email': body.email,
                    ':password': body.password,
                    ':id': req.params.id
                })
                return Response.json(dbResp)
            },

            DELETE: (req) => {
                const query = db.query(`DELETE FROM users WHERE id=:id`)
                const data = query.run({ ':id': req.params.id })
                return Response.json(data)
            },
        },

        "/plano": {
            GET: () => {
                const query = db.query(`SELECT * FROM plano`)
                const data = query.all()
                if (!data) {
                    return Response.json({ msg: "usuário não cadastrado" }, { status: 404 })

                }
                return Response.json(data)
            },

            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`
                    INSERT INTO plano(quanthoras, dias)
                    VALUES(:quanthoras, :dias)
                `)
                const dbResp = query.run({
                    ':quanthoras': body.quanthoras,
                    ':dias': body.dias
                })
                return Response.json({
                    "message": "deu boa!",
                    dbResp
                })
            }
        },

        "/plano/:id": {
            GET: (req) => {
                const id = req.params.id
                const query = db.query(`SELECT * FROM plano WHERE id=:id`)
                const data = query.get({ ':id': id })
                return Response.json(data)
            },

            PUT: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`UPDATE plano SET quanthoras = :quanthoras, dias = :dias WHERE id = :id`)
                const dbResp = query.run({
                    ':quanthoras': body.cargahoraria,
                    ':dias': body.descricao,
                    ':id': req.params.id
                })
                return Response.json(dbResp)

            },

            DELETE: (req) => {
                const query = db.query(`DELETE FROM plano WHERE id=:id`)
                const data = query.run({ ':id': req.params.id })
                return Response.json(data)
            },

        },

        "/tarefa": {
            GET: () => {
                const query = db.query(`SELECT * FROM tarefa`)
                const data = query.all()
                return Response.json(data)
            },

            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`
                    INSERT INTO tarefa(descricao, cargahoraria)
                    VALUES(:descricao, :cargahoraria)
                `)
                const dbResp = query.run({
                    ':descricao': body.descricao,
                    ':cargahoraria': body.cargahoraria
                })
                return Response.json({
                    "message": "Funcionou!",
                    dbResp
                })
            }
        },

        "/tarefa/:id": {
            GET: (req) => {
                const id = req.params.id
                const query = db.query(`SELECT * FROM tarefa WHERE id=:id`)
                const data = query.get({ ':id': id })
                return Response.json(data)
            },

            PUT: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`UPDATE tarefa SET cargahoraria = :cargahoraria, descricao = :descricao WHERE id = :id`)
                const dbResp = query.run({
                    ':cargahoraria': body.cargahoraria,
                    ':descricao': body.descricao,
                    ':id': req.params.id
                })
                return Response.json(dbResp)

            },

            DELETE: (req) => {
                const query = db.query(`DELETE FROM tarefa WHERE id=:id`)
                const data = query.run({ ':id': req.params.id })
                return Response.json(data)
            },

        }
    }
})


console.log(`Servidor em ${srv.url}`)