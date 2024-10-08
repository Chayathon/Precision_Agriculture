const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express')
const router = express.Router()

const authIsCheck = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(400).send(
                'Authorization header missing'
            )
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(400).send('Token missing')
        }

        const keyauth = "lovemymom"

        jwt.verify(token, keyauth, async (err, decode) => {
            if (err) {
                return res.status(400).send('Token expired')
            }
            req.user = decode
            next()
        })
    } catch (err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
}

const isAdmin = async(req, res, next) => {
    try {
        const checkAdmin = await prisma.user.findFirst({
            where : {
                username : req.user.data.username
            }
        })

        const checkRoleAdmin = await prisma.role.findFirst({
            where : {
                id : checkAdmin.role_id
            }
        })

        if(checkRoleAdmin.role_name != "admin") {
            return res.status(400).send("Access denied")
        }
        
        next()
    } catch(err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
}

module.exports = {authIsCheck, isAdmin}