import imgDress from '../assets/images/crochet_maxi_dress.png';
import imgTop from '../assets/images/crochet_lace_top.png';
import imgBag from '../assets/images/crochet_tote_bag.png';
import imgCardigan from '../assets/images/crochet_cardigan.png';
import imgHat from '../assets/images/crochet_sun_hat.png';

export const products = [
    // {
    //     id: 1,
    //     name: "Boho Maxi Dress",
    //     price: 245.00,
    //     tag: "Best Seller",
    //     type: "Dress",
    //     rating: 5,
    //     img: imgDress,
    //     images: [imgDress, imgTop, imgCardigan],
    //     description: "Handcrafted from premium cotton blend yarn, this Boho Maxi Dress features intricate lace patterns that cascade elegantly to the floor. Perfect for beach weddings or summer soirées, its breathable open-work design ensures comfort while making a stunning statement. The adjustable straps and elasticized back provide a custom fit for all body types."
    // },
    {
        id: 2,
        name: "Lace Crop Top",
        price: 85.00,
        tag: "New",
        type: "Top",
        rating: 4,
        img: imgTop,
        images: [imgTop, imgDress, imgBag],
        description: "Delicate and feminine, our Lace Crop Top is a versatile addition to your wardrobe. Woven with soft, silk-infused yarn, it features a vintage-inspired floral motif. Pair it with high-waisted jeans for a casual look or a flowing skirt for a romantic vibe."
    },
    {
        id: 3,
        name: "Woven Tote Bag",
        price: 120.00,
        type: "Accessory",
        rating: 5,
        img: imgBag,
        images: [imgBag, imgHat, imgCardigan],
        description: "Carry your essentials in style with this durable Woven Tote Bag. Hand-crocheted using sturdy natural fibers, it offers ample space and a comfortable shoulder strap. The neutral beige tones make it the perfect accessory for any outfit, from market runs to beach days."
    },
    {
        id: 4,
        name: "Summer Cardigan",
        price: 150.00,
        type: "Top",
        rating: 4,
        img: imgCardigan,
        images: [imgCardigan, imgTop, imgDress],
        description: "Lightweight and airy, this Summer Cardigan is designed for those breezy evenings. The open-weave stitch allows for breathability, while the relaxed fit ensures effortless layering. Made with a luxurious silk blend, it adds a touch of elegance to any ensemble."
    },
    {
        id: 5,
        name: "Beach Coverup",
        price: 95.00,
        type: "Dress",
        rating: 5,
        img: imgDress,
        images: [imgDress, imgHat, imgBag],
        description: "Transition seamlessly from the waves to the boardwalk with our chic Beach Coverup. Its loose, flowing silhouette and quick-drying yarn make it a vacation essential. The intricate geometric patterns add a modern twist to classic crochet."
    },
    {
        id: 6,
        name: "Sun Hat",
        price: 45.00,
        type: "Accessory",
        rating: 3,
        img: imgHat,
        images: [imgHat, imgBag, imgTop],
        description: "Protect yourself from the sun in style with our wide-brimmed Sun Hat. Crafted from flexible raffia yarn, it holds its shape while being packable for travel. The elegant ribbon detail adds a sophisticated finishing touch."
    },
    {
        id: 7,
        name: "Floral Shawl",
        price: 110.00,
        type: "Accessory",
        rating: 5,
        img: imgCardigan,
        images: [imgCardigan, imgDress, imgTop],
        description: "Wrap yourself in luxury with this exquisite Floral Shawl. Each flower is individually crocheted and joined to create a stunning masterpiece. Soft, warm, and incredibly detailed, it's an heirloom-quality piece to cherish for years."
    },
    {
        id: 8,
        name: "Market Net Bag",
        price: 35.00,
        type: "Accessory",
        rating: 4,
        img: imgBag,
        images: [imgBag, imgHat, imgTop],
        description: "Eco-friendly and stylish, our Market Net Bag is the perfect alternative to plastic. It expands to hold all your groceries and produce, yet folds up small enough to fit in your pocket. Strong, washable, and available in a variety of earth tones."
    },
    {
        id: 9,
        name: "Crochet Bikini Set",
        price: 130.00,
        tag: "Trending",
        type: "Set",
        rating: 5,
        img: imgTop,
        images: [imgTop, imgHat, imgDress],
        description: "Make a splash with our boho-chic Crochet Bikini Set. Lined for comfort and coverage, it features adjustable ties for the perfect fit. The water-resistant yarn ensures it stays beautiful swim after swim."
    },
    {
        id: 10,
        name: "Granny Square Vest",
        price: 85.00,
        type: "Top",
        rating: 4,
        img: imgTop,
        images: [imgTop, imgCardigan, imgBag],
        description: "Channel retro vibes with this colorful Granny Square Vest. A modern take on a classic 70s style, it features a cropped fit and vibrant color combinations. Perfect for layering over dresses or pairing with high-waisted denim."
    },
    {
        id: 11,
        name: "Fringed Poncho",
        price: 160.00,
        type: "Top",
        rating: 5,
        img: imgDress,
        images: [imgDress, imgCardigan, imgHat],
        description: "Stay cozy and stylish with our Fringed Poncho. The heavy-weight yarn provides warmth, while the dramatic fringe adds movement and flair. An ideal outer layer for crisp autumn days."
    },
    {
        id: 12,
        name: "Handmade Clutch",
        price: 65.00,
        type: "Accessory",
        rating: 4,
        img: imgBag,
        images: [imgBag, imgDress, imgTop],
        description: "Elegant and understated, this Handmade Clutch is the perfect evening companion. It features a secure magnetic closure and a lined interior to keep your valuables safe. The textured stitch work adds a sophisticated touch."
    },
    {
        id: 13,
        name: "Lace Tunic",
        price: 140.00,
        type: "Dress",
        rating: 5,
        img: imgDress,
        images: [imgDress, imgTop, imgCardigan],
        description: "Effortlessly chic, this Lace Tunic can be worn as a mini dress or over leggings. The bell sleeves and scalloped hemline enhance its romantic appeal. Crafted from soft, breathable cotton for all-day comfort."
    },
    {
        id: 14,
        name: "Baby Blanket",
        price: 75.00,
        type: "Accessory",
        rating: 5,
        img: imgCardigan,
        images: [imgCardigan, imgHat, imgBag],
        description: "Wrap your little one in love with our heirloom-quality Baby Blanket. Made from the softest hypoallergenic yarn, it's gentle on delicate skin. The classic shell stitch design makes it a timeless gift for new parents."
    },
    {
        id: 15,
        name: "Coaster Set",
        price: 25.00,
        type: "Accessory",
        rating: 4,
        img: imgBag,
        images: [imgBag, imgTop, imgHat],
        description: "Protect your surfaces in style with this set of 4 hand-crocheted coasters. Made from absorbent cotton, they feature a beautiful mandala design. A lovely housewarming gift or a treat for your own home."
    },
    {
        id: 16,
        name: "Winter Scarf",
        price: 55.00,
        type: "Accessory",
        rating: 5,
        img: imgCardigan,
        images: [imgCardigan, imgDress, imgHat],
        description: "Beat the chill with our chunky Winter Scarf. The oversized length allows for multiple styling options, while the premium wool blend keeps you toasty warm. Available in a range of rich, seasonal colors."
    },
    {
        id: 17,
        name: "Beanie Hat",
        price: 40.00,
        type: "Accessory",
        rating: 4,
        img: imgHat,
        images: [imgHat, imgCardigan, imgTop],
        description: "Complete your winter look with our cozy Beanie Hat. It features a classic ribbed brim and a slouchy fit for a relaxed style. The faux fur pom-pom adds a playful element to this cold-weather staple."
    },
    {
        id: 18,
        name: "Crochet Earrings",
        price: 20.00,
        type: "Accessory",
        rating: 3,
        img: imgBag,
        images: [imgBag, imgDress, imgTop],
        description: "Add a pop of color to your outfit with these lightweight Crochet Earrings. Stiffened to hold their shape, they feature delicate micro-crochet work. Surgical steel hooks ensure they are safe for sensitive ears."
    },
    {
        id: 19,
        name: "Table Runner",
        price: 90.00,
        type: "Accessory",
        rating: 5,
        img: imgDress,
        images: [imgDress, imgCardigan, imgBag],
        description: "Elevate your dining experience with this exquisite Table Runner. The intricate pineapple lace pattern creates a stunning focal point for your table. Perfect for special occasions or everyday elegance."
    },
    {
        id: 20,
        name: "Wall Hanging",
        price: 110.00,
        type: "Accessory",
        rating: 5,
        img: imgBag,
        images: [imgBag, imgHat, imgTop],
        description: "Add texture and warmth to your walls with this bohemian Wall Hanging. Mounted on a natural driftwood branch, it features a mix of macramé and crochet techniques. A beautiful statement piece for any room."
    },
    {
        id: 21,
        name: "Vintage Doily",
        price: 30.00,
        type: "Accessory",
        rating: 4,
        img: imgCardigan,
        images: [imgCardigan, imgDress, imgHat],
        description: "Bring a touch of nostalgia to your home with this delicate Vintage Doily. Hand-crocheted with fine thread, it showcases exceptional craftsmanship. Use it under a vase, candle, or simply display it as a work of art."
    },
    {
        id: 22,
        name: "Headband",
        price: 18.00,
        type: "Accessory",
        rating: 4,
        img: imgHat,
        images: [imgHat, imgTop, imgBag],
        description: "Keep your hair in place with our cute and comfortable Headband. The twist detail adds a modern touch, while the soft yarn ensures no headaches. Perfect for bad hair days or adding a finishing touch to your look."
    },
];
