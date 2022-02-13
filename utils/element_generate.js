const basePath = process.cwd();
const fs = require("fs");
const path = require("path");
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;
const {
 layerConfigurations,
 rarityDelimiter,
} = require(`${basePath}/src/config.js`);

const layersSetup = async(layersOrder) => {
 const layers = layersOrder.map((layerObj, index) => ({
   id: index,
   elements: getElements(`${layersDir}/${layerObj.name}/`),
   name:
     layerObj.options?.["displayName"] != undefined
       ? layerObj.options?.["displayName"]
       : layerObj.name,
   blend:
     layerObj.options?.["blend"] != undefined
       ? layerObj.options?.["blend"]
       : "source-over",
   opacity:
     layerObj.options?.["opacity"] != undefined
       ? layerObj.options?.["opacity"]
       : 1,
   bypassDNA:
     layerObj.options?.["bypassDNA"] !== undefined
       ? layerObj.options?.["bypassDNA"]
       : false,
 }));
 return layers;
};

const getRarityWeight = (_str) => {
 let nameWithoutExtension = _str.slice(0, -4);
 var nameWithoutWeight = Number(
  nameWithoutExtension.split(rarityDelimiter).pop()
 );
 if (isNaN(nameWithoutWeight)) {
  nameWithoutWeight = 1;
 }
 return nameWithoutWeight;
};

const getElements = (path) => {
 return fs
  .readdirSync(path)
  .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
  .map((i, index) => {
   return {
    id: index,
    name: cleanName(i),
    filename: i,
    path: `${path}${i}`,
    weight: getRarityWeight(i),
   };
  });
};

const cleanName = (_str) => {
 let nameWithoutExtension = _str.slice(0, -4);
 var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
 return nameWithoutWeight;
};

const writeLayers = (_data) => {
 fs.writeFileSync(`${buildDir}/layers.json`, _data);
};


const start = async () => {
 const layers = await layersSetup(
  layerConfigurations[0].layersOrder
 );

 writeLayers(JSON.stringify(layers));
}

start();