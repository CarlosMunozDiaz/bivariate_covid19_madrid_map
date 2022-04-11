//Desarrollo de la visualización
import * as d3 from 'd3';
import * as topojson from "topojson-client";
let d3_composite = require("d3-composite-projections");

//Necesario para importar los estilos de forma automática en la etiqueta 'style' del html final
import '../css/main.scss';

///// VISUALIZACIÓN DEL GRÁFICO //////
let map1 = d3.select('#map1'), map2 = d3.select('#map2');

const width = parseInt(map1.style('width'));
const height = parseInt(map1.style('height'));

let mapLayer1 = map1.append('svg').attr('width', width).attr('height', height),
    mapLayer2 = map2.append('svg').attr('width', width).attr('height', height);
let distritos;
let projection, path;

d3.queue()
    .defer(d3.json, 'https://raw.githubusercontent.com/carlosmunozdiaz/bivariate_covid19_madrid_map/main/data/distritos_v2.json')
    .defer(d3.csv, 'https://raw.githubusercontent.com/carlosmunozdiaz/bivariate_covid19_madrid_map/main/data/covid19_bivariate_20_21.csv')
    .await(main);

function main(error, distritosAux, data) {
    if (error) throw error;

    distritos = topojson.feature(distritosAux, distritosAux.objects.distritos);

    ///HACEMOS EL JOIN
    distritos.features.forEach(function(item) {
        let join = data.filter(function(subItem) {
            if(subItem.municipio_distrito.trim() == item.properties.NOMBRE) {
                return subItem;
            }
        });
        item.data = join;
    });

    projection = d3_composite.geoConicConformalSpain().scale(2000).fitSize([width,height], distritos);
    path = d3.geoPath(projection);

    mapLayer1.selectAll(".dist1")
        .data(distritos.features)
        .enter()
        .append("path")
        .attr("class", "dist1")
        .style('stroke','none')
        .style('opacity', '1')
        .style('fill', function(d) {
            if(d.data) {
                let color = '';

                let renta = +d.data[0].renta_neta_media_persona;
                let tasa_covid = +d.data[0].tasa_incidencia_acumulada_total;

                if(tasa_covid < 155.5) {

                    if (renta < 14575) {
                        color = '#e8e8e8';
                    } else if (renta >= 14575 & renta < 18590) {
                        color = '#bddede';
                    } else if (renta >= 18590 & renta < 23325) {
                        color = '#8ed4d4';
                    } else {
                        color = '#5ac8c8';
                    }   

                } else if (tasa_covid >= 155.5 & tasa_covid < 191) {

                    if (renta < 14575) {
                        color = '#dabdd4';
                    } else if (renta >= 14575 & renta < 18590) {
                        color = '#bdbdd4';
                    } else if (renta >= 18590 & renta < 23325) {
                        color = '#8ebdd4';
                    } else {
                        color = '#5abdc8';
                    } 
                
                } else if(tasa_covid >= 191 & tasa_covid < 226.5) {

                    if (renta < 14575) {
                        color = '#cc92c1';
                    } else if (renta >= 14575 & renta < 18590) {
                        color = '#bd92c1';
                    } else if (renta >= 18590 & renta < 23325) {
                        color = '#8e92c1';
                    } else {
                        color = '#5a92c1';
                    } 

                } else {

                    if (renta < 14575) {
                        color = '#be64ac';
                    } else if (renta >= 14575 & renta < 18590) {
                        color = '#bd64ac';
                    } else if (renta >= 18590 & renta < 23325) {
                        color = '#8e64ac';
                    } else {
                        color = '#5a64ac';
                    } 

                }

                return color;
            } else {
                return '#ccc';
            }            
        })
        .attr("d", path);

        mapLayer1.append("g")
            .selectAll("labels")
            .data(distritos.features)
            .enter()
            .append("text")
            .attr("x", function(d){return path.centroid(d)[0]})
            .attr("y", function(d){return path.centroid(d)[1]})
            .text(function(d){ return d.data[0].id_distrito; })
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .style("font-size", 11)
            .style("fill", "white");

        mapLayer2.selectAll(".dist2")
            .data(distritos.features)
            .enter()
            .append("path")
            .attr("class", "dist2")
            .style('stroke','none')
            .style('opacity', '1')
            .style('fill', function(d) {
                if(d.data) {
                    let color = '';

                    let renta = +d.data[1].renta_neta_media_persona;
                    let tasa_covid = +d.data[1].tasa_incidencia_acumulada_total;

                    if(tasa_covid < 155.5) {

                        if (renta < 14575) {
                            color = '#e8e8e8';
                        } else if (renta >= 14575 & renta < 18590) {
                            color = '#bddede';
                        } else if (renta >= 18590 & renta < 23325) {
                            color = '#8ed4d4';
                        } else {
                            color = '#5ac8c8';
                        }   

                    } else if (tasa_covid >= 155.5 & tasa_covid < 191) {

                        if (renta < 14575) {
                            color = '#dabdd4';
                        } else if (renta >= 14575 & renta < 18590) {
                            color = '#bdbdd4';
                        } else if (renta >= 18590 & renta < 23325) {
                            color = '#8ebdd4';
                        } else {
                            color = '#5abdc8';
                        } 
                    
                    } else if(tasa_covid >= 191 & tasa_covid < 226.5) {

                        if (renta < 14575) {
                            color = '#cc92c1';
                        } else if (renta >= 14575 & renta < 18590) {
                            color = '#bd92c1';
                        } else if (renta >= 18590 & renta < 23325) {
                            color = '#8e92c1';
                        } else {
                            color = '#5a92c1';
                        } 

                    } else {

                        if (renta < 14575) {
                            color = '#be64ac';
                        } else if (renta >= 14575 & renta < 18590) {
                            color = '#bd64ac';
                        } else if (renta >= 18590 & renta < 23325) {
                            color = '#8e64ac';
                        } else {
                            color = '#5a64ac';
                        } 

                    }

                    return color;
                } else {
                    return '#ccc';
                }            
            })
            .attr("d", path);

        mapLayer2.append("g")
            .selectAll("labels")
            .data(distritos.features)
            .enter()
            .append("text")
            .attr("x", function(d){return path.centroid(d)[0]})
            .attr("y", function(d){return path.centroid(d)[1]})
            .text(function(d){ return d.data[1].id_distrito; })
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .style("font-size", 11)
            .style("fill", "white");
}