import { Database } from "bun:sqlite";

const db = new Database("Database.sqlite");

const users = db.query(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE, 
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL

    );
`)

users.run();


const plano = db.query(`
    CREATE TABLE IF NOT EXISTS plano (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quanthoras INTEGER NOT NULL,
        dias INTEGER NOT NULL
    );
`)

plano.run();


const tarefa = db.query(`
    CREATE TABLE IF NOT EXISTS tarefa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        cargahoraria INTEGER NOT NULL
    );
`)

tarefa.run();



export { db }