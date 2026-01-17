import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = "Aalaboo - Premium Handcrafted Crochet Fashion";
    const defaultDescription = "Discover Aalaboo's exquisite collection of handcrafted crochet wearables and accessories. Elevate your style with our sustainable, artisanal designs made with love.";
    const defaultKeywords = "crochet, handmade, fashion, sustainable fashion, artisanal, crochet wear, luxury crochet, handcrafted, Aalaboo";
    const defaultImage = "https://aalaboo.onrender.com/og-image.png"; // Replace with actual default OG image if available
    const siteUrl = "https://aalaboo.onrender.com";

    const fullTitle = title ? `${title} | Aalaboo` : siteTitle;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <link rel="canonical" href={url || siteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:site_name" content="Aalaboo" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
};

export default SEO;
