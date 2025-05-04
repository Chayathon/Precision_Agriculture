const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/getFactor/:id/:age', async (req, res) => {
    try {
        const { id, age } = req.params;

        const Factor = await prisma.p_factor.findFirst({
            where: {
                plant_id: Number(id),
                age: {
                    lte: Number(age)
                }
            },
            orderBy: {
                age: 'desc'
            }
        });

        if (!Factor) {
            return res.status(404).json({ message: `No data found for the age ${age} days` });
        }

        res.status(200).json({
            message: 'Get Factor Variables',
            resultData: [Factor],
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getFactorByPlantId/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const Factor = await prisma.p_factor.findMany({
            where: {
                plant_id: Number(id)
            },
            orderBy: {
                age: 'desc'
            }
        });

        if(Factor) {
            res.status(200).json({
                message: 'Get Factor By Plant ID',
                resultData: Factor,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getFactorById/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const Factor = await prisma.p_factor.findFirst({
            where: {
                id: Number(id)
            },
        });

        if(Factor) {
            res.status(200).json({
                message: 'Get Factor By ID',
                resultData: Factor,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/createFactor', async (req, res) => {
    const { age, ph, temperature, humidity, salinity, lightIntensity, plantId } = req.body;

    if (!plantId) {
        return res.status(400).json({ message: "Missing plantId" });
    }

    try {
        const createFactor = await prisma.p_factor.create({
            data: {
                age: Number(age),
                pH: parseFloat(ph),
                temperature: parseFloat(temperature),
                humidity: parseFloat(humidity),
                lightIntensity: parseFloat(lightIntensity),
                salinity: parseFloat(salinity),
                plant_id: plantId,
            }
        });

        if(createFactor) {
            res.status(200).json({
                message: 'Factor created successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.put('/updateFactor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { age, ph, temperature, humidity, salinity, lightIntensity } = req.body;

        const putFactor = await prisma.p_factor.update({
            where: {
                id: Number(id)
            },
            data: {
                age: Number(age),
                pH: parseFloat(ph),
                temperature: parseFloat(temperature),
                humidity: parseFloat(humidity),
                lightIntensity: parseFloat(lightIntensity),
                salinity: parseFloat(salinity),
            },
        });

        if(putFactor) {
            res.status(200).json({
                message: 'Factor updated successfully',
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/deleteFactor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const delFactor = await prisma.p_factor.delete({
            where: {
                id: Number(id),
            },
        });

        if(delFactor) {
            res.status(200).json({
                message: 'Factor deleted successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getNutrient/:id/:age', async (req, res) => {
    try {
        const { id, age } = req.params;

        const Nutrient = await prisma.p_nutrient.findFirst({
            where: {
                plant_id: Number(id),
                age: {
                    lte: Number(age)
                }
            },
            orderBy: {
                age: 'desc'
            }
        });

        if (!Nutrient) {
            return res.status(404).json({ message: `No data found for the age ${age} days` });
        }

        res.status(200).json({
            message: 'Get Nutrient Variables',
            resultData: [Nutrient],
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getNutrientByPlantId/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const Nutrient = await prisma.p_nutrient.findMany({
            where: {
                plant_id: Number(id)
            },
            orderBy: {
                age: 'desc'
            }
        });

        if(Nutrient) {
            res.status(200).json({
                message: 'Get Nutrient By Plant ID',
                resultData: Nutrient,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getNutrientById/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const Nutrient = await prisma.p_nutrient.findFirst({
            where: {
                id: Number(id)
            },
        });

        if(Nutrient) {
            res.status(200).json({
                message: 'Get Nutrient By ID',
                resultData: Nutrient,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/createNutrient', async (req, res) => {
    const { age, nitrogen, phosphorus, potassium, plantId } = req.body;

    if (!plantId) {
        return res.status(400).json({ message: "Missing plantId" });
    }

    try {
        const createNutrient = await prisma.p_nutrient.create({
            data: {
                age: Number(age),
                nitrogen: parseFloat(nitrogen),
                phosphorus: parseFloat(phosphorus),
                potassium: parseFloat(potassium),
                plant_id: plantId,
            }
        });

        if(createNutrient) {
            res.status(200).json({
                message: 'Nutrient created successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.put('/updateNutrient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { age, nitrogen, phosphorus, potassium } = req.body;

        const putNutrient = await prisma.p_nutrient.update({
            where: {
                id: Number(id)
            },
            data: {
                age: Number(age),
                nitrogen: parseFloat(nitrogen),
                phosphorus: parseFloat(phosphorus),
                potassium: parseFloat(potassium),
            },
        });

        if(putNutrient) {
            res.status(200).json({
                message: 'Nutrient updated successfully',
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/deleteNutrient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const delNutrient = await prisma.p_nutrient.delete({
            where: {
                id: Number(id),
            },
        });

        if(delNutrient) {
            res.status(200).json({
                message: 'Nutrient deleted successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getOtherFactor/:id/:age', async (req, res) => {
    try {
        const { id, age } = req.params;

        const Factor = await prisma.p_other_factor.findFirst({
            where: {
                plant_id: Number(id),
                age: {
                    lte: Number(age)
                }
            },
            orderBy: {
                age: 'desc'
            }
        });

        if (!Factor) {
            return res.status(404).json({ message: `No data found for the age ${age} days` });
        }

        res.status(200).json({
            message: 'Get Factor Variables',
            resultData: [Factor],
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getOtherFactorByPlantId/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const Factor = await prisma.p_other_factor.findMany({
            where: {
                plant_id: Number(id)
            },
            orderBy: {
                age: 'desc'
            }
        });

        if(Factor) {
            res.status(200).json({
                message: 'Get Factor By Plant ID',
                resultData: Factor,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getOtherFactorById/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const Factor = await prisma.p_other_factor.findFirst({
            where: {
                id: Number(id)
            },
        });

        if(Factor) {
            res.status(200).json({
                message: 'Get Factor By ID',
                resultData: Factor,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/createOtherFactor', async (req, res) => {

    const { age, ph, temperature, humidity, salinity, lightIntensity, plantId } = req.body;

    if (!plantId) {
        return res.status(400).json({ message: "Missing plantId" });
    }

    try {
        const createOtherFactor = await prisma.p_other_factor.create({
            data: {
                age: Number(age),
                pH: parseFloat(ph),
                temperature: parseFloat(temperature),
                humidity: parseFloat(humidity),
                lightIntensity: parseFloat(lightIntensity),
                salinity: parseFloat(salinity),
                plant_id: plantId,
            }
        });

        if(createOtherFactor) {
            res.status(200).json({
                message: 'Factor created successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.put('/updateOtherFactor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { age, ph, temperature, humidity, salinity, lightIntensity } = req.body;

        const putOtherFactor = await prisma.p_other_factor.update({
            where: {
                id: Number(id)
            },
            data: {
                age: Number(age),
                pH: parseFloat(ph),
                temperature: parseFloat(temperature),
                humidity: parseFloat(humidity),
                lightIntensity: parseFloat(lightIntensity),
                salinity: parseFloat(salinity),
            },
        });

        if(putOtherFactor) {
            res.status(200).json({
                message: 'Factor updated successfully',
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/deleteOtherFactor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const delOtherFactor = await prisma.p_other_factor.delete({
            where: {
                id: Number(id),
            },
        });

        if(delOtherFactor) {
            res.status(200).json({
                message: 'Factor deleted successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getOtherNutrient/:id/:age', async (req, res) => {
    try {
        const { id, age } = req.params;

        const Nutrient = await prisma.p_other_nutrient.findFirst({
            where: {
                plant_id: Number(id),
                age: {
                    lte: Number(age)
                }
            },
            orderBy: {
                age: 'desc'
            }
        });

        if (!Nutrient) {
            return res.status(404).json({ message: `No data found for the age ${age} days` });
        }

        res.status(200).json({
            message: 'Get Nutrient Variables',
            resultData: [Nutrient],
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getOtherNutrientByPlantId/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const Nutrient = await prisma.p_other_nutrient.findMany({
            where: {
                plant_id: Number(id)
            },
            orderBy: {
                age: 'desc'
            }
        });

        if(Nutrient) {
            res.status(200).json({
                message: 'Get Nutrient By Plant ID',
                resultData: Nutrient,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/getOtherNutrientById/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const Nutrient = await prisma.p_other_nutrient.findFirst({
            where: {
                id: Number(id)
            },
        });

        if(Nutrient) {
            res.status(200).json({
                message: 'Get Nutrient By ID',
                resultData: Nutrient,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/createOtherNutrient', async (req, res) => {

    const { age, nitrogen, phosphorus, potassium, plantId } = req.body;

    if (!plantId) {
        return res.status(400).json({ message: "Missing plantId" });
    }

    try {
        const createOtherNutrient = await prisma.p_other_nutrient.create({
            data: {
                age: Number(age),
                nitrogen: parseFloat(nitrogen),
                phosphorus: parseFloat(phosphorus),
                potassium: parseFloat(potassium),
                plant_id: plantId,
            }
        });

        if(createOtherNutrient) {
            res.status(200).json({
                message: 'Nutrient created successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.put('/updateOtherNutrient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { age, nitrogen, phosphorus, potassium } = req.body;

        const putOtherNutrient = await prisma.p_other_nutrient.update({
            where: {
                id: Number(id)
            },
            data: {
                age: Number(age),
                nitrogen: parseFloat(nitrogen),
                phosphorus: parseFloat(phosphorus),
                potassium: parseFloat(potassium),
            },
        });

        if(putOtherNutrient) {
            res.status(200).json({
                message: 'Nutrient updated successfully',
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/deleteOtherNutrient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const delOtherNutrient = await prisma.p_other_nutrient.delete({
            where: {
                id: Number(id),
            },
        });

        if(delOtherNutrient) {
            res.status(200).json({
                message: 'Nutrient deleted successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;