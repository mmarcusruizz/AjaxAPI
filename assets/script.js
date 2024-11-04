$(function () {
    //al hacer click en btn1 se obtiene el valor del ID "form" y se almacena en la variable heroID
    $("#btn1").click(function () {
      let heroId = $("#form").val().trim();
      //validación del ID
      if (!/^\d+$/.test(heroId)) {
        alert("Ingrese un número válido");
        return;
      } else if (heroId <= 1 || heroId > 731) {
        alert("Ingrese número de ID ( de 1 a 731)");
        return;
      }
      // Petición de AJAX a la API superheroapi
      $.ajax({
        url: `https://www.superheroapi.com/api.php/39061931e847500796f4d24baba2ee82/${heroId}`,
        type: "GET",
        dataType: "json",
        //si es exitosa se renderiza
        success: function (data) {
          renderHero(data);
        },
        error: function () {
          alert("Error al cargar la info.");
        },
      });
    });
  
    // Función para renderizar la información del héroe en la página
    function renderHero(hero) {
      let heroHtml = `
              <div class="col-md-6">
                  <div class="card mb-3">
                      <div class="row no-gutters">
                          <div class="col-md-4">
                              <img src="${
                                hero.image.url
                              }" class="card-img" alt="${hero.name}">
                          </div>
                          <div class="col-md-8">
                              <div class="card-body">
                                  <p id="title" class="fw-bold fs-3">SuperHero Encontrado</p>
                                  <h5 class="card-title">${hero.name}</h5>
                                  <p class="card-text"><strong>Conexiones:</strong> ${
                                    hero.connections["group-affiliation"]
                                  }</p>
                                  <p class="card-text"><strong>Publicado por:</strong> ${
                                    hero.biography.publisher
                                  }</p>
                                  <p class="card-text"><strong>Ocupación:</strong> ${
                                    hero.work.occupation
                                  }</p>
                                  <p class="card-text"><strong>Primera Aparición:</strong> ${
                                    hero.biography["first-appearance"]
                                  }</p>
                                  <p class="card-text"><strong>Altura:</strong> ${hero.appearance.height.join(
                                    " - "
                                  )}</p>
                                  <p class="card-text"><strong>Peso:</strong> ${hero.appearance.weight.join(
                                    " - "
                                  )}</p>
                                  <p class="card-text"><strong>Alianzas:</strong> ${hero.biography.aliases.join(
                                    ", "
                                  )}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            <div class="col-md-6 mt-2" id="chartContainer" style="height: 370px; width: 50%;"></div>
          `;
    // Se crea una variable con el HTML que se va a insertar en la página. El HTML utiliza template literals para insertar la información del héroe en el código.
      $("#Hero-Info").html(heroHtml);
      renderHeroChart(hero);
      if (hero.powerstats.intelligence === "null") {
        $("#chartContainer").html(
          '<div class="alert alert-warning fw-bold" role="alert">No power stats.</div>'
        );
      }
    }
    // Función para renderizar el gráfico con las estadísticas del héroe
    function renderHeroChart(hero) {
      let powerStats = [
        { label: "Inteligencia", value: parseInt(hero.powerstats.intelligence) },
        { label: "Fuerza", value: parseInt(hero.powerstats.strength) },
        { label: "Velocidad", value: parseInt(hero.powerstats.speed) },
        { label: "Durabilidad", value: parseInt(hero.powerstats.durability) },
        { label: "Poder", value: parseInt(hero.powerstats.power) },
        { label: "Combate", value: parseInt(hero.powerstats.combat) },
      ];
      // Se ordena el array de estadísticas de mayor a menor.
      powerStats.sort((a, b) => b.value - a.value);
      // Array para almacenar los puntos del gráfico.
      let dataPoints = [];
      for (let i = 0; i < powerStats.length; i++) {
        dataPoints.push({
          y: powerStats[i].value,
          label: powerStats[i].label,
        });
      }
      // Se crea un nuevo gráfico con la librería CanvasJS.
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
          text: `Estadísticas de ${hero.name}`,
        },
         // Se agregan los datos del gráfico.
        data: [
          {
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0",
            indexLabel: "{label} {y}",
            dataPoints: dataPoints,
          },
        ],
      });
      // Se renderiza el gráfico en la página.
      chart.render();
    }
  });

  // Esta función se ejecuta cuando el DOM está completamente cargado
  document.addEventListener("DOMContentLoaded", function () {
    const apiUrl =
      "https://www.superheroapi.com/api.php/39061931e847500796f4d24baba2ee82/";
    const heroIds = Array.from({ length: 731 }, (_, i) => i + 1);
    const heroPromises = heroIds.map((id) =>
      fetch(apiUrl + id).then((response) => response.json())
    );
    // Se crea un array de promesas que se resuelven con la información de cada héroe.
    Promise.all(heroPromises)
      .then((heroes) => {
        renderHeroTable(heroes);
      })
      .catch((error) => console.error("Error al cargar la información del SuperHero", error));
  });

  // Función para renderizar la tabla con la lista de héroes
  function renderHeroTable(heroes) {
    let heroRows = ""; 
    heroes.forEach((hero) => {
      let heroRow = `
            <tr>
                <td>${hero.id}</td>
                <td>${hero.name}</td>
            </tr>
        `;
      heroRows += heroRow;
    });
  
    // Se inserta el HTML de las filas en la tabla con el ID "superheroTable".
    document.getElementById("superheroTable").innerHTML = heroRows;
  }
  
  $(".trigger-text").on("click", function () {
    $("#myModal").modal("show");
  });