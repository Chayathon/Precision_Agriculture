const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/listRole/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getRole = await prisma.role.findMany({
            where: {
                id: Number(id),
            },
        });

        if (getRole) {
            res.status(200).json({
                message: "Get Role",
                resultData: getRole,
            });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.post('/role', async (req, res) => {
    try {
        const {role_name} = req.body 
        const createRole = await prisma.role.create({
            data: {
                role_name
            }
        })

        if(createRole) {
            res.status(200).json({
                message: 'Role created successfully'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

module.exports = router