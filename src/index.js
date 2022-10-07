import * as L from "leaflet";

const fetchData = async () => {
  const urlGeo =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";

  const res = await fetch(urlGeo);
  const data = await res.json();
  const resPos = await fetch(
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f"
  );
  const resNeg = await fetch(
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e"
  );
  const dataPos = await resPos.json();
  const dataNeg = await resNeg.json();
  initMap(data, dataPos, dataNeg);
};

const initMap = (data, dataPos, dataNeg) => {
  let map = L.map("map", { minZoom: -3 });
  let geoJson = L.geoJSON(data, { onEachFeature: getFeature, width: 2 }).addTo(
    map
  );
  geoJson.eachLayer(function (layer) {
    const id = layer.feature.properties.kunta;
    let keyPos = dataPos.dataset.dimension.Tuloalue.category.label;
    let valuePos = dataPos.dataset.value;
    let valueNeg = dataNeg.dataset.value;
    console.log(valueNeg);
    let round = 0;
    for (let key in keyPos) {
      if ("KU" + id === key) {
        layer.bindPopup(
          "<ul> <li>Positive: " +
            valuePos[round] +
            "</li> <li>Negative: " +
            valueNeg[round] +
            "</li></ul>"
        );
      }
      round = round + 1;
    }
  });

  let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  map.fitBounds(geoJson.getBounds());
};
fetchData();

const getFeature = (feature, layer) => {
  const id = feature.properties.name;
  layer.bindTooltip(id);
};
