const rawMaterialModel = require("../models/rawMaterialModel");

// Add Raw Material
const addRawMaterial = async (req, res) => {
    try {
        const { name, description, price, color, type, length } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        const getFileUrl = (item) => {
            if (item.path && (item.path.startsWith('http:') || item.path.startsWith('https:'))) {
                return item.path;
            }
            let protocol = req.protocol;
            if (req.get('host').includes('onrender.com')) {
                protocol = 'https';
            }
            return `${protocol}://${req.get('host')}/uploads/${item.filename}`;
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                return getFileUrl(item);
            })
        )

        const rawMaterialData = {
            name,
            description,
            price: Number(price),
            color,
            type,
            length: length || "",
            image: imagesUrl,
        }

        const rawMaterial = new rawMaterialModel(rawMaterialData);
        await rawMaterial.save();

        res.json({ success: true, message: "Raw Material Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List Raw Materials
const listRawMaterials = async (req, res) => {
    try {
        const rawMaterials = await rawMaterialModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, rawMaterials });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Single Raw Material Info
const singleRawMaterial = async (req, res) => {
    try {
        const { id } = req.body;
        const rawMaterial = await rawMaterialModel.findById(id);
        res.json({ success: true, rawMaterial });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Raw Material
const updateRawMaterial = async (req, res) => {
    try {
        const { id, name, description, price, color, type, length } = req.body;

        const rawMaterial = await rawMaterialModel.findById(id);
        if (!rawMaterial) {
            return res.json({ success: false, message: "Raw Material not found" });
        }

        let updatedImages = [...rawMaterial.image];

        const getUrl = (file) => {
            if (file.path && (file.path.startsWith('http:') || file.path.startsWith('https:'))) {
                return file.path;
            }
            let protocol = req.protocol;
            if (req.get('host').includes('onrender.com')) {
                protocol = 'https';
            }
            return `${protocol}://${req.get('host')}/uploads/${file.filename}`;
        }

        if (req.body.deletedIndices) {
            const deleted = JSON.parse(req.body.deletedIndices);
            deleted.forEach(index => {
                if (index >= 0 && index < updatedImages.length) {
                    updatedImages[index] = null;
                }
            });
        }

        if (req.files.image1) updatedImages[0] = getUrl(req.files.image1[0]);
        if (req.files.image2) updatedImages[1] = getUrl(req.files.image2[0]);
        if (req.files.image3) updatedImages[2] = getUrl(req.files.image3[0]);
        if (req.files.image4) updatedImages[3] = getUrl(req.files.image4[0]);

        updatedImages = updatedImages.filter(item => item);

        rawMaterial.name = name;
        rawMaterial.description = description;
        rawMaterial.price = Number(price);
        rawMaterial.color = color;
        rawMaterial.type = type;
        rawMaterial.length = length || "";
        rawMaterial.image = updatedImages;

        await rawMaterial.save();
        res.json({ success: true, message: "Raw Material Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove Raw Material
const removeRawMaterial = async (req, res) => {
    try {
        await rawMaterialModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Raw Material Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { addRawMaterial, listRawMaterials, removeRawMaterial, singleRawMaterial, updateRawMaterial };
