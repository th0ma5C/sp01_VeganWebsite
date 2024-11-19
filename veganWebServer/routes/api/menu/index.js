const express = require('express');
const router = express.Router();
const MenuModel = require('@models/MenuModel');

// let getSaladList = async () => {
//     try {
//         const result = await MenuModel.find({ name: "salad" });
//         if (result.length === 0) return [];
//         return result[0].items;
//     } catch (err) {
//         console.error('Error fetching salad list:', err);
//         throw err;
//     }
// }

let getMenuList = async (name) => {
    try {
        const result = await MenuModel.find({ name });
        // console.log(result);

        return result[0].items

    } catch (err) {
        console.error('Error fetching salad list:', err);
        throw err;
    }
}


async function findSalad(sortField, category) {
    try {
        let data = await getMenuList(category);
        data.sort((a, b) => {
            return new Date(b[sortField]) - new Date(a[sortField])
        });

        const extension = category == 'salad' ? '.png' : '.jpg';
        const path = `/api/images/menu/${category}/`

        // if (category == 'salad') {
        //     data.forEach((item) => {
        //         item.fileName = `/api/images/menu/${category}/${item.fileName}.png`
        //     })
        // } else {
        //     data.forEach((item) => {
        //         item.fileName = `/api/images/menu/${category}/${item.fileName}.jpg`
        //     })
        // }
        data.forEach((item) => {
            item.fileName = `${path}${item.fileName}${extension}`
        })

        // console.log(data);

        let list = data.slice(0, 5);

        return list
    } catch (error) {
        console.log(findSalad.name, error);
    }
}

/* GET home new catalog */
router.get('/newCatalog', async (req, res) => {
    try {
        const { name } = req.query;
        let data = await findSalad('date', name);
        return res.json(data);

    } catch (error) {
        console.log(error);
    }
});
/* GET home hot catalog */
router.get('/hotCatalog', async (req, res) => {
    try {
        const { name } = req.query;
        let data = await findSalad('rating', name);
        return res.json(data);

    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
