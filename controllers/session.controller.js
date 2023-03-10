const db = require('../models/index.model')
require('dotenv').config()
const jsonwebtoken = require('jsonwebtoken')

const Session = db.Session

exports.createSession = async (req, res) => {
    const {
        title,
        description,
        module_id,
    } = req.body


    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const user_id = decode.id

    const uploads = req.file.path

    try {
        const sessionCreated = await Session.create({
            title: title,
            description: description,
            module_id: module_id,
            user_id: user_id,
            created_by: user_id,
            uploads: uploads,
        })
        res.status(201).send(sessionCreated)
    }
    catch (e) {
        res.status(400).send(e)
    }

}

exports.updateSession = async (req, res) => {
    const {
        title,
        description,
        module_id,
    } = req.body

    const sessionId = req.params.id
   
    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const user_id = decode.id

    const uploads = req.file.path
 

    try {
        const sessionUpdate = await Session.update({
            title: title,
            description: description,
            module_id: module_id,
            user_id: user_id,
            uploads: uploads,
            updated_by: user_id,
        },{ where: { id: sessionId } })

        const updatedSession = await Session.findOne({ where: { id: sessionId } })
        res.status(201).send(updatedSession)
    }
    catch (e) {
        res.status(400).send(e)
    }
}


exports.deleteSession = async (req, res) => {
    const sessionId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const deleted_by = decode.id
    try {
        const findSession = await Session.findOne({ where: { id: sessionId } })
        if (findSession) {
            const isDeleted = await Session.update({ is_deleted: true, deleted_by: deleted_by }, { where: { id: sessionId } })
            const sessionDeleted = await Session.findOne({ where: { id: sessionId } })
            res.status(201).send(sessionDeleted)
        }

        if (!findSession) {
            res.status(404).json('No session awailable!')
        }
    }
    catch (e) {
        res.status(400).json(e)
    }

}


