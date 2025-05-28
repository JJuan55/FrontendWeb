document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/compras") // Ajusta a la ruta real de tu backend
        .then(res => res.json())
        .then(data => {
            const labels = data.map(item => item.fecha);
            const valores = data.map(item => item.total);

            const ctx = document.getElementById("graficoCompras").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Compras Totales ($)",
                        data: valores,
                        fill: true,
                        borderColor: "#2e7d32",
                        backgroundColor: "rgba(46, 125, 50, 0.2)",
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true },
                        title: {
                            display: false
                        }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Fecha' } },
                        y: { title: { display: true, text: 'Monto' } }
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error al cargar los datos de compras:", error);
        });
});
