import Company from '../company/company.model.js'
import Category from '../category/category.model.js'
import { checkUpdate } from '../../utils/validator.js'
import ExcelJS from 'exceljs'

export const add = async (req, res) => {
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        let company = new Company(data)
        await company.save()
        return res.send({ message: 'a new company was created' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'saving error' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updated = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('category')
        if (!updated) return res.status(401).send({ message: 'Product not found and not updated' })
        return res.send({ message: 'Updated product', updated })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'error updating' })
    }
}

export const filterAZ = async (req, res) => {
    try {
        const companies = await Company.find().sort({ name: 1 }); // Orden ascendente por el campo 'name'
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving sorted companies', error: error });
    }
}

export const filterZA = async (req, res) => {
    try {
        const companies = await Company.find().sort({ name: -1 }); // Orden descendente por el campo 'name'
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving sorted companies', error: error });
    }
}

export const filterYears = async (req, res) => {
    try {
        const companies = await Company.find().sort({ yearExp: -1 }); // Orden descendente por el campo 'yearExp'
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving sorted companies by experience', error: error });
    }
}

export const filterImpact = async (req, res) => {
    try {
        const companies = await Company.find().sort({ impact: 1 }); // Orden ascendente por el campo 'impact'
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving sorted companies by impact', error: error });
    }
}

export const generateXLSX = async(req, res)=>{
    try {
        let company = await Company.find().populate('category', ['name', 'description'])

        let excelBook = new ExcelJS.Workbook()
        let sheet = excelBook.addWorksheet('Company')

        sheet.columns =[
            {header: 'Name', key: 'name', width: 20},
            {header: 'Impact', key: 'impact', width: 20},
            {header: 'Year of Experiencde', key: 'yearExp', width: 20},
            {header: 'Category', key: 'category', width: 20},
            {header: 'Description', key: 'description', width: 20},
        ]

        company.forEach(company =>{
            sheet.addRow({
                name: company.name,
                impact: company.impact,
                yearExp: company.yearExp,
                category: company.category.name,
                description: company.category.description
            })
        })

        let filePath = 'company.xlsx'
        await excelBook.xlsx.writeFile(filePath)

        res.attachment(filePath)
        res.send()
    }  catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching companies and generating Excel', err: err });
    }
}
