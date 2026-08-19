const data = [{
    x: carYears,
    y: carPrices,
    mode: "markers",
    type: "scatter"
}];

const layout = {
    title: "Vehicle Age vs Price",
    xaxis: {
        title: "Year"
    },
    yaxis: {
        title: "Price"
    }
};


const data = [{
    x: carYears,
    y: carPrices,
    mode: "markers",
    type: "scatter"
}];

const layout = {
    title: "Vehicle Age vs Price",
    xaxis: {
        title: "Year"
    },
    yaxis: {
        title: "Price"
    }
};

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }

    });

});


fetch("/api/mileage-price")
    .then(response => response.json())
    .then(data => {

        console.log(data);

        const mileage = data.map(row => row.mileage);
        const price = data.map(row => row.price);

        const chartData = [
            {
                x: mileage,
                y: price,
                mode: "markers",
                type: "scatter"
            }
        ];

        const layout = {
            title: "Mileage vs Car Price",

            xaxis: {
                title: "Mileage"
            },

            yaxis: {
                title: "Price"
            }
        };

        Plotly.newPlot(
            "mileage-price-chart",
            chartData,
            layout,
            {
                responsive: true
            }
        );
    })
    .catch(error => {
        console.error("Error loading chart:", error);
    });

fetch("/api/prices")
    .then(response => response.json())
    .then(prices => {

        const chart = [{
            x: prices,
            type: "histogram"
        }];

        const layout = {
            title: "Distribution of Car Prices",
            xaxis: {
                title: "Price"
            },
            yaxis: {
                title: "Number of Cars"
            }
        };

        Plotly.newPlot(
            "price-distribution",
            chart,
            layout,
            {
                responsive: true
            }
        );

    });
fetch("/api/brand-price")
    .then(response => response.json())
    .then(data => {

        const brands = Object.keys(data);
        const prices = Object.values(data);

        Plotly.newPlot(
            "brand-chart",
            [{
                x: brands,
                y: prices,
                type: "bar"
            }],
            {
                title: "Average Price by Brand",
                xaxis: {
                    title: "Brand"
                },
                yaxis: {
                    title: "Average Price"
                }
            },
            {
                responsive: true
            }
        );

    });

document
    .querySelectorAll(".reveal")
    .forEach(element => observer.observe(element));