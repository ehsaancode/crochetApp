const axios = require('axios');
const FormData = require('form-data');

async function testUpdate() {
    try {
        // 1. Get a product to update
        const listRes = await axios.get('http://localhost:4000/api/product/list');
        const product = listRes.data.products[0];
        console.log("Updating Product:", product._id, product.name);

        // 2. Prepare update data
        const form = new FormData();
        form.append('productId', product._id);
        form.append('name', product.name);
        form.append('description', product.description);
        form.append('price', product.price);
        form.append('category', product.category);
        form.append('sizes', JSON.stringify(["S", "M"]));
        // New features
        form.append('sizePrices', JSON.stringify({ "S": 1234, "M": 5678 }));
        form.append('defaultSize', "S");
        form.append('bestseller', "true");

        // 3. Send Update
        const updateRes = await axios.post('http://localhost:4000/api/product/update', form, {
            headers: {
                ...form.getHeaders(),
                token: "dummy_token_if_needed" // The controller currently doesn't seem to check token for update logic strictly in the code I viewed, but route might. 
                // Wait, verify auth middleware in route.
            }
        });
        console.log("Update Response:", updateRes.data);

        // 4. Verify Update
        const verifyRes = await axios.post('http://localhost:4000/api/product/single', { productId: product._id });
        const updatedProduct = verifyRes.data.product;
        console.log("Updated Product sizePrices:", updatedProduct.sizePrices);
        console.log("Updated Product defaultSize:", updatedProduct.defaultSize);

    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) console.error("Response:", error.response.data);
    }
}

testUpdate();
