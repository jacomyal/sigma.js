# Sigma website

This website is based on [Next.js](https://nextjs.org/), using the same setup as [OuestWare's website](https://www.ouestware.com/en) as described in this [(french) blog post](https://www.ouestware.com/2020/09/22/migrer-de-jekyll-a-nextjs/).

## Development

To run the development version, you can run

    npm install
    npm run dev
    
To get the example pages work properly, you must also have the examples' server running

    cd ../
    npm run examples
    
## Production

To build the website, you can run

    npm install
    npm run build-all
    
The whole website is then available in the `./www` folder.