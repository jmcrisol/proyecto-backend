import productsModel from "../dao/models/products.model.js";

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);

        let aggregateOptions = [];

        // Manejar la búsqueda por categoría o disponibilidad
        if (query) {
            let matchQuery;
            if (query.toLowerCase() === 'disponible') {
                matchQuery = { stock: { $gt: 0 } };
            } else if (query.toLowerCase() === 'nodisponible') {
                matchQuery = { stock: 0 };
            } else {
                matchQuery = { category: query };
            }

            aggregateOptions.push({
                $match: matchQuery,
            });
        }

        // Agregar la lógica para sort en la agregación
        if (sort) {
            const sortOrder = sort === 'desc' ? -1 : 1;
            aggregateOptions.push({
                $sort: { price: sortOrder },
            });
        }

        // Agregar la lógica para paginación en la agregación
        aggregateOptions.push({
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [
                    { $skip: (pageInt - 1) * limitInt },
                    { $limit: limitInt },
                ],
            },
        });

        // Ejecutar la agregación
        const result = await productsModel.aggregate(aggregateOptions);

        const metadata = result[0].metadata[0];
        const productList = result[0].data;

        // Definir la información de paginación
        const paginationInfo = {
            totalPages: Math.ceil(metadata.total / limitInt),
            prevPage: pageInt > 1 ? pageInt - 1 : null,
            nextPage: pageInt < Math.ceil(metadata.total / limitInt) ? pageInt + 1 : null,
            page: pageInt,
            hasPrevPage: pageInt > 1,
            hasNextPage: pageInt < Math.ceil(metadata.total / limitInt),
            prevLink: pageInt > 1 ? `${req.baseUrl}?page=${pageInt - 1}&limit=${limitInt}` : null,
            nextLink: pageInt < Math.ceil(metadata.total / limitInt) ? `${req.baseUrl}?page=${pageInt + 1}&limit=${limitInt}` : null,
        };

        res.json({
                status: 'success',
                payload: productList,
                pagination: paginationInfo,
            });

        

  

    } catch (error) {
        console.log('Error fetching data from MongoDB:', error);
        res.status(500).send({ status: 'error', error: error.message });
    }
};

export const getListProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);

        let aggregateOptions = [];

        // Manejar la búsqueda por categoría o disponibilidad
        if (query) {
            let matchQuery;
            if (query.toLowerCase() === 'disponible') {
                matchQuery = { stock: { $gt: 0 } };
            } else if (query.toLowerCase() === 'nodisponible') {
                matchQuery = { stock: 0 };
            } else {
                matchQuery = { category: query };
            }

            aggregateOptions.push({
                $match: matchQuery,
            });
        }

        // Agregar la lógica para sort en la agregación
        if (sort) {
            const sortOrder = sort === 'desc' ? -1 : 1;
            aggregateOptions.push({
                $sort: { price: sortOrder },
            });
        }

        // Agregar la lógica para paginación en la agregación
        aggregateOptions.push({
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [
                    { $skip: (pageInt - 1) * limitInt },
                    { $limit: limitInt },
                ],
            },
        });

        // Ejecutar la agregación
        const result = await productsModel.aggregate(aggregateOptions);

        const metadata = result[0].metadata[0];
        const productList = result[0].data;

        // Definir la información de paginación
        const paginationInfo = {
            totalPages: Math.ceil(metadata.total / limitInt),
            prevPage: pageInt > 1 ? pageInt - 1 : null,
            nextPage: pageInt < Math.ceil(metadata.total / limitInt) ? pageInt + 1 : null,
            page: pageInt,
            hasPrevPage: pageInt > 1,
            hasNextPage: pageInt < Math.ceil(metadata.total / limitInt),
            prevLink: pageInt > 1 ? `${req.baseUrl}?page=${pageInt - 1}&limit=${limitInt}` : null,
            nextLink: pageInt < Math.ceil(metadata.total / limitInt) ? `${req.baseUrl}?page=${pageInt + 1}&limit=${limitInt}` : null,
        };

        res.render('layouts/products', {
            products: productList,
            pagination: paginationInfo
        });

        

  

    } catch (error) {
        console.log('Error fetching data from MongoDB:', error);
        res.status(500).send({ status: 'error', error: error.message });
    }
};


export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid; // Obtén el ID del parámetro de la ruta

        // Busca el producto por su ID
        const product = await productsModel.findById(productId);

        // Verifica si el producto existe
        if (!product) {
            return res.status(404).send({ result: "error", message: "Producto no encontrado" });
        }

        res.send({ result: "success", payload: product });
    } catch (error) {
        console.log("Error fetching data from MongoDB:", error);
        res.status(500).send({ result: "error", error: error.message });
    }
};

export const newProduct = async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la solicitud
        const { title, description, price, thumbnail, code, stock, status, category, thumbnails } = req.body;

        // Crea una nueva instancia del modelo de productos con los datos proporcionados
        const newProduct = new productsModel({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
            thumbnails,
        });

        // Guarda el nuevo producto en la base de datos
        const savedProduct = await newProduct.save();

        res.status(201).send({ result: "success", payload: savedProduct });
    } catch (error) {
        console.log("Error saving new product to MongoDB:", error);
        res.status(500).send({ result: "error", error: error.message });
    }

};

export const modPrductById = async (req, res) => {
    try {
        const productId = req.params.pid; // Obtén el ID del parámetro de la ruta
        const updateFields = req.body; // Obtén los campos a actualizar del cuerpo de la solicitud

        // Verifica si el producto con el ID proporcionado existe
        const existingProduct = await productsModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).send({ result: "error", message: "Producto no encontrado" });
        }

        // Actualiza los campos del producto y guarda los cambios
        Object.assign(existingProduct, updateFields);
        const updatedProduct = await existingProduct.save();

        res.send({ result: "success", payload: updatedProduct });
    } catch (error) {
        console.log("Error updating product in MongoDB:", error);
        res.status(500).send({ result: "error", error: error.message });
    }
};

export const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.pid; // Obtén el ID del parámetro de la ruta

        // Elimina el producto de la base de datos
        const deletionResult = await productsModel.deleteOne({ _id: productId });

        // Verifica si el producto con el ID proporcionado existe
        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ result: "error", message: "Producto no encontrado" });
        }

        res.send({ result: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.log("Error deleting product from MongoDB:", error);
        res.status(500).send({ result: "error", error: error.message });
    }
};