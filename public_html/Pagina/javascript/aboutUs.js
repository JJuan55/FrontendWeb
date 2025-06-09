document.addEventListener("DOMContentLoaded", function () {
    cargarGraficoReciclaje();
    cargarGraficoCategorias();
});

function cargarGraficoReciclaje() {
    fetch("/api/reciclaje")
        .then(res => res.json())
        .then(data => {
            const labels = data.map(item => item.mes); // Ej: ["Enero", "Febrero"]
            const valores = data.map(item => item.kg); // Ej: [120, 240]

            const ctx = document.getElementById("graficoReciclaje").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Kg de plástico reciclado",
                        data: valores,
                        backgroundColor: "#66bb6a",
                        borderColor: "#2e7d32",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Kilogramos"
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: "Mes"
                            }
                        }
                    }
                }
            });
        })
        .catch(err => console.error("Error al cargar datos de reciclaje:", err));
}

function cargarGraficoCategorias() {
    fetch("/api/ventas/categorias")
        .then(res => res.json())
        .then(data => {
            const categorias = [
                "accesorios", "decoración", "envases", "macetas", "muebles", "utileria", "otros"
            ];

            const colores = [
                "#81c784", "#aed581", "#c5e1a5", "#dcedc8", "#e6ee9c", "#fff59d", "#ffcc80"
            ];

            // Ordenar los datos de acuerdo con las categorías predefinidas
            const datosOrdenados = categorias.map(cat => {
                const encontrado = data.find(item => item.categoria.toLowerCase() === cat);
                return encontrado ? encontrado.cantidad : 0;
            });

            const ctx = document.getElementById("graficoCategorias").getContext("2d");
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: categorias.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
                    datasets: [{
                        data: datosOrdenados,
                        backgroundColor: colores
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            });
        })
        .catch(err => console.error("Error al cargar datos de categorías:", err));
}
