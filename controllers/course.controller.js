const db = require('../models/index.model')
require('dotenv').config
const jsonwebtoken = require('jsonwebtoken')
const Course = db.Course
const Module = db.Module
const Session = db.Session

exports.createCourse = async (req, res) => {
    const {
        title,
        description,
        isVisible,
        isChargeable } = req.body

    const token = req.headers.logintoken

    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const user_id = decode.id

    try {
        courseCreated = await Course.create({
            title: title,
            description: description,
            isVisible: isVisible,
            isChargeable: isChargeable,
            user_id: user_id,
            created_by:user_id,
        })

        res.status(201).json(courseCreated)

    } catch (e) {
        res.status(400).send(e)
    }

}


exports.updateCourse = async (req, res) => {
    const {
        title,
        description,
        isVisible,
        isChargeable } = req.body

    const courseId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const user_id = decode.id

    try {
        courseUpdate = await Course.update({
            title: title,
            description: description,
            isVisible: isVisible,
            isChargeable: isChargeable,
            user_id: user_id,
            updated_by: user_id,
        }, { where: { id: courseId } })

        const updatedCourse = await Course.findOne({ where: { id: courseId } })
        res.status(201).json(updatedCourse)

    } catch (e) {
        res.status(400).send(e)
    }
}


exports.deleteCourse = async (req, res) => {
    const courseId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const deleted_by = decode.id
    

    try {
        findCourse = await Course.findOne({ where: { id: courseId } })
        if (findCourse) {
            const isDeleted = await Course.update({ is_deleted: true, deleted_by: deleted_by }, { where: { id: courseId } })
            const courseDeleted = await Course.findOne({ where: { id: courseId } })

            const moduleDelete = await Module.update({ is_deleted: true, deleted_by: deleted_by }, { where: { course_id: courseId } })
            const findModuleDeleted = await Module.findOne({ where: { course_id: courseId } })

            const moduleDeletedId = findModuleDeleted.id
            // console.log(moduleDeletedId)
            const sessionDeleted = await Session.update({ is_deleted: true, deleted_by: deleted_by }, { where: { module_id: moduleDeletedId } })
            const findSesssionDeleted = await Session.findOne({ where: { module_id: moduleDeletedId } })

            res.status(200).json({
                courseDeleted: courseDeleted,
                moduleDelete: findModuleDeleted,
                sessionDeleted: findSesssionDeleted
            })
        }

        if (!findCourse) {
            res.status(404).json('This course not available')
        }
    }
    catch (e) {
        res.status(400).send(e)
    }

}

